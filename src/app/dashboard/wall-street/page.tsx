'use client';

import { useMemo } from 'react';
import { Newspaper, TrendingUp, Building2, Target, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { formatCurrency } from '@/lib/format';
import {
  getWallStreetAnalysis,
  getRatingColor,
  getInstitutionalColor,
} from '@/lib/wall-street-data';
import { Progress } from '@/components/ui/progress';

export default function WallStreetAnalysisPage() {
  const { assets } = usePortfolioStore();

  // Get Wall Street analysis for all stocks
  const analyses = useMemo(() => {
    return assets.map((asset) => {
      const analysis = getWallStreetAnalysis(asset.symbol);
      return {
        ...asset,
        ...analysis,
      };
    });
  }, [assets]);

  // Portfolio-level insights
  const portfolioInsights = useMemo(() => {
    const strongBuyCount = analyses.filter(
      (a) => a.rating.consensus === 'Strong Buy'
    ).length;
    const buyCount = analyses.filter((a) => a.rating.consensus === 'Buy').length;
    const avgTargetUpside =
      analyses.reduce((sum, a) => {
        const upside = a.rating.targetPrice > 0
          ? ((a.rating.targetPrice - a.price) / a.price) * 100
          : 0;
        return sum + upside;
      }, 0) / analyses.length;

    const highConvictionStocks = analyses.filter(
      (a) =>
        (a.rating.consensus === 'Strong Buy' || a.rating.consensus === 'Buy') &&
        ((a.rating.targetPrice - a.price) / a.price) * 100 > 15
    );

    return {
      strongBuyCount,
      buyCount,
      avgTargetUpside,
      highConvictionStocks,
    };
  }, [analyses]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white font-sans">Wall Street Analysis</h1>
          <p className="text-gray-400 mt-1 font-sans">
            Analyst ratings, price targets, and market sentiment
          </p>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Strong Buy Stocks</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {portfolioInsights.strongBuyCount}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {portfolioInsights.buyCount} additional Buy ratings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Target Upside</CardTitle>
            <Target className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                portfolioInsights.avgTargetUpside >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {portfolioInsights.avgTargetUpside >= 0 ? '+' : ''}
              {portfolioInsights.avgTargetUpside.toFixed(2)}%
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Based on analyst targets
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">High Conviction</CardTitle>
            <AlertCircle className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {portfolioInsights.highConvictionStocks.length}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Buy rating + 15%+ upside
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Portfolio Coverage</CardTitle>
            <Newspaper className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{assets.length}/{assets.length}</div>
            <p className="text-sm text-gray-400 mt-2">
              Stocks with analyst coverage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* High Conviction Stocks Highlight */}
      {portfolioInsights.highConvictionStocks.length > 0 && (
        <Card className="mb-8 bg-green-500/5 backdrop-blur-md border-green-500/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-green-400" />
              High Conviction Opportunities
            </CardTitle>
            <p className="text-sm text-gray-400">
              Stocks with strong Buy consensus and significant upside potential
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioInsights.highConvictionStocks.map((stock) => {
                const upside = ((stock.rating.targetPrice - stock.price) / stock.price) * 100;
                return (
                  <div
                    key={stock.symbol}
                    className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-lg text-white">{stock.symbol}</div>
                        <div className="text-sm text-gray-400">{stock.name}</div>
                      </div>
                      <Badge className={getRatingColor(stock.rating.consensus)}>
                        {stock.rating.consensus}
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Target:</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(stock.rating.targetPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Upside:</span>
                        <span className="font-semibold text-green-400">
                          +{upside.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis by Stock */}
      <div className="space-y-6">
        {analyses.map((analysis) => {
          const upside = analysis.rating.targetPrice > 0
            ? ((analysis.rating.targetPrice - analysis.price) / analysis.price) * 100
            : 0;

          return (
            <Card key={analysis.symbol} className="bg-gray-900/50 backdrop-blur-md border-white/10 shadow-xl">
              <CardHeader className="bg-gray-800/30 border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white">{analysis.symbol}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">
                      {analysis.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {formatCurrency(analysis.price)}
                    </div>
                    <div className="text-sm text-gray-400">Current Price</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Analyst Rating */}
                  <div className="space-y-4 p-4 rounded-lg bg-gray-800/40 border border-white/5">
                    <h3 className="font-semibold flex items-center gap-2 text-white text-lg">
                      <Target className="w-5 h-5 text-primary" />
                      Analyst Consensus
                    </h3>
                    <Badge className={getRatingColor(analysis.rating.consensus) + ' text-base px-4 py-1'}>
                      {analysis.rating.consensus}
                    </Badge>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Price:</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(analysis.rating.targetPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Upside:</span>
                        <span
                          className={`font-semibold ${
                            upside >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {upside >= 0 ? '+' : ''}
                          {upside.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Analysts:</span>
                        <span className="font-semibold text-white">{analysis.rating.numAnalysts}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Buy: <span className="text-green-400 font-semibold">{analysis.rating.buyRatings}</span></span>
                        <span>Hold: <span className="text-yellow-400 font-semibold">{analysis.rating.holdRatings}</span></span>
                        <span>Sell: <span className="text-red-400 font-semibold">{analysis.rating.sellRatings}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment */}
                  <div className="space-y-4 p-4 rounded-lg bg-gray-800/40 border border-white/5">
                    <h3 className="font-semibold flex items-center gap-2 text-white text-lg">
                      <Newspaper className="w-5 h-5 text-primary" />
                      News Sentiment
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Progress
                          value={((analysis.sentimentScore + 100) / 200) * 100}
                          className="h-2"
                        />
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          analysis.sentimentScore > 20
                            ? 'text-green-400'
                            : analysis.sentimentScore < -20
                            ? 'text-red-400'
                            : 'text-yellow-400'
                        }`}
                      >
                        {analysis.sentimentScore > 20
                          ? 'Bullish'
                          : analysis.sentimentScore < -20
                          ? 'Bearish'
                          : 'Neutral'}
                      </span>
                    </div>
                    <div className="space-y-3 mt-4">
                      {analysis.news.slice(0, 3).map((newsItem) => (
                        <div
                          key={newsItem.id}
                          className="p-3 rounded-lg bg-gray-900/60 border border-white/10 text-xs"
                        >
                          <div className="font-medium line-clamp-2 text-white">
                            {newsItem.headline}
                          </div>
                          <div className="flex items-center justify-between mt-2 text-gray-400">
                            <span>{newsItem.source}</span>
                            <Badge
                              className={
                                newsItem.sentiment === 'bullish'
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                  : newsItem.sentiment === 'bearish'
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              }
                            >
                              {newsItem.sentiment}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Institutional Activity */}
                  <div className="space-y-4 p-4 rounded-lg bg-gray-800/40 border border-white/5">
                    <h3 className="font-semibold flex items-center gap-2 text-white text-lg">
                      <Building2 className="w-5 h-5 text-primary" />
                      Institutional Activity
                    </h3>
                    <Badge
                      className={
                        getInstitutionalColor(analysis.institutional.activity) + ' text-base px-4 py-1'
                      }
                    >
                      {analysis.institutional.activity}
                    </Badge>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quarterly Change:</span>
                        <span
                          className={`font-semibold ${
                            analysis.institutional.quarterlyChange >= 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {analysis.institutional.quarterlyChange >= 0 ? '+' : ''}
                          {analysis.institutional.quarterlyChange.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-xs text-gray-400 mb-3">
                        Top Institutional Holders:
                      </div>
                      <div className="space-y-2">
                        {analysis.institutional.topHolders.map((holder, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-white"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {holder}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
