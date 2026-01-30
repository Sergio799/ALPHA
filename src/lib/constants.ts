// Application constants for better maintainability and performance

export const APP_CONFIG = {
  name: 'SamrAI',
  description: 'Intelligent Investment Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9003',
} as const;

export const PORTFOLIO_UPDATE_INTERVAL = 2000; // 2 seconds
export const CACHE_REVALIDATION_TIME = 60; // 1 minute

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  DASHBOARD: '/dashboard',
  PORTFOLIO: '/dashboard/portfolio',
  PREDICTIONS: '/dashboard/predictions',
  ADVISOR: '/dashboard/advisor',
  BEHAVIORAL: '/dashboard/behavioral',
  ANALYTICS: '/dashboard/analytics',
  GOALS: '/dashboard/goals',
  ACCOUNTS: '/dashboard/accounts',
} as const;

export const API_ENDPOINTS = {
  ADVISOR_CHAT: '/api/advisor/chat',
  PORTFOLIO_DATA: '/api/portfolio',
  BEHAVIORAL_ANALYSIS: '/api/behavioral',
} as const;

export const QUERY_KEYS = {
  PORTFOLIO: 'portfolio',
  GOALS: 'goals',
  ACCOUNTS: 'accounts',
  BEHAVIORAL: 'behavioral',
} as const;
