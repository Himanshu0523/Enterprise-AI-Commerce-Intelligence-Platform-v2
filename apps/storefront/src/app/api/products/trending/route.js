import { NextResponse } from 'next/server';
import productsData from '@/lib/mock-data/products.json';

export async function GET() {
  const trending = productsData.filter((p) => p.isTrending || p.rating >= 4.5);
  return NextResponse.json(trending.slice(0, 8));
}
