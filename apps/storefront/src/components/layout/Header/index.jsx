'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, UserRound, Heart, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useWishlist } from '@/lib/contexts/WishlistContext';

export default function Header() {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const { items } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const itemCount = getTotalItems();
  const wishlistCount = items.length;

  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (value) window.location.href = `/search?q=${encodeURIComponent(value)}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e4dc] bg-[#f5f4ef]/95 text-[#1c2924] backdrop-blur-xl">
      <div className="editorial-shell flex h-[76px] items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-full border border-[#e5e4dc] lg:hidden"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link href="/" className="shrink-0" aria-label="Storefront home">
          <span className="block text-[21px] font-semibold tracking-[-.07em]">storefront<span className="text-[#668775]">.</span></span>
          <span className="mt-0.5 hidden text-[8px] font-semibold uppercase tracking-[.24em] text-[#899189] sm:block">Intelligent commerce</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          <Link href="/products" className="text-xs font-semibold text-[#43534a] transition-colors hover:text-[#78917f]">Discover</Link>
          <Link href="/products?sort=popular" className="text-xs font-semibold text-[#43534a] transition-colors hover:text-[#78917f]">Popular</Link>
          <Link href="/products?category=Accessories" className="text-xs font-semibold text-[#43534a] transition-colors hover:text-[#78917f]">Accessories</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <form onSubmit={submitSearch} className="hidden h-10 w-[220px] items-center gap-2 border-b border-[#d6d8d0] md:flex">
            <Search size={15} className="shrink-0 text-[#78847b]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search products"
              placeholder="Search the collection"
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#929a92]"
            />
            <button type="submit" aria-label="Submit search" className="text-[#315b49]"><ArrowUpRight size={15} /></button>
          </form>

          <Link href="/account/wishlist" className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-[#e9e9df]" aria-label="Wishlist">
            <Heart size={18} strokeWidth={1.6} />
            {wishlistCount > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#315b49] px-1 text-[9px] text-white">{wishlistCount}</span>}
          </Link>

          {user ? (
            <div className="group relative">
              <button type="button" className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-[#e9e9df]" aria-label="Account menu">
                <UserRound size={18} strokeWidth={1.6} />
              </button>
              <div className="invisible absolute right-0 top-full mt-2 w-52 translate-y-1 border border-[#e5e4dc] bg-[#fffefa] p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <p className="border-b border-[#e5e4dc] px-3 py-3 text-xs font-semibold">{user.name || user.email || 'Account'}</p>
                <Link href="/account" className="block px-3 py-2.5 text-xs hover:bg-[#f2f2ec]">My profile</Link>
                <Link href="/account/orders" className="block px-3 py-2.5 text-xs hover:bg-[#f2f2ec]">My orders</Link>
                <button type="button" onClick={logout} className="w-full px-3 py-2.5 text-left text-xs text-rose-700 hover:bg-rose-50">Sign out</button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-[#e9e9df]" aria-label="Sign in"><UserRound size={18} strokeWidth={1.6} /></Link>
          )}

          <Link href="/cart" className="relative grid h-10 w-10 place-items-center rounded-full bg-[#315b49] text-white transition-colors hover:bg-[#214635]" aria-label={`Shopping bag, ${itemCount} items`}>
            <ShoppingBag size={17} strokeWidth={1.7} />
            {itemCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#d8b779] px-1 text-[9px] font-bold text-[#1c2924]">{itemCount}</span>}
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#e5e4dc] bg-[#f5f4ef] px-6 py-5 lg:hidden">
          <form onSubmit={submitSearch} className="mb-4 flex h-11 items-center gap-3 border-b border-[#d6d8d0]">
            <Search size={16} className="text-[#78847b]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" className="flex-1 bg-transparent text-sm outline-none" />
            <button type="submit" aria-label="Submit search"><ArrowUpRight size={16} /></button>
          </form>
          <nav className="grid gap-1" aria-label="Mobile navigation">
            <Link onClick={() => setMobileOpen(false)} href="/products" className="py-3 text-sm">Discover collection</Link>
            <Link onClick={() => setMobileOpen(false)} href="/products?sort=popular" className="py-3 text-sm">Popular products</Link>
            <Link onClick={() => setMobileOpen(false)} href="/products?category=Accessories" className="py-3 text-sm">Accessories</Link>
          </nav>
        </div>
      )}
    </header>
  );
}