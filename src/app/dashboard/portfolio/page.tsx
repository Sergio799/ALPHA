'use client';

import { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { type Asset } from '@/lib/portfolio-data';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { DailyChange } from '@/components/dashboard/DailyChange';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import { PORTFOLIO_UPDATE_INTERVAL } from '@/lib/constants';
import { generatePortfolioReport } from '@/lib/pdf-generator';
import { Download, HelpCircle } from 'lucide-react';

const generateNewUpdate = (asset: Asset): Asset => {
  const priceChange = (Math.random() - 0.49) * (asset.price * 0.05);
  const newPrice = Math.max(0.01, asset.price + priceChange);
  const dailyChange = ((newPrice - asset.price_open) / asset.price_open) * 100;

  return {
    ...asset,
    price: newPrice,
    value: newPrice * asset.shares,
    daily_change_percent: dailyChange,
  };
};

// Lazy load AssetCard with better loading state
const AssetCard = dynamic(
  () => import('@/components/dashboard/AssetCard').then(mod => mod.AssetCard),
  {
    loading: () => <Skeleton className="h-[218px] w-full" />,
    ssr: false,
  }
);

const MobileView = ({ assets, totalValue }: { assets: Asset[], totalValue: number }) => (
  <div className="space-y-4">
    {assets.map((asset) => (
      <AssetCard key={asset.symbol} asset={asset} totalValue={totalValue} />
    ))}
  </div>
);


// Memoized desktop view for better performance
const DesktopView = ({ assets, totalValue }: { assets: Asset[], totalValue: number }) => {
  const rows = useMemo(() => 
    assets.map((asset) => ({
      ...asset,
      allocation: ((asset.value / totalValue) * 100).toFixed(2),
    })),
    [assets, totalValue]
  );

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-300 font-semibold">Asset</TableHead>
            <TableHead className="text-gray-300 font-semibold">Symbol</TableHead>
            <TableHead className="text-gray-300 font-semibold">Shares</TableHead>
            <TableHead className="text-gray-300 font-semibold">Price</TableHead>
            <TableHead className="text-gray-300 font-semibold">Value</TableHead>
            <TableHead className="text-gray-300 font-semibold">Daily Change</TableHead>
            <TableHead className="text-gray-300 font-semibold">Allocation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((asset) => (
            <TableRow key={asset.symbol} className="border-white/10 hover:bg-white/5 transition-colors">
              <TableCell className="font-medium text-white">{asset.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white">{asset.symbol}</Badge>
              </TableCell>
              <TableCell className="text-gray-300">{asset.shares.toLocaleString()}</TableCell>
              <TableCell className="text-gray-300">{formatCurrency(asset.price)}</TableCell>
              <TableCell className="text-white font-semibold">{formatCurrency(asset.value)}</TableCell>
              <TableCell>
                <DailyChange change={asset.daily_change_percent} />
              </TableCell>
              <TableCell className="text-gray-300">{asset.allocation}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function PortfolioPage() {
  const { assets: storeAssets, updateAsset } = usePortfolioStore();
  const [assets, setAssets] = useState<Asset[]>(storeAssets);
  const isMobile = useIsMobile();

  // Sync with store
  useEffect(() => {
    setAssets(storeAssets);
  }, [storeAssets]);

  // Memoize the update function
  const updateAssets = useCallback(() => {
    setAssets(prevAssets => 
      prevAssets.map(generateNewUpdate).sort((a, b) => b.value - a.value)
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(updateAssets, PORTFOLIO_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [updateAssets]);

  // Memoize total value calculation
  const totalValue = useMemo(
    () => assets.reduce((acc, asset) => acc + asset.value, 0),
    [assets]
  );

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    const totalCost = assets.reduce((sum, asset) => sum + (asset.shares * asset.price_open), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalReturn = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    
    const dailyChange = assets.reduce((sum, asset) => {
      const dailyGainLoss = (asset.price - asset.price_open) * asset.shares;
      return sum + dailyGainLoss;
    }, 0);
    const dailyChangePercent = totalCost > 0 ? (dailyChange / totalCost) * 100 : 0;

    const sortedByPerformance = [...assets].sort((a, b) => b.daily_change_percent - a.daily_change_percent);
    const bestPerformer = sortedByPerformance[0];
    const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];

    return {
      totalReturn,
      totalGainLoss,
      dailyChange,
      dailyChangePercent,
      bestPerformer,
      worstPerformer,
    };
  }, [assets, totalValue]);

  // State for "Why is my return up/down today?" dialog
  const [showExplanation, setShowExplanation] = useState(false);

  // Calculate top 3 drivers of today's change
  const topDrivers = useMemo(() => {
    return [...assets]
      .map((asset) => ({
        symbol: asset.symbol,
        name: asset.name,
        dailyChangePercent: asset.daily_change_percent,
        dailyChangeValue: (asset.price - asset.price_open) * asset.shares,
        contribution: ((asset.price - asset.price_open) * asset.shares / totalValue) * 100,
      }))
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
      .slice(0, 3);
  }, [assets, totalValue]);

  // Generate PDF Report
  const handleDownloadPDF = useCallback(() => {
    const pdfData = {
      clientName: 'Portfolio Owner',
      totalValue,
      totalReturn: performanceMetrics.totalReturn,
      holdingsCount: assets.length,
      sharpeRatio: 0.04,
      beta: 1.28,
      maxDrawdown: 24.2,
      diversificationScore: 95.4,
      holdings: assets.map((asset) => ({
        symbol: asset.symbol,
        shares: asset.shares,
        value: asset.value,
        allocation: (asset.value / totalValue) * 100,
        return: ((asset.value - (asset.purchase_price * asset.shares)) / (asset.purchase_price * asset.shares)) * 100,
      })),
      recommendations: [
        {
          action: 'Reduce tech concentration from 65% to 45%',
          reason: 'High sector concentration increases portfolio risk',
          impact: 'Expected to reduce Beta by 0.15 and improve diversification score',
        },
        {
          action: 'Exit underperforming crypto positions (BTC, ETH)',
          reason: 'Both down nearly 100% with no recovery signs',
          impact: 'Reduces portfolio volatility and frees capital for better opportunities',
        },
        {
          action: 'Add defensive allocation (10-15% VTI or VOO)',
          reason: 'Low exposure to market-tracking ETFs',
          impact: 'Improves risk-adjusted returns and reduces portfolio Beta',
        },
      ],
    };

    generatePortfolioReport(pdfData);
  }, [assets, totalValue, performanceMetrics]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white">Portfolio Dashboard</h1>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white shadow-lg text-xs md:text-sm"
          >
            <Download className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <a href="/dashboard/search">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white shadow-lg text-xs md:text-sm"
            >
              <span className="hidden sm:inline">Manage Watchlist</span>
              <span className="sm:hidden">Watchlist</span>
            </Button>
          </a>
          <a href="/dashboard/heatmap">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white shadow-lg text-xs md:text-sm"
            >
              Heatmap
            </Button>
          </a>
          <a href="/dashboard/analytics">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white shadow-lg text-xs md:text-sm"
            >
              Analytics
            </Button>
          </a>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(totalValue)}</div>
            <p className="text-sm text-gray-400 mt-2">
              {assets.length} holdings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${performanceMetrics.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {performanceMetrics.totalReturn >= 0 ? '+' : ''}{performanceMetrics.totalReturn.toFixed(2)}%
            </div>
            <p className={`text-sm mt-2 ${performanceMetrics.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {performanceMetrics.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(performanceMetrics.totalGainLoss)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              Today's Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${performanceMetrics.dailyChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {performanceMetrics.dailyChangePercent >= 0 ? '+' : ''}{performanceMetrics.dailyChangePercent.toFixed(2)}%
            </div>
            <p className={`text-sm mt-2 ${performanceMetrics.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {performanceMetrics.dailyChange >= 0 ? '+' : ''}{formatCurrency(performanceMetrics.dailyChange)}
            </p>
            <button
              onClick={() => setShowExplanation(true)}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-3 cursor-pointer transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              Why is my return {performanceMetrics.dailyChangePercent >= 0 ? 'up' : 'down'} today?
            </button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{performanceMetrics.bestPerformer?.symbol || 'N/A'}</div>
            <p className="text-sm text-green-400 mt-2">
              {performanceMetrics.bestPerformer?.daily_change_percent != null
                ? `+${performanceMetrics.bestPerformer.daily_change_percent.toFixed(2)}%`
                : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        {isMobile === undefined ? (
          <Skeleton className="h-[400px] w-full" />
        ) : isMobile ? (
          <MobileView assets={assets} totalValue={totalValue} />
        ) : (
          <DesktopView assets={assets} totalValue={totalValue} />
        )}
      </Suspense>

      {/* Explanation Dialog */}
      <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Why is my return {performanceMetrics.dailyChangePercent >= 0 ? 'up' : 'down'} today?
            </DialogTitle>
            <DialogDescription>
              Top 3 drivers of today's {performanceMetrics.dailyChangePercent >= 0 ? 'gain' : 'loss'}:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {topDrivers.map((driver, index) => (
              <div
                key={driver.symbol}
                className="flex items-start justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{index + 1}.</span>
                    <div>
                      <p className="font-semibold">{driver.symbol}</p>
                      <p className="text-sm text-muted-foreground">{driver.name}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <p className={driver.dailyChangePercent != null && driver.dailyChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {driver.dailyChangePercent != null
                        ? `${driver.dailyChangePercent >= 0 ? '+' : ''}${driver.dailyChangePercent.toFixed(2)}% today`
                        : 'N/A'}
                    </p>
                    <p className="text-muted-foreground">
                      Contributing {driver.contribution != null ? Math.abs(driver.contribution).toFixed(2) : '0'}% to portfolio change
                    </p>
                  </div>
                </div>
                <div className={`text-right font-semibold ${driver.dailyChangeValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {driver.dailyChangeValue >= 0 ? '+' : ''}{formatCurrency(driver.dailyChangeValue)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            These stocks had the largest impact on your portfolio's performance today.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
