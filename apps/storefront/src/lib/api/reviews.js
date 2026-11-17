// src/lib/api/reviews.js
import { apiClient } from './client';

/**
 * Fetch reviews for a specific product
 * @param {string} productId 
 * @param {Object} [params] Optional sorting and query filters
 * @returns {Promise<Array>}
 */
export async function getProductReviews(productId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/reviews/product/${productId}${query ? `?${query}` : ''}`;
  const response = await apiClient(endpoint);
  return { ...response, reviews: (response.reviews || []).map((review) => ({ ...review, id: review._id || review.id, author: review.userName || 'Account', date: review.createdAt, helpfulCount: review.helpfulVotes || 0, isVerifiedPurchase: Boolean(review.verifiedPurchase), media: review.images || [] })), pagination: { page: response.page || 1, limit: Number(params.limit || 5), total: response.total || 0, totalPages: response.pages || 1 } };
}

/**
 * Fetch review summary (average rating, count, distribution) for a specific product
 * @param {string} productId 
 * @returns {Promise<Object>}
 */
export async function getProductReviewSummary(productId) {
  return apiClient(`/reviews/product/${productId}/summary`);
}

/**
 * Create a new review
 * @param {Object} reviewData 
 * @returns {Promise<Object>}
 */
export async function createReview(reviewData) {
  return apiClient('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

/**
 * Update an existing review
 * @param {string} reviewId 
 * @param {Object} reviewData 
 * @returns {Promise<Object>}
 */
export async function updateReview(reviewId, reviewData) {
  return apiClient(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  });
}

/**
 * Delete a review
 * @param {string} reviewId 
 * @returns {Promise<Object>}
 */
export async function deleteReview(reviewId) {
  return apiClient(`/reviews/${reviewId}`, {
    method: 'DELETE',
  });
}

/**
 * Mark a review as helpful
 * @param {string} reviewId 
 * @returns {Promise<Object>}
 */
export async function markHelpful(reviewId) {
  return apiClient(`/reviews/${reviewId}/helpful`, {
    method: 'POST',
  });
}

/**
 * Get reviews written by the currently logged-in user
 * @returns {Promise<Array>}
 */
export async function getUserReviews() {
  const response = await apiClient('/reviews/user');
  return (response.reviews || []).map((review) => ({ ...review, id: review._id || review.id, author: review.userName || 'Account', date: review.createdAt, helpfulCount: review.helpfulVotes || 0, isVerifiedPurchase: Boolean(review.verifiedPurchase) }));
}

