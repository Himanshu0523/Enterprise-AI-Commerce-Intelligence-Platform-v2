'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  LayoutDashboard, ShoppingBag, MapPin, User, Heart, CreditCard,
  Star, Shield, Bell, SlidersHorizontal, LogOut,
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
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (href, exact) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="space-y-5 border border-[#e5e4dc] bg-[#fffefa] p-4">
      {/* User info */}
      <div className="flex items-center gap-3 px-2 pb-4 border-b border-[#e5e4dc]">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#dce5dc] text-[#315b49] font-bold text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#27362e] truncate">{user?.name || 'My Account'}</p>
          <p className="text-xs text-[#879087] truncate">{user?.email || ''}</p>
        </div>
      </div>

      {/* Nav groups */}
      <div className="space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#879087]">
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
                        ? 'bg-[#e8eee7] text-[#315b49]'
                        : 'text-[#59665e] hover:bg-[#f2f2ec] hover:text-[#315b49]'
                    }`}
                  >
                    <Icon size={17} className={active ? 'text-[#315b49]' : 'text-[#879087]'} />
                    {label}
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#315b49]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="pt-2 border-t border-[#e5e4dc]">
        <button
          onClick={async () => { try { await logout(); } finally { router.replace('/login'); router.refresh(); } }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#9b5147] hover:bg-[#fbf0ed] transition-colors"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}