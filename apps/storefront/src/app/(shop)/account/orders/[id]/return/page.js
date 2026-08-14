'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById } from '@/lib/api/orders';
import { ArrowLeft, Package, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';

const RETURN_REASONS = [
  'Item arrived damaged',
  'Wrong item delivered',
  'Item not as described',
  'Missing parts/accessories',
  'Quality not as expected',
  'Changed my mind',
  'Ordered by mistake',
  'Found better price elsewhere',
  'Other',
];

export default function ReturnRequestPage() {
  const params = useParams();
  const router = useRouter();
  const order = getOrderById(params?.id);

  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [returnType, setReturnType] = useState('refund');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-24 text-center">
        <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order not found</h2>
        <button
          onClick={() => router.push('/account/orders')}
          className="mt-6 flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>
      </div>
    );
  }

  const isEligible = order.status === 'delivered';

  const toggleItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0 || !reason) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 py-24 text-center px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-sm mb-6">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Return Request Submitted</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md">
          Your return request for Order #{order.id} has been received. We'll review it and email you with next steps within 1–2 business days.
        </p>
        <p className="mt-4 text-xs font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-indigo-600 dark:text-indigo-400">
          Request ID: RET-{order.id?.slice(0, 6).toUpperCase()}-{Date.now().toString().slice(-4)}
        </p>
        <button
          onClick={() => router.push('/account/orders')}
          className="mt-8 flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push(`/account/orders/${order.id}`)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={16} /> Back to Order Details
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Return Request</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Order #{order.id} · {order.items?.length} item(s)</p>
      </div>

      {!isEligible ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-400">Return Not Available</h3>
              <p className="text-sm text-amber-700 dark:text-amber-500 mt-0.5">
                Returns can only be requested for delivered orders. The current status of this order is <strong className="capitalize">{order.status}</strong>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Items */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800/50 dark:bg-gray-800/20">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Select Items to Return</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Choose the item(s) you want to return.</p>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {order.items?.map((item) => (
                <li
                  key={item.productId}
                  onClick={() => toggleItem(item.productId)}
                  className={`flex items-center gap-4 p-5 cursor-pointer transition-colors ${
                    selectedItems.includes(item.productId)
                      ? 'bg-indigo-50 dark:bg-indigo-500/10'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/20'
                  }`}
                >
                  <div className={`h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedItems.includes(item.productId)
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedItems.includes(item.productId) && (
                      <CheckCircle size={12} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Qty: {item.quantity} · ${item.price?.toFixed(2)} each</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Return Type */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Return Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'refund', label: 'Refund to Original Payment', description: '3–5 business days' },
                { value: 'exchange', label: 'Exchange for Another Item', description: 'Same or different size/color' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                    returnType === opt.value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="returnType"
                    value={opt.value}
                    checked={returnType === opt.value}
                    onChange={(e) => setReturnType(e.target.value)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{opt.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Reason for Return</h2>
            <div className="relative">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select a reason...</option>
                {RETURN_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Additional Details <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Describe the issue in more detail..."
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>
          </div>

          {/* Policy Note */}
          <div className="rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-5 py-4">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              <strong>Return Policy:</strong> Items must be returned within 30 days of delivery. Products must be in original packaging and unused condition. Refunds are processed within 3–5 business days after we receive the item.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={selectedItems.length === 0 || !reason || isSubmitting}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                'Submit Return Request'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
