import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { addReview } from '@/lib/db/reviews';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
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
      author: (author || session?.user?.name || 'Anonymous').trim(),
      userId: session?.user?.id || null,
    };

    const newReview = addReview(reviewData);
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
