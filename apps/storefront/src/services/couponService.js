import axios from 'axios';

const API_BASE = '/api/coupons';

/** Get all available coupons for the current user */
export const getAvailableCoupons = async () => {
  return axios.get(API_BASE);
};

/** Validate a coupon code */
export const validateCoupon = async (code, cartTotal = 0) => {
  return axios.post(`${API_BASE}/validate`, { code, cartTotal });
};

/** Get coupon details by code */
export const getCouponByCode = async (code) => {
  return axios.get(`${API_BASE}/code/${code}`);
};

/** Get user's coupon history */
export const getCouponHistory = async () => {
  return axios.get(`${API_BASE}/history`);
};

/** Get active promotions / campaigns */
export const getActivePromotions = async () => {
  return axios.get(`${API_BASE}/promotions`);
};

/** Get user's reward points balance */
export const getRewardsBalance = async () => {
  return axios.get(`${API_BASE}/rewards`);
};

/** Redeem reward points for a coupon */
export const redeemRewards = async (points) => {
  return axios.post(`${API_BASE}/rewards/redeem`, { points });
};

/** Get gift cards */
export const getGiftCards = async () => {
  return axios.get(`${API_BASE}/gift-cards`);
};

/** Redeem gift card */
export const redeemGiftCard = async (code) => {
  return axios.post(`${API_BASE}/gift-cards/redeem`, { code });
};
