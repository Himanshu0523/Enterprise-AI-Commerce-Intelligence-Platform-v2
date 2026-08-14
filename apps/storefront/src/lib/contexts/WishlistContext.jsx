'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * @typedef {Object} WishlistContextType
 * @property {string[]} items - product IDs
 * @property {(productId: string) => void} toggleItem
 * @property {(productId: string) => void} addItem
 * @property {(productId: string) => void} removeItem
 * @property {(productId: string) => boolean} isInWishlist
 */

/** @type {React.Context<WishlistContextType | undefined>} */
const WishlistContext = createContext(undefined);

const WISHLIST_STORAGE_KEY = 'wishlist_ids';

/**
 * Wishlist Provider Component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function WishlistProvider({ children }) {
  // Initialize state lazily from localStorage to avoid calling setState inside an effect
  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} */
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [isInitialized, setIsInitialized] = useState(true);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = useCallback((productId) => {
    setItems((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((id) => id !== productId));
  }, []);

  const toggleItem = useCallback((productId) => {
    setItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback((productId) => {
    return items.includes(productId);
  }, [items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleItem,
        addItem,
        removeItem,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

/**
 * Custom hook to use Wishlist Context
 * @returns {WishlistContextType}
 */
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}