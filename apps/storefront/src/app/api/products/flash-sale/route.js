import { NextResponse } from 'next/server';
import productsData from '@/lib/mock-data/products.json';

export async function GET() {
  const flashSale = productsData.filter((p) => p.flashSalePrice != null);
  // Add sale end time (e.g., 24 hours from now)
  const endsAt = new Date(Date.now() + 18 * 3600 * 1000).toISOString();
  return NextResponse.json({
    endsAt,
    items: flashSale.slice(0, 8),
  });
}
