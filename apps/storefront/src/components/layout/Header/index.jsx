'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Heart } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useWishlist } from '@/lib/contexts/WishlistContext';

/**
 * Header Component
 */
export default function Header() {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const { items } = useWishlist();
  const itemCount = getTotalItems();
  const wishlistCount = items.length;

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Storefront
        </Link>

        <form action="/search" method="get" className="hidden flex-1 px-8 md:block">
          <div className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-2.5">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <Link href="/account/wishlist" className="relative text-gray-600 hover:text-gray-900">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900">
                <User size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block z-50">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link
                  href="/account/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Orders
                </Link>
                <Link
                  href="/account/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Account Settings
                </Link>
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              <User size={20} />
            </Link>
          )}

          <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}