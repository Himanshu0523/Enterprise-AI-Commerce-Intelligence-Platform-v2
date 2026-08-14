// src/lib/api/client.js
const API_BASE_URL = process.env.API_BASE_URL || '/api';

/**
 * @typedef {Object} FetchOptions
 * @extends {RequestInit}
 * @property {Record<string, string>} [headers]
 */

/**
 * Generic API fetch wrapper
 * @template T
 * @param {string} endpoint 
 * @param {FetchOptions} [options={}]
 * @returns {Promise<T>}
 */
export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}