import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generate = async (
  query: string,
  model: string,
  systemPrompt?: string,
  context?: { role: string; content: string }[],
): Promise<string> => {
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] =
    [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  if (context) {
    messages.push(
      ...(context as {
        role: 'system' | 'user' | 'assistant';
        content: string;
      }[]),
    );
  }

  messages.push({ role: 'user', content: query });

  const chatCompletion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
  });

  return chatCompletion.choices[0]?.message?.content || '';
};
