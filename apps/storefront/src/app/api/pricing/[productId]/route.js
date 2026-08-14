import { NextResponse } from 'next/server';
import productsData from '@/lib/mock-data/products.json';

export async function GET(request, { params }) {
  const { productId } = params;
  const product = productsData.find((p) => p.id === productId);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const basePrice = product.price;
  const flashPrice = product.flashSalePrice;
  const effectivePrice = flashPrice || basePrice;
  const discountPercentage = flashPrice ? Math.round(((basePrice - flashPrice) / basePrice) * 100) : 0;

  return NextResponse.json({
    productId: product.id,
    currency: 'USD',
    basePrice,
    flashSalePrice: flashPrice || null,
    effectivePrice,
    discountPercentage,
  });
}
