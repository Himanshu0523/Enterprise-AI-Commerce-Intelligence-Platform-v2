import { NextResponse } from 'next/server';
import { getReviewsByProduct } from '@/lib/db/reviews';

export async function GET(request, { params }) {
  try {
    const { productId } = params;
    const reviews = getReviewsByProduct(productId);

    const totalReviews = reviews.length;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    reviews.forEach(review => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
      sum += review.rating;
    });

    const averageRating = totalReviews > 0 ? parseFloat((sum / totalReviews).toFixed(1)) : 0;

    return NextResponse.json({
      averageRating,
      totalReviews,
      distribution,
    });
  } catch (error) {
    console.error('Error fetching product review summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
