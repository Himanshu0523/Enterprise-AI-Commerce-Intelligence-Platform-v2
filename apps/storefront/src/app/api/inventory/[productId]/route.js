import { NextResponse } from 'next/server';
import productsData from '@/lib/mock-data/products.json';

export async function GET(request, { params }) {
  const { productId } = params;
  const product = productsData.find((p) => p.id === productId);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({
    productId: product.id,
    stock: product.stock || 0,
    inStock: (product.stock || 0) > 0,
    status: (product.stock || 0) > 10 ? 'IN_STOCK' : (product.stock || 0) > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
  });
}
