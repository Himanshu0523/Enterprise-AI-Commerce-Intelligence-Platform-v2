import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server';
import { addReview } from '@/lib/db/reviews';

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const { productId, rating, comment, author } = body;

    if (!productId || rating === undefined || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
    }

    const reviewData = {
      productId,
      rating: numericRating,
      comment: comment.trim(),
      author: (author || user.name || user.email || 'Account').trim(),
      userId: user.id,
    };

    const newReview = addReview(reviewData);
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
