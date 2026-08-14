'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCheckout } from '@/lib/contexts/CheckoutContext';
import { CheckCircle } from 'lucide-react';



export default function ConfirmationPage() {
  const { state } = useCheckout();
  const params = useParams();
  const orderId = params?.orderId;
  const router = useRouter();


  useEffect(() => {
    if (!state.orderId || state.orderId !== orderId) {
      router.push('/');
    }
  }, [state.orderId, orderId, router]);

  if (!state.orderId || state.orderId !== orderId) {
    return null; 
  }

  return (
    <div className="py-12 text-center bg-white p-6 rounded-lg border shadow-sm">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-3xl font-bold">Thank You for Your Order!</h1>
      <p className="mt-2 text-gray-600">
        Your order has been placed successfully.
      </p>
      <p className="mt-1 text-lg font-semibold">
        Order ID: <span className="text-indigo-600">{orderId}</span>
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-lg border bg-gray-50 p-6 text-left shadow-sm">
        <h2 className="font-semibold text-lg">Order Summary</h2>
        <div className="mt-3 space-y-2 text-sm text-gray-700">
          <p><strong>Shipping:</strong> {state.shippingMethod}</p>
          <p><strong>Payment:</strong> {state.paymentMethod}</p>
          <p><strong>Address:</strong> {state.shippingAddress?.address}, {state.shippingAddress?.city}</p>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          We&apos;ll send a confirmation email to your registered email address.
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/"
          className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 font-medium"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="rounded border border-gray-300 px-6 py-2 hover:bg-gray-50 font-medium text-gray-700"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}