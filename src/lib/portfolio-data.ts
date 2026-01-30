export type Asset = {
  name: string;
  symbol: string;
  shares: number;
  price: number;
  price_open: number;
  purchase_price: number;
  value: number;
  daily_change_percent: number;
  type: 'Stock' | 'ETF' | 'Crypto';
};

export const portfolioData: Asset[] = [
  {
    name: 'Apple Inc.',
    symbol: 'AAPL',
    shares: 50,
    price: 175.2,
    price_open: 173.1,
    purchase_price: 150.0,
    value: 8760,
    daily_change_percent: 1.21,
    type: 'Stock',
  },
  {
    name: 'Vanguard S&P 500 ETF',
    symbol: 'VOO',
    shares: 20,
    price: 420.5,
    price_open: 418.2,
    purchase_price: 380.0,
    value: 8410,
    daily_change_percent: 0.55,
    type: 'ETF',
  },
  {
    name: 'Microsoft Corp.',
    symbol: 'MSFT',
    shares: 30,
    price: 340.1,
    price_open: 342.5,
    purchase_price: 310.0,
    value: 10203,
    daily_change_percent: -0.7,
    type: 'Stock',
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    shares: 0.15,
    price: 65000,
    price_open: 64500,
    purchase_price: 45000,
    value: 9750,
    daily_change_percent: 0.78,
    type: 'Crypto',
  },
  {
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    shares: 40,
    price: 135.5,
    price_open: 134.0,
    purchase_price: 120.0,
    value: 5420,
    daily_change_percent: 1.12,
    type: 'Stock',
  },
  {
    name: 'Invesco QQQ Trust',
    symbol: 'QQQ',
    shares: 25,
    price: 380.75,
    price_open: 379.0,
    purchase_price: 350.0,
    value: 9518.75,
    daily_change_percent: 0.46,
    type: 'ETF',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    shares: 2.5,
    price: 3500,
    price_open: 3550,
    purchase_price: 2800,
    value: 8750,
    daily_change_percent: -1.41,
    type: 'Crypto',
  },
  {
    name: 'NVIDIA Corp.',
    symbol: 'NVDA',
    shares: 15,
    price: 450.0,
    price_open: 445.0,
    purchase_price: 380.0,
    value: 6750,
    daily_change_percent: 1.12,
    type: 'Stock',
  },
  {
    name: 'Tesla, Inc.',
    symbol: 'TSLA',
    shares: 20,
    price: 250.0,
    price_open: 255.0,
    purchase_price: 220.0,
    value: 5000,
    daily_change_percent: -1.96,
    type: 'Stock',
  },
  {
    name: 'iShares Russell 2000 ETF',
    symbol: 'IWM',
    shares: 30,
    price: 180.0,
    price_open: 181.0,
    purchase_price: 170.0,
    value: 5400,
    daily_change_percent: -0.55,
    type: 'ETF',
  },
];
