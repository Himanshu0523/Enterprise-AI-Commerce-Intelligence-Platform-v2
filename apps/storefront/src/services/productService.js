import axios from 'axios';

export const getProducts = async () => {
  return axios.get('/api/products');
};

export const createProduct = async (product) => {
  return axios.post('/api/products', product);
};

export const updateProduct = async (id, product) => {
  return axios.put(`/api/products/${id}`, product);
};

export const deleteProduct = async (id) => {
  return axios.delete(`/api/products/${id}`);
};