'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/contexts/CartContext';

/**
 * Checkout Review Page Component
 */
export default function CheckoutPage() {
  const { items, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block text-indigo-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Cart items */}
      <div className="flex-1">
        <h2 className="mb-4 text-xl font-semibold">Review Your Order</h2>
        <ul className="divide-y rounded-lg border bg-white">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Order summary */}
      <div className="lg:w-80">
        <div className="rounded-lg bg-gray-50 p-6 shadow-sm border">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items ({items.length})</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Calculated next step</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          <Link
            href="/checkout/shipping"
            className="mt-4 block w-full rounded bg-indigo-600 py-2 text-center text-white hover:bg-indigo-700 font-medium"
          >
            Proceed to Shipping
          </Link>
        </div>
      </div>
    </div>
  );
}