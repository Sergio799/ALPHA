import { fetchAllPortfolioData, calculateReturns, extractPrices } from '@/lib/data-pipeline';
import { calculateAllRiskMetrics, interpretRiskMetrics } from './core/risk-metrics';
import type { Asset } from '@/lib/portfolio-data';

export interface QuantitativeInsights {
    // Portfolio-level metrics
    portfolio: {
        totalValue: number;
        totalReturn: number;
        sharpeRatio: number;
        maxDrawdown: number;
        var95: number;
        beta: number;
        alpha: number;
        volatility: number;
        diversificationScore: number;
    };

    // Individual stock metrics
    holdings: Array<{
        symbol: string;
        name: string;
        allocation: number;
        sharpeRatio: number;
        beta: number;
        volatility: number;
        maxDrawdown: number;
        recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
        confidence: number;
    }>;

    // Insights and recommendations
    insights: Array<{
        type: 'opportunity' | 'risk' | 'anomaly' | 'rebalance';
        severity: 'high' | 'medium' | 'low';
        title: string;
        description: string;
        mathematicalBasis: string;
        recommendation?: string;
    }>;

    // Market context
    marketContext: {
        regime: 'bull' | 'bear' | 'sideways';
        volatility: 'low' | 'medium' | 'high';
        sentiment: string;
    };
}

/**
 * Generate comprehensive quantitative insights for portfolio
 */
export async function generateQuantitativeInsights(
    portfolio: Asset[]
): Promise<QuantitativeInsights> {
    console.log('🔬 Generating quantitative insights...');

    // Extract symbols
    const symbols = portfolio.map(asset => asset.symbol);

    // Fetch all data
    console.log('📊 Fetching historical data...');
    const data = await fetchAllPortfolioData(symbols);

    // Calculate portfolio-level metrics
    console.log('📈 Calculating portfolio metrics...');
    const portfolioValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);
    const portfolioCost = portfolio.reduce((sum, asset) => sum + (asset.shares * asset.purchase_price), 0);
    const totalReturn = (portfolioValue - portfolioCost) / portfolioCost;

    // Calculate weighted portfolio returns
    const portfolioReturns = calculateWeightedPortfolioReturns(portfolio, data);
    const benchmarkPrices = extractPrices(data.benchmark);

    let portfolioMetrics;
    if (portfolioReturns.length > 0 && benchmarkPrices.length > 0) {
        // Create synthetic portfolio prices from returns
        const portfolioPrices = returnsToprices(portfolioReturns, portfolioValue);

        portfolioMetrics = calculateAllRiskMetrics(
            portfolioPrices,
            benchmarkPrices,
            data.riskFreeRate
        );
    } else {
        // Fallback to default values
        portfolioMetrics = {
            sharpeRatio: 0,
            sortinoRatio: 0,
            maxDrawdown: 0,
            var95: 0,
            cvar95: 0,
            volatility: 0,
            beta: 1,
            alpha: 0,
            treynorRatio: 0,
            calmarRatio: 0
        };
    }

    // Calculate diversification score
    const diversificationScore = calculateDiversificationScore(portfolio);

    // Calculate individual stock metrics
    console.log('🎯 Analyzing individual holdings...');
    const holdings = await Promise.all(
        data.stocks.map(async (stock, index) => {
            const asset = portfolio[index];
            const allocation = (asset.value / portfolioValue) * 100;

            if (stock.historical.length === 0) {
                return {
                    symbol: stock.symbol,
                    name: asset.name,
                    allocation,
                    sharpeRatio: 0,
                    beta: 1,
                    volatility: 0,
                    maxDrawdown: 0,
                    recommendation: 'hold' as const,
                    confidence: 0
                };
            }

            const stockPrices = extractPrices(stock.historical);
            const stockMetrics = calculateAllRiskMetrics(
                stockPrices,
                benchmarkPrices,
                data.riskFreeRate
            );

            const recommendation = generateRecommendation(stockMetrics, allocation);

            return {
                symbol: stock.symbol,
                name: asset.name,
                allocation,
                sharpeRatio: stockMetrics.sharpeRatio,
                beta: stockMetrics.beta,
                volatility: stockMetrics.volatility,
                maxDrawdown: stockMetrics.maxDrawdown,
                recommendation: recommendation.action,
                confidence: recommendation.confidence
            };
        })
    );

    // Generate insights
    console.log('💡 Generating insights...');
    const insights = generateInsights(portfolio, portfolioMetrics, holdings, diversificationScore);

    // Detect market regime
    const marketContext = detectMarketRegime(data.benchmark, portfolioMetrics);

    console.log('✅ Quantitative analysis complete!');

    return {
        portfolio: {
            totalValue: portfolioValue,
            totalReturn,
            sharpeRatio: portfolioMetrics.sharpeRatio,
            maxDrawdown: portfolioMetrics.maxDrawdown,
            var95: portfolioMetrics.var95,
            beta: portfolioMetrics.beta,
            alpha: portfolioMetrics.alpha,
            volatility: portfolioMetrics.volatility,
            diversificationScore
        },
        holdings,
        insights,
        marketContext
    };
}

