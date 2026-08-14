'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, ArrowRight, Download, Share2 } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const orderId = searchParams.get('orderId') || `ORD-${Date.now().toString().slice(-8)}`;
  const amount = searchParams.get('amount') || '0.00';

  useEffect(() => {
    // Clear cart after successful payment
    clearCart?.();
  }, []);

  const estimatedDelivery = new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg text-center">

        {/* Animated Success Icon */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full bg-emerald-100 dark:bg-emerald-500/20" />
          <CheckCircle className="relative z-10 h-14 w-14 text-emerald-500" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Payment Successful!
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400 text-base">
          Thank you for your order. We've received your payment and are preparing your items.
        </p>

        {/* Order Info Card */}
        <div className="mt-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-left overflow-hidden">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border-b border-emerald-100 dark:border-emerald-500/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Order Confirmed</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">#{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Amount Paid</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${parseFloat(amount).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                <Package size={18} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Order Status</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Processing & Packing</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                <Truck size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{estimatedDelivery}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation email note */}
        <p className="mt-5 text-sm text-gray-400 dark:text-gray-500">
          A confirmation email has been sent to your registered email address.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/account/orders`}
            className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
          >
            View My Orders <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Download size={16} /> Download Receipt
          </button>
        </div>

        <div className="mt-4">
          <Link
            href="/products"
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
