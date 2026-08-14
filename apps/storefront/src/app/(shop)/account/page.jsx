'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getOrdersByUser } from '@/lib/api/orders';
import Link from 'next/link';
import {
  Package, MapPin, User, Heart, Shield, Bell, CreditCard,
  Star, ChevronRight, ShoppingBag, Truck, CheckCircle, Clock, ArrowRight,
} from 'lucide-react';

const STATUS_CONFIG = {
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
  shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' },
  processing: { label: 'Processing', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
};

const QUICK_LINKS = [
  { href: '/account/orders', icon: ShoppingBag, label: 'My Orders', desc: 'Track & manage orders', color: 'bg-indigo-50 dark:bg-indigo-500/10', iconColor: 'text-indigo-600 dark:text-indigo-400' },
  { href: '/account/wishlist', icon: Heart, label: 'Wishlist', desc: 'Saved items', color: 'bg-rose-50 dark:bg-rose-500/10', iconColor: 'text-rose-500' },
  { href: '/account/addresses', icon: MapPin, label: 'Addresses', desc: 'Delivery addresses', color: 'bg-emerald-50 dark:bg-emerald-500/10', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { href: '/account/payment-methods', icon: CreditCard, label: 'Payments', desc: 'Cards & methods', color: 'bg-blue-50 dark:bg-blue-500/10', iconColor: 'text-blue-600 dark:text-blue-400' },
  { href: '/account/reviews', icon: Star, label: 'Reviews', desc: 'Your product reviews', color: 'bg-amber-50 dark:bg-amber-500/10', iconColor: 'text-amber-500' },
  { href: '/account/security', icon: Shield, label: 'Security', desc: 'Password & sessions', color: 'bg-purple-50 dark:bg-purple-500/10', iconColor: 'text-purple-600 dark:text-purple-400' },
];

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-gray-600 dark:text-gray-400">Please log in to view your account.</p>
        <Link href="/login" className="mt-3 inline-flex items-center gap-1.5 text-indigo-600 hover:underline font-medium text-sm">
          Go to Login <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const orders = getOrdersByUser(user?.id || '');
  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <div className="rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-500/10 dark:via-gray-900 dark:to-purple-500/10 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0] || 'there'}!</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
          </div>
          <Link
            href="/account/profile"
            className="flex-shrink-0 flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
          >
            <User size={14} /> Edit Profile
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Total Orders', value: orders.length },
            { label: 'Delivered', value: deliveredCount },
            { label: 'Total Spent', value: `$${totalSpent.toFixed(0)}` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 px-4 py-3 text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map(({ href, icon: Icon, label, desc, color, iconColor }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30"
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon size={18} className={iconColor} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link href="/account/orders" className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4">
              <ShoppingBag className="h-7 w-7 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No orders yet.</p>
            <Link href="/products" className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              Start shopping <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing;
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                    <Package size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <p className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">${order.total?.toFixed(2)}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 dark:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}