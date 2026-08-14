// src/lib/hooks/useRecentlyViewed.js
'use client';

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'recently_viewed';
const MAX_RECENT = 10;

/**
 * Custom hook to manage recently viewed products with localStorage persistence
 * @returns {Object}
 */
export function useRecentlyViewed() {
  // Initialize state directly from localStorage to avoid synchronous setState in an effect
  const [ids, setIds] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore parsing error
    }
    return [];
  });

  const add = useCallback((productId) => {
    setIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const newIds = [productId, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      } catch {
        // ignore storage error
      }
      return newIds;
    });
  }, []);

  const clear = useCallback(() => {
    setIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage error
    }
  }, []);

  return { ids, add, clear };
}