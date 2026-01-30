// Chart data fetching and formatting for stock price charts

export interface ChartDataPoint {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

/**
 * Fetch historical price data for charting
 */
export async function fetchChartData(
  symbol: string,
  timeframe: TimeFrame = '1M'
): Promise<ChartDataPoint[]> {
  // In production, this would call Yahoo Finance API
  // For demo, we'll generate realistic mock data
  return generateMockChartData(symbol, timeframe);
}

/**
 * Generate realistic mock chart data
 */
function generateMockChartData(symbol: string, timeframe: TimeFrame): ChartDataPoint[] {
  const now = Date.now();
  const dataPoints: ChartDataPoint[] = [];
  
  // Determine number of data points and interval based on timeframe
  const config = {
    '1D': { points: 78, interval: 5 * 60 * 1000 }, // 5-minute intervals
    '1W': { points: 35, interval: 30 * 60 * 1000 }, // 30-minute intervals
    '1M': { points: 30, interval: 24 * 60 * 60 * 1000 }, // Daily
    '3M': { points: 90, interval: 24 * 60 * 60 * 1000 }, // Daily
    '1Y': { points: 52, interval: 7 * 24 * 60 * 60 * 1000 }, // Weekly
    '5Y': { points: 60, interval: 30 * 24 * 60 * 60 * 1000 }, // Monthly
  };
  
  const { points, interval } = config[timeframe];
  
  // Base price varies by symbol
  const basePrices: Record<string, number> = {
    'AAPL': 185,
    'MSFT': 380,
    'GOOGL': 140,
    'AMZN': 145,
    'NVDA': 495,
    'TSLA': 245,
    'META': 325,
    'BTC-USD': 43000,
    'ETH-USD': 2300,
    'SPY': 450,
    'VOO': 420,
  };
  
  let basePrice = basePrices[symbol] || 100;
  let currentPrice = basePrice;
  
  // Generate data points going backwards in time
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = now - (i * interval);
    
    // Add some realistic volatility
    const volatility = 0.02; // 2% daily volatility
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(Math.random() * 10000000) + 1000000;
    
    dataPoints.push({
      timestamp,
      date: new Date(timestamp).toISOString(),
      open,
      high,
      low,
      close,
      volume,
    });
    
    currentPrice = close;
  }
  
  return dataPoints;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return price.toFixed(2);
}

/**
 * Format volume for display
 */
export function formatVolume(volume: number): string {
  if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(2)}B`;
  }
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toString();
}
