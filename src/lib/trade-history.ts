/**
 * Trade history tracking
 */

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  date: string;
  notes?: string;
}

export interface TradeHistory {
  trades: Trade[];
  totalInvested: number;
  totalRealized: number;
  netProfit: number;
}

const STORAGE_KEY = 'samrai_trade_history';

export function getTradeHistory(): TradeHistory {
  if (typeof window === 'undefined') {
    return { trades: [], totalInvested: 0, totalRealized: 0, netProfit: 0 };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { trades: [], totalInvested: 0, totalRealized: 0, netProfit: 0 };
  }

  return JSON.parse(stored);
}

export function addTrade(trade: Omit<Trade, 'id'>): Trade {
  const history = getTradeHistory();
  
  const newTrade: Trade = {
    ...trade,
    id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };

  history.trades.unshift(newTrade);

  if (trade.type === 'buy') {
    history.totalInvested += trade.total;
  } else {
    history.totalRealized += trade.total;
  }

  history.netProfit = history.totalRealized - history.totalInvested;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  
  return newTrade;
}

export function deleteTrade(tradeId: string): void {
  const history = getTradeHistory();
  
  const trade = history.trades.find(t => t.id === tradeId);
  if (!trade) return;

  history.trades = history.trades.filter(t => t.id !== tradeId);

  if (trade.type === 'buy') {
    history.totalInvested -= trade.total;
  } else {
    history.totalRealized -= trade.total;
  }

  history.netProfit = history.totalRealized - history.totalInvested;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearTradeHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getTradesBySymbol(symbol: string): Trade[] {
  const history = getTradeHistory();
  return history.trades.filter(t => t.symbol === symbol);
}

export function calculateAverageCost(symbol: string): number {
  const trades = getTradesBySymbol(symbol).filter(t => t.type === 'buy');
  
  if (trades.length === 0) return 0;

  const totalCost = trades.reduce((sum, t) => sum + t.total, 0);
  const totalShares = trades.reduce((sum, t) => sum + t.shares, 0);

  return totalShares > 0 ? totalCost / totalShares : 0;
}
