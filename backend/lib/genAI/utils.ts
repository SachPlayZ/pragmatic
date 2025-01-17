export const generate = async (
    query: string,
    model: string = "meta-llama/Meta-Llama-3-8B-Instruct-Turbo",
    systemPrompt?: string,
    context?: { role: string; content: string }[]
): Promise<string> => {
    const BEYOND_API_URL = process.env.BEYOND_BASE_URL + "/api/chat/completions";

    const messages: { role: string; content: string }[] = [];

    if (context) {
        messages.push(...context);
    }

    if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
    }

    messages.push({ role: "user", content: query });
    const body = {
        "model": model,
        "messages": messages,
    };
    const response = await fetch(BEYOND_API_URL, {
        method: "POST",
        headers: new Headers([
            ["x-api-key", process.env.BEYOND_API_KEY || ""],
            ["Content-Type", "application/json"],
        ]),
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Beyond API error: ${response.statusText}`);
    }
    const res = await response.json();
    return res.choices[0].message.content;
}