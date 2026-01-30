import { Asset } from './portfolio-data';

// Mock fundamental data - in production, this would come from an API
interface FundamentalData {
  eps: number; // Earnings per share
  peRatio: number;
  sectorAvgPE: number;
  revenueGrowth: number; // percentage
  dividendYield: number;
  bookValue: number;
  cashFlowPerShare: number;
}

// Mock data for demo - API-ready structure
const fundamentalsDatabase: Record<string, FundamentalData> = {
  AAPL: {
    eps: 6.05,
    peRatio: 28.9,
    sectorAvgPE: 25.2,
    revenueGrowth: 8.5,
    dividendYield: 0.52,
    bookValue: 3.85,
    cashFlowPerShare: 7.2,
  },
  MSFT: {
    eps: 11.2,
    peRatio: 30.4,
    sectorAvgPE: 25.2,
    revenueGrowth: 12.3,
    dividendYield: 0.78,
    bookValue: 22.5,
    cashFlowPerShare: 12.8,
  },
  AMZN: {
    eps: 2.9,
    peRatio: 46.7,
    sectorAvgPE: 32.1,
    revenueGrowth: 11.2,
    dividendYield: 0,
    bookValue: 18.3,
    cashFlowPerShare: 4.5,
  },
  NVDA: {
    eps: 12.3,
    peRatio: 36.6,
    sectorAvgPE: 28.5,
    revenueGrowth: 126.0,
    dividendYield: 0.03,
    bookValue: 15.2,
    cashFlowPerShare: 14.1,
  },
  TSLA: {
    eps: 3.62,
    peRatio: 69.1,
    sectorAvgPE: 18.5,
    revenueGrowth: 18.8,
    dividendYield: 0,
    bookValue: 19.8,
    cashFlowPerShare: 5.2,
  },
  VOO: {
    eps: 12.5,
    peRatio: 33.6,
    sectorAvgPE: 33.6,
    revenueGrowth: 5.2,
    dividendYield: 1.42,
    bookValue: 385.0,
    cashFlowPerShare: 15.0,
  },
  QQQ: {
    eps: 14.8,
    peRatio: 25.7,
    sectorAvgPE: 30.2,
    revenueGrowth: 8.5,
    dividendYield: 0.58,
    bookValue: 320.0,
    cashFlowPerShare: 18.2,
  },
  IWM: {
    eps: 8.2,
    peRatio: 22.0,
    sectorAvgPE: 22.0,
    revenueGrowth: 4.5,
    dividendYield: 1.25,
    bookValue: 160.0,
    cashFlowPerShare: 10.5,
  },
  BTC: {
    eps: 0,
    peRatio: 0,
    sectorAvgPE: 0,
    revenueGrowth: 0,
    dividendYield: 0,
    bookValue: 0,
    cashFlowPerShare: 0,
  },
  ETH: {
    eps: 0,
    peRatio: 0,
    sectorAvgPE: 0,
    revenueGrowth: 0,
    dividendYield: 0,
    bookValue: 0,
    cashFlowPerShare: 0,
  },
};

export interface ValuationResult {
  intrinsicValue: number;
  currentPrice: number;
  differencePercent: number;
  valuationStatus: 'Undervalued' | 'Fairly Valued' | 'Overvalued';
  confidence: number; // 0-100
  method: string;
}

/**
 * Calculate intrinsic value using multi-factor valuation model
 * Combines DCF approximation, P/E comparison, and growth factors
 */
export function calculateIntrinsicValue(asset: Asset): ValuationResult {
  const fundamentals = fundamentalsDatabase[asset.symbol];

  // For crypto or assets without fundamentals, return neutral valuation
  if (!fundamentals || fundamentals.eps === 0) {
    return {
      intrinsicValue: asset.price,
      currentPrice: asset.price,
      differencePercent: 0,
      valuationStatus: 'Fairly Valued',
      confidence: 30,
      method: 'Market Price (No Fundamentals)',
    };
  }

  // Method 1: P/E Sector Comparison (Base Valuation)
  const peSectorValue = fundamentals.eps * fundamentals.sectorAvgPE;

  // Method 2: PEG-Adjusted Valuation (Growth-Adjusted)
  // PEG Ratio approach: Fair P/E = Growth Rate (if PEG = 1)
  // Adjust sector P/E based on company's growth vs expected growth
  const expectedGrowth = 5; // Assume 5% is "normal" growth for sector avg P/E
  const growthPremium = fundamentals.revenueGrowth / expectedGrowth;
  const growthAdjustedPE = fundamentals.sectorAvgPE * Math.min(growthPremium, 2); // Cap at 2x
  const pegValue = fundamentals.eps * growthAdjustedPE;

  // Method 3: DCF Approximation using Cash Flow
  // Use 5-year forecast period + terminal value
  const discountRate = 0.10; // 10% WACC
  const terminalGrowthRate = 0.03; // 3% perpetual growth
  const growthRate = Math.min(fundamentals.revenueGrowth / 100, 0.25); // Cap at 25%

  // Sum of discounted cash flows for next 5 years
  let dcfValue = 0;
  for (let year = 1; year <= 5; year++) {
    const projectedCF = fundamentals.cashFlowPerShare * Math.pow(1 + growthRate, year);
    dcfValue += projectedCF / Math.pow(1 + discountRate, year);
  }

  // Add terminal value (Year 6 onwards)
  const terminalCF = fundamentals.cashFlowPerShare * Math.pow(1 + growthRate, 5) * (1 + terminalGrowthRate);
  const terminalValue = terminalCF / (discountRate - terminalGrowthRate);
  dcfValue += terminalValue / Math.pow(1 + discountRate, 5);

  // Weighted average with adjusted weights
  const intrinsicValue =
    peSectorValue * 0.35 + pegValue * 0.35 + dcfValue * 0.30;

  // Calculate difference percentage
  const differencePercent =
    ((intrinsicValue - asset.price) / asset.price) * 100;

  // Determine valuation status
  let valuationStatus: 'Undervalued' | 'Fairly Valued' | 'Overvalued';
  if (differencePercent > 10) {
    valuationStatus = 'Undervalued';
  } else if (differencePercent < -10) {
    valuationStatus = 'Overvalued';
  } else {
    valuationStatus = 'Fairly Valued';
  }

  // Confidence score based on data quality
  const confidence = Math.min(
    100,
    60 + (fundamentals.revenueGrowth > 0 ? 20 : 0) + (fundamentals.cashFlowPerShare > 0 ? 20 : 0)
  );

  return {
    intrinsicValue,
    currentPrice: asset.price,
    differencePercent,
    valuationStatus,
    confidence,
    method: 'Multi-Factor DCF',
  };
}

/**
 * Get valuation badge color based on status
 */
export function getValuationColor(status: string): string {
  switch (status) {
    case 'Undervalued':
      return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'Overvalued':
      return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'Fairly Valued':
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    default:
      return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  }
}
