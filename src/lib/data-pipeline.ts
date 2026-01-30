export interface OHLCVData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

export interface FundamentalData {
  // Income Statement
  revenue: number;
  netIncome: number;
  eps: number;
  ebitda: number;
  operatingIncome: number;
  
  // Balance Sheet
  totalAssets: number;
  totalDebt: number;
  shareholderEquity: number;
  currentAssets: number;
  currentLiabilities: number;
  
  // Cash Flow
  operatingCashFlow: number;
  freeCashFlow: number;
  
  // Ratios
  pe: number;
  pb: number;
  ps: number;
  roe: number;
  roa: number;
  debtToEquity: number;
  currentRatio: number;
  
  // Growth
  revenueGrowth: number;
  earningsGrowth: number;
  
  // Valuation
  marketCap: number;
  enterpriseValue: number;
  
  // Dividends
  dividendYield: number;
  payoutRatio: number;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  dividendYield: number;
  sector: string;
  industry: string;
}

/**
 * Fetch historical OHLCV data from Yahoo Finance
 * This is ESSENTIAL for all quantitative analysis
 */
export async function fetchHistoricalData(
  symbol: string,
  period: '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' = '1y',
  interval: '1d' | '1wk' | '1mo' = '1d'
): Promise<OHLCVData[]> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${period}`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      }
    );

    if (!response.ok) {
      console.warn(`Yahoo Finance returned ${response.status} for ${symbol}`);
      return [];
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];
    
    if (!result) return [];

    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};
    const adjClose = result.indicators?.adjclose?.[0]?.adjclose || [];

    const ohlcv: OHLCVData[] = timestamps.map((timestamp: number, i: number) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      open: quotes.open?.[i] || 0,
      high: quotes.high?.[i] || 0,
      low: quotes.low?.[i] || 0,
      close: quotes.close?.[i] || 0,
      volume: quotes.volume?.[i] || 0,
      adjustedClose: adjClose[i] || quotes.close?.[i] || 0,
    }));

    return ohlcv.filter(d => d.close > 0); // Remove invalid data
  } catch (error) {
    console.error(`Failed to fetch historical data for ${symbol}:`, error);
    return [];
  }
}

/**
 * Fetch market data (quote + stats) from Yahoo Finance
 */
export async function fetchMarketData(symbol: string): Promise<MarketData | null> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price,summaryDetail,defaultKeyStatistics`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const result = data.quoteSummary?.result?.[0];
    
    if (!result) return null;

    const price = result.price || {};
    const summary = result.summaryDetail || {};
    const stats = result.defaultKeyStatistics || {};

    return {
      symbol: price.symbol || symbol,
      name: price.longName || price.shortName || symbol,
      price: price.regularMarketPrice?.raw || 0,
      change: price.regularMarketChange?.raw || 0,
      changePercent: price.regularMarketChangePercent?.raw || 0,
      volume: price.regularMarketVolume?.raw || 0,
      marketCap: price.marketCap?.raw || 0,
      pe: summary.trailingPE?.raw || 0,
      beta: stats.beta?.raw || 1.0,
      fiftyTwoWeekHigh: summary.fiftyTwoWeekHigh?.raw || 0,
      fiftyTwoWeekLow: summary.fiftyTwoWeekLow?.raw || 0,
      dividendYield: summary.dividendYield?.raw || 0,
      sector: price.sector || 'Unknown',
      industry: price.industry || 'Unknown',
    };
  } catch (error) {
    console.error(`Failed to fetch market data for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch fundamental data from Yahoo Finance
 */
export async function fetchFundamentals(symbol: string): Promise<FundamentalData | null> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=financialData,defaultKeyStatistics,summaryDetail`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const result = data.quoteSummary?.result?.[0];
    
    if (!result) return null;

    const financial = result.financialData || {};
    const stats = result.defaultKeyStatistics || {};
    const summary = result.summaryDetail || {};

    return {
      // Income Statement
      revenue: financial.totalRevenue?.raw || 0,
      netIncome: financial.netIncomeToCommon?.raw || 0,
      eps: financial.trailingEps?.raw || 0,
      ebitda: financial.ebitda?.raw || 0,
      operatingIncome: financial.operatingCashflow?.raw || 0,
      
      // Balance Sheet
      totalAssets: financial.totalAssets?.raw || 0,
      totalDebt: financial.totalDebt?.raw || 0,
      shareholderEquity: financial.totalCashPerShare?.raw || 0,
      currentAssets: 0, // Not available in this endpoint
      currentLiabilities: 0,
      
      // Cash Flow
      operatingCashFlow: financial.operatingCashflow?.raw || 0,
      freeCashFlow: financial.freeCashflow?.raw || 0,
      
      // Ratios
      pe: summary.trailingPE?.raw || 0,
      pb: stats.priceToBook?.raw || 0,
      ps: stats.priceToSalesTrailing12Months?.raw || 0,
      roe: financial.returnOnEquity?.raw || 0,
      roa: financial.returnOnAssets?.raw || 0,
      debtToEquity: financial.debtToEquity?.raw || 0,
      currentRatio: financial.currentRatio?.raw || 0,
      
      // Growth
      revenueGrowth: financial.revenueGrowth?.raw || 0,
      earningsGrowth: financial.earningsGrowth?.raw || 0,
      
      // Valuation
      marketCap: summary.marketCap?.raw || 0,
      enterpriseValue: stats.enterpriseValue?.raw || 0,
      
      // Dividends
      dividendYield: summary.dividendYield?.raw || 0,
      payoutRatio: stats.payoutRatio?.raw || 0,
    };
  } catch (error) {
    console.error(`Failed to fetch fundamentals for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch S&P 500 data (market benchmark)
 */
export async function fetchMarketBenchmark(
  period: '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' = '1y'
): Promise<OHLCVData[]> {
  return fetchHistoricalData('^GSPC', period, '1d');
}

/**
 * Fetch risk-free rate (10-year Treasury yield)
 * Using FRED API (Federal Reserve Economic Data)
 */
export async function fetchRiskFreeRate(): Promise<number> {
  try {
    // Fallback: Use Yahoo Finance for 10-year Treasury
    const response = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/^TNX?interval=1d&range=1d',
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch risk-free rate, using default 4%');
      return 0.04; // Default 4%
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];
    const quotes = result?.indicators?.quote?.[0];
    const latestClose = quotes?.close?.[quotes.close.length - 1];

    if (latestClose) {
      return latestClose / 100; // Convert from percentage to decimal
    }

    return 0.04; // Default 4%
  } catch (error) {
    console.error('Failed to fetch risk-free rate:', error);
    return 0.04; // Default 4%
  }
}

/**
 * Fetch all data for a stock (comprehensive)
 */
export async function fetchAllStockData(symbol: string) {
  const [historical, market, fundamentals] = await Promise.all([
    fetchHistoricalData(symbol, '1y', '1d'),
    fetchMarketData(symbol),
    fetchFundamentals(symbol),
  ]);

  return {
    symbol,
    historical,
    market,
    fundamentals,
  };
}

/**
 * Fetch all data for portfolio (parallel)
 */
export async function fetchAllPortfolioData(symbols: string[]) {
  const [stocksData, benchmarkData, riskFreeRate] = await Promise.all([
    Promise.all(symbols.map(symbol => fetchAllStockData(symbol))),
    fetchMarketBenchmark('1y'),
    fetchRiskFreeRate(),
  ]);

  return {
    stocks: stocksData,
    benchmark: benchmarkData,
    riskFreeRate,
  };
}

/**
 * Calculate returns from OHLCV data
 */
export function calculateReturns(ohlcv: OHLCVData[]): number[] {
  const returns: number[] = [];
  
  for (let i = 1; i < ohlcv.length; i++) {
    const prevClose = ohlcv[i - 1].adjustedClose;
    const currClose = ohlcv[i].adjustedClose;
    
    if (prevClose > 0) {
      returns.push((currClose - prevClose) / prevClose);
    }
  }
  
  return returns;
}

/**
 * Calculate prices from OHLCV data
 */
export function extractPrices(ohlcv: OHLCVData[]): number[] {
  return ohlcv.map(d => d.adjustedClose);
}

/**
 * Get date range for historical data
 */
export function getDateRange(ohlcv: OHLCVData[]): { start: string; end: string } {
  if (ohlcv.length === 0) {
    return { start: '', end: '' };
  }
  
  return {
    start: ohlcv[0].date,
    end: ohlcv[ohlcv.length - 1].date,
  };
}