/**
 * Calculate weighted portfolio returns
 */
function calculateWeightedPortfolioReturns(portfolio: Asset[], data: any): number[] {
    const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);

    // Get all stock returns
    const allReturns = data.stocks.map((stock: any) => {
        if (stock.historical.length === 0) return [];
        return calculateReturns(stock.historical);
    });

    // Find minimum length
    const minLength = Math.min(...allReturns.map((r: number[]) => r.length).filter((l: number) => l > 0));

    if (minLength === 0) return [];

    // Calculate weighted returns
    const portfolioReturns: number[] = [];
    for (let i = 0; i < minLength; i++) {
        let weightedReturn = 0;
        portfolio.forEach((asset, index) => {
            const weight = asset.value / totalValue;
            const returns = allReturns[index];
            if (returns && returns[i] !== undefined) {
                weightedReturn += weight * returns[i];
            }
        });
        portfolioReturns.push(weightedReturn);
    }

    return portfolioReturns;
}

/**
 * Convert returns to prices
 */
function returnsToprices(returns: number[], initialPrice: number): number[] {
    const prices = [initialPrice];
    for (let i = 0; i < returns.length; i++) {
        prices.push(prices[i] * (1 + returns[i]));
    }
    return prices;
}

/**
 * Calculate diversification score
 */
function calculateDiversificationScore(portfolio: Asset[]): number {
    const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);

    // Calculate Herfindahl index (concentration)
    const herfindahl = portfolio.reduce((sum, asset) => {
        const weight = asset.value / totalValue;
        return sum + weight * weight;
    }, 0);

    // Convert to diversification score (0-100)
    // Perfect diversification (equal weights) = 1/n
    // Herfindahl ranges from 1/n to 1
    const n = portfolio.length;
    const perfectDiversification = 1 / n;
    const diversification = (1 - herfindahl) / (1 - perfectDiversification);

    return Math.max(0, Math.min(100, diversification * 100));
}

/**
 * Generate recommendation for individual stock
 */
function generateRecommendation(
    metrics: ReturnType<typeof calculateAllRiskMetrics>,
    allocation: number
): { action: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'; confidence: number } {
    let score = 0;
    let confidence = 0;

    // Sharpe ratio (40% weight)
    if (metrics.sharpeRatio > 2.0) {
        score += 40;
        confidence += 30;
    } else if (metrics.sharpeRatio > 1.0) {
        score += 25;
        confidence += 20;
    } else if (metrics.sharpeRatio > 0) {
        score += 10;
        confidence += 10;
    } else {
        score -= 20;
        confidence += 15;
    }

    // Alpha (30% weight)
    if (metrics.alpha > 0.05) {
        score += 30;
        confidence += 25;
    } else if (metrics.alpha > 0) {
        score += 15;
        confidence += 15;
    } else if (metrics.alpha < -0.05) {
        score -= 30;
        confidence += 20;
    }

    // Max drawdown (20% weight)
    if (metrics.maxDrawdown < 0.15) {
        score += 20;
        confidence += 15;
    } else if (metrics.maxDrawdown < 0.25) {
        score += 10;
        confidence += 10;
    } else {
        score -= 20;
        confidence += 15;
    }

    // Allocation (10% weight) - penalize over-concentration
    if (allocation > 20) {
        score -= 10;
        confidence += 5;
    }

    // Normalize confidence
    confidence = Math.min(100, confidence);

    // Determine action
    if (score >= 60) return { action: 'strong_buy', confidence };
    if (score >= 30) return { action: 'buy', confidence };
    if (score >= -20) return { action: 'hold', confidence };
    if (score >= -50) return { action: 'sell', confidence };
    return { action: 'strong_sell', confidence };
}

