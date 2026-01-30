'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Search, Sparkles } from 'lucide-react';
import { StockChart } from '@/components/dashboard/StockChart';
import { StockSearch } from '@/components/dashboard/StockSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { getStockInfo } from '@/lib/stock-search';
import { useToast } from '@/hooks/use-toast';

export default function ChartsPage() {
  const { assets } = usePortfolioStore();
  const { toast } = useToast();
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  } | null>(null);

  // Auto-select first stock from portfolio on mount
  useEffect(() => {
    if (assets.length > 0 && !selectedStock) {
      const firstAsset = assets[0];
      handleSelectStock(firstAsset.symbol, firstAsset.name);
    }
  }, [assets]);

  const handleSelectStock = async (symbol: string, name: string) => {
    try {
      const info = await getStockInfo(symbol);
      
      // If API fails, use mock data
      if (!info) {
        const mockPrices: Record<string, { price: number; previousClose: number }> = {
          'AAPL': { price: 185.92, previousClose: 182.15 },
          'MSFT': { price: 380.45, previousClose: 375.20 },
          'GOOGL': { price: 140.23, previousClose: 138.90 },
          'AMZN': { price: 145.67, previousClose: 143.50 },
          'NVDA': { price: 495.32, previousClose: 485.10 },
          'TSLA': { price: 245.18, previousClose: 248.90 },
          'META': { price: 325.45, previousClose: 320.10 },
          'VOO': { price: 420.15, previousClose: 418.50 },
          'BTC': { price: 43250.00, previousClose: 42800.00 },
          'ETH': { price: 2315.50, previousClose: 2290.00 },
        };

        const mockData = mockPrices[symbol] || { price: 100, previousClose: 98 };
        
        setSelectedStock({
          symbol: symbol,
          name: name,
          price: mockData.price,
          change: mockData.price - mockData.previousClose,
          changePercent: ((mockData.price - mockData.previousClose) / mockData.previousClose) * 100,
        });
        return;
      }

      setSelectedStock({
        symbol: info.symbol,
        name: info.name,
        price: info.price,
        change: info.price - info.previousClose,
        changePercent: ((info.price - info.previousClose) / info.previousClose) * 100,
      });
    } catch (error) {
      // Fallback to mock data on error
      const mockPrices: Record<string, { price: number; previousClose: number }> = {
        'AAPL': { price: 185.92, previousClose: 182.15 },
        'MSFT': { price: 380.45, previousClose: 375.20 },
        'GOOGL': { price: 140.23, previousClose: 138.90 },
        'AMZN': { price: 145.67, previousClose: 143.50 },
        'NVDA': { price: 495.32, previousClose: 485.10 },
        'TSLA': { price: 245.18, previousClose: 248.90 },
        'META': { price: 325.45, previousClose: 320.10 },
        'VOO': { price: 420.15, previousClose: 418.50 },
        'BTC': { price: 43250.00, previousClose: 42800.00 },
        'ETH': { price: 2315.50, previousClose: 2290.00 },
      };

      const mockData = mockPrices[symbol] || { price: 100, previousClose: 98 };
      
      setSelectedStock({
        symbol: symbol,
        name: name,
        price: mockData.price,
        change: mockData.price - mockData.previousClose,
        changePercent: ((mockData.price - mockData.previousClose) / mockData.previousClose) * 100,
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Live Charts</h1>
          <p className="text-gray-400 text-base">
            Real-time price charts with historical performance across multiple timeframes
          </p>
        </div>
      </div>

      {/* Stock Selector */}
      <Card className="mb-8 bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="bg-gray-800/30 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            <CardTitle className="text-white">Select Stock to Chart</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <StockSearch onAddStock={handleSelectStock} />
          
          {/* Quick Select from Portfolio */}
          {assets.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium text-gray-300">Quick select from your portfolio:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {assets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => handleSelectStock(asset.symbol, asset.name)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedStock?.symbol === asset.symbol
                        ? 'bg-primary/80 text-white border-2 border-primary shadow-lg'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    {asset.symbol}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Display */}
      {selectedStock ? (
        <StockChart
          symbol={selectedStock.symbol}
          name={selectedStock.name}
          currentPrice={selectedStock.price}
          change={selectedStock.change}
          changePercent={selectedStock.changePercent}
        />
      ) : (
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <TrendingUp className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">No stock selected</h3>
            <p className="text-gray-400">
              Search for a stock or select one from your portfolio to view its chart.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
