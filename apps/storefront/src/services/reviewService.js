import axios from 'axios';

const API_BASE = '/api/reviews';

/** Get reviews for a product */
export const getProductReviews = async (productId, params = {}) => {
  return axios.get(`${API_BASE}/product/${productId}`, { params });
};

/** Get a single review by ID */
export const getReviewById = async (reviewId) => {
  return axios.get(`${API_BASE}/${reviewId}`);
};

/** Create a new review */
export const createReview = async (productId, reviewData) => {
  return axios.post(API_BASE, { productId, ...reviewData });
};

/** Update an existing review */
export const updateReview = async (reviewId, reviewData) => {
  return axios.put(`${API_BASE}/${reviewId}`, reviewData);
};

/** Delete a review */
export const deleteReview = async (reviewId) => {
  return axios.delete(`${API_BASE}/${reviewId}`);
};

/** Upload review media (photos/videos) */
export const uploadReviewMedia = async (reviewId, formData) => {
  return axios.post(`${API_BASE}/${reviewId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** Get review summary/stats for a product */
export const getReviewSummary = async (productId) => {
  return axios.get(`${API_BASE}/product/${productId}/summary`);
};

/** Mark review as helpful */
export const markHelpful = async (reviewId) => {
  return axios.post(`${API_BASE}/${reviewId}/helpful`);
};

/** Report a review */
export const reportReview = async (reviewId, reason) => {
  return axios.post(`${API_BASE}/${reviewId}/report`, { reason });
};

/** Get reviews written by the current user */
export const getUserReviews = async () => {
  return axios.get(`${API_BASE}/user`);
};
