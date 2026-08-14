'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  LayoutDashboard, ShoppingBag, MapPin, User, Heart, CreditCard,
  Star, Shield, Bell, SlidersHorizontal, Gift, LogOut,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Shopping',
    items: [
      { href: '/account', label: 'Overview', icon: LayoutDashboard, exact: true },
      { href: '/account/orders', label: 'My Orders', icon: ShoppingBag },
      { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
      { href: '/account/reviews', label: 'My Reviews', icon: Star },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/account/profile', label: 'Profile', icon: User },
      { href: '/account/addresses', label: 'Addresses', icon: MapPin },
      { href: '/account/payment-methods', label: 'Payment Methods', icon: CreditCard },
    ],
  },
  {
    label: 'Settings',
    items: [
      { href: '/account/notifications', label: 'Notifications', icon: Bell },
      { href: '/account/security', label: 'Security', icon: Shield },
      { href: '/account/preferences', label: 'Preferences', icon: SlidersHorizontal },
    ],
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href, exact) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="space-y-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
      {/* User info */}
      <div className="flex items-center gap-3 px-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-sm">
          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'My Account'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
        </div>
      </div>

      {/* Nav groups */}
      <div className="space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={17} className={active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'} />
                    {label}
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}