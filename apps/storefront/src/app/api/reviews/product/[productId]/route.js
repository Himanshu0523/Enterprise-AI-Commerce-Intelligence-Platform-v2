import { NextResponse } from 'next/server';
import { getReviewsByProduct } from '@/lib/db/reviews';

export async function GET(request, { params }) {
  try {
    const { productId } = params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sort = searchParams.get('sort') || 'newest';
    const verifiedOnly = searchParams.get('verified') === 'true';
    const hasImagesOnly = searchParams.get('hasImages') === 'true';
    const ratingFilter = searchParams.get('rating');

    let reviews = getReviewsByProduct(productId);

    // Apply filters
    if (ratingFilter) {
      const rVal = parseInt(ratingFilter, 10);
      if (!isNaN(rVal) && rVal >= 1 && rVal <= 5) {
        reviews = reviews.filter(r => Math.round(r.rating) === rVal);
      }
    }

    if (verifiedOnly) {
      reviews = reviews.filter(r => r.isVerifiedPurchase === true || r.verified === true);
    }

    if (hasImagesOnly) {
      reviews = reviews.filter(r => (r.media && r.media.length > 0) || (r.images && r.images.length > 0));
    }

    // Apply sorting
    if (sort === 'highest') {
      reviews.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'lowest') {
      reviews.sort((a, b) => a.rating - b.rating);
    } else {
      // Default: newest first
      reviews.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    }

    // Pagination
    const total = reviews.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedReviews = reviews.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      reviews: paginatedReviews,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