/**
 * Generate insights from metrics
 */
function generateInsights(
    portfolio: Asset[],
    portfolioMetrics: ReturnType<typeof calculateAllRiskMetrics>,
    holdings: any[],
    diversificationScore: number
): Array<{
    type: 'opportunity' | 'risk' | 'anomaly' | 'rebalance';
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    mathematicalBasis: string;
    recommendation?: string;
}> {
    const insights: Array<{
        type: 'opportunity' | 'risk' | 'anomaly' | 'rebalance';
        severity: 'high' | 'medium' | 'low';
        title: string;
        description: string;
        mathematicalBasis: string;
        recommendation?: string;
    }> = [];
    const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);

    // Risk-adjusted performance insight
    if (portfolioMetrics.sharpeRatio > 1.5) {
        insights.push({
            type: 'opportunity',
            severity: 'low',
            title: 'Excellent Risk-Adjusted Returns',
            description: `Your portfolio has a Sharpe ratio of ${portfolioMetrics.sharpeRatio.toFixed(2)}, indicating excellent risk-adjusted performance. You're earning ${portfolioMetrics.sharpeRatio.toFixed(2)} units of return for each unit of risk taken.`,
            mathematicalBasis: `Sharpe Ratio = (Return - Risk-Free Rate) / Volatility = ${portfolioMetrics.sharpeRatio.toFixed(2)}`,
            recommendation: 'Continue current strategy while monitoring for regime changes.'
        });
    } else if (portfolioMetrics.sharpeRatio < 0.5) {
        insights.push({
            type: 'risk',
            severity: 'high',
            title: 'Poor Risk-Adjusted Returns',
            description: `Your portfolio has a Sharpe ratio of ${portfolioMetrics.sharpeRatio.toFixed(2)}, which is below acceptable levels. You're taking significant risk without adequate compensation.`,
            mathematicalBasis: `Sharpe Ratio = ${portfolioMetrics.sharpeRatio.toFixed(2)} (Target: > 1.0)`,
            recommendation: 'Consider rebalancing into higher quality assets or reducing volatility exposure.'
        });
    }

    // Concentration risk
    const maxAllocation = Math.max(...holdings.map(h => h.allocation));
    if (maxAllocation > 25) {
        const concentrated = holdings.find(h => h.allocation === maxAllocation);
        insights.push({
            type: 'risk',
            severity: 'high',
            title: 'Concentration Risk Detected',
            description: `${concentrated?.symbol} represents ${maxAllocation.toFixed(1)}% of your portfolio, creating concentration risk. Portfolio theory suggests maximum 15-20% per position.`,
            mathematicalBasis: `Herfindahl Index indicates concentration. Optimal diversification: ${(100 / holdings.length).toFixed(1)}% per position.`,
            recommendation: `Reduce ${concentrated?.symbol} position to ~15% and diversify into uncorrelated assets.`
        });
    }

    // Diversification score
    if (diversificationScore < 60) {
        insights.push({
            type: 'rebalance',
            severity: 'medium',
            title: 'Low Diversification',
            description: `Your diversification score is ${diversificationScore.toFixed(1)}/100, indicating suboptimal diversification. This increases portfolio-specific risk.`,
            mathematicalBasis: `Diversification Score = 100 * (1 - Herfindahl Index) / (1 - 1/n)`,
            recommendation: 'Add uncorrelated assets or rebalance to more equal weights.'
        });
    }

    // Alpha generation
    if (portfolioMetrics.alpha > 0.03) {
        insights.push({
            type: 'opportunity',
            severity: 'low',
            title: 'Generating Positive Alpha',
            description: `Your portfolio is generating ${(portfolioMetrics.alpha * 100).toFixed(2)}% alpha, outperforming the market on a risk-adjusted basis. This suggests skillful selection or favorable market conditions.`,
            mathematicalBasis: `Alpha = Actual Return - Expected Return (CAPM) = ${(portfolioMetrics.alpha * 100).toFixed(2)}%`,
            recommendation: 'Monitor to determine if alpha is sustainable or due to temporary factors.'
        });
    } else if (portfolioMetrics.alpha < -0.03) {
        insights.push({
            type: 'risk',
            severity: 'medium',
            title: 'Negative Alpha',
            description: `Your portfolio is generating ${(portfolioMetrics.alpha * 100).toFixed(2)}% negative alpha, underperforming the market on a risk-adjusted basis.`,
            mathematicalBasis: `Alpha = ${(portfolioMetrics.alpha * 100).toFixed(2)}% (Target: > 0%)`,
            recommendation: 'Consider passive index funds or reassess stock selection strategy.'
        });
    }

    // Drawdown risk
    if (portfolioMetrics.maxDrawdown > 0.25) {
        insights.push({
            type: 'risk',
            severity: 'high',
            title: 'High Drawdown Risk',
            description: `Your portfolio has experienced a maximum drawdown of ${(portfolioMetrics.maxDrawdown * 100).toFixed(1)}%, indicating high volatility and potential for large losses.`,
            mathematicalBasis: `Max Drawdown = ${(portfolioMetrics.maxDrawdown * 100).toFixed(1)}% (Acceptable: < 20%)`,
            recommendation: 'Consider adding defensive positions or implementing stop-loss strategies.'
        });
    }

    // Beta analysis
    if (portfolioMetrics.beta > 1.3) {
        insights.push({
            type: 'risk',
            severity: 'medium',
            title: 'High Market Sensitivity',
            description: `Your portfolio has a beta of ${portfolioMetrics.beta.toFixed(2)}, meaning it's ${((portfolioMetrics.beta - 1) * 100).toFixed(0)}% more volatile than the market. This amplifies both gains and losses.`,
            mathematicalBasis: `Beta = Covariance(Portfolio, Market) / Variance(Market) = ${portfolioMetrics.beta.toFixed(2)}`,
            recommendation: 'Consider adding low-beta stocks or bonds to reduce market sensitivity.'
        });
    } else if (portfolioMetrics.beta < 0.7) {
        insights.push({
            type: 'opportunity',
            severity: 'low',
            title: 'Low Market Sensitivity',
            description: `Your portfolio has a beta of ${portfolioMetrics.beta.toFixed(2)}, providing downside protection but potentially limiting upside in bull markets.`,
            mathematicalBasis: `Beta = ${portfolioMetrics.beta.toFixed(2)} (Market = 1.0)`,
            recommendation: 'Current positioning is defensive. Consider increasing beta if expecting bull market.'
        });
    }

    // Individual stock recommendations
    const strongBuys = holdings.filter(h => h.recommendation === 'strong_buy');
    const sells = holdings.filter(h => h.recommendation === 'sell' || h.recommendation === 'strong_sell');

    if (strongBuys.length > 0) {
        insights.push({
            type: 'opportunity',
            severity: 'medium',
            title: 'Strong Performers Identified',
            description: `${strongBuys.map(h => h.symbol).join(', ')} show excellent risk-adjusted metrics. Consider increasing allocation to these positions.`,
            mathematicalBasis: `Based on Sharpe ratio, alpha, and drawdown analysis.`,
            recommendation: `Consider increasing allocation to top performers while maintaining diversification.`
        });
    }

    if (sells.length > 0) {
        insights.push({
            type: 'rebalance',
            severity: 'high',
            title: 'Underperforming Positions',
            description: `${sells.map(h => h.symbol).join(', ')} show poor risk-adjusted metrics. Consider reducing or exiting these positions.`,
            mathematicalBasis: `Based on negative alpha, high drawdown, or poor Sharpe ratio.`,
            recommendation: `Review these positions and consider reallocation to stronger performers.`
        });
    }

    return insights;
}

