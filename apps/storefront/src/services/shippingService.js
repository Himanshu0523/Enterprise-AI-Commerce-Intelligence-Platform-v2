import axios from 'axios';

const API_BASE = '/api/shipping';

/** Get available shipping methods for a given address */
export const getShippingMethods = async (addressData) => {
  return axios.post(`${API_BASE}/methods`, addressData);
};

/** Calculate shipping cost */
export const calculateShipping = async (orderId, methodId) => {
  return axios.post(`${API_BASE}/calculate`, { orderId, methodId });
};

/** Track shipment by order ID */
export const trackShipment = async (orderId) => {
  return axios.get(`${API_BASE}/track/${orderId}`);
};

/** Get tracking details by tracking number */
export const getTrackingByNumber = async (trackingNumber) => {
  return axios.get(`${API_BASE}/tracking/${trackingNumber}`);
};

/** Get estimated delivery date */
export const getEstimatedDelivery = async (pincode, methodId) => {
  return axios.get(`${API_BASE}/estimate`, { params: { pincode, methodId } });
};

/** Check serviceability for a pincode */
export const checkServiceability = async (pincode) => {
  return axios.get(`${API_BASE}/serviceability/${pincode}`);
};

/** Get return shipping label */
export const getReturnLabel = async (orderId) => {
  return axios.get(`${API_BASE}/return-label/${orderId}`, { responseType: 'blob' });
};
