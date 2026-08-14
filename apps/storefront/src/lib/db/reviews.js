import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/lib/mock-data/reviews.json');

function readReviews() {
  try {
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return [];
  }
}

function writeReviews(reviews) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
  } catch (error) {
    console.error('Error writing reviews:', error);
  }
}

export function getReviewsByProduct(productId) {
  const reviews = readReviews();
  return reviews.filter(r => r.productId === productId);
}

export function getReviewById(id) {
  const reviews = readReviews();
  return reviews.find(r => r.id === id);
}

export function getReviewsByUser(userId) {
  const reviews = readReviews();
  return reviews.filter(r => r.userId === userId);
}

export function addReview(reviewData) {
  const reviews = readReviews();
  const newReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    helpfulCount: 0,
    reported: false,
    media: [],
    date: new Date().toISOString(),
    ...reviewData,
  };
  reviews.push(newReview);
  writeReviews(reviews);
  return newReview;
}

export function updateReview(id, reviewData) {
  const reviews = readReviews();
  const index = reviews.findIndex(r => r.id === id);
  if (index === -1) return null;
  reviews[index] = {
    ...reviews[index],
    ...reviewData,
    // prevent updating ID, productId, userId
    id: reviews[index].id,
    productId: reviews[index].productId,
    userId: reviews[index].userId,
  };
  writeReviews(reviews);
  return reviews[index];
}

export function deleteReview(id) {
  const reviews = readReviews();
  const filtered = reviews.filter(r => r.id !== id);
  if (reviews.length === filtered.length) return false;
  writeReviews(filtered);
  return true;
}

export function incrementHelpful(id) {
  const reviews = readReviews();
  const review = reviews.find(r => r.id === id);
  if (!review) return null;
  review.helpfulCount = (review.helpfulCount || 0) + 1;
  writeReviews(reviews);
  return review;
}

export function reportReview(id, reason) {
  const reviews = readReviews();
  const review = reviews.find(r => r.id === id);
  if (!review) return null;
  review.reported = true;
  review.reportReason = reason;
  writeReviews(reviews);
  return review;
}
