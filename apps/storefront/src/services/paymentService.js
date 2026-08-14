import axios from 'axios';

const API_BASE = '/api/payments';

/** Initiate a payment for an order */
export const initiatePayment = async (orderId, paymentMethod, paymentDetails = {}) => {
  return axios.post(API_BASE, { orderId, paymentMethod, ...paymentDetails });
};

/** Verify payment status */
export const verifyPayment = async (paymentId) => {
  return axios.get(`${API_BASE}/${paymentId}/verify`);
};

/** Get payment by ID */
export const getPaymentById = async (paymentId) => {
  return axios.get(`${API_BASE}/${paymentId}`);
};

/** Get all payments for a user */
export const getUserPayments = async () => {
  return axios.get(`${API_BASE}/user`);
};

/** Get payment for a specific order */
export const getPaymentByOrder = async (orderId) => {
  return axios.get(`${API_BASE}/order/${orderId}`);
};

/** Request refund */
export const requestRefund = async (paymentId, reason) => {
  return axios.post(`${API_BASE}/${paymentId}/refund`, { reason });
};

/** Get refund status */
export const getRefundStatus = async (refundId) => {
  return axios.get(`${API_BASE}/refund/${refundId}`);
};

/** Get available payment methods */
export const getPaymentMethods = async () => {
  return axios.get(`${API_BASE}/methods`);
};

/** Save payment method for future use */
export const savePaymentMethod = async (methodData) => {
  return axios.post(`${API_BASE}/methods/save`, methodData);
};

/** Delete saved payment method */
export const deleteSavedPaymentMethod = async (methodId) => {
  return axios.delete(`${API_BASE}/methods/${methodId}`);
};

/** Get saved payment methods */
export const getSavedPaymentMethods = async () => {
  return axios.get(`${API_BASE}/methods/saved`);
};

/** Download invoice PDF */
export const downloadInvoice = async (orderId) => {
  return axios.get(`${API_BASE}/invoice/${orderId}`, { responseType: 'blob' });
};
