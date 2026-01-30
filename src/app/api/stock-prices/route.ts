import { NextResponse } from 'next/server';
import { portfolioData } from '@/lib/portfolio-data';

export const dynamic = 'force-dynamic';

/**
 * API route to fetch real stock prices
 * This runs on the server to avoid CORS issues
 */
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Fetch prices for all symbols (limited by Alpha Vantage rate limit)
    const prices: Record<string, number> = {};
    
    // For demo, just fetch first 5 stocks to avoid rate limit
    const symbolsToFetch = portfolioData.slice(0, 5);
    
    for (const asset of symbolsToFetch) {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${asset.symbol}&apikey=${apiKey}`
        );
        
        const data = await response.json();
        
        if (data['Global Quote']?.['05. price']) {
          prices[asset.symbol] = parseFloat(data['Global Quote']['05. price']);
        }
        
        // Wait 12 seconds between calls (Alpha Vantage: 5 calls/min)
        if (symbolsToFetch.indexOf(asset) < symbolsToFetch.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 12000));
        }
      } catch (error) {
        console.error(`Failed to fetch ${asset.symbol}:`, error);
      }
    }
    
    return NextResponse.json({ prices });
  } catch (error) {
    console.error('Failed to fetch stock prices:', error);
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}
