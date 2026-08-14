import { NextResponse } from 'next/server';
import productsData from '@/lib/mock-data/products.json';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  let recommendations = [...productsData];
  if (productId) {
    const current = productsData.find((p) => p.id === productId);
    if (current) {
      recommendations = productsData.filter((p) => p.id !== productId && p.category === current.category);
    }
  }

  if (recommendations.length < 4) {
    recommendations = productsData.filter((p) => p.id !== productId);
  }

  return NextResponse.json(recommendations.slice(0, 4));
}
