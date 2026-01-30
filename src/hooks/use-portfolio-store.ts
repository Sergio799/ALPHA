import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { portfolioData, type Asset } from '@/lib/portfolio-data';

interface PortfolioStore {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  removeAsset: (symbol: string) => void;
  updateAsset: (symbol: string, updates: Partial<Asset>) => void;
  resetToDefault: () => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      assets: portfolioData,
      
      addAsset: (asset) =>
        set((state) => ({
          assets: [...state.assets, asset],
        })),
      
      removeAsset: (symbol) =>
        set((state) => ({
          assets: state.assets.filter((a) => a.symbol !== symbol),
        })),
      
      updateAsset: (symbol, updates) =>
        set((state) => ({
          assets: state.assets.map((a) =>
            a.symbol === symbol ? { ...a, ...updates } : a
          ),
        })),
      
      resetToDefault: () =>
        set({ assets: portfolioData }),
    }),
    {
      name: 'portfolio-storage',
    }
  )
);
