import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  addedAt: string;
  alertPrice?: number;
}

interface WatchlistStore {
  items: WatchlistItem[];
  addItem: (item: WatchlistItem) => void;
  removeItem: (symbol: string) => void;
  updateItem: (symbol: string, updates: Partial<WatchlistItem>) => void;
  setAlertPrice: (symbol: string, price: number) => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      
      removeItem: (symbol) =>
        set((state) => ({
          items: state.items.filter((item) => item.symbol !== symbol),
        })),
      
      updateItem: (symbol, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.symbol === symbol ? { ...item, ...updates } : item
          ),
        })),
      
      setAlertPrice: (symbol, price) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.symbol === symbol ? { ...item, alertPrice: price } : item
          ),
        })),
    }),
    {
      name: 'watchlist-storage',
    }
  )
);
