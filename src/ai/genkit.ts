import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set');
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function generateText(
  modelName: string,
  prompt: string,
  systemMessage?: string
): Promise<string> {
  try {
    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];

    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage
      });
    }

    messages.push({
      role: 'user',
      content: prompt
    });

    const response = await openai.chat.completions.create({
      model: modelName,
      messages,
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

// Export for backwards compatibility
export const ai = {
  generate: async ({
    model,
    prompt,
    systemMessage,
    output
  }: {
    model: string;
    prompt: string;
    systemMessage?: string;
    output?: any
  }) => {
    const result = await generateText(model, prompt, systemMessage);
    return { output: result };
  }
};
