'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useCart } from './CartContext';

/**
 * @typedef {Object} ShippingAddress
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} address
 * @property {string} city
 * @property {string} state
 * @property {string} zip
 * @property {string} country
 * @property {string} phone
 */

/**
 * @typedef {Object} CheckoutState
 * @property {ShippingAddress | null} shippingAddress
 * @property {string | null} shippingMethod
 * @property {string | null} paymentMethod
 * @property {string | null} orderId
 * @property {boolean} isPlacingOrder
 */

/**
 * @typedef {Object} CheckoutContextType
 * @property {CheckoutState} state
 * @property {(address: ShippingAddress) => void} setShippingAddress
 * @property {(method: string) => void} setShippingMethod
 * @property {(method: string) => void} setPaymentMethod
 * @property {() => Promise<string>} placeOrder
 * @property {() => void} clearCheckout
 */

/** @type {React.Context<CheckoutContextType | undefined>} */
const CheckoutContext = createContext(undefined);

const STORAGE_KEY = 'checkout_state';

/**
 * Checkout Provider Component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function CheckoutProvider({ children }) {
  const { clearCart } = useCart();
  const [state, setState] = useState(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return {
      shippingAddress: null,
      shippingMethod: null,
      paymentMethod: null,
      orderId: null,
      isPlacingOrder: false,
    };
  });

  // Save state to localStorage when it changes
  const updateState = useCallback((newState) => {
    setState((prev) => {
      const updated = { ...prev, ...newState };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setShippingAddress = useCallback((address) => {
    updateState({ shippingAddress: address });
  }, [updateState]);

  const setShippingMethod = useCallback((method) => {
    updateState({ shippingMethod: method });
  }, [updateState]);

  const setPaymentMethod = useCallback((method) => {
    updateState({ paymentMethod: method });
  }, [updateState]);

  const placeOrder = useCallback(async () => {
    // Prevent double submission
    if (state.isPlacingOrder) {
      throw new Error('Order already being placed');
    }

    // Validate required fields
    if (!state.shippingAddress) {
      throw new Error('Shipping address required');
    }
    if (!state.shippingMethod) {
      throw new Error('Shipping method required');
    }
    if (!state.paymentMethod) {
      throw new Error('Payment method required');
    }

    updateState({ isPlacingOrder: true });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate fake order ID
    const orderId = 'ORD-' + Date.now().toString().slice(-6) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    // Clear cart
    clearCart();

    // Save order ID and reset order placing flag
    updateState({
      orderId,
      isPlacingOrder: false,
    });

    return orderId;
  }, [state, updateState, clearCart]);

  const clearCheckout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      shippingAddress: null,
      shippingMethod: null,
      paymentMethod: null,
      orderId: null,
      isPlacingOrder: false,
    });
  }, []);

  return (
    <CheckoutContext.Provider
      value={{
        state,
        setShippingAddress,
        setShippingMethod,
        setPaymentMethod,
        placeOrder,
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

/**
 * Custom hook to use Checkout Context
 * @returns {CheckoutContextType}
 */
export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}