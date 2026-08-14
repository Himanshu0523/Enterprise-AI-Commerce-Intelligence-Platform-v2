import { NextResponse } from 'next/server';
import productsData from '@/lib/mock-data/products.json';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) return NextResponse.json([]);

  const qLower = q.toLowerCase();
  
  // Collect matching product titles, categories, and brands
  const suggestions = new Set();
  
  productsData.forEach((p) => {
    if (p.name.toLowerCase().includes(qLower)) suggestions.add(p.name);
    if (p.category.toLowerCase().includes(qLower)) suggestions.add(p.category);
    if (p.brand.toLowerCase().includes(qLower)) suggestions.add(p.brand);
  });

  return NextResponse.json(Array.from(suggestions).slice(0, 6));
}
