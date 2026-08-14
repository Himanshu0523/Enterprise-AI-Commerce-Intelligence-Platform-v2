import { NextResponse } from 'next/server';
import { reportReview } from '@/lib/db/reviews';

export async function POST(request, { params }) {
  try {
    const { reviewId } = params;
    const { reason } = await request.json();

    const updated = reportReview(reviewId, reason || 'Unspecified reason');
    if (!updated) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error reporting review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
