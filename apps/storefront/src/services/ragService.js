import axios from 'axios';

const API_BASE = '/api/rag';

/** Send a message to the AI assistant chatbot */
export const sendMessage = async (message, conversationId = null) => {
  return axios.post(`${API_BASE}/chat`, { message, conversationId });
};

/** Get conversation history */
export const getConversation = async (conversationId) => {
  return axios.get(`${API_BASE}/chat/${conversationId}`);
};

/** Ask a product-specific question */
export const askProductQuestion = async (productId, question) => {
  return axios.post(`${API_BASE}/product-qa`, { productId, question });
};

/** Get AI-generated product summary */
export const getProductSummary = async (productId) => {
  return axios.get(`${API_BASE}/product-summary/${productId}`);
};

/** Search knowledge base (FAQs, policies, etc.) */
export const searchKnowledge = async (query) => {
  return axios.get(`${API_BASE}/search`, { params: { query } });
};

/** Get FAQ suggestions based on context */
export const getFaqSuggestions = async (context = 'general') => {
  return axios.get(`${API_BASE}/faqs`, { params: { context } });
};

/** Get order-specific help */
export const getOrderHelp = async (orderId, question) => {
  return axios.post(`${API_BASE}/order-help`, { orderId, question });
};

/** Generate business report (admin) */
export const generateReport = async (reportType, params = {}) => {
  return axios.post(`${API_BASE}/reports`, { reportType, ...params });
};
