'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { portfolioData } from '@/lib/portfolio-data';
import { updatePortfolioWithRealPrices, fetchPortfolioNews, fetchMarketNews } from '@/lib/stock-api';
import { generateQuantitativeInsights, formatInsightsForAI } from '@/quant/insights-engine';
import { analyzeNewsSentiment } from '@/lib/news-analyzer';

export async function advise(history: any): Promise<string> {
    const MessageSchema = z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
    });

    const HistorySchema = z.array(MessageSchema);
    HistorySchema.parse(history);

    const latestMessage = history[history.length - 1].content;
    const isGreeting = ['hello', 'hi', 'hey'].some(g => latestMessage.toLowerCase().includes(g));

    if (isGreeting) {
        const { output } = await ai.generate({
            model: 'gpt-4o-mini',
            systemMessage: 'You are SamrAI, a quantitative investment advisor with a PhD-level understanding of portfolio theory, risk management, and financial markets. You provide research-grade analysis backed by mathematical rigor.',
            prompt: `Greet the user professionally and mention you can provide quantitative portfolio analysis with metrics like Sharpe ratio, Beta, Alpha, and VaR. Keep it brief (1-2 sentences) and welcoming.`,
            output: { format: 'text' }
        });
        return output!;
    }


    const updatedPortfolio = await updatePortfolioWithRealPrices(portfolioData);


    const isAskingAboutMarket = /market|news|trend|economy|fed|inflation|rate/i.test(latestMessage);
    const mentionedSymbols = portfolioData
        .map(asset => asset.symbol)
        .filter(symbol => new RegExp(`\\b${symbol}\\b`, 'i').test(latestMessage));

    let marketNews: any[] = [];
    let portfolioNews: Map<string, any[]> = new Map();

    if (isAskingAboutMarket) {
        const rawMarketNews = await fetchMarketNews();
        // Add AI-powered sentiment analysis to market news
        marketNews = await analyzeNewsSentiment(rawMarketNews);
    }

    if (mentionedSymbols.length > 0) {
        const rawPortfolioNews = await fetchPortfolioNews(mentionedSymbols);
        // Add AI-powered sentiment analysis to each stock's news
        for (const [symbol, news] of rawPortfolioNews.entries()) {
            const analyzedNews = await analyzeNewsSentiment(news);
            portfolioNews.set(symbol, analyzedNews);
        }
    }

    let quantInsights;
    try {
        quantInsights = await generateQuantitativeInsights(updatedPortfolio);
    } catch (error) {
        console.error('Error generating insights:', error);
        quantInsights = null;
    }
    const totalValue = updatedPortfolio.reduce((acc, asset) => acc + asset.value, 0);
    const totalCost = updatedPortfolio.reduce((acc, asset) => acc + (asset.shares * asset.purchase_price), 0);
    const totalReturn = ((totalValue - totalCost) / totalCost * 100);
    const totalGainLoss = (totalValue - totalCost);

    const todayOpen = updatedPortfolio.reduce((acc, asset) => acc + (asset.shares * asset.price_open), 0);
    const todayChange = ((totalValue - todayOpen) / todayOpen * 100);
    const todayGainLoss = (totalValue - todayOpen);

    const portfolioMetrics = updatedPortfolio.map(asset => {
        const totalGain = asset.value - (asset.shares * asset.purchase_price);
        const totalGainPercent = ((asset.price - asset.purchase_price) / asset.purchase_price) * 100;
        return {
            symbol: asset.symbol,
            name: asset.name,
            shares: asset.shares,
            currentPrice: asset.price,
            entryPrice: asset.purchase_price,
            currentValue: asset.value,
            allocation: (asset.value / totalValue) * 100,
            dailyChange: asset.daily_change_percent,
            totalGain,
            totalGainPercent,
            type: asset.type,
        };
    });

    let newsContext = '';

    if (marketNews.length > 0) {
        newsContext += '\n\n## REAL-TIME MARKET NEWS (AI-Analyzed)\n\n';
        marketNews.slice(0, 5).forEach((news, i) => {
            newsContext += `${i + 1}. **${news.title}** (${news.publisher})\n`;
            if (news.summary) {
                newsContext += `   ${news.summary}\n`;
            }
            if (news.sentiment) {
                newsContext += `   📊 Sentiment: ${news.sentiment.toUpperCase()} | Impact: ${news.impact || 'medium'}\n`;
                if (news.sentimentReason) {
                    newsContext += `   💡 ${news.sentimentReason}\n`;
                }
            }
            newsContext += '\n';
        });
    }

    if (portfolioNews.size > 0) {
        newsContext += '\n\n## NEWS FOR YOUR HOLDINGS (AI-Analyzed)\n\n';
        portfolioNews.forEach((news, symbol) => {
            if (news.length > 0) {
                newsContext += `### ${symbol}:\n`;
                news.slice(0, 3).forEach((item, i) => {
                    newsContext += `${i + 1}. **${item.title}** (${item.publisher})\n`;
                    if (item.sentiment) {
                        newsContext += `   📊 Sentiment: ${item.sentiment.toUpperCase()} | Impact: ${item.impact || 'medium'}\n`;
                        if (item.sentimentReason) {
                            newsContext += `   💡 ${item.sentimentReason}\n`;
                        }
                    }
                });
                newsContext += '\n';
            }
        });
    }

    let quantContext = '';
    if (quantInsights) {
        quantContext = '\n\n' + formatInsightsForAI(quantInsights);
    }
    const { output } = await ai.generate({
        model: 'gpt-4o',
        systemMessage: `You are SamrAI, a proactive portfolio manager and quantitative investment advisor with a PhD-level understanding of portfolio theory, risk management, and financial markets.

Your expertise includes:
- Modern Portfolio Theory (MPT), CAPM, and Fama-French models
- Risk metrics: Sharpe ratio, Sortino ratio, Beta, Alpha, VaR, CVaR, Maximum Drawdown
- Technical analysis: Moving averages, RSI, MACD, Bollinger Bands
- Fundamental analysis: P/E ratios, earnings growth, sector analysis
- Behavioral finance: Recognizing emotional trading patterns

Your PRIMARY JOB is to proactively identify what needs to change in the portfolio:
- ALWAYS analyze the portfolio for improvements, even if not explicitly asked
- Give specific BUY/SELL/HOLD recommendations with exact percentages
- Identify underperforming assets that should be sold
- Recommend better alternatives for reallocation
- Point out concentration risks and suggest diversification

Your responses must:
- START with specific portfolio changes needed (if any)
- Reference specific quantitative metrics with precise calculations
- Show mathematical formulas when explaining concepts
- Provide confidence levels for recommendations (High/Medium/Low)
- Consider both risk and return in all advice
- Use real-time data and news when available
- Think like a Stanford/MIT quantitative researcher managing real money
- Be direct, precise, and actionable - tell me exactly what to do`,
        prompt: `
You are SamrAI, a quantitative investment advisor with a PhD-level understanding of portfolio theory, risk management, and financial markets.

# PORTFOLIO DATA

## Overview
- **Total Value:** $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- **Total Return (All Time):** ${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}% ($${totalGainLoss >= 0 ? '+' : ''}${Math.abs(totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
- **Today's Change:** ${todayChange >= 0 ? '+' : ''}${todayChange.toFixed(2)}% ($${todayGainLoss >= 0 ? '+' : ''}${Math.abs(todayGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
- **Holdings:** ${portfolioMetrics.length} positions

## Current Holdings

| Symbol | Allocation | Price | Daily Change | Total Return |
|--------|------------|-------|--------------|--------------|
${portfolioMetrics.map(m =>
            `| ${m.symbol} | ${m.allocation.toFixed(1)}% | $${m.currentPrice.toFixed(2)} | ${m.dailyChange >= 0 ? '+' : ''}${m.dailyChange.toFixed(2)}% | ${m.totalGainPercent >= 0 ? '+' : ''}${m.totalGainPercent.toFixed(2)}% |`
        ).join('\n')}

${quantContext}

${newsContext}

---

# USER QUESTION
"${latestMessage}"

# CONVERSATION HISTORY
${history.slice(0, -1).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}

---

# YOUR TASK

Analyze the portfolio data and user question with research-grade quantitative rigor. Your response must be actionable, precise, and grounded in financial theory.

## Analysis Framework:

### 1. PORTFOLIO CHANGES RECOMMENDED (ALWAYS PROVIDE THIS FIRST)
Before answering the user's question, ALWAYS start by analyzing what needs to change in the portfolio:

**🔴 SELL/REDUCE (if applicable):**
- List specific positions to sell or reduce with exact amounts/percentages
- Example: "SELL 100% of BTC ($500) - down 100%, no recovery signs, high volatility"
- Show: Current allocation → Recommended allocation

**🟢 BUY/ADD (if applicable):**
- Recommend specific assets to buy with dollar amounts
- Example: "BUY $1,000 of VTI - diversify away from tech concentration"
- Explain why this improves portfolio metrics (Sharpe, diversification, etc.)

**🔵 REBALANCE (if applicable):**
- Identify overweight sectors and suggest reductions
- Example: "REDUCE tech from 65% to 40% - sell $2,000 AAPL"

If the portfolio is well-optimized, say "No immediate changes recommended - portfolio is well-balanced."

### 2. IMMEDIATE ANSWER TO USER'S QUESTION
- Directly address the user's specific question in 1-2 sentences
- State your main conclusion upfront

### 3. QUANTITATIVE EVIDENCE
When quantitative insights are available:
- **Risk-Adjusted Returns**: Reference Sharpe ratio, Sortino ratio (explain what these mean)
- **Market Exposure**: Discuss Beta, correlation to market indices
- **Performance Attribution**: Break down Alpha (skill) vs Beta (market exposure)
- **Risk Metrics**: Mention VaR (Value at Risk), max drawdown, volatility
- **Diversification**: Analyze correlation matrix, concentration risk
- Show calculations with formulas when explaining concepts

### 3. CURRENT HOLDINGS ANALYSIS
- Identify top performers and underperformers with specific percentages
- Analyze allocation balance (are you overweight/underweight any sector?)
- Compare daily changes to assess volatility patterns
- Note any positions with concerning risk profiles

### 4. NEWS & MARKET CONTEXT
- Integrate real-time news when available
- Explain how current market conditions (volatility, trends, events) affect the portfolio
- Connect macro factors to specific holdings

### 5. RISK ASSESSMENT
- Quantify specific risks (e.g., "15% allocation to tech increases sector concentration risk")
- Identify correlation risks (highly correlated positions reduce diversification)
- Assess drawdown risk based on volatility and Beta
- Consider tail risks and black swan scenarios

### 6. CALCULATIONS & FORMULAS
When explaining metrics, show the math:
\`\`\`
Sharpe Ratio = (Return - Risk-Free Rate) / Standard Deviation
Example: (15.2% - 4.5%) / 12.1% = 0.88
\`\`\`

## Response Quality Standards:

✅ DO:
- Lead with the direct answer
- Use specific numbers from the portfolio data
- Explain "why" behind every recommendation
- Reference academic concepts (MPT, CAPM, Efficient Frontier)
- Provide confidence levels (e.g., "High confidence given Sharpe > 1.0")
- Use tables for multi-asset comparisons
- Bold key metrics and numbers
- Be concise but thorough

❌ DON'T:
- Give generic advice that ignores the actual data
- Make recommendations without quantitative justification
- Use vague language ("might", "could", "possibly" without context)
- Ignore available quantitative insights
- Provide advice that contradicts the risk profile shown in the data

## Example Response Structure:

**Direct Answer:** Your portfolio shows strong risk-adjusted returns with a Sharpe ratio of 1.35, but concentration in tech (45% allocation) creates sector-specific risk.

**Key Metrics:**
- Sharpe Ratio: 1.35 (Excellent - earning 1.35 units return per unit risk)
- Beta: 1.08 (8% more volatile than market)
- Max Drawdown: -12.3% (Moderate risk)

**Holdings Analysis:**
Your top performer is NVDA (+23.4% total return) but it represents 18% of the portfolio—above the recommended 15% single-position limit.

**Risk Assessment:**
With 45% in tech, a sector downturn could cause 15-20% portfolio decline based on historical correlations.

**Recommendations:**
1. **Trim NVDA by 3%** → Reduces concentration risk while protecting gains (Confidence: High)
2. **Add defensive allocation** → 10-15% in consumer staples or utilities (Confidence: Medium)

**Market Context:**
Given elevated VIX (18.5) and tech sector PE ratio at 28x (above 10-year avg of 22x), some profit-taking is prudent.

**ALWAYS END WITH:**
---
*This analysis combines quantitative metrics, real-time data, and portfolio theory. Not financial advice. Consult a qualified advisor before making investment decisions.*
        `,
        output: {
            format: 'text'
        }
    });

    return output!;
}
