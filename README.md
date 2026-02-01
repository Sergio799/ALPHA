# ALPHA 2.0 - AI-Powered Investment Platform

Intelligent investing powered by AI. ALPHA combines institutional-grade quantitative analysis, predictive forecasting, and personalized advice to help you navigate the markets with confidence.

## 🚀 Overview

ALPHA 2.0 is a cutting-edge AI-powered investment platform that democratizes institutional-grade quantitative analysis for retail investors. Access professional-grade financial metrics, real-time market data, and AI-driven insights—completely free.

### ✨ Key Features

- **Institutional-Grade Quantitative Analysis** - 10+ professional risk metrics (Sharpe Ratio, Beta, Alpha, VaR, Sortino Ratio, Max Drawdown, Volatility, Diversification Score)
- **AI Investment Advisor** - Natural language chat interface powered by Google Genkit with PhD-level quantitative insights
- **Real-Time Market Data** - Live stock prices via Yahoo Finance with 10+ years of historical data
- **Smart Risk Management** - Dynamic ATR-based stop-loss levels with 3 risk profiles (Conservative/Moderate/Aggressive)
- **Valuation Analysis** - Multi-factor intrinsic value calculations with undervalued/fairly valued/overvalued classifications
- **12 Comprehensive Dashboard Pages** - Portfolio, Analytics, Wall Street, Stop Loss, Heatmap, Charts, Watchlist, News, Search, Advisor, Predictions, Goals

## 📋 Dashboard Pages

1. **Portfolio** - Real-time tracking with live prices and allocation
2. **Analytics** - Intrinsic value & valuation analysis
3. **Wall Street** - Analyst ratings & consensus
4. **Stop Loss** - Dynamic risk management
5. **Heatmap** - Visual sector allocation
6. **Charts** - Interactive price visualization
7. **Watchlist** - Track stocks of interest
8. **News** - Real-time market intelligence with sentiment analysis
9. **Search** - Stock discovery & research
10. **Advisor** - AI investment chat with strategic recommendations
11. **Predictions** - Future price estimates
12. **Goals** - Investment goal tracking & monitoring

## 🎯 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Environment variables configured (see `.env.example`)

### Installation

```bash
# Clone the repository
git clone https://github.com/Sergio799/ALPHA.git
cd ALPHA

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                           # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── health/              # Health check endpoint
│   │   ├── stock-price/         # Single stock price
│   │   ├── stock-prices/        # Multiple stock prices
│   │   ├── stock-search/        # Stock search
│   │   └── test-price/          # Test endpoint
│   ├── dashboard/               # Dashboard pages (12 sections)
│   │   ├── portfolio/           # Portfolio tracking
│   │   ├── analytics/           # Valuation analysis
│   │   ├── wall-street/         # Analyst ratings
│   │   ├── stop-loss/           # Risk management
│   │   ├── heatmap/             # Sector allocation
│   │   ├── charts/              # Price charts
│   │   ├── watchlist/           # Watchlist
│   │   ├── news/                # Market news
│   │   ├── search/              # Stock search
│   │   ├── advisor/             # AI advisor chat
│   │   ├── predictions/         # Price predictions
│   │   └── goals/               # Investment goals
│   ├── sign-in/                 # Clerk authentication
│   ├── sign-up/                 # User registration
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles & animations
├── components/
│   ├── dashboard/               # Dashboard components
│   │   ├── AssetCard.tsx
│   │   ├── DailyChange.tsx
│   │   ├── GoalDialog.tsx
│   │   ├── LinkAccountDialog.tsx
│   │   ├── Nav.tsx
│   │   ├── StockChart.tsx
│   │   └── StockSearch.tsx
│   ├── ui/                      # Reusable UI components
│   │   ├── input-with-button.tsx # Custom input with send button
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ... (19 more UI components)
│   └── providers/               # Context providers
├── hooks/                       # Custom React hooks
│   ├── use-chat-history.ts
│   ├── use-debounce.ts
│   ├── use-intersection-observer.ts
│   ├── use-mobile.tsx
│   ├── use-portfolio-store.ts
│   ├── use-real-prices.ts
│   ├── use-toast.ts
│   └── use-watchlist-store.ts
├── lib/                         # Utility functions & services
│   ├── stock-api.ts            # Yahoo Finance integration
│   ├── financial-formulas.ts   # Quantitative calculations
│   ├── valuation-engine.ts     # Valuation analysis
│   ├── stop-loss-engine.ts     # Stop-loss calculations
│   ├── news-analyzer.ts        # News sentiment analysis
│   ├── news-api.ts             # News data fetching
│   ├── portfolio-data.ts       # Portfolio data types
│   ├── wall-street-data.ts     # Analyst data
│   ├── chart-data.ts           # Chart utilities
│   ├── cache.ts                # Caching layer
│   ├── format.ts               # Formatting utilities
│   ├── utils.ts                # General utilities
│   └── ... (more utilities)
├── ai/                          # AI/Genkit integration
│   ├── genkit.ts               # Genkit configuration
│   └── flows/
│       ├── advisor-flow.ts     # AI advisor flow
│       └── panic-selling-flow.ts # Panic detection flow
└── quant/                       # Quantitative analysis
    ├── insights-engine.ts      # Insights generation
    └── core/
        └── risk-metrics.ts     # Risk calculations
```

