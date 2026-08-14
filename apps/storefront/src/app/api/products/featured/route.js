import { NextResponse } from 'next/server';
import productsData from '@/lib/mock-data/products.json';

export async function GET() {
  const featured = productsData.filter((p) => p.isFeatured);
  return NextResponse.json(featured.slice(0, 8));
}
