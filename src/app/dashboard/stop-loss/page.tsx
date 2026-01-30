'use client';

import { useState, useMemo } from 'react';
import { Shield, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { formatCurrency } from '@/lib/format';
import {
  calculateStopLoss,
  getRiskLevelColor,
  getVolatilityDescription,
  generatePriceHistory,
  type RiskProfile,
} from '@/lib/stop-loss-engine';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function StopLossManagerPage() {
  const { assets } = usePortfolioStore();
  const [globalRiskProfile, setGlobalRiskProfile] = useState<RiskProfile>('Moderate');
  const [trailingStopEnabled, setTrailingStopEnabled] = useState<Record<string, boolean>>({});
  const [manualOverrides, setManualOverrides] = useState<Record<string, number>>({});

  // Calculate stop loss data for all positions
  const stopLossData = useMemo(() => {
    return assets.map((asset) => {
      const data = calculateStopLoss(
        asset,
        globalRiskProfile,
        trailingStopEnabled[asset.symbol] || false,
        manualOverrides[asset.symbol]
      );
      return {
        ...asset,
        ...data,
      };
    });
  }, [assets, globalRiskProfile, trailingStopEnabled, manualOverrides]);

  // Portfolio-level risk metrics
  const portfolioRisk = useMemo(() => {
    const triggeredCount = stopLossData.filter((d) => d.riskLevel === 'Triggered').length;
    const warningCount = stopLossData.filter((d) => d.riskLevel === 'Warning').length;
    const safeCount = stopLossData.filter((d) => d.riskLevel === 'Safe').length;
    const totalPotentialLoss = stopLossData.reduce((sum, d) => sum + d.potentialLoss, 0);

    return {
      triggeredCount,
      warningCount,
      safeCount,
      totalPotentialLoss,
    };
  }, [stopLossData]);

  const toggleTrailingStop = (symbol: string) => {
    setTrailingStopEnabled((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20 flex-shrink-0">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Stop Loss Manager</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Dynamic risk management with ATR-based stop loss calculations
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3 md:px-4 py-2 md:py-3 flex-shrink-0">
          <span className="text-xs md:text-sm text-gray-400 font-medium font-sans whitespace-nowrap">Risk:</span>
          <Select
            value={globalRiskProfile}
            onValueChange={(value) => setGlobalRiskProfile(value as RiskProfile)}
          >
            <SelectTrigger className="w-32 md:w-40 bg-white/10 backdrop-blur-md border-white/20 text-white font-sans text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-sans">
              <SelectItem value="Conservative">Conservative</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Aggressive">Aggressive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Portfolio Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Safe Positions</CardTitle>
            <Shield className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {portfolioRisk.safeCount}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Well above stop loss levels
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Warning Zone</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {portfolioRisk.warningCount}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Approaching stop loss
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Triggered Stops</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">
              {portfolioRisk.triggeredCount}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Stop loss triggered
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Potential Risk</CardTitle>
            <Activity className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(Math.abs(portfolioRisk.totalPotentialLoss))}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              At current stop loss levels
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Section */}
      {(portfolioRisk.triggeredCount > 0 || portfolioRisk.warningCount > 0) && (
        <Card className="mb-8 bg-yellow-500/5 backdrop-blur-md border-yellow-500/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stopLossData
                .filter((d) => d.riskLevel !== 'Safe')
                .map((data) => (
                  <div
                    key={data.symbol}
                    className={`p-4 rounded-lg border backdrop-blur-sm ${
                      data.riskLevel === 'Triggered'
                        ? 'border-red-500/20 bg-red-500/10'
                        : 'border-yellow-500/20 bg-yellow-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">{data.symbol}</span>
                        <span className="text-sm text-gray-400 ml-2">
                          {data.riskLevel === 'Triggered'
                            ? 'Stop loss triggered!'
                            : `Only ${data.distanceToStopLoss.toFixed(1)}% above stop loss`}
                        </span>
                      </div>
                      <Badge className={getRiskLevelColor(data.riskLevel)}>
                        {data.riskLevel}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Stop Loss Table */}
      <Card className="mb-8 bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Position Risk Management</CardTitle>
          <p className="text-sm text-gray-400">
            Dynamic stop loss levels based on Average True Range (ATR)
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-300 font-semibold">Stock</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Entry Price</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Current Price</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Stop Loss</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Distance</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Volatility</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Risk Level</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Trailing Stop</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stopLossData.map((data) => {
                  const activeStopLoss =
                    data.trailingStopLoss ||
                    data.stopLossPrice[globalRiskProfile.toLowerCase() as keyof typeof data.stopLossPrice];
                  return (
                    <TableRow key={data.symbol} className="border-white/10 hover:bg-white/5 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-semibold text-white">{data.symbol}</div>
                          <div className="text-sm text-gray-400">
                            {data.shares} shares
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-300">
                        {formatCurrency(data.entryPrice)}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {formatCurrency(data.currentPrice)}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-red-400">
                          {formatCurrency(activeStopLoss)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Risk: {formatCurrency(Math.abs(data.potentialLoss))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            data.distanceToStopLoss > 10
                              ? 'text-green-400'
                              : data.distanceToStopLoss > 5
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {data.distanceToStopLoss.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-300">
                          {getVolatilityDescription(data.atr, data.currentPrice)}
                        </div>
                        <div className="text-xs text-gray-400">
                          ATR: {formatCurrency(data.atr)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskLevelColor(data.riskLevel)}>
                          {data.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={trailingStopEnabled[data.symbol] ? 'default' : 'outline'}
                          onClick={() => toggleTrailingStop(data.symbol)}
                          className={trailingStopEnabled[data.symbol] 
                            ? 'bg-primary/80 backdrop-blur-md border-primary/30 hover:bg-primary/90' 
                            : 'bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white'}
                        >
                          {trailingStopEnabled[data.symbol] ? 'Enabled' : 'Enable'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Price Charts with Stop Loss Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stopLossData.slice(0, 6).map((data) => {
          const priceHistory = generatePriceHistory(data.currentPrice);
          const activeStopLoss =
            data.trailingStopLoss ||
            data.stopLossPrice[globalRiskProfile.toLowerCase() as keyof typeof data.stopLossPrice];

          return (
            <Card key={data.symbol} className="bg-gray-900/50 backdrop-blur-md border-white/10 shadow-xl">
              <CardHeader className="bg-gray-800/30 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">{data.symbol}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">
                      30-day price with stop loss
                    </p>
                  </div>
                  <Badge className={getRiskLevelColor(data.riskLevel)}>
                    {data.riskLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="date"
                      stroke="#888"
                      fontSize={10}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis stroke="#888" fontSize={10} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Price']}
                    />
                    <ReferenceLine
                      y={activeStopLoss}
                      stroke="#ef4444"
                      strokeDasharray="5 5"
                      label={{
                        value: 'Stop Loss',
                        fill: '#ef4444',
                        fontSize: 10,
                      }}
                    />
                    <ReferenceLine
                      y={data.entryPrice}
                      stroke="#6366f1"
                      strokeDasharray="3 3"
                      label={{
                        value: 'Entry',
                        fill: '#6366f1',
                        fontSize: 10,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs bg-gray-800/40 p-3 rounded-lg">
                  <div>
                    <div className="text-gray-400">Conservative</div>
                    <div className="font-semibold text-white">
                      {formatCurrency(data.stopLossPrice.conservative)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Moderate</div>
                    <div className="font-semibold text-white">
                      {formatCurrency(data.stopLossPrice.moderate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Aggressive</div>
                    <div className="font-semibold text-white">
                      {formatCurrency(data.stopLossPrice.aggressive)}
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
