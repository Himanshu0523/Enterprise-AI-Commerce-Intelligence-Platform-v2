'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

/**
 * @typedef {Object} CartItem
 * @property {string} productId
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {number} quantity
 */

/**
 * @typedef {Object} CartContextType
 * @property {CartItem[]} items
 * @property {(product: Omit<CartItem, 'quantity'>, quantity?: number) => void} addItem
 * @property {(productId: string) => void} removeItem
 * @property {(productId: string, quantity: number) => void} updateQuantity
 * @property {() => void} clearCart
 * @property {() => number} getTotalItems
 * @property {() => number} getTotalPrice
 */

/** @type {React.Context<CartContextType|undefined>} */
const CartContext = createContext(undefined);

const CART_STORAGE_KEY = 'cart_items';

/**
 * Helper to safely load initial cart items from localStorage.
 * @returns {CartItem[]}
 */
function getInitialCartItems() {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
    }
  }
  return [];
}

/**
 * Cart Provider Component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(getInitialCartItems);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}