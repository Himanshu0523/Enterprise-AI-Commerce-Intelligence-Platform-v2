import axios from 'axios';

const API_BASE = '/api/visual-search';

/** Upload an image for visual search */
export const searchByImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  return axios.post(`${API_BASE}/search`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** Search by image URL */
export const searchByImageUrl = async (imageUrl) => {
  return axios.post(`${API_BASE}/search-url`, { imageUrl });
};

/** Get similar products by image embedding */
export const findSimilarByEmbedding = async (productId) => {
  return axios.get(`${API_BASE}/similar/${productId}`);
};
