'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getOrderById } from '@/lib/api/orders';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Calendar, Download, RotateCcw, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-24 text-center">
        <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order not found</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">The order you are looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => router.push('/account/orders')}
          className="mt-6 flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>
      </div>
    );
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'processing':
        return { icon: <Clock className="text-amber-500" size={20} />, color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30' };
      case 'shipped':
        return { icon: <Truck className="text-blue-500" size={20} />, color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30' };
      case 'delivered':
        return { icon: <CheckCircle className="text-emerald-500" size={20} />, color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30' };
      case 'cancelled':
        return { icon: <Package className="text-red-500" size={20} />, color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30' };
      default:
        return { icon: <Clock className="text-gray-500" size={20} />, color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' };
    }
  };

  const statusConfig = getStatusDisplay(order.status);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push('/account/orders')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Order #{order.id}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Calendar size={14} />
              Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(order.status === 'shipped' || order.status === 'out_for_delivery') && (
              <Link
                href={`/account/orders/${order.id}/track`}
                className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
              >
                <Truck size={16} /> Track Order
              </Link>
            )}
            {order.status === 'delivered' && (
              <Link
                href={`/account/orders/${order.id}/return`}
                className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm transition-all hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
              >
                <RotateCcw size={16} /> Return
              </Link>
            )}
            {order.status === 'delivered' && (
              <Link
                href={`/account/orders/${order.id}/refund`}
                className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm transition-all hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
              >
                <RefreshCw size={16} /> Refund Status
              </Link>
            )}
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              <Download size={16} /> Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`flex items-center gap-4 rounded-xl border p-4 ${statusConfig.color.replace('text-', 'text-').replace('bg-', 'bg-').split(' ')[0]} ${statusConfig.color.split(' ')[2]} dark:bg-opacity-20`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
          {statusConfig.icon}
        </div>
        <div>
          <h3 className="font-semibold capitalize text-gray-900 dark:text-white">{order.status}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {order.status === 'delivered' ? 'Your package has been delivered successfully.' :
             order.status === 'shipped' ? 'Your package is on the way.' :
             order.status === 'processing' ? 'We are preparing your order.' :
             'Order status updated.'}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content - Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800/50 dark:bg-gray-800/20">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Items</h2>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {order.items.map((item) => (
                <li key={item.productId} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link href={`/products/${item.productId}`} className="font-semibold text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right sm:text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">${item.price.toFixed(2)} each</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800/50 dark:bg-gray-800/20">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-900 dark:text-white">Order Total</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Info */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Shipping Address</h2>
            </div>
            <address className="not-italic text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-2 flex items-center gap-2 text-gray-500">
                <span className="text-xs uppercase tracking-wider font-semibold">Phone:</span> {order.shippingAddress.phone}
              </p>
            </address>
          </div>

          {/* Shipping Method */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Shipping Method</h2>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{order.shippingMethod}</p>
            <p className="mt-1 text-xs text-gray-500">Standard Delivery (3-5 business days)</p>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Payment Method</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <span className="text-xs font-bold text-gray-500 uppercase">{order.paymentMethod}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white uppercase">{order.paymentMethod}</p>
                <p className="text-xs text-gray-500">Ending in ****</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}