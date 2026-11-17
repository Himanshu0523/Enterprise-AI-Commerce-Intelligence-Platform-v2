const rawUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || '/api';
const normalizedUrl = rawUrl.replace(/\/+$/, '');
const apiRoot = normalizedUrl.endsWith('/api/storefront')
  ? normalizedUrl.slice(0, -'/storefront'.length)
  : normalizedUrl.endsWith('/api')
    ? normalizedUrl
    : `${normalizedUrl}/api`;
const API_BASE_URL = `${apiRoot}/storefront`;
const AUTH_BASE_URL = `${apiRoot}/auth`;

async function readResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json() : response.text();
}

async function refreshAccessToken() {
  if (typeof window === 'undefined') return null;
  const refreshToken = localStorage.getItem('auth_refresh_token');
  if (!refreshToken) return null;

  const response = await fetch(`${AUTH_BASE_URL}/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await readResponse(response);
  if (!response.ok || !data.accessToken || !data.refreshToken) {
    localStorage.removeItem('auth_access_token');
    localStorage.removeItem('auth_refresh_token');
    localStorage.removeItem('auth_user');
    return null;
  }
  localStorage.setItem('auth_access_token', data.accessToken);
  localStorage.setItem('auth_refresh_token', data.refreshToken);
  return data.accessToken;
}

export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const makeHeaders = (token) => ({
    ...(!isFormData && options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  });

  let token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
  let response = await fetch(url, { ...options, headers: makeHeaders(token) });

  if (response.status === 401 && typeof window !== 'undefined') {
    token = await refreshAccessToken();
    if (token) response = await fetch(url, { ...options, headers: makeHeaders(token) });
  }

  const data = await readResponse(response);
  if (!response.ok) {
    const message = typeof data === 'string' ? data : data.error?.message || data.msg || data.message || data.error;
    throw new Error(message || `API request failed with status ${response.status}`);
  }
  return data;
}