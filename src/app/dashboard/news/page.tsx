'use client';

import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import { fetchStockNews, type NewsArticle } from '@/lib/news-api';

export default function NewsPage() {
  const { assets } = usePortfolioStore();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const symbols = assets.map(a => a.symbol);
      const articles = await fetchStockNews(symbols);
      setNews(articles);
      setLoading(false);
    }

    loadNews();

    // Refresh news every 2 minutes for intraday trading
    const interval = setInterval(loadNews, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [assets]);

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSentimentBadge = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-sans">
            Positive
          </Badge>
        );
      case 'negative':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-sans">
            Negative
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 font-sans">
            Neutral
          </Badge>
        );
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
          <Newspaper className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-sans">Market News</h1>
          <p className="text-gray-400 text-base font-sans">
            AI-analyzed news for your portfolio, updated every 2 minutes
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white/5 backdrop-blur-md border-white/10">
              <CardContent className="p-6">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-white/10 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((article, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <div className="p-1.5 rounded-full bg-white/10">
                        {getSentimentIcon(article.sentiment)}
                      </div>
                      {article.impact === 'high' && (
                        <Badge className="text-xs bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/40 font-sans font-semibold px-3 py-1 shadow-lg shadow-orange-500/20">
                          HIGH IMPACT
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-xl leading-tight text-white mb-3 font-sans">
                      {article.title}
                    </h3>

                    <p className="text-gray-400 mb-4 leading-relaxed font-sans">
                      {article.description}
                    </p>

                    {article.sentimentReason && (
                      <div className="bg-gray-800/40 border border-white/10 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-300 font-sans">
                            <span className="font-semibold text-white">AI Analysis:</span> {article.sentimentReason}
                          </p>
                        </div>
                        {article.impact && (
                          <p className="text-xs text-gray-400 ml-6 font-sans">
                            Impact Level: <span className="font-semibold capitalize text-white">{article.impact}</span>
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
                          <span className="text-sm font-semibold text-white font-sans">{article.source}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
                          <span className="text-sm text-gray-300 font-sans">
                            {formatTimeAgo(article.publishedAt)}
                          </span>
                        </div>
                        {getSentimentBadge(article.sentiment)}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-sans border border-white/10"
                      >
                        Read More
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {news.length === 0 && (
            <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Newspaper className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white font-sans">No news found</h3>
                <p className="text-gray-400 font-sans">
                  No recent news found for your portfolio holdings.
                  Try adding more stocks to get relevant news updates.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
