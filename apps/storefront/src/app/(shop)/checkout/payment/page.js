'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/lib/contexts/CheckoutContext';


export default function PaymentPage() {
  const { state, setPaymentMethod, placeOrder } = useCheckout();
  const router = useRouter();

  const [paymentMethod, setPaymentMethodState] = useState(
    state.paymentMethod || 'card'
  );
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [expiry, setExpiry] = useState('12/25');
  const [cvv, setCvv] = useState('123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    // Save payment method
    setPaymentMethod(paymentMethod);

    try {
      setIsSubmitting(true);
      const orderId = await placeOrder();
      router.push(`/checkout/confirmation/${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-3 rounded border p-3 cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethodState('card')}
              className="h-4 w-4 text-indigo-600"
            />
            <span className="font-medium">Credit / Debit Card</span>
          </label>
          <label className="flex items-center gap-3 rounded border p-3 cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethodState('paypal')}
              className="h-4 w-4 text-indigo-600"
            />
            <span className="font-medium">PayPal</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="rounded-lg border p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              placeholder="4111 1111 1111 1111"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                placeholder="123"
              />
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.push('/checkout/shipping')}
          className="rounded border border-gray-300 px-6 py-2 hover:bg-gray-50"
        >
          Back to Shipping
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50 font-medium"
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </form>
  );
}