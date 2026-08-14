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
  return apiClient(endpoint);
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
 * Report a review
 * @param {string} reviewId 
 * @param {string} reason 
 * @returns {Promise<Object>}
 */
export async function reportReview(reviewId, reason) {
  return apiClient(`/reviews/${reviewId}/report`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

/**
 * Get reviews written by the currently logged-in user
 * @returns {Promise<Array>}
 */
export async function getUserReviews() {
  return apiClient('/reviews/user');
}

/**
 * Get details of a single review
 * @param {string} reviewId 
 * @returns {Promise<Object>}
 */
export async function getReviewById(reviewId) {
  return apiClient(`/reviews/${reviewId}`);
}

/**
 * Upload media files (photos/videos) for a review
 * @param {string} reviewId 
 * @param {FormData} formData 
 * @returns {Promise<Object>}
 */
export async function uploadReviewMedia(reviewId, formData) {
  return apiClient(`/reviews/${reviewId}/media`, {
    method: 'POST',
    body: formData,
  });
}
