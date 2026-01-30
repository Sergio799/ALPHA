// Stock search functionality using Yahoo Finance

export interface StockSearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

// Mock stock database for fallback
const MOCK_STOCKS: StockSearchResult[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'EQUITY', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'EQUITY', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'EQUITY', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'EQUITY', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'EQUITY', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'EQUITY', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'EQUITY', exchange: 'NASDAQ' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', type: 'EQUITY', exchange: 'NYSE' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'EQUITY', exchange: 'NYSE' },
  { symbol: 'V', name: 'Visa Inc.', type: 'EQUITY', exchange: 'NYSE' },
  { symbol: 'WMT', name: 'Walmart Inc.', type: 'EQUITY', exchange: 'NYSE' },
  { symbol: 'DIS', name: 'The Walt Disney Company', type: 'EQUITY', exchange: 'NYSE' },
  { symbol: 'NFLX', name: 'Netflix Inc.', type: 'EQUITY', exchange: 'NASDAQ' },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', type: 'EQUITY', exchange: 'NASDAQ' },
  { symbol: 'INTC', name: 'Intel Corporation', type: 'EQUITY', exchange: 'NASDAQ' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETF', exchange: 'NYSE' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', exchange: 'NYSE' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', exchange: 'NASDAQ' },
  { symbol: 'BTC-USD', name: 'Bitcoin USD', type: 'CRYPTOCURRENCY', exchange: 'CCC' },
  { symbol: 'ETH-USD', name: 'Ethereum USD', type: 'CRYPTOCURRENCY', exchange: 'CCC' },
];

/**
 * Search for stocks by symbol or name
 * Uses Yahoo Finance autocomplete API with mock fallback
 */
export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  if (!query || query.length < 1) return [];

  const lowerQuery = query.toLowerCase();

  try {
    const response = await fetch(
      `/api/stock-search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      // Fallback to mock data
      return MOCK_STOCKS.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(lowerQuery) ||
          stock.name.toLowerCase().includes(lowerQuery)
      ).slice(0, 10);
    }

    const data = await response.json();
    const quotes = data.quotes || [];

    const results = quotes
      .filter((q: any) => q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'CRYPTOCURRENCY')
      .map((q: any) => ({
        symbol: q.symbol,
        name: q.longname || q.shortname || q.symbol,
        type: q.quoteType,
        exchange: q.exchange || 'N/A',
      }))
      .slice(0, 10);

    return results.length > 0 ? results : MOCK_STOCKS.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(lowerQuery) ||
        stock.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  } catch (error) {
    console.error('Stock search failed, using mock data:', error);
    // Fallback to mock data
    return MOCK_STOCKS.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(lowerQuery) ||
        stock.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  }
}

// Mock stock prices for fallback
const MOCK_STOCK_PRICES: Record<string, { price: number; previousClose: number; name: string; type: string }> = {
  'AAPL': { price: 185.92, previousClose: 182.15, name: 'Apple Inc.', type: 'EQUITY' },
  'MSFT': { price: 380.45, previousClose: 375.20, name: 'Microsoft Corporation', type: 'EQUITY' },
  'GOOGL': { price: 140.23, previousClose: 138.90, name: 'Alphabet Inc.', type: 'EQUITY' },
  'AMZN': { price: 145.67, previousClose: 143.50, name: 'Amazon.com Inc.', type: 'EQUITY' },
  'NVDA': { price: 495.32, previousClose: 485.10, name: 'NVIDIA Corporation', type: 'EQUITY' },
  'TSLA': { price: 245.18, previousClose: 248.90, name: 'Tesla Inc.', type: 'EQUITY' },
  'META': { price: 325.45, previousClose: 320.10, name: 'Meta Platforms Inc.', type: 'EQUITY' },
  'BRK.B': { price: 365.20, previousClose: 362.50, name: 'Berkshire Hathaway Inc.', type: 'EQUITY' },
  'JPM': { price: 155.80, previousClose: 154.20, name: 'JPMorgan Chase & Co.', type: 'EQUITY' },
  'V': { price: 245.60, previousClose: 243.90, name: 'Visa Inc.', type: 'EQUITY' },
  'WMT': { price: 165.30, previousClose: 164.50, name: 'Walmart Inc.', type: 'EQUITY' },
  'DIS': { price: 95.40, previousClose: 94.80, name: 'The Walt Disney Company', type: 'EQUITY' },
  'NFLX': { price: 485.20, previousClose: 480.50, name: 'Netflix Inc.', type: 'EQUITY' },
  'AMD': { price: 145.80, previousClose: 143.20, name: 'Advanced Micro Devices Inc.', type: 'EQUITY' },
  'INTC': { price: 42.50, previousClose: 42.10, name: 'Intel Corporation', type: 'EQUITY' },
  'VOO': { price: 420.15, previousClose: 418.50, name: 'Vanguard S&P 500 ETF', type: 'ETF' },
  'SPY': { price: 450.30, previousClose: 448.70, name: 'SPDR S&P 500 ETF Trust', type: 'ETF' },
  'QQQ': { price: 385.60, previousClose: 383.20, name: 'Invesco QQQ Trust', type: 'ETF' },
  'BTC-USD': { price: 43250.00, previousClose: 42800.00, name: 'Bitcoin USD', type: 'CRYPTOCURRENCY' },
  'ETH-USD': { price: 2315.50, previousClose: 2290.00, name: 'Ethereum USD', type: 'CRYPTOCURRENCY' },
};

/**
 * Get detailed stock info with mock fallback
 */
export async function getStockInfo(symbol: string) {
  try {
    const response = await fetch(
      `/api/stock-price?symbol=${encodeURIComponent(symbol)}`
    );

    if (!response.ok) {
      // Use mock data
      const mockData = MOCK_STOCK_PRICES[symbol];
      if (mockData) {
        return {
          symbol: symbol,
          name: mockData.name,
          price: mockData.price,
          previousClose: mockData.previousClose,
          currency: 'USD',
          exchange: 'NASDAQ',
          type: mockData.type,
        };
      }
      return null;
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];
    
    if (!result) {
      // Use mock data
      const mockData = MOCK_STOCK_PRICES[symbol];
      if (mockData) {
        return {
          symbol: symbol,
          name: mockData.name,
          price: mockData.price,
          previousClose: mockData.previousClose,
          currency: 'USD',
          exchange: 'NASDAQ',
          type: mockData.type,
        };
      }
      return null;
    }

    const meta = result.meta;

    return {
      symbol: meta.symbol,
      name: meta.longName || meta.shortName || meta.symbol,
      price: meta.regularMarketPrice,
      previousClose: meta.previousClose,
      currency: meta.currency,
      exchange: meta.exchangeName,
      type: meta.instrumentType,
    };
  } catch (error) {
    console.error('Failed to get stock info, using mock data:', error);
    // Use mock data
    const mockData = MOCK_STOCK_PRICES[symbol];
    if (mockData) {
      return {
        symbol: symbol,
        name: mockData.name,
        price: mockData.price,
        previousClose: mockData.previousClose,
        currency: 'USD',
        exchange: 'NASDAQ',
        type: mockData.type,
      };
    }
    return null;
  }
}
