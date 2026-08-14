'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, RefreshCw, ArrowLeft, ShieldAlert, HelpCircle, Phone, MessageSquare } from 'lucide-react';

const FAILURE_REASONS = {
  card_declined: {
    title: 'Card Declined',
    description: 'Your card was declined by the issuing bank. Please try a different payment method or contact your bank.',
    tips: ['Ensure your card details are correct', 'Check if you have sufficient funds', 'Try a different card', 'Contact your bank'],
  },
  insufficient_funds: {
    title: 'Insufficient Funds',
    description: 'Your card has insufficient balance to complete this transaction.',
    tips: ['Use a card with sufficient balance', 'Try a debit/UPI payment', 'Pay with a different card'],
  },
  network_error: {
    title: 'Network Error',
    description: 'A network issue interrupted the payment. Your card was not charged.',
    tips: ['Check your internet connection', 'Try again in a few moments', 'Clear browser cache'],
  },
  timeout: {
    title: 'Payment Timed Out',
    description: 'The payment session expired before it could be completed. Your cart is safe.',
    tips: ['Return to checkout and try again', 'Use a faster payment method'],
  },
  default: {
    title: 'Payment Failed',
    description: 'An error occurred while processing your payment. No charges were made to your account.',
    tips: ['Try again with the same card', 'Use a different payment method', 'Contact support if issue persists'],
  },
};

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const errorCode = searchParams.get('error') || 'default';
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount') || '0.00';

  const reason = FAILURE_REASONS[errorCode] || FAILURE_REASONS.default;

  const handleRetry = async () => {
    setIsRetrying(true);
    await new Promise((r) => setTimeout(r, 800));
    router.push('/checkout/payment');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg text-center">

        {/* Error Icon */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-red-100 dark:bg-red-500/20 opacity-40" />
          <div className="absolute inset-2 rounded-full bg-red-100 dark:bg-red-500/20" />
          <XCircle className="relative z-10 h-14 w-14 text-red-500" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {reason.title}
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400 text-base max-w-sm mx-auto">
          {reason.description}
        </p>

        {/* Error Details Card */}
        <div className="mt-8 rounded-2xl border border-red-200 dark:border-red-500/30 bg-white dark:bg-gray-900 shadow-sm text-left overflow-hidden">
          <div className="bg-red-50 dark:bg-red-500/10 border-b border-red-100 dark:border-red-500/20 px-6 py-4 flex items-center gap-3">
            <ShieldAlert size={18} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">Transaction Failed</p>
              {orderId && <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Ref: #{orderId}</p>}
            </div>
            {amount !== '0.00' && (
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-400">Attempted</p>
                <p className="font-semibold text-gray-900 dark:text-white">${parseFloat(amount).toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              What you can try:
            </p>
            <ul className="space-y-2">
              {reason.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <div className="h-4 w-4 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400">{i + 1}</span>
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* No charge notice */}
        <p className="mt-4 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center gap-1.5">
          <ShieldAlert size={12} /> No amount was deducted from your account.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isRetrying ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Redirecting...
              </>
            ) : (
              <><RefreshCw size={16} /> Try Again</>
            )}
          </button>
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={16} /> Back to Cart
          </Link>
        </div>

        {/* Support */}
        <div className="mt-10 border-t border-gray-100 dark:border-gray-800 pt-8">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5 mb-4">
            <HelpCircle size={14} /> Need help?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/support"
              className="flex items-center justify-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <MessageSquare size={14} /> Live Chat
            </Link>
            <span className="hidden sm:block text-gray-300 dark:text-gray-700">|</span>
            <a
              href="tel:+18001234567"
              className="flex items-center justify-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <Phone size={14} /> Call Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
