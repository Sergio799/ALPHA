'use client';

import { useMemo } from 'react';
import { BarChart, TrendingUp, TrendingDown, DollarSign, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { formatCurrency } from '@/lib/format';
import { calculateIntrinsicValue, getValuationColor } from '@/lib/valuation-engine';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AnalyticsPage() {
  const { assets } = usePortfolioStore();

  // Calculate intrinsic valuations for all stocks
  const valuations = useMemo(() => {
    return assets.map((asset) => {
      const valuation = calculateIntrinsicValue(asset);
      return {
        ...asset,
        ...valuation,
      };
    });
  }, [assets]);

  // Portfolio summary metrics
  const portfolioSummary = useMemo(() => {
    const totalMarketValue = valuations.reduce((sum, v) => sum + v.value, 0);
    const totalIntrinsicValue = valuations.reduce(
      (sum, v) => sum + v.intrinsicValue * v.shares,
      0
    );
    const overallUndervaluation =
      ((totalIntrinsicValue - totalMarketValue) / totalMarketValue) * 100;

    const undervaluedStocks = valuations.filter(
      (v) => v.valuationStatus === 'Undervalued'
    ).length;
    const overvaluedStocks = valuations.filter(
      (v) => v.valuationStatus === 'Overvalued'
    ).length;

    return {
      totalMarketValue,
      totalIntrinsicValue,
      overallUndervaluation,
      undervaluedStocks,
      overvaluedStocks,
      fairlyValuedStocks: valuations.length - undervaluedStocks - overvaluedStocks,
    };
  }, [valuations]);

  // Chart data for intrinsic vs current price
  const chartData = useMemo(() => {
    return valuations.map((v) => ({
      symbol: v.symbol,
      intrinsic: v.intrinsicValue,
      current: v.currentPrice,
      difference: v.differencePercent,
    }));
  }, [valuations]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
          <BarChart className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white font-sans">Portfolio Analytics</h1>
          <p className="text-gray-400 mt-1 font-sans">
            Intrinsic value analysis and valuation insights
          </p>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 font-sans">Total Market Value</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-sans">
              {formatCurrency(portfolioSummary.totalMarketValue)}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-sans">Current portfolio value</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 font-sans">
              Total Intrinsic Value
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-sans">
              {formatCurrency(portfolioSummary.totalIntrinsicValue)}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Estimated fair value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 font-sans">
              Overall Valuation
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
              {portfolioSummary.overallUndervaluation >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold font-sans ${
                portfolioSummary.overallUndervaluation >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {portfolioSummary.overallUndervaluation >= 0 ? '+' : ''}
              {portfolioSummary.overallUndervaluation.toFixed(2)}%
            </div>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              {portfolioSummary.overallUndervaluation >= 0
                ? 'Portfolio undervalued'
                : 'Portfolio overvalued'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 font-sans">Valuation Mix</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
              <Award className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-sans">
              {portfolioSummary.undervaluedStocks}/{assets.length}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Undervalued opportunities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Intrinsic vs Current Price Chart */}
      <Card className="mb-8 bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="bg-gray-800/30 border-b border-white/10">
          <CardTitle className="text-white font-sans">Intrinsic Value vs Current Price</CardTitle>
          <p className="text-sm text-gray-400 mt-2 font-sans">
            Green bars indicate undervaluation, red bars indicate overvaluation
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="symbol" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              />
              <Bar dataKey="intrinsic" fill="#6366f1" name="Intrinsic Value" />
              <Bar dataKey="current" fill="#8b5cf6" name="Current Price" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Valuation Table */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="bg-gray-800/30 border-b border-white/10">
          <CardTitle className="text-white font-sans">Detailed Valuation Analysis</CardTitle>
          <p className="text-sm text-gray-400 mt-2 font-sans">
            Multi-factor valuation model for each holding
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-300 font-semibold font-sans">Stock</TableHead>
                  <TableHead className="text-gray-300 font-semibold font-sans">Current Price</TableHead>
                  <TableHead className="text-gray-300 font-semibold font-sans">Intrinsic Value</TableHead>
                  <TableHead className="text-gray-300 font-semibold font-sans">Difference</TableHead>
                  <TableHead className="text-gray-300 font-semibold font-sans">Status</TableHead>
                  <TableHead className="text-gray-300 font-semibold font-sans">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {valuations.map((val) => (
                  <TableRow key={val.symbol} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-white font-sans">{val.symbol}</div>
                        <div className="text-sm text-gray-400 font-sans">
                          {val.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-white font-sans">
                      {formatCurrency(val.currentPrice)}
                    </TableCell>
                    <TableCell className="font-medium text-white font-sans">
                      {formatCurrency(val.intrinsicValue)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold font-sans ${
                          val.differencePercent >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {val.differencePercent >= 0 ? '+' : ''}
                        {val.differencePercent.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`font-sans ${getValuationColor(val.valuationStatus)}`}
                      >
                        {val.valuationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-blue-400"
                            style={{ width: `${val.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 font-sans">
                          {val.confidence}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
