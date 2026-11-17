'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(undefined);
const ACCESS_KEY = 'auth_access_token';
const REFRESH_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

async function authRequest(path, payload, accessToken) {
  const response = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.msg || data.message || data.error || 'Authentication request failed.');
  }
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingMfa, setPendingMfa] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const accessToken = localStorage.getItem(ACCESS_KEY);
      if (storedUser && accessToken) setUser(JSON.parse(storedUser));
      else {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistSession = useCallback((session, fallbackUser) => {
    if (!session.accessToken || !session.refreshToken) {
      throw new Error('The authentication service did not return a valid token pair.');
    }
    const nextUser = session.user || fallbackUser;
    if (!nextUser) throw new Error('The authentication service did not return user details.');
    localStorage.setItem(ACCESS_KEY, session.accessToken);
    localStorage.setItem(REFRESH_KEY, session.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setPendingMfa(null);
    return nextUser;
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authRequest('login', { email: email.trim().toLowerCase(), password });
      if (data.requireMFA) {
        setPendingMfa({ userId: data.userId, email: email.trim().toLowerCase() });
        return { requiresMfa: true };
      }
      persistSession(data);
      return { requiresMfa: false };
    } finally {
      setIsLoading(false);
    }
  }, [persistSession]);

  const verifyMfa = useCallback(async (token) => {
    if (!pendingMfa?.userId) throw new Error('Your verification session has expired. Please sign in again.');
    setIsLoading(true);
    try {
      const data = await authRequest('mfa/verify-login', { userId: pendingMfa.userId, token });
      const fallbackUser = {
        id: pendingMfa.userId,
        email: pendingMfa.email,
        name: pendingMfa.email.split('@')[0],
      };
      return persistSession(data, fallbackUser);
    } finally {
      setIsLoading(false);
    }
  }, [pendingMfa, persistSession]);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authRequest('register', { name: name.trim(), email: email.trim().toLowerCase(), password });
      persistSession(data);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, [persistSession]);

  const completeOAuthSession = useCallback(async (accessToken, refreshToken) => {
    if (!accessToken || !refreshToken) throw new Error('OAuth did not return a complete token pair.');
    const data = await authRequest('validate', { token: accessToken });
    if (!data.valid || !data.user) throw new Error('The OAuth session could not be validated.');
    return persistSession({
      accessToken,
      refreshToken,
      user: { id: data.user.id, email: data.user.email, name: data.user.name || data.user.email?.split('@')[0] || 'Account', roles: data.user.roles || [] },
    });
  }, [persistSession]);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    const accessToken = localStorage.getItem(ACCESS_KEY);
    try {
      if (refreshToken && accessToken) {
        await authRequest('logout', { refreshToken }, accessToken);
      }
    } finally {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setPendingMfa(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, verifyMfa, pendingMfa, completeOAuthSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}