import { NextResponse } from 'next/server';
import productsData from '@/lib/mock-data/products.json';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const brands = searchParams.get('brands') ? searchParams.get('brands').split(',') : [];
  const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')) : null;
  const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')) : null;
  const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')) : null;
  const sort = searchParams.get('sort') || 'featured';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  let filtered = [...productsData];

  // Search query filter
  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.description?.toLowerCase().includes(qLower) ||
        p.category?.toLowerCase().includes(qLower) ||
        p.brand?.toLowerCase().includes(qLower)
    );
  }

  // Category filter
  if (category) {
    filtered = filtered.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
  }

  // Single brand or multiple brands filter
  if (brand) {
    filtered = filtered.filter((p) => p.brand?.toLowerCase() === brand.toLowerCase());
  } else if (brands.length > 0) {
    filtered = filtered.filter((p) => brands.some((b) => b.toLowerCase() === p.brand?.toLowerCase()));
  }

  // Price Min/Max filter
  if (priceMin !== null) {
    filtered = filtered.filter((p) => p.price >= priceMin);
  }
  if (priceMax !== null) {
    filtered = filtered.filter((p) => p.price <= priceMax);
  }

  // Rating filter
  if (rating !== null) {
    filtered = filtered.filter((p) => p.rating >= rating);
  }

  // Sorting
  switch (sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'newest':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'popularity':
      filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      break;
    case 'featured':
    default:
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    products: paginated,
    pagination: {
      page,
      limit,
      total,
      pages: totalPages,
    },
  });
}