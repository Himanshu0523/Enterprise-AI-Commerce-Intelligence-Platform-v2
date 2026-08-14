'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById } from '@/lib/api/orders';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, ExternalLink } from 'lucide-react';

const TRACKING_STEPS = [
  { key: 'placed', label: 'Order Placed', description: 'Your order has been received and is being reviewed.' },
  { key: 'confirmed', label: 'Order Confirmed', description: 'Payment verified and order confirmed by seller.' },
  { key: 'processing', label: 'Processing', description: 'Your items are being picked and packed at the warehouse.' },
  { key: 'shipped', label: 'Shipped', description: 'Your package has been handed over to the carrier.' },
  { key: 'out_for_delivery', label: 'Out for Delivery', description: 'Your package is with the local delivery agent.' },
  { key: 'delivered', label: 'Delivered', description: 'Package delivered successfully.' },
];

const STATUS_TO_STEP = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  out_for_delivery: 4,
  delivered: 5,
};

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const order = getOrderById(params?.id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-24 text-center">
        <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order not found</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">We couldn't find the order you're looking for.</p>
        <button
          onClick={() => router.push('/account/orders')}
          className="mt-6 flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>
      </div>
    );
  }

  const currentStep = STATUS_TO_STEP[order.status] ?? 2;
  const isCancelled = order.status === 'cancelled';

  const mockTracking = {
    carrier: 'BlueDart Express',
    trackingNumber: `BD${order.id?.slice(0, 8).toUpperCase()}`,
    estimatedDelivery: new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    events: [
      { time: '10:32 AM', date: 'Today', message: 'Package out for delivery', location: order.shippingAddress?.city || 'Local Facility' },
      { time: '08:15 AM', date: 'Today', message: 'Arrived at local delivery hub', location: `${order.shippingAddress?.city || ''} Hub` },
      { time: '11:45 PM', date: 'Yesterday', message: 'In transit', location: 'Regional Sorting Facility' },
      { time: '06:00 AM', date: '2 days ago', message: 'Picked up by carrier', location: 'Seller Warehouse' },
    ],
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Track Order #{order.id}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Real-time tracking for your shipment.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main - Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Timeline */}
          {isCancelled ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
                  <Package className="text-red-500" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-400">Order Cancelled</h3>
                  <p className="text-sm text-red-600 dark:text-red-500">This order has been cancelled and will not be shipped.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800/50 dark:bg-gray-800/20">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipment Progress</h2>
                {order.status !== 'delivered' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Estimated delivery: <span className="font-medium text-gray-700 dark:text-gray-300">{mockTracking.estimatedDelivery}</span>
                  </p>
                )}
              </div>
              <div className="p-6">
                <ol className="relative">
                  {TRACKING_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;
                    const isLast = index === TRACKING_STEPS.length - 1;

                    return (
                      <li key={step.key} className={`relative flex gap-4 ${!isLast ? 'pb-8' : ''}`}>
                        {/* Connector line */}
                        {!isLast && (
                          <div
                            className={`absolute left-[18px] top-9 w-0.5 h-full -translate-x-1/2 ${
                              isCompleted ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        )}
                        {/* Step circle */}
                        <div className={`relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          isCompleted
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
                        } ${isCurrent ? 'ring-4 ring-indigo-100 dark:ring-indigo-500/20 scale-110' : ''}`}>
                          {isCompleted ? (
                            index === TRACKING_STEPS.length - 1
                              ? <CheckCircle size={16} className="text-white" />
                              : <CheckCircle size={14} className="text-white" />
                          ) : (
                            <span className={`text-xs font-bold ${isCurrent ? 'text-gray-400' : 'text-gray-300'}`}>{index + 1}</span>
                          )}
                        </div>
                        {/* Step content */}
                        <div className="pb-2">
                          <p className={`text-sm font-semibold leading-6 ${
                            isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
                          } ${isCurrent ? 'text-indigo-700 dark:text-indigo-400' : ''}`}>
                            {step.label}
                          </p>
                          <p className={`text-xs leading-5 ${
                            isCompleted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-700'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          )}

          {/* Tracking Events */}
          {!isCancelled && (
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800/50 dark:bg-gray-800/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tracking History</h2>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                    <ExternalLink size={12} /> Track on Carrier Site
                  </button>
                </div>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {mockTracking.events.map((event, i) => (
                  <li key={i} className="flex items-start gap-4 p-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      i === 0 ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {i === 0 ? (
                        <Truck size={14} className="text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Clock size={14} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${i === 0 ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {event.message}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{event.location}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{event.time}</p>
                      <p className="text-xs text-gray-400">{event.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Carrier Info */}
          {!isCancelled && (
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Carrier Details</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Carrier</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{mockTracking.carrier}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Tracking Number</p>
                  <p className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{mockTracking.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Est. Delivery</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{mockTracking.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Address */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Delivery Address</h2>
            </div>
            <address className="not-italic text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p className="font-semibold text-gray-900 dark:text-white">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p className="flex items-center gap-1.5 pt-1 text-gray-500">
                <Phone size={12} /> {order.shippingAddress?.phone}
              </p>
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}
