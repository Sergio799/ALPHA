
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0.04 // 4% annual
): number {
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const volatility = calculateVolatility(returns, false);
  
  if (volatility === 0) return 0;
  
  return (avgReturn - riskFreeRate / 252) / volatility; // Daily Sharpe
}

/**
 * Calculate Sortino Ratio (downside risk-adjusted return)
 * Like Sharpe but only penalizes downside volatility
 * 
 * Better than Sharpe for asymmetric returns
 */
export function calculateSortinoRatio(
  returns: number[],
  targetReturn: number = 0,
  riskFreeRate: number = 0.04
): number {
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const downsideReturns = returns.filter(r => r < targetReturn);
  
  if (downsideReturns.length === 0) return Infinity;
  
  const downsideDeviation = Math.sqrt(
    downsideReturns.reduce((sum, r) => sum + Math.pow(r - targetReturn, 2), 0) / downsideReturns.length
  );
  
  if (downsideDeviation === 0) return 0;
  
  return (avgReturn - riskFreeRate / 252) / downsideDeviation;
}

/**
 * Calculate Maximum Drawdown (peak-to-trough decline)
 * 
 * Interpretation:
 * < 10%: Low risk
 * 10-20%: Moderate risk
 * 20-30%: High risk
 * > 30%: Very high risk
 */
export function calculateMaxDrawdown(prices: number[]): {
  maxDrawdown: number;
  peak: number;
  trough: number;
  peakIndex: number;
  troughIndex: number;
  duration: number;
} {
  let maxDrawdown = 0;
  let peak = prices[0];
  let peakIndex = 0;
  let trough = prices[0];
  let troughIndex = 0;
  let currentPeak = prices[0];
  let currentPeakIndex = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > currentPeak) {
      currentPeak = prices[i];
      currentPeakIndex = i;
    }

    const drawdown = (currentPeak - prices[i]) / currentPeak;

    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      peak = currentPeak;
      peakIndex = currentPeakIndex;
      trough = prices[i];
      troughIndex = i;
    }
  }

  return {
    maxDrawdown,
    peak,
    trough,
    peakIndex,
    troughIndex,
    duration: troughIndex - peakIndex
  };
}

/**
 * Calculate Value at Risk (VaR)
 * Maximum expected loss at given confidence level
 * 
 * Example: VaR(95%) = $1000 means 5% chance of losing more than $1000
 */
export function calculateVaR(
  returns: number[],
  confidence: number = 0.95,
  portfolioValue: number = 1
): number {
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);
  const varReturn = sorted[index];
  
  return Math.abs(varReturn * portfolioValue);
}

/**
 * Calculate Conditional Value at Risk (CVaR / Expected Shortfall)
 * Average loss beyond VaR threshold
 * 
 * More conservative than VaR - shows tail risk
 */
export function calculateCVaR(
  returns: number[],
  confidence: number = 0.95,
  portfolioValue: number = 1
): number {
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);
  const tailReturns = sorted.slice(0, index);
  
  if (tailReturns.length === 0) return 0;
  
  const avgTailReturn = tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;
  
  return Math.abs(avgTailReturn * portfolioValue);
}

/**
 * Calculate Volatility (standard deviation of returns)
 * 
 * Interpretation:
 * < 15%: Low volatility
 * 15-25%: Moderate volatility
 * > 25%: High volatility
 */
export function calculateVolatility(
  returns: number[],
  annualize: boolean = true
): number {
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);
  
  return annualize ? volatility * Math.sqrt(252) : volatility; // 252 trading days
}

/**
 * Calculate Beta (systematic risk relative to market)
 * 
 * Interpretation:
 * β = 1.0: Moves with market
 * β > 1.0: More volatile than market
 * β < 1.0: Less volatile than market
 * β < 0: Inverse correlation (rare)
 */
export function calculateBeta(
  stockReturns: number[],
  marketReturns: number[]
): number {
  if (stockReturns.length !== marketReturns.length) {
    throw new Error('Stock and market returns must have same length');
  }

  const n = stockReturns.length;
  const stockMean = stockReturns.reduce((sum, r) => sum + r, 0) / n;
  const marketMean = marketReturns.reduce((sum, r) => sum + r, 0) / n;

  let covariance = 0;
  let marketVariance = 0;

  for (let i = 0; i < n; i++) {
    covariance += (stockReturns[i] - stockMean) * (marketReturns[i] - marketMean);
    marketVariance += Math.pow(marketReturns[i] - marketMean, 2);
  }

  covariance /= n;
  marketVariance /= n;

  return marketVariance === 0 ? 0 : covariance / marketVariance;
}

/**
 * Calculate Alpha (excess return above expected return)
 * 
 * Formula: Alpha = ActualReturn - (RiskFreeRate + Beta * (MarketReturn - RiskFreeRate))
 * 
 * Interpretation:
 * α > 0: Outperforming (skill/luck)
 * α = 0: Performing as expected
 * α < 0: Underperforming
 */
export function calculateAlpha(
  stockReturn: number,
  beta: number,
  marketReturn: number,
  riskFreeRate: number = 0.04
): number {
  const expectedReturn = riskFreeRate + beta * (marketReturn - riskFreeRate);
  return stockReturn - expectedReturn;
}

/**
 * Calculate Treynor Ratio (return per unit of systematic risk)
 * 
 * Similar to Sharpe but uses Beta instead of total volatility
 * Better for well-diversified portfolios
 */
export function calculateTreynorRatio(
  portfolioReturn: number,
  beta: number,
  riskFreeRate: number = 0.04
): number {
  if (beta === 0) return 0;
  return (portfolioReturn - riskFreeRate) / beta;
}

