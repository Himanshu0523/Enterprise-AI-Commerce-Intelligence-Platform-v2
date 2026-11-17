const rawUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || '/api';
const API_BASE_URL = (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('/'))
  ? rawUrl
  : `http://${rawUrl}`;

export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(!isFormData && options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data.msg || data.message || data.error;
    throw new Error(message || `API request failed with status ${response.status}`);
  }
  return data;
}