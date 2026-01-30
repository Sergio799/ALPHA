'use server';

import { advise } from '@/ai/flows/advisor-flow';

type State = {
  messages: any[];
  error?: string;
};

export async function handleAdvisorChat(
  history: any[]
): Promise<State> {
  
  try {
    const aiResponse = await advise(history);

    return {
      messages: [
        ...history,
        { role: 'assistant', content: aiResponse },
      ],
    };
  } catch (e: any) {
    console.error(e);
    const errorMessage = e.message || 'Failed to get a response from the advisor.';
    return {
      messages: history,
      error: errorMessage,
    };
  }
}
