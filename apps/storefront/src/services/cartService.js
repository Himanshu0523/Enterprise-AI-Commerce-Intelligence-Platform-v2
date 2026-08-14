import axios from 'axios';

const API_BASE = '/api/cart';

/** Get user's cart */
export const getCart = async () => {
  return axios.get(API_BASE);
};

/** Add item to cart */
export const addToCart = async (productId, quantity = 1, variant = null) => {
  return axios.post(API_BASE, { productId, quantity, variant });
};

/** Update cart item quantity */
export const updateCartItem = async (itemId, quantity) => {
  return axios.put(`${API_BASE}/${itemId}`, { quantity });
};

/** Remove item from cart */
export const removeCartItem = async (itemId) => {
  return axios.delete(`${API_BASE}/${itemId}`);
};

/** Clear entire cart */
export const clearCart = async () => {
  return axios.delete(API_BASE);
};

/** Move item to "Save for Later" */
export const saveForLater = async (itemId) => {
  return axios.post(`${API_BASE}/${itemId}/save-later`);
};

/** Get saved-for-later items */
export const getSavedItems = async () => {
  return axios.get(`${API_BASE}/saved`);
};

/** Move saved item back to cart */
export const moveToCart = async (itemId) => {
  return axios.post(`${API_BASE}/saved/${itemId}/move-to-cart`);
};

/** Apply coupon to cart */
export const applyCoupon = async (couponCode) => {
  return axios.post(`${API_BASE}/coupon`, { code: couponCode });
};

/** Remove coupon from cart */
export const removeCoupon = async () => {
  return axios.delete(`${API_BASE}/coupon`);
};

/** Get cart summary (totals, taxes, discounts) */
export const getCartSummary = async () => {
  return axios.get(`${API_BASE}/summary`);
};
