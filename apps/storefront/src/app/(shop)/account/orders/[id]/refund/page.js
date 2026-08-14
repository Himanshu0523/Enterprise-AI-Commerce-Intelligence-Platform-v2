'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById } from '@/lib/api/orders';
import { ArrowLeft, Package, Clock, CheckCircle, AlertCircle, DollarSign, CreditCard, Calendar } from 'lucide-react';

const MOCK_REFUND = {
  id: 'REF-2024-001',
  status: 'processing',
  amount: null, // uses order total
  method: 'Original Payment Method',
  requestedDate: new Date(Date.now() - 2 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  estimatedDate: new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
};

const REFUND_STEPS = [
  { key: 'requested', label: 'Refund Requested', description: 'Your return request was received and is being reviewed.' },
  { key: 'approved', label: 'Return Approved', description: 'Your return has been approved by our team.' },
  { key: 'received', label: 'Item Received', description: 'We have received your returned package at our facility.' },
  { key: 'processing', label: 'Refund Processing', description: 'Your refund is being processed to your payment method.' },
  { key: 'completed', label: 'Refund Completed', description: 'Refund has been credited to your account.' },
];

const STATUS_TO_STEP = { requested: 0, approved: 1, received: 2, processing: 3, completed: 4 };

export default function RefundStatusPage() {
  const params = useParams();
  const router = useRouter();
  const order = getOrderById(params?.id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-24 text-center">
        <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order not found</h2>
        <button
          onClick={() => router.push('/account/orders')}
          className="mt-6 flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>
      </div>
    );
  }

  const currentStep = STATUS_TO_STEP[MOCK_REFUND.status] ?? 0;
  const refundAmount = MOCK_REFUND.amount ?? order.total;

  const getStepIcon = (index, completed) => {
    if (index === REFUND_STEPS.length - 1 && completed) return <CheckCircle size={16} className="text-white" />;
    if (completed) return <CheckCircle size={14} className="text-white" />;
    return <span className="text-xs font-bold text-gray-300">{index + 1}</span>;
  };

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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Refund Status</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Order #{order.id} · Refund ID: {MOCK_REFUND.id}</p>
      </div>

      {/* Refund Summary Card */}
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-500/10 dark:to-gray-900 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex-shrink-0">
            <DollarSign size={28} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Refund Amount</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${refundAmount.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              MOCK_REFUND.status === 'completed'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
                : MOCK_REFUND.status === 'processing'
                ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30'
                : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
            }`}>
              {MOCK_REFUND.status === 'completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
              {MOCK_REFUND.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800/50 dark:bg-gray-800/20">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Refund Progress</h2>
              {MOCK_REFUND.status !== 'completed' && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Expected by: <span className="font-medium text-gray-700 dark:text-gray-300">{MOCK_REFUND.estimatedDate}</span>
                </p>
              )}
            </div>
            <div className="p-6">
              <ol className="relative">
                {REFUND_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  const isLast = index === REFUND_STEPS.length - 1;
                  return (
                    <li key={step.key} className={`relative flex gap-4 ${!isLast ? 'pb-8' : ''}`}>
                      {!isLast && (
                        <div className={`absolute left-[18px] top-9 w-0.5 h-full -translate-x-1/2 ${isCompleted ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                      )}
                      <div className={`relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
                      } ${isCurrent ? 'ring-4 ring-indigo-100 dark:ring-indigo-500/20 scale-110' : ''}`}>
                        {getStepIcon(index, isCompleted)}
                      </div>
                      <div className="pb-2">
                        <p className={`text-sm font-semibold leading-6 ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'} ${isCurrent ? 'text-indigo-700 dark:text-indigo-400' : ''}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs leading-5 ${isCompleted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-700'}`}>
                          {step.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Refund Details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><CreditCard size={13}/> Method</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{MOCK_REFUND.method}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><Calendar size={13}/> Requested</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{MOCK_REFUND.requestedDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><Clock size={13}/> Expected</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{MOCK_REFUND.estimatedDate}</dd>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><DollarSign size={13}/> Amount</dt>
                <dd className="font-bold text-indigo-600 dark:text-indigo-400">${refundAmount.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-4 py-3.5">
            <div className="flex gap-2">
              <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Refunds may take 3–10 business days depending on your bank or card issuer, even after we've processed it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
