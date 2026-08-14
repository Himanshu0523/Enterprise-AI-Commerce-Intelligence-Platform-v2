import axios from 'axios'; // or use fetch

export const getUserOrders = async () => {
  // Replace with your actual endpoint
  return axios.get('/api/orders/user');
};

export const getOrderById = async (id) => {
  return axios.get(`/api/orders/${id}`);
};

export const getAllOrders = async () => {
  // For admin
  return axios.get('/api/orders');
};