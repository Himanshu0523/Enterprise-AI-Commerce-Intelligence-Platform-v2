import axios from 'axios';

const API_BASE = '/api/ml';

/** Get personalized product recommendations */
export const getRecommendations = async (userId, limit = 8) => {
  return axios.get(`${API_BASE}/recommendations`, { params: { userId, limit } });
};

/** Get "Customers Also Bought" for a product */
export const getAlsoBought = async (productId, limit = 4) => {
  return axios.get(`${API_BASE}/also-bought/${productId}`, { params: { limit } });
};

/** Get similar products */
export const getSimilarProducts = async (productId, limit = 4) => {
  return axios.get(`${API_BASE}/similar/${productId}`, { params: { limit } });
};

/** Get trending products */
export const getTrendingProducts = async (limit = 8) => {
  return axios.get(`${API_BASE}/trending`, { params: { limit } });
};

/** Get customer segments for analytics */
export const getCustomerSegments = async () => {
  return axios.get(`${API_BASE}/segments`);
};

/** Get sales predictions */
export const getSalesPredictions = async (range = '30d') => {
  return axios.get(`${API_BASE}/predictions/sales`, { params: { range } });
};

/** Get recommendation performance metrics */
export const getRecommendationMetrics = async () => {
  return axios.get(`${API_BASE}/metrics/recommendations`);
};

/** Get trend analysis */
export const getTrendAnalysis = async (category = null) => {
  return axios.get(`${API_BASE}/trends`, { params: { category } });
};
