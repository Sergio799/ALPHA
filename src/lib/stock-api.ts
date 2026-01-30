// Real-time stock price fetcher (optional - for production)

/**
 * Fetch real stock prices from Alpha Vantage
 * Free tier: 25 requests/day
 * Get API key: https://www.alphavantage.co/support/#api-key
 */
export async function fetchRealStockPrice(symbol: string): Promise<number | null> {
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    console.warn('ALPHA_VANTAGE_API_KEY not set, using dummy data');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
      { cache: 'no-store' }
    );

    const data = await response.json();

    // Check for API limit
    if (data.Note || data['Error Message']) {
      console.warn(`Alpha Vantage API limit or error for ${symbol}`);
      return null;
    }

    const price = parseFloat(data['Global Quote']?.['05. price']);

    return price || null;
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch real stock prices from Finnhub
 * Free tier: 60 calls/minute
 * Get API key: https://finnhub.io/register
 */
export async function fetchFinnhubPrice(symbol: string): Promise<number | null> {
  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { cache: 'no-store' }
    );

    const data = await response.json();
    return data.c || null; // Current price
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch real stock prices from Yahoo Finance (unofficial but reliable)
 * Free tier: Unlimited
 * No API key needed
 * Perfect for hackathon demos!
 */
export async function fetchYahooPrice(symbol: string): Promise<number | null> {
  try {
    // Use direct fetch for server-side (no CORS issues)
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      }
    );

    if (!response.ok) {
      console.warn(`Yahoo Finance returned ${response.status} for ${symbol}`);
      return null;
    }

    const data = await response.json();
    const price = data.chart?.result?.[0]?.meta?.regularMarketPrice;

    if (price && typeof price === 'number') {
      return price;
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch prices with fallback (tries multiple sources)
 * Yahoo Finance is tried first because it's fastest and has no rate limits
 */
export async function fetchStockPriceWithFallback(symbol: string): Promise<number | null> {
  // Try Yahoo first (no API key, unlimited, fast!)
  let price = await fetchYahooPrice(symbol);
  if (price) return price;

  // Try Alpha Vantage as fallback (you have API key)
  price = await fetchRealStockPrice(symbol);
  if (price) return price;

  // Try Finnhub as last resort
  price = await fetchFinnhubPrice(symbol);
  if (price) return price;

  return null;
}

/**
 * Fetch prices for multiple symbols (fast with Yahoo Finance!)
 * No rate limiting needed with Yahoo Finance
 */
export async function fetchMultiplePrices(symbols: string[]): Promise<Map<string, number>> {
  const prices = new Map<string, number>();

  // Fetch all prices in parallel (Yahoo has no rate limit!)
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const price = await fetchStockPriceWithFallback(symbol);
      return { symbol, price };
    })
  );

  // Store results
  results.forEach(({ symbol, price }) => {
    if (price) {
      prices.set(symbol, price);
    }
  });

  return prices;
}

/**
 * Update portfolio with real prices (fast with Yahoo Finance!)
 * All stocks load in parallel - takes ~5 seconds total
 */
export async function updatePortfolioWithRealPrices(portfolio: any[]) {
  // Fetch all prices in parallel (Yahoo has no rate limit!)
  const updatedPortfolio = await Promise.all(
    portfolio.map(async (asset) => {
      const realPrice = await fetchStockPriceWithFallback(asset.symbol);

      if (realPrice) {
        return {
          ...asset,
          price: realPrice,
          value: realPrice * asset.shares,
          daily_change_percent: ((realPrice - asset.price_open) / asset.price_open) * 100,
        };
      }

      return asset; // Keep dummy data if API fails
    })
  );

  return updatedPortfolio;
}

/**
 * Fetch Yahoo Finance news for a stock symbol with better company-specific queries
 */
export async function fetchYahooNews(symbol: string): Promise<any[]> {
  try {
    // Get company name for better search results
    const companyNames: Record<string, string> = {
      'AAPL': 'Apple Inc',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Google Alphabet',
      'AMZN': 'Amazon',
      'TSLA': 'Tesla',
      'NVDA': 'NVIDIA',
      'META': 'Meta Facebook',
      'NFLX': 'Netflix',
      'AMD': 'AMD',
      'INTC': 'Intel',
    };

    const companyName = companyNames[symbol] || symbol;

    // Fetch news using both symbol and company name for better relevance
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(companyName)}&quotesCount=1&newsCount=10`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const news = data.news || [];

    // Filter out news that doesn't mention the symbol or company
    const relevantNews = news
      .map((item: any) => ({
        title: item.title,
        publisher: item.publisher,
        link: item.link,
        publishedAt: new Date(item.providerPublishTime * 1000).toISOString(),
        summary: item.summary || '',
        relatedTickers: item.relatedTickers || [],
      }))
      .filter((item: any) => {
        // Only include if it mentions the symbol or appears in relatedTickers
        const mentionsSymbol = item.title.toLowerCase().includes(symbol.toLowerCase()) ||
                              item.summary.toLowerCase().includes(symbol.toLowerCase()) ||
                              item.relatedTickers?.includes(symbol);
        return mentionsSymbol;
      })
      .slice(0, 5); // Limit to top 5 most relevant

    return relevantNews;
  } catch (error) {
    console.error(`Failed to fetch news for ${symbol}:`, error);
    return [];
  }
}

/**
 * Fetch market news (general market trends) with better queries
 */
export async function fetchMarketNews(): Promise<any[]> {
  try {
    // Use multiple focused queries for better market news
    const queries = [
      'stock market today',
      'S&P 500',
      'Federal Reserve',
      'inflation',
      'interest rates'
    ];

    // Fetch from the most relevant query
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(queries[0])}&quotesCount=0&newsCount=10`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const news = data.news || [];

    // Filter for actual market news (not individual stocks)
    const marketKeywords = ['market', 'stocks', 's&p', 'dow', 'nasdaq', 'fed', 'federal reserve',
                           'economy', 'inflation', 'recession', 'bull', 'bear', 'treasury', 'bonds'];

    return news
      .map((item: any) => ({
        title: item.title,
        publisher: item.publisher,
        link: item.link,
        publishedAt: new Date(item.providerPublishTime * 1000).toISOString(),
        summary: item.summary || '',
      }))
      .filter((item: any) => {
        // Only include if it mentions market-related terms
        const text = (item.title + ' ' + item.summary).toLowerCase();
        return marketKeywords.some(keyword => text.includes(keyword));
      })
      .slice(0, 8); // Return top 8 most relevant market news

  } catch (error) {
    console.error('Failed to fetch market news:', error);
    return [];
  }
}

/**
 * Fetch news for all portfolio stocks
 */
export async function fetchPortfolioNews(symbols: string[]): Promise<Map<string, any[]>> {
  const newsMap = new Map<string, any[]>();

  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const news = await fetchYahooNews(symbol);
      return { symbol, news };
    })
  );

  results.forEach(({ symbol, news }) => {
    newsMap.set(symbol, news);
  });

  return newsMap;
}
