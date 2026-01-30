/**
 * Common financial formulas and calculations
 */

export function calculateCompoundAnnualGrowthRate(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue <= 0 || years <= 0) return 0;
  return Math.pow(endValue / startValue, 1 / years) - 1;
}

export function calculateSimpleReturn(
  startValue: number,
  endValue: number
): number {
  if (startValue === 0) return 0;
  return (endValue - startValue) / startValue;
}

export function calculateAnnualizedReturn(
  totalReturn: number,
  years: number
): number {
  if (years <= 0) return 0;
  return Math.pow(1 + totalReturn, 1 / years) - 1;
}

export function calculateFutureValue(
  presentValue: number,
  rate: number,
  periods: number
): number {
  return presentValue * Math.pow(1 + rate, periods);
}

export function calculatePresentValue(
  futureValue: number,
  rate: number,
  periods: number
): number {
  return futureValue / Math.pow(1 + rate, periods);
}

export function calculateCompoundInterest(
  principal: number,
  rate: number,
  periods: number,
  compoundingFrequency: number = 1
): number {
  return principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * periods);
}

export function calculatePriceToEarnings(
  price: number,
  earningsPerShare: number
): number {
  if (earningsPerShare === 0) return 0;
  return price / earningsPerShare;
}

export function calculatePriceToBook(
  price: number,
  bookValuePerShare: number
): number {
  if (bookValuePerShare === 0) return 0;
  return price / bookValuePerShare;
}

export function calculateDividendYield(
  annualDividend: number,
  price: number
): number {
  if (price === 0) return 0;
  return annualDividend / price;
}

export function calculateEarningsYield(
  earningsPerShare: number,
  price: number
): number {
  if (price === 0) return 0;
  return earningsPerShare / price;
}

export function calculateReturnOnEquity(
  netIncome: number,
  shareholderEquity: number
): number {
  if (shareholderEquity === 0) return 0;
  return netIncome / shareholderEquity;
}

export function calculateReturnOnAssets(
  netIncome: number,
  totalAssets: number
): number {
  if (totalAssets === 0) return 0;
  return netIncome / totalAssets;
}

export function calculateDebtToEquity(
  totalDebt: number,
  shareholderEquity: number
): number {
  if (shareholderEquity === 0) return 0;
  return totalDebt / shareholderEquity;
}

export function calculateCurrentRatio(
  currentAssets: number,
  currentLiabilities: number
): number {
  if (currentLiabilities === 0) return 0;
  return currentAssets / currentLiabilities;
}

export function calculateQuickRatio(
  currentAssets: number,
  inventory: number,
  currentLiabilities: number
): number {
  if (currentLiabilities === 0) return 0;
  return (currentAssets - inventory) / currentLiabilities;
}

export function calculateGrossMargin(
  revenue: number,
  costOfGoodsSold: number
): number {
  if (revenue === 0) return 0;
  return (revenue - costOfGoodsSold) / revenue;
}

export function calculateOperatingMargin(
  operatingIncome: number,
  revenue: number
): number {
  if (revenue === 0) return 0;
  return operatingIncome / revenue;
}

export function calculateNetMargin(
  netIncome: number,
  revenue: number
): number {
  if (revenue === 0) return 0;
  return netIncome / revenue;
}

export function calculateBreakEvenPoint(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number
): number {
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  if (contributionMargin === 0) return 0;
  return fixedCosts / contributionMargin;
}

export function calculatePaybackPeriod(
  initialInvestment: number,
  annualCashFlow: number
): number {
  if (annualCashFlow === 0) return 0;
  return initialInvestment / annualCashFlow;
}

export function calculateRuleOf72(rate: number): number {
  if (rate === 0) return 0;
  return 72 / (rate * 100);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return formatCurrency(value);
}