/**
 * Detect market regime
 */
function detectMarketRegime(
    benchmarkData: any[],
    portfolioMetrics: ReturnType<typeof calculateAllRiskMetrics>
): {
    regime: 'bull' | 'bear' | 'sideways';
    volatility: 'low' | 'medium' | 'high';
    sentiment: string;
} {
    if (benchmarkData.length === 0) {
        return {
            regime: 'sideways',
            volatility: 'medium',
            sentiment: 'Neutral - insufficient data for regime detection'
        };
    }

    const prices = extractPrices(benchmarkData);
    const returns = calculateReturns(benchmarkData);

    // Calculate trend (last 50 days vs 200 days)
    const recent = prices.slice(-50);
    const longTerm = prices.slice(-200);

    const recentAvg = recent.reduce((sum, p) => sum + p, 0) / recent.length;
    const longTermAvg = longTerm.reduce((sum, p) => sum + p, 0) / longTerm.length;

    const trend = (recentAvg - longTermAvg) / longTermAvg;

    // Determine regime
    let regime: 'bull' | 'bear' | 'sideways';
    if (trend > 0.05) {
        regime = 'bull';
    } else if (trend < -0.05) {
        regime = 'bear';
    } else {
        regime = 'sideways';
    }

    // Determine volatility
    const vol = portfolioMetrics.volatility;
    let volatility: 'low' | 'medium' | 'high';
    if (vol < 0.15) {
        volatility = 'low';
    } else if (vol < 0.25) {
        volatility = 'medium';
    } else {
        volatility = 'high';
    }

    // Generate sentiment
    let sentiment = '';
    if (regime === 'bull' && volatility === 'low') {
        sentiment = 'Strong bull market with low volatility - favorable conditions';
    } else if (regime === 'bull' && volatility === 'high') {
        sentiment = 'Bull market with high volatility - proceed with caution';
    } else if (regime === 'bear') {
        sentiment = 'Bear market detected - defensive positioning recommended';
    } else {
        sentiment = 'Sideways market - range-bound trading conditions';
    }

    return { regime, volatility, sentiment };
}

