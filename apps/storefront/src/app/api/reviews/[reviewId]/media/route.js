import { NextResponse } from 'next/server';
import { getReviewById, updateReview } from '@/lib/db/reviews';
import fs from 'fs';
import path from 'path';

export async function POST(request, { params }) {
  try {
    const { reviewId } = params;
    const review = getReviewById(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const files = formData.getAll('file');

    const mediaUrls = [];

    for (const file of files) {
      if (file && typeof file === 'object' && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public/uploads/reviews');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Clean filename to prevent path traversal or special character issues
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `review-${reviewId}-${Date.now()}-${cleanName}`;
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);

        mediaUrls.push(`/uploads/reviews/${filename}`);
      }
    }

    if (mediaUrls.length === 0) {
      return NextResponse.json({ error: 'No files were uploaded' }, { status: 400 });
    }

    const updatedMedia = [...(review.media || []), ...mediaUrls];
    const updated = updateReview(reviewId, { media: updatedMedia });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error uploading review media:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
