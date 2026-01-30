# Quantitative Advisor - Technical Summary

## Overview
AI investment advisor with quantitative analysis capabilities using real-time market data.

## Core Components

### 1. Risk Metrics (`src/quant/core/risk-metrics.ts`)
Calculates portfolio risk and performance metrics:
- Sharpe Ratio, Sortino Ratio, Treynor Ratio
- Beta, Alpha
- VaR, CVaR
- Max Drawdown
- Volatility

### 2. Data Pipeline (`src/lib/data-pipeline.ts`)
Fetches market data from Yahoo Finance:
- Historical OHLCV data (1-5 years)
- S&P 500 benchmark
- Risk-free rate (10-year Treasury)
- Fundamental data
- Market quotes

### 3. Insights Engine (`src/quant/insights-engine.ts`)
Generates strategic insights:
- Portfolio-level analysis
- Individual stock recommendations
- Risk warnings
- Rebalancing suggestions
- Market regime detection

### 4. AI Advisor (`src/ai/flows/advisor-flow.ts`)
Integrates quantitative analysis with AI:
- Fetches real-time data
- Calculates metrics
- Generates natural language insights
- Provides strategic recommendations

## Data Flow

```
User Query
    ↓
Fetch Historical Data (Yahoo Finance)
    ↓
Calculate Risk Metrics
    ↓
Generate Insights
    ↓
AI Analysis & Response
```

## Key Metrics

**Portfolio Level:**
- Sharpe Ratio: Risk-adjusted returns
- Beta: Market correlation
- Alpha: Excess returns vs market
- Max Drawdown: Worst peak-to-trough decline
- VaR: Value at Risk (95% confidence)

**Individual Holdings:**
- Performance vs benchmark
- Risk metrics
- Buy/Hold/Sell recommendation
- Confidence score

## Technical Details

**Data Source:** Yahoo Finance (free, no API key)
**Historical Data:** 252 trading days (1 year)
**Benchmark:** S&P 500 (^GSPC)
**Risk-Free Rate:** 10-year Treasury (^TNX)

**Performance:**
- First query: ~7 seconds (fetches data)
- Subsequent: ~3 seconds

## Implementation

All quantitative analysis is automatically integrated into the advisor flow. No additional configuration required.

## Mathematical Foundation

Based on:
- Modern Portfolio Theory (Markowitz)
- Capital Asset Pricing Model (CAPM)
- Value at Risk (VaR) methodology
- Standard deviation for volatility
- Correlation analysis for diversification
