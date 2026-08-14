import { NextResponse } from 'next/server';
import productsData from '@/lib/mock-data/products.json';

export async function GET() {
  const newArrivals = productsData.filter((p) => p.isNew);
  return NextResponse.json(newArrivals.slice(0, 8));
}