/**
 * Calculate Information Ratio (active return vs tracking error)
 * 
 * Measures skill of active management
 * Higher is better
 */
export function calculateInformationRatio(
  portfolioReturns: number[],
  benchmarkReturns: number[]
): number {
  if (portfolioReturns.length !== benchmarkReturns.length) {
    throw new Error('Returns must have same length');
  }

  const activeReturns = portfolioReturns.map((r, i) => r - benchmarkReturns[i]);
  const avgActiveReturn = activeReturns.reduce((sum, r) => sum + r, 0) / activeReturns.length;
  const trackingError = calculateVolatility(activeReturns, false);

  return trackingError === 0 ? 0 : avgActiveReturn / trackingError;
}

/**
 * Calculate Calmar Ratio (return / max drawdown)
 * 
 * Measures return relative to worst loss
 * Higher is better
 */
export function calculateCalmarRatio(
  annualReturn: number,
  maxDrawdown: number
): number {
  return maxDrawdown === 0 ? 0 : annualReturn / Math.abs(maxDrawdown);
}

/**
 * Calculate all risk metrics at once
 */
export function calculateAllRiskMetrics(
  prices: number[],
  marketPrices: number[],
  riskFreeRate: number = 0.04
): {
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  var95: number;
  cvar95: number;
  volatility: number;
  beta: number;
  alpha: number;
  treynorRatio: number;
  calmarRatio: number;
} {
  // Calculate returns
  const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);
  const marketReturns = marketPrices.slice(1).map((p, i) => (p - marketPrices[i]) / marketPrices[i]);

  // Calculate metrics
  const sharpeRatio = calculateSharpeRatio(returns, riskFreeRate);
  const sortinoRatio = calculateSortinoRatio(returns, 0, riskFreeRate);
  const { maxDrawdown: maxDD } = calculateMaxDrawdown(prices);
  const var95 = calculateVaR(returns, 0.95, prices[prices.length - 1]);
  const cvar95 = calculateCVaR(returns, 0.95, prices[prices.length - 1]);
  const volatility = calculateVolatility(returns, true);
  const beta = calculateBeta(returns, marketReturns);
  
  const totalReturn = (prices[prices.length - 1] - prices[0]) / prices[0];
  const marketTotalReturn = (marketPrices[marketPrices.length - 1] - marketPrices[0]) / marketPrices[0];
  const alpha = calculateAlpha(totalReturn, beta, marketTotalReturn, riskFreeRate);
  
  const treynorRatio = calculateTreynorRatio(totalReturn, beta, riskFreeRate);
  const calmarRatio = calculateCalmarRatio(totalReturn, maxDD);

  return {
    sharpeRatio,
    sortinoRatio,
    maxDrawdown: maxDD,
    var95,
    cvar95,
    volatility,
    beta,
    alpha,
    treynorRatio,
    calmarRatio
  };
}

/**
 * Interpret risk metrics and provide insights
 */
export function interpretRiskMetrics(metrics: ReturnType<typeof calculateAllRiskMetrics>): string[] {
  const insights: string[] = [];

  // Sharpe Ratio
  if (metrics.sharpeRatio > 2.0) {
    insights.push(`Excellent risk-adjusted returns (Sharpe: ${metrics.sharpeRatio.toFixed(2)})`);
  } else if (metrics.sharpeRatio > 1.0) {
    insights.push(`Good risk-adjusted returns (Sharpe: ${metrics.sharpeRatio.toFixed(2)})`);
  } else if (metrics.sharpeRatio > 0) {
    insights.push(`Acceptable risk-adjusted returns (Sharpe: ${metrics.sharpeRatio.toFixed(2)})`);
  } else {
    insights.push(`Poor risk-adjusted returns (Sharpe: ${metrics.sharpeRatio.toFixed(2)}) - consider rebalancing`);
  }

  // Max Drawdown
  if (metrics.maxDrawdown > 0.3) {
    insights.push(`⚠️ High risk: Maximum drawdown of ${(metrics.maxDrawdown * 100).toFixed(1)}% - consider reducing position sizes`);
  } else if (metrics.maxDrawdown > 0.2) {
    insights.push(`Moderate risk: Maximum drawdown of ${(metrics.maxDrawdown * 100).toFixed(1)}%`);
  } else {
    insights.push(`Low risk: Maximum drawdown of ${(metrics.maxDrawdown * 100).toFixed(1)}%`);
  }

  // Beta
  if (metrics.beta > 1.2) {
    insights.push(`High market sensitivity (β=${metrics.beta.toFixed(2)}) - portfolio is ${((metrics.beta - 1) * 100).toFixed(0)}% more volatile than market`);
  } else if (metrics.beta < 0.8) {
    insights.push(`Low market sensitivity (β=${metrics.beta.toFixed(2)}) - portfolio is ${((1 - metrics.beta) * 100).toFixed(0)}% less volatile than market`);
  }

  // Alpha
  if (metrics.alpha > 0.05) {
    insights.push(`🎯 Generating alpha: Outperforming market by ${(metrics.alpha * 100).toFixed(1)}% (skill or luck?)`);
  } else if (metrics.alpha < -0.05) {
    insights.push(`⚠️ Negative alpha: Underperforming market by ${(Math.abs(metrics.alpha) * 100).toFixed(1)}%`);
  }

  // VaR
  insights.push(`95% VaR: $${metrics.var95.toFixed(2)} - 5% chance of losing more than this in a day`);

  return insights;
}
