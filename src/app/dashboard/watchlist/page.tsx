'use client';

import { useState } from 'react';
import { Eye, Plus, Trash2, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StockSearch } from '@/components/dashboard/StockSearch';
import { useWatchlistStore, type WatchlistItem } from '@/hooks/use-watchlist-store';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { useToast } from '@/hooks/use-toast';
import { getStockInfo } from '@/lib/stock-search';
import { formatCurrency } from '@/lib/format';

export default function WatchlistPage() {
  const { items, addItem, removeItem, setAlertPrice } = useWatchlistStore();
  const { assets, addAsset } = usePortfolioStore();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [alertPrices, setAlertPrices] = useState<Record<string, string>>({});

  const handleAddToWatchlist = async (symbol: string, name: string) => {
    // Check if already in watchlist
    if (items.find((item) => item.symbol === symbol)) {
      toast({
        title: 'Already in watchlist',
        description: `${symbol} is already in your watchlist.`,
        variant: 'destructive',
      });
      return;
    }

    setAdding(true);

    try {
      const info = await getStockInfo(symbol);

      if (!info) {
        toast({
          title: 'Failed to add stock',
          description: `Could not fetch data for ${symbol}.`,
          variant: 'destructive',
        });
        return;
      }

      const watchlistItem: WatchlistItem = {
        symbol: info.symbol,
        name: info.name,
        price: info.price,
        change: info.price - info.previousClose,
        changePercent: ((info.price - info.previousClose) / info.previousClose) * 100,
        addedAt: new Date().toISOString(),
      };

      addItem(watchlistItem);

      toast({
        title: 'Added to watchlist',
        description: `${symbol} has been added to your watchlist.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add stock to watchlist.',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveFromWatchlist = (symbol: string, name: string) => {
    removeItem(symbol);
    toast({
      title: 'Removed from watchlist',
      description: `${name} (${symbol}) has been removed from your watchlist.`,
    });
  };

  const handleAddToPortfolio = async (item: WatchlistItem) => {
    // Check if already in portfolio
    if (assets.find((a) => a.symbol === item.symbol)) {
      toast({
        title: 'Already in portfolio',
        description: `${item.symbol} is already in your portfolio.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      const info = await getStockInfo(item.symbol);
      if (!info) return;

      const newAsset = {
        name: info.name,
        symbol: info.symbol,
        shares: 10,
        price: info.price,
        price_open: info.previousClose,
        purchase_price: info.price,
        value: info.price * 10,
        daily_change_percent: ((info.price - info.previousClose) / info.previousClose) * 100,
        type: info.type === 'CRYPTOCURRENCY' ? 'Crypto' : info.type === 'ETF' ? 'ETF' : 'Stock',
      } as const;

      addAsset(newAsset);

      toast({
        title: 'Added to portfolio',
        description: `${item.symbol} has been added to your portfolio.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add stock to portfolio.',
        variant: 'destructive',
      });
    }
  };

  const handleSetAlert = (symbol: string) => {
    const price = parseFloat(alertPrices[symbol]);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Invalid price',
        description: 'Please enter a valid price for the alert.',
        variant: 'destructive',
      });
      return;
    }

    setAlertPrice(symbol, price);
    setAlertPrices(prev => ({ ...prev, [symbol]: '' }));

    toast({
      title: 'Alert set',
      description: `You'll be notified when ${symbol} reaches ${formatCurrency(price)}.`,
    });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Eye className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Watchlist</h1>
      </div>

      <p className="text-muted-foreground mb-6 max-w-2xl">
        Track stocks you're interested in but don't own yet. Set price alerts and 
        quickly add them to your portfolio when ready.
      </p>

      {/* Add to Watchlist */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add to Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StockSearch onAddStock={handleAddToWatchlist} />
          {adding && (
            <p className="text-sm text-muted-foreground mt-2">
              Adding stock to watchlist...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Watchlist Items */}
      <Card>
        <CardHeader>
          <CardTitle>Watching ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No stocks in watchlist</h3>
              <p className="text-muted-foreground">
                Add stocks you're interested in to track their performance.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {item.changePercent >= 0 ? (
                        <TrendingUp className="w-6 h-6 text-green-500" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.symbol}
                        {item.alertPrice && (
                          <span className="ml-2 text-primary">
                            • Alert: {formatCurrency(item.alertPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(item.price)}
                      </div>
                      <Badge
                        variant={item.changePercent >= 0 ? 'default' : 'destructive'}
                        className={item.changePercent >= 0 ? 'bg-green-600/20 text-green-300 border-green-500/30' : ''}
                      >
                        {item.changePercent >= 0 ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Alert price"
                        value={alertPrices[item.symbol] || ''}
                        onChange={(e) => setAlertPrices(prev => ({ ...prev, [item.symbol]: e.target.value }))}
                        className="w-24 h-8 text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSetAlert(item.symbol)}
                        className="h-8 w-8"
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToPortfolio(item)}
                    >
                      Add to Portfolio
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFromWatchlist(item.symbol, item.name)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
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
