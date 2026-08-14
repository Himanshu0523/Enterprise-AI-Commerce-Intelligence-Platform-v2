'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getOrdersByUser } from '@/lib/api/orders';
import Link from 'next/link';
import { Package, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const orders = getOrdersByUser(user?.id || '');

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
      case 'processing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Order History</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Check the status of recent orders, manage returns, and discover similar products.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm mb-6">
            <ShoppingBag className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">No orders yet</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            When you place orders, they will appear here. Start shopping to discover amazing products.
          </p>
          <Link 
            href="/products" 
            className="mt-8 flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
          >
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30"
            >
              <div className="border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">Date placed</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="hidden sm:block h-10 w-px bg-gray-200 dark:bg-gray-800" />
                    <div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">Total amount</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-500 dark:text-gray-400 text-sm">Order number</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white text-sm">
                        #{order.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Package size={24} />
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} in this order
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-sm font-medium mr-1">View Details</span>
                  <ChevronRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}