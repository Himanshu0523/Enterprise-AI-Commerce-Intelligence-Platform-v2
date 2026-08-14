// src/lib/contexts/AuthContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User | null} user
 * @property {boolean} isLoading
 * @property {(email: string, password: string) => Promise<void>} login
 * @property {(name: string, email: string, password: string) => Promise<void>} register
 * @property {() => void} logout
 */

/** @type {React.Context<AuthContextType | undefined>} */
const AuthContext = createContext(undefined);

const USER_STORAGE_KEY = 'auth_user';

/**
 * Auth Provider Component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function AuthProvider({ children }) {
  // Initialize state lazily from localStorage to avoid calling setState inside an effect
  /** @type {[User | null, React.Dispatch<React.SetStateAction<User | null>>]} */
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Save user to localStorage and manage cookie whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      document.cookie = 'auth_token=dummy; path=/; max-age=86400'; // 1 day
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Dummy validation – any email/password works
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Mock user
    setUser({
      id: 'user_1',
      name: email.split('@')[0] || 'User',
      email,
    });
  }, []);

  const register = useCallback(async (name, email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    // Mock user
    setUser({
      id: 'user_' + Date.now(),
      name,
      email,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use Auth Context
 * @returns {AuthContextType}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}