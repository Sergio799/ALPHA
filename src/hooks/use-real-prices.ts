import { useState, useEffect } from 'react';
import { fetchStockPriceWithFallback } from '@/lib/stock-api';
import type { Asset } from '@/lib/portfolio-data';

/**
 * Hook to fetch real stock prices and update portfolio
 * Uses Yahoo Finance - fast and unlimited!
 * All stocks load in parallel (~5 seconds total)
 */
export function useRealPrices(initialAssets: Asset[]) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchRealPrices() {
      setLoading(true);
      setError(null);

      try {
        // Fetch all prices in parallel (Yahoo has no rate limit!)
        const updatedAssets = await Promise.all(
          initialAssets.map(async (asset) => {
            const realPrice = await fetchStockPriceWithFallback(asset.symbol);
            
            if (realPrice) {
              return {
                ...asset,
                price: realPrice,
                value: realPrice * asset.shares,
                daily_change_percent: ((realPrice - asset.price_open) / asset.price_open) * 100,
              };
            }
            
            return asset; // Keep dummy data if fetch fails
          })
        );
        
        if (mounted) {
          setAssets(updatedAssets);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to fetch real prices');
          console.error(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Fetch real prices on mount
    fetchRealPrices();

    return () => {
      mounted = false;
    };
  }, []); // Only run once on mount

  return { assets, loading, error };
}
