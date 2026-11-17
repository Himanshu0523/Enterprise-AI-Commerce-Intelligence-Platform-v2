'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useCart } from './CartContext';
import { apiClient } from '@/lib/api/client';

const CheckoutContext = createContext(undefined);
const STORAGE_KEY = 'checkout_state';
const SHIPPING_FEES = { standard: 5.99, express: 12.99, overnight: 24.99 };

function readSavedState() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

export function CheckoutProvider({ children }) {
  const { items, clearCart } = useCart();
  const [state, setState] = useState(() => ({
    shippingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
    orderId: null,
    isPlacingOrder: false,
    ...readSavedState(),
  }));

  const updateState = useCallback((patch) => {
    setState((previous) => {
      const next = { ...previous, ...patch };
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setShippingAddress = useCallback((shippingAddress) => updateState({ shippingAddress }), [updateState]);
  const setShippingMethod = useCallback((shippingMethod) => updateState({ shippingMethod }), [updateState]);
  const setPaymentMethod = useCallback((paymentMethod) => updateState({ paymentMethod }), [updateState]);

  const placeOrder = useCallback(async (paymentMethodOverride) => {
    if (state.isPlacingOrder) throw new Error('An order submission is already in progress.');
    if (!items.length) throw new Error('Your bag is empty.');
    const selectedPaymentMethod = paymentMethodOverride || state.paymentMethod;
    if (!state.shippingAddress || !state.shippingMethod || !selectedPaymentMethod) {
      throw new Error('Complete shipping and payment details before placing the order.');
    }

    updateState({ isPlacingOrder: true });
    try {
      const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
      const shippingFee = SHIPPING_FEES[state.shippingMethod] ?? 0;
      const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'order-' + Date.now() + '-' + Math.random().toString(36).slice(2);

      const result = await apiClient('/orders', {
        method: 'POST',
        headers: { 'X-Idempotency-Key': idempotencyKey },
        body: JSON.stringify({
          items: items.map(({ productId, name, price, image, quantity }) => ({ productId, title: name, price, image, quantity })),
          shippingAddress: {
            fullName: [state.shippingAddress.firstName, state.shippingAddress.lastName].filter(Boolean).join(' '),
            addressLine1: state.shippingAddress.address,
            addressLine2: state.shippingAddress.addressLine2 || '',
            city: state.shippingAddress.city,
            state: state.shippingAddress.state,
            postalCode: state.shippingAddress.zip,
            country: state.shippingAddress.country,
            phone: state.shippingAddress.phone,
          },
          shippingMethod: state.shippingMethod,
          paymentMethod: selectedPaymentMethod,
          subtotal,
          tax: 0,
          shippingFee,
          discount: 0,
        }),
      });

      const order = result.data || result.order || result;
      const orderId = order.orderNumber || order._id || order.id;
      if (!orderId) throw new Error('The order service did not return an order reference.');

      updateState({ orderId, paymentMethod: selectedPaymentMethod, isPlacingOrder: false, orderStatus: order.orderStatus || 'PENDING' });
      clearCart();
      return orderId;
    } catch (error) {
      updateState({ isPlacingOrder: false });
      throw error;
    }
  }, [items, state, updateState, clearCart]);

  const clearCheckout = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    setState({ shippingAddress: null, shippingMethod: null, paymentMethod: null, orderId: null, isPlacingOrder: false });
  }, []);

  return <CheckoutContext.Provider value={{ state, setShippingAddress, setShippingMethod, setPaymentMethod, placeOrder, clearCheckout }}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error('useCheckout must be used within a CheckoutProvider');
  return context;
}
