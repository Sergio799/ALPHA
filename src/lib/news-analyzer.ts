'use server';

import { ai } from '@/ai/genkit';

/**
 * AI-powered sentiment analysis for news articles
 * Uses GPT-4o-mini for fast, accurate sentiment detection
 */
export async function analyzeNewsSentiment(articles: any[]): Promise<any[]> {
  if (articles.length === 0) return [];

  try {
    const articlesText = articles
      .map((article, i) => `${i + 1}. ${article.title}\n   ${article.summary || ''}`)
      .join('\n\n');

    const { output } = await ai.generate({
      model: 'gpt-4o-mini',
      systemMessage: `You are a financial news analyst specializing in sentiment analysis. Analyze news headlines and summaries to determine their sentiment (positive, negative, or neutral) and impact on stock prices.`,
      prompt: `Analyze the sentiment of these news articles. For each article, provide:
1. Sentiment: positive, negative, or neutral
2. Impact level: high, medium, or low (how much this could affect stock prices)
3. Brief reason (10-15 words)

Articles:
${articlesText}

Respond in JSON format as an array of objects with this structure:
[
  {
    "index": 1,
    "sentiment": "positive",
    "impact": "high",
    "reason": "Strong earnings beat expectations, revenue growth accelerating"
  },
  ...
]

Only return the JSON array, no other text.`,
      output: { format: 'text' }
    });

    // Parse AI response
    let analysis;
    try {
      // Extract JSON from response (handle cases where AI adds markdown code blocks)
      const jsonMatch = output!.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(output!);
      }
    } catch (parseError) {
      console.error('Failed to parse sentiment analysis:', parseError);
      return articles; // Return original articles if parsing fails
    }

    // Merge analysis with articles
    return articles.map((article, i) => {
      const sentiment = analysis.find((a: any) => a.index === i + 1);
      return {
        ...article,
        sentiment: sentiment?.sentiment || 'neutral',
        impact: sentiment?.impact || 'low',
        sentimentReason: sentiment?.reason || '',
      };
    });

  } catch (error) {
    console.error('Failed to analyze news sentiment:', error);
    return articles; // Return original articles if analysis fails
  }
}

/**
 * Filter and rank news by relevance using AI
 */
export async function filterRelevantNews(
  articles: any[],
  symbol: string,
  companyName: string
): Promise<any[]> {
  if (articles.length === 0) return [];

  try {
    const articlesText = articles
      .map((article, i) => `${i + 1}. ${article.title}\n   ${article.summary || ''}`)
      .join('\n\n');

    const { output } = await ai.generate({
      model: 'gpt-4o-mini',
      systemMessage: `You are a financial news analyst. Your job is to determine if news articles are truly relevant to a specific company/stock.`,
      prompt: `Analyze these news articles for ${companyName} (${symbol}).

For each article, determine:
1. Is it directly about ${companyName}? (true/false)
2. Relevance score: 0-100 (0 = not relevant, 100 = highly relevant)
3. Brief reason (10 words max)

Articles:
${articlesText}

Respond in JSON format:
[
  {
    "index": 1,
    "relevant": true,
    "relevanceScore": 95,
    "reason": "Direct quarterly earnings announcement"
  },
  ...
]

Only return the JSON array.`,
      output: { format: 'text' }
    });

    let analysis;
    try {
      const jsonMatch = output!.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(output!);
      }
    } catch (parseError) {
      console.error('Failed to parse relevance analysis:', parseError);
      return articles;
    }

    // Filter and rank articles
    return articles
      .map((article, i) => {
        const relevance = analysis.find((a: any) => a.index === i + 1);
        return {
          ...article,
          relevant: relevance?.relevant ?? true,
          relevanceScore: relevance?.relevanceScore ?? 50,
          relevanceReason: relevance?.reason || '',
        };
      })
      .filter((article) => article.relevant && article.relevanceScore >= 40)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

  } catch (error) {
    console.error('Failed to filter news:', error);
    return articles;
  }
}

/**
 * Generate news summary using AI
 */
export async function summarizeNews(articles: any[], context: string = ''): Promise<string> {
  if (articles.length === 0) return 'No recent news available.';

  try {
    const newsText = articles
      .slice(0, 5)
      .map((article, i) => `${i + 1}. **${article.title}** (${article.publisher})
   ${article.summary || 'No summary available'}
   Sentiment: ${article.sentiment || 'neutral'} | Impact: ${article.impact || 'medium'}`)
      .join('\n\n');

    const { output } = await ai.generate({
      model: 'gpt-4o-mini',
      systemMessage: `You are a financial news analyst. Summarize news articles concisely, highlighting key insights and market implications.`,
      prompt: `Summarize these recent news articles${context ? ` for ${context}` : ''}.

Focus on:
1. Key themes and trends
2. Market implications
3. Important developments

Keep it concise (3-4 sentences max).

News Articles:
${newsText}`,
      output: { format: 'text' }
    });

    return output || 'Unable to generate news summary.';

  } catch (error) {
    console.error('Failed to summarize news:', error);
    return 'Unable to generate news summary.';
  }
}
