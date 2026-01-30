'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

/**
 * Panic Selling Detection Flow
 * Analyzes portfolio behavior and detects emotional trading patterns
 */

export async function detectPanicSelling(
  recentTrades: Array<{
    symbol: string;
    type: 'buy' | 'sell';
    price: number;
    date: string;
  }>,
  marketConditions: {
    volatility: number;
    marketChange: number;
  }
): Promise<{
  isPanicSelling: boolean;
  confidence: number;
  reasoning: string;
  recommendations: string[];
}> {
  const TradeSchema = z.object({
    symbol: z.string(),
    type: z.enum(['buy', 'sell']),
    price: z.number(),
    date: z.string(),
  });

  const TradesSchema = z.array(TradeSchema);
  TradesSchema.parse(recentTrades);

  const sellTrades = recentTrades.filter(t => t.type === 'sell');
  const sellCount = sellTrades.length;
  const totalTrades = recentTrades.length;

  const sellRatio = totalTrades > 0 ? sellCount / totalTrades : 0;
  const isHighVolatility = marketConditions.volatility > 0.25;
  const isMarketDown = marketConditions.marketChange < -0.05;

  let isPanicSelling = false;
  let confidence = 0;

  if (sellRatio > 0.7 && isHighVolatility && isMarketDown) {
    isPanicSelling = true;
    confidence = 0.85;
  } else if (sellRatio > 0.6 && (isHighVolatility || isMarketDown)) {
    isPanicSelling = true;
    confidence = 0.65;
  } else if (sellRatio > 0.5 && isHighVolatility && isMarketDown) {
    isPanicSelling = true;
    confidence = 0.50;
  }

  const { output } = await ai.generate({
    model: 'gpt-4o-mini',
    systemMessage: `You are a behavioral finance expert specializing in identifying emotional trading patterns and helping investors make rational decisions. You understand loss aversion, anchoring bias, confirmation bias, and other psychological factors that affect investment decisions.`,
    prompt: `
You are a behavioral finance expert analyzing trading patterns.

# TRADING DATA

Recent Trades: ${totalTrades}
Sell Trades: ${sellCount}
Sell Ratio: ${(sellRatio * 100).toFixed(1)}%

Market Conditions:
- Volatility: ${(marketConditions.volatility * 100).toFixed(1)}%
- Market Change: ${(marketConditions.marketChange * 100).toFixed(1)}%

Panic Selling Detected: ${isPanicSelling ? 'YES' : 'NO'}
Confidence: ${(confidence * 100).toFixed(0)}%

# YOUR TASK

Analyze this trading behavior and provide:

1. **Reasoning**: Explain why this might or might not be panic selling
2. **Psychological Factors**: What emotions might be driving this behavior
3. **Recommendations**: 3-5 specific actions to take

Be empathetic but direct. Focus on helping the investor make rational decisions.

Format your response as:

## Analysis
[Your reasoning here]

## Psychological Factors
- [Factor 1]
- [Factor 2]

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]
    `,
    output: { format: 'text' }
  });

  const recommendations = [
    'Take a 24-hour cooling-off period before making more trades',
    'Review your investment thesis for each position',
    'Consider dollar-cost averaging instead of selling everything',
    'Consult your long-term financial goals',
    'Speak with a financial advisor if anxiety persists',
  ];

  return {
    isPanicSelling,
    confidence,
    reasoning: output || 'Unable to generate analysis',
    recommendations: recommendations.slice(0, 3),
  };
}

export async function analyzeTradingBehavior(
  trades: Array<{
    symbol: string;
    type: 'buy' | 'sell';
    price: number;
    date: string;
  }>
): Promise<{
  pattern: 'rational' | 'emotional' | 'panic' | 'fomo';
  description: string;
  advice: string;
}> {
  const buyCount = trades.filter(t => t.type === 'buy').length;
  const sellCount = trades.filter(t => t.type === 'sell').length;

  let pattern: 'rational' | 'emotional' | 'panic' | 'fomo' = 'rational';
  let description = '';
  let advice = '';

  if (sellCount > buyCount * 2) {
    pattern = 'panic';
    description = 'High frequency of selling suggests panic or fear-driven decisions';
    advice = 'Take a step back and review your long-term strategy';
  } else if (buyCount > sellCount * 2) {
    pattern = 'fomo';
    description = 'High frequency of buying suggests FOMO (fear of missing out)';
    advice = 'Ensure each purchase aligns with your investment thesis';
  } else if (trades.length > 20) {
    pattern = 'emotional';
    description = 'High trading frequency suggests emotional decision-making';
    advice = 'Consider a more disciplined, less frequent trading approach';
  } else {
    pattern = 'rational';
    description = 'Trading pattern appears balanced and measured';
    advice = 'Continue with your current disciplined approach';
  }

  return { pattern, description, advice };
}
