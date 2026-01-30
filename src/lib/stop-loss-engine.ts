import { Asset } from './portfolio-data';

export type RiskProfile = 'Conservative' | 'Moderate' | 'Aggressive';

export interface StopLossData {
  symbol: string;
  entryPrice: number;
  currentPrice: number;
  atr: number; // Average True Range (volatility metric)
  stopLossPrice: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
  trailingStopLoss?: number;
  riskLevel: 'Safe' | 'Warning' | 'Triggered';
  distanceToStopLoss: number; // percentage
  potentialLoss: number; // dollar amount
}

/**
 * Calculate Average True Range (ATR) - simplified version
 * In production, this would use historical price data
 */
function calculateATR(symbol: string, currentPrice: number): number {
  // Mock ATR values based on typical volatility patterns
  const atrDatabase: Record<string, number> = {
    AAPL: currentPrice * 0.025, // 2.5% of price
    MSFT: currentPrice * 0.022,
    AMZN: currentPrice * 0.035,
    NVDA: currentPrice * 0.045,
    TSLA: currentPrice * 0.055,
    VOO: currentPrice * 0.015,
    QQQ: currentPrice * 0.020,
    IWM: currentPrice * 0.025,
    BTC: currentPrice * 0.080,
    ETH: currentPrice * 0.090,
  };

  return atrDatabase[symbol] || currentPrice * 0.03;
}

/**
 * Calculate stop loss levels based on ATR and risk profile
 */
export function calculateStopLoss(
  asset: Asset,
  riskProfile: RiskProfile = 'Moderate',
  useTrailingStop: boolean = false,
  manualStopPrice?: number
): StopLossData {
  const entryPrice = asset.purchase_price;
  const currentPrice = asset.price;
  const atr = calculateATR(asset.symbol, currentPrice);

  // Calculate stop loss prices based on ATR multiples
  const stopLossPrice = {
    conservative: entryPrice - 1.5 * atr,
    moderate: entryPrice - 2.0 * atr,
    aggressive: entryPrice - 3.0 * atr,
  };

  // Get the active stop loss based on profile or manual override
  const activeStopLoss =
    manualStopPrice || stopLossPrice[riskProfile.toLowerCase() as keyof typeof stopLossPrice];

  // Calculate trailing stop loss if enabled
  const trailingStopLoss = useTrailingStop
    ? currentPrice - 2.0 * atr
    : undefined;

  // Determine risk level
  const effectiveStopLoss = trailingStopLoss || activeStopLoss;
  const distanceToStopLoss =
    ((currentPrice - effectiveStopLoss) / currentPrice) * 100;

  let riskLevel: 'Safe' | 'Warning' | 'Triggered';
  if (currentPrice <= effectiveStopLoss) {
    riskLevel = 'Triggered';
  } else if (distanceToStopLoss < 5) {
    riskLevel = 'Warning';
  } else {
    riskLevel = 'Safe';
  }

  // Calculate potential loss
  const potentialLoss = (currentPrice - effectiveStopLoss) * asset.shares;

  return {
    symbol: asset.symbol,
    entryPrice,
    currentPrice,
    atr,
    stopLossPrice,
    trailingStopLoss,
    riskLevel,
    distanceToStopLoss,
    potentialLoss,
  };
}

/**
 * Get risk level color
 */
export function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'Safe':
      return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'Warning':
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'Triggered':
      return 'text-red-500 bg-red-500/10 border-red-500/20';
    default:
      return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  }
}

/**
 * Get ATR-based volatility description
 */
export function getVolatilityDescription(atr: number, price: number): string {
  const atrPercent = (atr / price) * 100;

  if (atrPercent < 2) return 'Low Volatility';
  if (atrPercent < 4) return 'Moderate Volatility';
  if (atrPercent < 6) return 'High Volatility';
  return 'Very High Volatility';
}

/**
 * Generate price history data for chart (mock data)
 */
export function generatePriceHistory(
  currentPrice: number,
  days: number = 30
): { date: string; price: number }[] {
  const history: { date: string; price: number }[] = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate price movement
    const volatility = 0.02;
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const dayPrice = currentPrice * (1 - (i / days) * 0.05 + randomChange);

    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(dayPrice, 0),
    });
  }

  return history;
}
