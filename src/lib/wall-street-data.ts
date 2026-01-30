// Wall Street Analysis Data Service
// Mock data structure designed to be API-ready

export interface AnalystRating {
  symbol: string;
  consensus: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  targetPrice: number;
  numAnalysts: number;
  buyRatings: number;
  holdRatings: number;
  sellRatings: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  publishedAt: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  url: string;
}

export interface InstitutionalActivity {
  symbol: string;
  activity: 'High Accumulation' | 'Neutral' | 'Distribution';
  quarterlyChange: number; // percentage change in institutional holdings
  topHolders: string[];
}

export interface WallStreetAnalysis {
  rating: AnalystRating;
  news: NewsItem[];
  institutional: InstitutionalActivity;
  sentimentScore: number; // -100 to 100
  targetUpside: number; // percentage
}

// Mock analyst ratings - API-ready structure
const analystRatings: Record<string, AnalystRating> = {
  AAPL: {
    symbol: 'AAPL',
    consensus: 'Buy',
    targetPrice: 195.0,
    numAnalysts: 42,
    buyRatings: 28,
    holdRatings: 12,
    sellRatings: 2,
  },
  MSFT: {
    symbol: 'MSFT',
    consensus: 'Strong Buy',
    targetPrice: 425.0,
    numAnalysts: 38,
    buyRatings: 32,
    holdRatings: 6,
    sellRatings: 0,
  },
  AMZN: {
    symbol: 'AMZN',
    consensus: 'Buy',
    targetPrice: 178.0,
    numAnalysts: 45,
    buyRatings: 35,
    holdRatings: 9,
    sellRatings: 1,
  },
  NVDA: {
    symbol: 'NVDA',
    consensus: 'Strong Buy',
    targetPrice: 580.0,
    numAnalysts: 40,
    buyRatings: 36,
    holdRatings: 4,
    sellRatings: 0,
  },
  TSLA: {
    symbol: 'TSLA',
    consensus: 'Hold',
    targetPrice: 235.0,
    numAnalysts: 35,
    buyRatings: 12,
    holdRatings: 18,
    sellRatings: 5,
  },
  VOO: {
    symbol: 'VOO',
    consensus: 'Buy',
    targetPrice: 445.0,
    numAnalysts: 8,
    buyRatings: 6,
    holdRatings: 2,
    sellRatings: 0,
  },
  QQQ: {
    symbol: 'QQQ',
    consensus: 'Buy',
    targetPrice: 405.0,
    numAnalysts: 10,
    buyRatings: 7,
    holdRatings: 3,
    sellRatings: 0,
  },
  IWM: {
    symbol: 'IWM',
    consensus: 'Hold',
    targetPrice: 185.0,
    numAnalysts: 6,
    buyRatings: 2,
    holdRatings: 4,
    sellRatings: 0,
  },
  BTC: {
    symbol: 'BTC',
    consensus: 'Buy',
    targetPrice: 95000,
    numAnalysts: 15,
    buyRatings: 10,
    holdRatings: 4,
    sellRatings: 1,
  },
  ETH: {
    symbol: 'ETH',
    consensus: 'Buy',
    targetPrice: 4200,
    numAnalysts: 12,
    buyRatings: 8,
    holdRatings: 3,
    sellRatings: 1,
  },
};

// Mock news headlines - API-ready structure
const newsDatabase: Record<string, NewsItem[]> = {
  AAPL: [
    {
      id: '1',
      headline: 'Apple Vision Pro sales exceed expectations in Q1 2026',
      source: 'Bloomberg',
      publishedAt: '2 hours ago',
      sentiment: 'bullish',
      url: '#',
    },
    {
      id: '2',
      headline: 'iPhone 16 demand remains strong amid AI feature rollout',
      source: 'Reuters',
      publishedAt: '5 hours ago',
      sentiment: 'bullish',
      url: '#',
    },
    {
      id: '3',
      headline: 'Analysts raise AAPL price target citing services growth',
      source: 'CNBC',
      publishedAt: '1 day ago',
      sentiment: 'bullish',
      url: '#',
    },
  ],
  MSFT: [
    {
      id: '1',
      headline: 'Microsoft Azure AI revenue jumps 45% year-over-year',
      source: 'WSJ',
      publishedAt: '1 hour ago',
      sentiment: 'bullish',
      url: '#',
    },
    {
      id: '2',
      headline: 'Cloud computing market share gains accelerate for MSFT',
      source: 'MarketWatch',
      publishedAt: '4 hours ago',
      sentiment: 'bullish',
      url: '#',
    },
  ],
  NVDA: [
    {
      id: '1',
      headline: 'NVIDIA announces next-gen Blackwell GPU architecture',
      source: 'TechCrunch',
      publishedAt: '3 hours ago',
      sentiment: 'bullish',
      url: '#',
    },
    {
      id: '2',
      headline: 'Data center demand drives NVDA to record quarterly revenue',
      source: 'Bloomberg',
      publishedAt: '1 day ago',
      sentiment: 'bullish',
      url: '#',
    },
  ],
  TSLA: [
    {
      id: '1',
      headline: 'Tesla FSD beta shows improvement but faces regulatory scrutiny',
      source: 'Reuters',
      publishedAt: '2 hours ago',
      sentiment: 'neutral',
      url: '#',
    },
    {
      id: '2',
      headline: 'Competition intensifies in EV market as rivals cut prices',
      source: 'CNBC',
      publishedAt: '6 hours ago',
      sentiment: 'bearish',
      url: '#',
    },
  ],
  AMZN: [
    {
      id: '1',
      headline: 'Amazon AWS maintains cloud market leadership position',
      source: 'Bloomberg',
      publishedAt: '4 hours ago',
      sentiment: 'bullish',
      url: '#',
    },
    {
      id: '2',
      headline: 'E-commerce margins improve as logistics costs decline',
      source: 'WSJ',
      publishedAt: '1 day ago',
      sentiment: 'bullish',
      url: '#',
    },
  ],
};

