import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatHistoryStore {
  messages: ChatMessage[];
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearHistory: () => void;
}

export const useChatHistory = create<ChatHistoryStore>()(
  persist(
    (set) => ({
      messages: [],
      
      addMessage: (role, content) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              role,
              content,
              timestamp: Date.now(),
            },
          ],
        })),
      
      clearHistory: () => set({ messages: [] }),
    }),
    {
      name: 'chat-history-storage',
    }
  )
);
