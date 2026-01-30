'use server';

import { fetchPortfolioNews, fetchMarketNews } from '@/lib/stock-api';
import { analyzeNewsSentiment } from '@/lib/news-analyzer';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  impact?: string;
  sentimentReason?: string;
}

/**
 * Fetch real-time stock news with AI-powered sentiment analysis
 * Uses Yahoo Finance API (free, unlimited) + GPT-4o-mini for sentiment
 */
export async function fetchStockNews(symbols: string[]): Promise<NewsArticle[]> {
  try {
    // Fetch real news from Yahoo Finance for all symbols
    const portfolioNewsMap = await fetchPortfolioNews(symbols);
    const marketNews = await fetchMarketNews();

    // Combine all news articles
    let allNews: any[] = [];

    // Add portfolio-specific news
    for (const [symbol, news] of portfolioNewsMap.entries()) {
      allNews = allNews.concat(news.map(item => ({
        ...item,
        symbol: symbol,
      })));
    }

    // Add general market news
    allNews = allNews.concat(marketNews);

    // Remove duplicates based on title
    const uniqueNews = Array.from(
      new Map(allNews.map(item => [item.title, item])).values()
    );

    // Apply AI-powered sentiment analysis
    const analyzedNews = await analyzeNewsSentiment(uniqueNews);

    // Convert to NewsArticle format
    const articles: NewsArticle[] = analyzedNews.map((item: any) => ({
      title: item.title,
      description: item.summary || 'No description available',
      url: item.link,
      source: item.publisher,
      publishedAt: item.publishedAt,
      sentiment: item.sentiment || 'neutral',
      impact: item.impact || 'medium',
      sentimentReason: item.sentimentReason || '',
    }));

    // Sort by published date (newest first)
    articles.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return articles.slice(0, 15); // Return top 15 most recent articles

  } catch (error) {
    console.error('Failed to fetch real-time news:', error);
    return [];
  }
}