## 🎨 Design System

### Glassmorphism UI
All components feature modern glassmorphism styling:
- `bg-white/10 backdrop-blur-xl border-white/20`
- Smooth transitions and hover effects
- Rounded corners with shadow effects

### Color Palette
- **Primary** - Blue (#3B82F6)
- **Background** - Dark gray (#0F172A)
- **Text** - White (#FFFFFF)
- **Secondary** - Gray (#6B7280)

### Typography
- **Font** - Space Grotesk (sans-serif)
- **Headings** - Bold, 2xl-7xl
- **Body** - Regular, sm-lg

### Icons
- Bootstrap SVG icons for feature cards
- Lucide React icons for UI elements

## 🔧 Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, Glassmorphism |
| **UI Components** | Shadcn/ui, Bootstrap Icons |
| **Authentication** | Clerk |
| **AI** | Google Genkit |
| **Data** | Yahoo Finance API |
| **State Management** | Zustand (portfolio & watchlist stores) |
| **Markdown** | React Markdown with GFM |
| **Deployment** | Vercel |

## 📊 Core Features Deep Dive

### 1. Quantitative Risk Metrics

Calculate professional-grade risk metrics:
- **Sharpe Ratio** - Risk-adjusted returns
- **Sortino Ratio** - Downside risk only
- **Beta** - Market sensitivity
- **Alpha** - Outperformance vs market
- **Max Drawdown** - Worst historical loss
- **Value at Risk (VaR)** - 95% confidence loss estimate
- **Volatility** - Annualized standard deviation
- **Diversification Score** - Portfolio balance (0-100)

### 2. AI Investment Advisor

Chat interface powered by Google Genkit:
- Real-time portfolio analysis
- Strategic BUY/SELL/HOLD recommendations with confidence levels
- News-driven insights with sentiment analysis
- Panic selling detection
- Educational explanations with formulas

### 3. Real-Time Market Data

- Live stock prices via Yahoo Finance (unlimited, free)
- 10+ years of historical data
- Multiple timeframes (1D, 5D, 1M, 3M, 6M, 1Y, 5Y)
- Sector allocation tracking
- Market news with AI sentiment analysis

### 4. Smart Risk Management

- **Dynamic Stop-Loss** - ATR-based calculations
- **Risk Profiles** - Conservative, Moderate, Aggressive
- **Trailing Stops** - Automatic adjustment
- **Portfolio-Level Dashboard** - Risk overview

## 🔌 API Routes

```
GET  /api/health              # Health check
GET  /api/stock-price         # Get current stock price
GET  /api/stock-prices        # Get multiple stock prices
GET  /api/stock-search        # Search stocks
GET  /api/test-price          # Test price endpoint
```

## 🌍 Environment Variables

```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard/portfolio
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/portfolio

# AI (Google Genkit)
GOOGLE_GENKIT_API_KEY=your_key

# APIs
STOCK_API_KEY=your_key
NEWS_API_KEY=your_key

# Database
DATABASE_URL=your_database_url
```

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add the following environment variables in Vercel project settings:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard/portfolio
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/portfolio
GOOGLE_GENAI_API_KEY=your_google_genai_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

4. Deploy with a single click or automatic deployments on push

## 📈 Performance Metrics

- **First Load** - ~2-3 seconds
- **Data Fetching** - ~5-7 seconds
- **Real-Time Updates** - Automatic
- **TypeScript Coverage** - 100%
- **Production Ready** - Vercel deployment

## 🔒 Security

- Enterprise-grade authentication via Clerk
- No PII sent to external APIs
- Data privacy assurance
- Secure environment variable handling
- Open-source components

## 🧪 Development

### Code Quality

```bash
npm run lint          # Run ESLint
npm run type-check    # TypeScript type checking
npm run build         # Production build
```

### Project Commands

```bash
npm run dev           # Development server
npm run build         # Production build
npm start             # Start production server
npm run lint          # Lint code
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

- **Email** - support@alpha.ai
- **GitHub Issues** - [Report bugs](https://github.com/Sergio799/ALPHA/issues)
- **Documentation** - Check README_QUANT.md for quantitative details

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced portfolio backtesting
- [ ] Machine learning price predictions
- [ ] Social trading features
- [ ] REST API for third-party integrations
- [ ] Advanced charting tools (TradingView integration)
- [ ] Options analysis
- [ ] Crypto portfolio support
- [ ] Tax optimization tools

## 🙏 Acknowledgments

- **Yahoo Finance** - Real-time market data
- **Google Genkit** - AI capabilities
- **Clerk** - Authentication infrastructure
- **Tailwind CSS** - Styling framework
- **Shadcn/ui** - UI component library
- **Bootstrap Icons** - Icon library
- **Lucide React** - Additional icons

## 📞 Contact

- **GitHub** - [@Sergio799](https://github.com/Sergio799)
- **Repository** - [ALPHA 2.0](https://github.com/Sergio799/ALPHA)

---

**Built with ❤️ for retail investors who deserve institutional-grade analysis.**
