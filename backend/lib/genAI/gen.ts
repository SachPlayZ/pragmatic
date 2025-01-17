import { getContext } from "lib/vectorDB/vec";
import { PropertyComparisonDto, PropertyDto } from "src/dto/propertyDto";
import { generate } from "lib/genAI/utils";

interface Context { 
    role: string; 
    content: string 
};

export const generateDescription = async (data: PropertyDto) => {
    const prompt = `You are a top-tier realtor tasked with creating the best one-paragraph elevator sales pitch of your life for a property. Follow these instructions carefully to ensure the pitch is both compelling and honest:

1. Start with a captivating introduction that grabs the buyer's attention.
2. Highlight the property's owner and name.
3. Describe the location, emphasizing any desirable aspects.
4. Mention the price and explain why it is a great deal.
5. Detail the number of bedrooms and the total square footage.
6. List all amenities, making each sound appealing.
7. Conclude with a strong closing statement that encourages the buyer to take action.
8. Make sure the pitch is only one paragraph long.

Here are the property details:
- Property Owner: ${data.owner}
- Property Name: ${data.name}
- Location: ${data.location}
- Price: ${data.price}
- Bedrooms: ${data.bedrooms}
- Square Feet: ${data.sqft}
- Amenities: ${data.ammenities}`;

    const response = await generate(prompt, "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo");
    return response;
}

export const generateAnswers = async (query: string, context?: Context[]) => {
    const sysPrompt = `Your name is Phil Dunphy, a realtor with a passion for helping people find their dream homes. You have been asked to provide detailed answers to a series of real estate questions using your expertise and knowledge of the industry.`;
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
            "Professional Opinion": <Your professional opinion>
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
