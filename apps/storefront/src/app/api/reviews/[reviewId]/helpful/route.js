import { NextResponse } from 'next/server';
import { incrementHelpful } from '@/lib/db/reviews';

export async function POST(request, { params }) {
  try {
    const { reviewId } = params;
    const updated = incrementHelpful(reviewId);
    if (!updated) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