// Mock institutional activity - API-ready structure
const institutionalActivity: Record<string, InstitutionalActivity> = {
  AAPL: {
    symbol: 'AAPL',
    activity: 'High Accumulation',
    quarterlyChange: 8.5,
    topHolders: ['Vanguard', 'BlackRock', 'Berkshire Hathaway'],
  },
  MSFT: {
    symbol: 'MSFT',
    activity: 'High Accumulation',
    quarterlyChange: 6.2,
    topHolders: ['Vanguard', 'BlackRock', 'State Street'],
  },
  NVDA: {
    symbol: 'NVDA',
    activity: 'High Accumulation',
    quarterlyChange: 12.3,
    topHolders: ['Vanguard', 'FMR LLC', 'BlackRock'],
  },
  TSLA: {
    symbol: 'TSLA',
    activity: 'Distribution',
    quarterlyChange: -3.2,
    topHolders: ['Vanguard', 'BlackRock', 'Geode Capital'],
  },
  AMZN: {
    symbol: 'AMZN',
    activity: 'Neutral',
    quarterlyChange: 1.5,
    topHolders: ['Vanguard', 'BlackRock', 'State Street'],
  },
};

/**
 * Get comprehensive Wall Street analysis for a stock
 */
export function getWallStreetAnalysis(symbol: string): WallStreetAnalysis {
  const rating = analystRatings[symbol] || {
    symbol,
    consensus: 'Hold' as const,
    targetPrice: 0,
    numAnalysts: 0,
    buyRatings: 0,
    holdRatings: 0,
    sellRatings: 0,
  };

  const news = newsDatabase[symbol] || [
    {
      id: '1',
      headline: `No recent news for ${symbol}`,
      source: 'N/A',
      publishedAt: 'N/A',
      sentiment: 'neutral' as const,
      url: '#',
    },
  ];

  const institutional = institutionalActivity[symbol] || {
    symbol,
    activity: 'Neutral' as const,
    quarterlyChange: 0,
    topHolders: [],
  };

  // Calculate sentiment score based on news
  const sentimentScore = calculateSentimentScore(news);

  // Calculate target upside
  const currentPrice = 100; // This would come from real-time data
  const targetUpside = rating.targetPrice > 0
    ? ((rating.targetPrice - currentPrice) / currentPrice) * 100
    : 0;

  return {
    rating,
    news,
    institutional,
    sentimentScore,
    targetUpside,
  };
}

/**
 * Calculate aggregate sentiment score from news items
 */
function calculateSentimentScore(news: NewsItem[]): number {
  if (news.length === 0) return 0;

  const scores = news.map((item) => {
    switch (item.sentiment) {
      case 'bullish':
        return 33;
      case 'bearish':
        return -33;
      default:
        return 0;
    }
  });

  return scores.reduce((sum: number, score) => sum + score, 0) / news.length;
}

/**
 * Get consensus rating color
 */
export function getRatingColor(consensus: string): string {
  switch (consensus) {
    case 'Strong Buy':
      return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'Buy':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'Hold':
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'Sell':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'Strong Sell':
      return 'text-red-500 bg-red-500/10 border-red-500/20';
    default:
      return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  }
}

/**
 * Get institutional activity color
 */
export function getInstitutionalColor(activity: string): string {
  switch (activity) {
    case 'High Accumulation':
      return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'Distribution':
      return 'text-red-500 bg-red-500/10 border-red-500/20';
    default:
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
  }
}
