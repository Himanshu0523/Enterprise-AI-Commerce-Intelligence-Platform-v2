const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

export async function getAuthenticatedUser(request) {
  const authorization = request.headers.get('authorization') || '';
  if (!authorization.startsWith('Bearer ')) return null;

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: authorization.slice(7) }),
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result.valid && result.user ? result.user : null;
  } catch {
    return null;
  }
}
