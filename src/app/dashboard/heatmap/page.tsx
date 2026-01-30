'use client';

import { useEffect, useState, useMemo } from 'react';
import { Grid3x3, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';

export default function HeatmapPage() {
  const { assets } = usePortfolioStore();
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const totalValue = assets.reduce((acc, asset) => acc + asset.value, 0);

  // Sort by value for better visualization
  const sortedAssets = useMemo(() => 
    [...assets].sort((a, b) => b.value - a.value),
    [assets]
  );

  // Calculate portfolio stats
  const portfolioStats = useMemo(() => {
    const gainers = assets.filter(a => a.daily_change_percent > 0).length;
    const losers = assets.filter(a => a.daily_change_percent < 0).length;
    const avgChange = assets.reduce((sum, a) => sum + a.daily_change_percent, 0) / assets.length;
    const topGainer = [...assets].sort((a, b) => b.daily_change_percent - a.daily_change_percent)[0];
    const topLoser = [...assets].sort((a, b) => a.daily_change_percent - b.daily_change_percent)[0];
    
    return { gainers, losers, avgChange, topGainer, topLoser };
  }, [assets]);

  const getColor = (change: number) => {
    if (change > 3) return 'bg-green-600 hover:bg-green-700';
    if (change > 1) return 'bg-green-500 hover:bg-green-600';
    if (change > 0) return 'bg-green-400 hover:bg-green-500';
    if (change > -1) return 'bg-red-400 hover:bg-red-500';
    if (change > -3) return 'bg-red-500 hover:bg-red-600';
    return 'bg-red-600 hover:bg-red-700';
  };

  const getSize = (value: number) => {
    const percentage = (value / totalValue) * 100;
    if (percentage > 15) return 'col-span-2 row-span-2';
    if (percentage > 10) return 'col-span-2';
    return 'col-span-1';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
          <Grid3x3 className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio Heatmap</h1>
          <p className="text-gray-400 text-base">
            Visual representation of your portfolio performance and allocation
          </p>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Gainers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{portfolioStats.gainers}</div>
            <p className="text-sm text-gray-400 mt-2">Stocks up today</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Losers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{portfolioStats.losers}</div>
            <p className="text-sm text-gray-400 mt-2">Stocks down today</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Top Gainer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{portfolioStats.topGainer?.symbol}</div>
            <p className="text-sm text-green-400 mt-2">
              +{portfolioStats.topGainer?.daily_change_percent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Top Loser</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{portfolioStats.topLoser?.symbol}</div>
            <p className="text-sm text-red-400 mt-2">
              {portfolioStats.topLoser?.daily_change_percent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <span className="font-semibold text-white">How to read this heatmap:</span> Tile size represents allocation percentage (larger = bigger portion of portfolio). 
            Color intensity shows performance (green = gains, red = losses). Hover over tiles for detailed information.
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {sortedAssets.map((asset) => {
          const allocation = ((asset.value / totalValue) * 100).toFixed(1);
          const isHovered = hoveredAsset === asset.symbol;

          return (
            <Card
              key={asset.symbol}
              className={cn(
                'relative overflow-hidden transition-all duration-300 cursor-pointer border-2',
                getSize(asset.value),
                getColor(asset.daily_change_percent),
                isHovered ? 'ring-4 ring-primary/50 scale-105 z-10 shadow-2xl' : 'border-transparent shadow-lg'
              )}
              onMouseEnter={() => setHoveredAsset(asset.symbol)}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              <CardContent className="p-4 h-full flex flex-col justify-between text-white relative">
                {/* Top Section */}
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-bold text-xl">{asset.symbol}</div>
                    <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                      {asset.daily_change_percent >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  <div className="text-xs opacity-90 truncate mb-2">{asset.name}</div>
                </div>

                {/* Bottom Section */}
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {asset.daily_change_percent >= 0 ? '+' : ''}
                    {asset.daily_change_percent?.toFixed(2) ?? '0.00'}%
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-90">{allocation}% allocation</span>
                  </div>
                  <div className="text-sm font-semibold opacity-95">
                    {formatCurrency(asset.value)}
                  </div>
                </div>

                {/* Hover Overlay */}
                {isHovered && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="text-center space-y-2">
                      <div className="text-lg font-bold">{asset.symbol}</div>
                      <div className="text-sm opacity-90">{asset.name}</div>
                      <div className="text-2xl font-bold">
                        {asset.daily_change_percent >= 0 ? '+' : ''}
                        {asset.daily_change_percent?.toFixed(2)}%
                      </div>
                      <div className="text-sm">{formatCurrency(asset.value)}</div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        {allocation}% of portfolio
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Performance Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg shadow-md"></div>
              <div>
                <div className="text-sm font-semibold text-white">Strong Gain</div>
                <div className="text-xs text-gray-400">+3% or more</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg shadow-md"></div>
              <div>
                <div className="text-sm font-semibold text-white">Moderate Gain</div>
                <div className="text-xs text-gray-400">+1% to +3%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-400 rounded-lg shadow-md"></div>
              <div>
                <div className="text-sm font-semibold text-white">Slight Gain</div>
                <div className="text-xs text-gray-400">0% to +1%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-400 rounded-lg shadow-md"></div>
              <div>
                <div className="text-sm font-semibold text-white">Slight Loss</div>
                <div className="text-xs text-gray-400">0% to -1%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 rounded-lg shadow-md"></div>
              <div>
                <div className="text-sm font-semibold text-white">Moderate Loss</div>
                <div className="text-xs text-gray-400">-1% to -3%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg shadow-md"></div>
              <div>
                <div className="text-sm font-semibold text-white">Strong Loss</div>
                <div className="text-xs text-gray-400">-3% or less</div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-gray-800/40 border border-white/10">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">Tile Size:</span> Represents allocation percentage. 
              Larger tiles indicate a bigger portion of your portfolio. The largest holdings are displayed with 2x2 tiles, 
              medium holdings with 2x1 tiles, and smaller holdings with 1x1 tiles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
