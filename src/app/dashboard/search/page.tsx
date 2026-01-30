'use client';

import { useState } from 'react';
import { Eye, Plus, Trash2, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { StockSearch } from '@/components/dashboard/StockSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getStockInfo } from '@/lib/stock-search';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { formatCurrency } from '@/lib/format';
import type { Asset } from '@/lib/portfolio-data';

export default function WatchlistPage() {
  const { assets, addAsset, removeAsset } = usePortfolioStore();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  const handleAddStock = async (symbol: string, name: string) => {
    // Check if already exists
    if (assets.find((a) => a.symbol === symbol)) {
      toast({
        title: 'Already in portfolio',
        description: `${symbol} is already in your portfolio.`,
        variant: 'destructive',
      });
      return;
    }

    setAdding(true);

    try {
      // Fetch real stock info
      const info = await getStockInfo(symbol);

      if (!info) {
        toast({
          title: 'Failed to add stock',
          description: `Could not fetch data for ${symbol}.`,
          variant: 'destructive',
        });
        return;
      }

      // Create new asset
      const newAsset: Asset = {
        name: info.name,
        symbol: info.symbol,
        shares: 10, // Default shares
        price: info.price,
        price_open: info.previousClose,
        purchase_price: info.price, // Set purchase price to current price
        value: info.price * 10,
        daily_change_percent: ((info.price - info.previousClose) / info.previousClose) * 100,
        type: info.type === 'CRYPTOCURRENCY' ? 'Crypto' : info.type === 'ETF' ? 'ETF' : 'Stock',
      };

      addAsset(newAsset);

      toast({
        title: 'Stock added!',
        description: `${symbol} has been added to your portfolio.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add stock. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveStock = (symbol: string, name: string) => {
    removeAsset(symbol);
    toast({
      title: 'Stock removed',
      description: `${name} (${symbol}) has been removed from your portfolio.`,
    });
  };

  // Calculate portfolio stats
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const gainers = assets.filter(a => a.daily_change_percent > 0).length;
  const losers = assets.filter(a => a.daily_change_percent < 0).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
          <Eye className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-sans">Watchlist & Portfolio Manager</h1>
          <p className="text-gray-400 text-base font-sans">
            Search and manage your portfolio with real-time data
          </p>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 font-sans">Total Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-sans">{assets.length}</div>
            <p className="text-sm text-gray-400 mt-2 font-sans">
              {formatCurrency(totalValue)} total value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 font-sans">Gainers Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400 font-sans">{gainers}</div>
            <p className="text-sm text-gray-400 mt-2 font-sans">Stocks up today</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 font-sans">Losers Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400 font-sans">{losers}</div>
            <p className="text-sm text-gray-400 mt-2 font-sans">Stocks down today</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="mb-8 bg-white/5 backdrop-blur-md border-white/10 shadow-xl overflow-visible">
        <CardHeader className="bg-gray-800/30 border-b border-white/10">
          <CardTitle className="flex items-center gap-2 text-white font-sans">
            <Plus className="w-5 h-5 text-primary" />
            Add New Stock
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-6 relative min-h-[120px]">
          <StockSearch onAddStock={handleAddStock} />
          {adding && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <p className="text-sm text-blue-400 font-sans">
                Adding stock to portfolio...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Holdings */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="bg-gray-800/30 border-b border-white/10">
          <CardTitle className="text-white font-sans">Current Holdings ({assets.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {assets.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                <Eye className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white font-sans">No holdings yet</h3>
              <p className="text-gray-400 font-sans">
                Search for stocks above to add them to your portfolio
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {assets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/40 border border-white/10 hover:bg-gray-800/60 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      asset.daily_change_percent >= 0 
                        ? 'bg-green-500/20 border-2 border-green-500/30' 
                        : 'bg-red-500/20 border-2 border-red-500/30'
                    }`}>
                      {asset.daily_change_percent >= 0 ? (
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white font-sans">{asset.name}</div>
                      <div className="text-sm text-gray-400 font-sans">
                        {asset.symbol} • {asset.shares} shares • {asset.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-white font-sans text-lg">
                        {formatCurrency(asset.value)}
                      </div>
                      <Badge
                        className={`font-sans ${
                          asset.daily_change_percent >= 0 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        {asset.daily_change_percent >= 0 ? '+' : ''}
                        {asset.daily_change_percent?.toFixed(2) ?? '0.00'}%
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveStock(asset.symbol, asset.name)}
                      className="hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