/**
 * Format insights for AI consumption
 */
export function formatInsightsForAI(insights: QuantitativeInsights): string {
    let formatted = '# QUANTITATIVE ANALYSIS RESULTS\n\n';

    // Portfolio metrics
    formatted += '## Portfolio Risk Metrics\n';
    formatted += `- **Sharpe Ratio:** ${insights.portfolio.sharpeRatio.toFixed(2)} ${insights.portfolio.sharpeRatio > 1 ? '(Good)' : '(Needs Improvement)'}\n`;
    formatted += `- **Beta:** ${insights.portfolio.beta.toFixed(2)} (Market sensitivity)\n`;
    formatted += `- **Alpha:** ${(insights.portfolio.alpha * 100).toFixed(2)}% ${insights.portfolio.alpha > 0 ? '(Outperforming)' : '(Underperforming)'}\n`;
    formatted += `- **Max Drawdown:** ${(insights.portfolio.maxDrawdown * 100).toFixed(1)}%\n`;
    formatted += `- **95% VaR:** $${insights.portfolio.var95.toFixed(2)}\n`;
    formatted += `- **Volatility:** ${(insights.portfolio.volatility * 100).toFixed(1)}% annualized\n`;
    formatted += `- **Diversification Score:** ${insights.portfolio.diversificationScore.toFixed(1)}/100\n\n`;

    // Holdings analysis
    formatted += '## Individual Holdings Analysis\n';
    insights.holdings.forEach(holding => {
        formatted += `\n### ${holding.symbol} (${holding.allocation.toFixed(1)}% allocation)\n`;
        formatted += `- Sharpe Ratio: ${holding.sharpeRatio.toFixed(2)}\n`;
        formatted += `- Beta: ${holding.beta.toFixed(2)}\n`;
        formatted += `- Volatility: ${(holding.volatility * 100).toFixed(1)}%\n`;
        formatted += `- Max Drawdown: ${(holding.maxDrawdown * 100).toFixed(1)}%\n`;
        formatted += `- **Recommendation:** ${holding.recommendation.toUpperCase()} (${holding.confidence}% confidence)\n`;
    });
    formatted += '\n';

    // Insights
    formatted += '## Key Insights\n';
    insights.insights.forEach((insight, i) => {
        formatted += `\n### ${i + 1}. ${insight.title} [${insight.severity.toUpperCase()} ${insight.type.toUpperCase()}]\n`;
        formatted += `${insight.description}\n\n`;
        formatted += `**Mathematical Basis:** ${insight.mathematicalBasis}\n`;
        if (insight.recommendation) {
            formatted += `**Recommendation:** ${insight.recommendation}\n`;
        }
    });
    formatted += '\n';

    // Market context
    formatted += '## Market Context\n';
    formatted += `- **Regime:** ${insights.marketContext.regime.toUpperCase()} market\n`;
    formatted += `- **Volatility:** ${insights.marketContext.volatility.toUpperCase()}\n`;
    formatted += `- **Sentiment:** ${insights.marketContext.sentiment}\n`;

    return formatted;
}
