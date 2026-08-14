import '@/types/product';

const STORAGE_KEY = 'user_reviews';

/**
 * @param {string} productId
 * @returns {import('@/types/product').Review[]}
 */
function getUserReviews(productId) {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const all = JSON.parse(data);
    return all[productId] || [];
  } catch {
    return [];
  }
}

/**
 * @param {string} productId
 * @param {import('@/types/product').Review[]} reviews
 */
function saveUserReviews(productId, reviews) {
  if (typeof window === 'undefined') return;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const all = data ? JSON.parse(data) : {};
    all[productId] = reviews;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

/**
 * @param {string} productId
 * @param {import('@/types/product').Review[]} [staticReviews=[]]
 * @returns {import('@/types/product').Review[]}
 */
export function getProductReviews(productId, staticReviews = []) {
  const userReviews = getUserReviews(productId);
  return [...staticReviews, ...userReviews];
}

/**
 * @param {string} productId
 * @param {Omit<import('@/types/product').Review, 'id'>} review
 * @param {import('@/types/product').Review[]} [staticReviews=[]]
 * @returns {import('@/types/product').Review[]}
 */
export function addProductReview(productId, review, staticReviews = []) {
  const userReviews = getUserReviews(productId);
  const newReview = {
    ...review,
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
  };
  const updated = [...userReviews, newReview];
  saveUserReviews(productId, updated);
  return [...staticReviews, ...updated];
}

/**
 * @param {import('@/types/product').Review[]} reviews
 * @returns {{ rating: number; count: number }}
 */
export function calculateRatingStats(reviews) {
  if (reviews.length === 0) return { rating: 0, count: 0 };
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    rating: Number((total / reviews.length).toFixed(1)),
    count: reviews.length,
  };
}