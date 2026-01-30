# ALPHA 2.0 - AI-Powered Investment Platform

Intelligent investing powered by AI. ALPHA combines institutional-grade quantitative analysis, predictive forecasting, and personalized advice to help you navigate the markets with confidence.

## Overview

ALPHA 2.0 is an AI-powered investment platform that democratizes institutional-grade quantitative analysis for retail investors. Get professional-grade financial metrics, real-time market data, and AI-driven insights—all for free.

### Key Features

- **Institutional-Grade Analysis** - 10+ quantitative risk metrics (Sharpe Ratio, Beta, Alpha, VaR, etc.)
- **AI Investment Advisor** - Natural language chat interface with PhD-level quantitative insights
- **Real-Time Market Data** - Live stock prices and 10+ years of historical data
- **Smart Risk Management** - Dynamic stop-loss levels and portfolio optimization
- **Valuation Analysis** - Multi-factor intrinsic value calculations
- **12 Dashboard Pages** - Portfolio, Analytics, Wall Street, Stop Loss, Heatmap, Charts, Watchlist, News, Search, Advisor, Predictions, Goals

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Environment variables configured (see `.env.example`)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd alpha-2.0

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages (12 sections)
│   ├── sign-in/           # Authentication
│   ├── sign-up/           # Registration
│   ├── page.tsx           # Landing page
│   └── layout.tsx         # Root layout
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── ui/               # Reusable UI components
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── stock-api.ts      # Stock data fetching
│   ├── financial-formulas.ts  # Quantitative calculations
│   ├── valuation-engine.ts    # Valuation analysis
│   └── ...
├── ai/                   # AI/Genkit flows
│   └── flows/           # AI advisor flows
└── quant/               # Quantitative analysis
    └── core/            # Risk metrics calculations
```

## Core Features

### 1. Quantitative Risk Metrics

- **Sharpe Ratio** - Risk-adjusted returns
- **Sortino Ratio** - Downside risk only
- **Beta & Alpha** - Market sensitivity & outperformance
- **Max Drawdown** - Worst historical loss
- **Value at Risk (VaR)** - 95% confidence loss estimate
- **Volatility** - Annualized standard deviation
- **Diversification Score** - Portfolio balance (0-100)

### 2. AI Investment Advisor

Chat with an AI advisor powered by Genkit. Get:
- Real-time portfolio analysis
- Strategic BUY/SELL/HOLD recommendations
- News-driven insights with sentiment analysis
- Behavioral analysis (panic selling detection)

### 3. Real-Time Market Data

- Live stock prices via Yahoo Finance
- 10+ years of historical data
- Multiple timeframes (1D to 5Y)
- Sector allocation tracking
- Market news with AI sentiment analysis

### 4. Smart Risk Management

- Dynamic stop-loss levels (ATR-based)
- Three risk profiles (Conservative/Moderate/Aggressive)
- Trailing stop support
- Portfolio-level risk dashboard

## Technology Stack

- **Frontend** - Next.js 15, React, TypeScript
- **Styling** - Tailwind CSS, Glassmorphism UI
- **Authentication** - Clerk
- **AI** - Google Genkit
- **Data** - Yahoo Finance API
- **Database** - (Configured via environment)
- **Deployment** - Vercel

## Environment Variables

```env
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AI/Genkit
GOOGLE_GENKIT_API_KEY=

# APIs
STOCK_API_KEY=
NEWS_API_KEY=

# Database
DATABASE_URL=
```

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

### Code Quality

```bash
npm run lint
npm run type-check
```

## Design System

### Colors

- **Primary** - Blue (#3B82F6)
- **Background** - Dark gray (#0F172A)
- **Text** - White (#FFFFFF)
- **Secondary** - Gray (#6B7280)

### Typography

- **Font** - Space Grotesk (sans-serif)
- **Headings** - Bold, 2xl-7xl
- **Body** - Regular, sm-lg

### Components

All UI components use glassmorphism styling:
- `bg-white/10 backdrop-blur-xl border-white/20`
- Rounded corners with smooth transitions
- Hover effects with opacity changes

## API Routes

- `GET /api/health` - Health check
- `GET /api/stock-price` - Get current stock price
- `GET /api/stock-prices` - Get multiple stock prices
- `GET /api/stock-search` - Search stocks
- `GET /api/test-price` - Test price endpoint

## Performance

- First load: ~2-3 seconds
- Data fetching: ~5-7 seconds
- Real-time updates: Automatic
- 100% TypeScript coverage
- Production-ready (Vercel deployment)

## Security

- Enterprise-grade authentication via Clerk
- No PII sent to external APIs
- Data privacy assurance
- Open-source components
- Secure environment variable handling

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@alpha.ai or open an issue on GitHub.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced portfolio backtesting
- [ ] Machine learning predictions
- [ ] Social trading features
- [ ] API for third-party integrations
- [ ] Advanced charting tools

## Acknowledgments

- Yahoo Finance for market data
- Google Genkit for AI capabilities
- Clerk for authentication
- Tailwind CSS for styling
- Lucide React for icons
