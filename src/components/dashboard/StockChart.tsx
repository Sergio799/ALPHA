'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { fetchChartData, formatPrice, formatVolume, type TimeFrame, type ChartDataPoint } from '@/lib/chart-data';

interface StockChartProps {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export function StockChart({ symbol, name, currentPrice, change, changePercent }: StockChartProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('1M');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChartData() {
      setLoading(true);
      const data = await fetchChartData(symbol, timeframe);
      setChartData(data);
      setLoading(false);
    }

    loadChartData();
  }, [symbol, timeframe]);

  const timeframes: TimeFrame[] = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

  const isPositive = change >= 0;

  // Format data for line chart
  const lineChartData = chartData.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    price: point.close,
    timestamp: point.timestamp,
  }));

  // Format data for volume chart
  const volumeChartData = chartData.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    volume: point.volume,
    timestamp: point.timestamp,
  }));

  return (
    <Card className="bg-gray-900/50 backdrop-blur-md border-white/10 shadow-xl">
      <CardHeader className="bg-gray-800/30 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl text-white font-bold font-sans">{symbol}</CardTitle>
            <p className="text-sm text-gray-400 mt-1 font-sans">{name}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white font-sans">${formatPrice(currentPrice)}</div>
            <div className="flex items-center gap-2 justify-end mt-2">
              <div className={`p-1.5 rounded-full ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
              <Badge
                className={`text-base px-3 py-1 font-sans ${
                  isPositive 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}
              >
                {isPositive ? '+' : ''}
                {changePercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Timeframe Selector */}
        <div className="flex gap-2 mb-6 p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 w-fit">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={`font-sans ${
                timeframe === tf
                  ? 'bg-primary/80 text-white hover:bg-primary/90 shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tf}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
              <div className="text-gray-400 font-sans">Loading chart data...</div>
            </div>
          </div>
        ) : (
          <>
            {/* Price Chart */}
            <div className="mb-8 p-4 rounded-lg bg-gray-800/40 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h3 className="text-base font-semibold text-white font-sans">Price Movement</h3>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={lineChartData}>
                  <defs>
                    <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isPositive ? '#22c55e' : '#ef4444'}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor={isPositive ? '#22c55e' : '#ef4444'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={{ stroke: '#374151' }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={{ stroke: '#374151' }}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${formatPrice(value)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      fontFamily: 'var(--font-space-grotesk), sans-serif',
                    }}
                    formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? '#22c55e' : '#ef4444'}
                    strokeWidth={3}
                    fill={`url(#gradient-${symbol})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Volume Chart */}
            <div className="p-4 rounded-lg bg-gray-800/40 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h3 className="text-base font-semibold text-white font-sans">Trading Volume</h3>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={volumeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={{ stroke: '#374151' }}
                    hide
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={{ stroke: '#374151' }}
                    tickFormatter={formatVolume}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      fontFamily: 'var(--font-space-grotesk), sans-serif',
                    }}
                    formatter={(value: number) => [formatVolume(value), 'Volume']}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Bar dataKey="volume" fill="#6366f1" opacity={0.7} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
