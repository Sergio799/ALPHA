import { NextResponse } from 'next/server';
import { fetchStockPriceWithFallback } from '@/lib/stock-api';

export const dynamic = 'force-dynamic';

/**
 * Test endpoint to fetch a single stock price
 * Usage: /api/test-price?symbol=AAPL
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'AAPL';

  try {
    const price = await fetchStockPriceWithFallback(symbol);
    
    if (price) {
      return NextResponse.json({
        symbol,
        price,
        timestamp: new Date().toISOString(),
        source: 'Alpha Vantage',
      });
    } else {
      return NextResponse.json({
        error: 'Failed to fetch price',
        symbol,
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching price:', error);
    return NextResponse.json({
      error: 'Internal server error',
      symbol,
    }, { status: 500 });
  }
}
