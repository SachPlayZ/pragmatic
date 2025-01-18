import { getContext } from "lib/vectorDB/vec";
import { PropertyComparisonDto, PropertyDescDto, PropertyDto } from "src/dto/propertyDto";
import { generate } from "lib/genAI/utils";
import { query } from "express";

interface Context {
    role: string;
    content: string
};

export const generateDescription = async (data: PropertyDescDto) => {
    const prompt = `You are Phil Dunphy, a beloved and top-tier realtor tasked with creating the best one-paragraph elevator sales pitch of your life for a property. Follow these instructions carefully to make the pitch unique, compelling, and honest. Output the result as a JSON object in the following format:

{
  "pitch": <generated pitch>,
  "rating": <a critical rating out of 5>
}

Follow these rules for the pitch:
1. Begin with a creative introduction that captures the buyer's attention.
2. Highlight the property's name and location, but don't always lead with these details—find ways to weave them naturally into the pitch.
3. Describe the location in a way that resonates with potential buyers. Emphasize its best aspects and adapt the focus (e.g., convenience, charm, or exclusivity).
4. Mention the price as part of the value proposition, but ensure it's framed dynamically (e.g., compare it to similar properties, emphasize cost-effectiveness, or highlight investment potential).
5. Incorporate details about the bedrooms and square footage, but avoid listing them in a formulaic way. Instead, integrate them into a description of the property’s functionality or appeal.
6. Present the amenities in a way that feels fresh and exciting—group related ones, tell a story about their benefits, or emphasize how they enhance the lifestyle.
7. End with a memorable closing statement that aligns with the tone of the pitch and motivates the buyer to act quickly.

Here are the property details:
- Property Name: ${data.name}
- Location: ${data.location}
- Price: ${data.price} AVAX
- Bedrooms: ${data.bedrooms}
- Square Feet: ${data.sqft}
- Amenities: ${data.ammenities}

Make sure there is no text before or after the JSON object, and only the JSON is outputted.`;



    const response = await generate(prompt, "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo");
    return JSON.parse(response);
}

const checkIfContextNeeded = async (query: string) => {
    const prompt = `You are a seasoned language model tasked with analysing whether the given query is a question or statement related to real estate or not. You can only answer with "YES" or "NO". Use the following instructions to guide your response:

    1. Read the query carefully and determine if it is a question or statement related to real estate.
    2. Consider the context and information provided in the query.
    3. Provide a clear and concise answer using only "YES" or "NO".
    4. If the query is related to real estate, answer "YES"; otherwise, answer "NO".
    5. Make sure your response is accurate and relevant to the query asked.
    6. Do not provide any additional information or context in your response.
    7. The response should be a single word, either "YES" or "NO".

    Here is the query you need to analyze:
    ${query}`;
    const response = await generate(prompt, "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo");
    console.log("Query:", query);
    console.log("Related to Real Estate:", response);
    if (response === "YES") {
        return true;
    }
    return false;
}

export const generateAnswers = async (query: string, context?: Context[]) => {
    const sysPrompt = `Your name is Phil Dunphy, a realtor with a passion for helping people find their dream homes. You have been asked to provide detailed answers to a series of real estate questions using your expertise and knowledge of the industry.`;
    if (!await checkIfContextNeeded(query)) {
        const response = await generate(query, "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", sysPrompt, context);
        return response;
    }
    const info = await getContext(query);
    const prompt = `You are a top-tier realtor tasked with answering a series of questions about real estate.
You will be given a question related to the property, along with information regarding the query from the real-estate guidebook by using vector semantic search.
Follow these instructions carefully to ensure your responses are both informative and engaging:

1. Read the question carefully and understand what information is being requested.
2. Use the information provided in the query to formulate your response.
3. Be concise and to the point, providing only the information requested.
4. Ensure your response is accurate and relevant to the question asked.
5. Make sure your response is well-structured and easy to understand.
6. Use proper grammar, punctuation, and spelling in your response.
7. Provide a detailed explanation to support your answer.

Here is the question you need to answer:
${query}

Here is the information you need to answer the question:
${info}`;
    if (!context) {
        context = [];
    }
    const response = await generate(prompt, "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", sysPrompt, context);
    return response;
}


export const generateComparison = async (data: PropertyComparisonDto[]) => {
    let properties = "";
    data.forEach((property, index) => {
        properties += `Property ${index + 1}:
- Property Id: ${property.id}
- Property Owner: ${property.owner}
- Property Name: ${property.name}
- Location: ${property.location}
- Price: ${property.price}
- Bedrooms: ${property.bedrooms}
- Square Feet: ${property.sqft}
- Amenities: ${property.ammenities}
================================================================
`;
    });

    const sysPrompt = `Your name is Phil Dunphy, a realtor with a passion for helping people find their dream homes. You have been asked to provide detailed answers to a series of real estate questions using your expertise and knowledge of the industry.`;

    const prompt = `You are a top-tier realtor tasked with comparing ${data.length} properties to help a buyer make an informed decision. Follow these instructions carefully to ensure the comparison is fair and unbiased:

1. Analyze the key details of each property, including the owner, name, location, price, bedrooms, square footage, and amenities.
2. Understand and highlight the unique features and selling points of each property.
3. Identify any similarities or differences between the properties that may influence the buyer's decision.
4. Provide a clear and concise summary of each property, focusing on the most important aspects.
5. Offer your professional opinion on which property would be the best choice for the buyer.
6. Make sure the comparison is detailed and informative, helping the buyer make an informed decision.
7. Present your findings as per the given JSON format.
8. ### VERY IMPORTANT: There should not be any text before or after the JSON. The JSON should be the only content in the response.

Here is the JSON format for the output:
{
    "Best Property": <Best Property Id>,
    "Worst Property": <Worst Property Id>,
    "Comparison": [
        {
            "id": <Property Id>,
            "Pros": [<List of concise pro points>],
            "Cons": [<List of concise con points>]
            "Unique Features": [<List of unique features>]
            "Professional Opinion": <Your professional opinion on why one should invest in this real estate (investor will look to sell it to potential buyers and profit at a higher rate)>
            "Overall Rating": <Rating out of 5>
        },
        ...
    ]
}

Here are the property details for comparison:
${properties}`;

    const response = await generate(prompt, "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", sysPrompt);
    return JSON.parse(response);
}
