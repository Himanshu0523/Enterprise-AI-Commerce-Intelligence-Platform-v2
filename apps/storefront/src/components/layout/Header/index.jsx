'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, UserRound, Heart, Menu, X, ArrowUpRight, ChevronDown, LogOut } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useWishlist } from '@/lib/contexts/WishlistContext';

const navItems = [
  { label: 'Discover', href: '/products' },
  { label: 'Women', href: '/products?category=Women' },
  { label: 'Men', href: '/products?category=Men' },
  { label: 'Kids', href: '/products?category=Kids' },
  { label: 'Accessories', href: '/products?category=Accessories' },
  { label: 'New arrivals', href: '/new-arrivals' },
  { label: 'Sale', href: '/sale' },
];

export default function Header() {
  const { getTotalItems } = useCart();
  const { user, logout, isLoading } = useAuth();
  const { items = [] } = useWishlist();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState('');
  const itemCount = getTotalItems();

  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setMobileOpen(false);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleLogout = async () => {
    setAccountOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error('Sign-out request failed; local session was cleared.', error);
    }
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e4dc] bg-[#f8f7f2]/95 text-[#1c2924] backdrop-blur-xl">
      <div className="border-b border-[#e5e4dc] bg-[#203b30] text-center text-[9px] font-semibold uppercase tracking-[.2em] text-[#f4f2e9]">
        <p className="px-3 py-2">Explore · Compare · Discover</p>
      </div>

      <div className="editorial-shell flex h-[74px] items-center justify-between gap-5">
        <button type="button" onClick={() => setMobileOpen((open) => !open)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#dedfd6] lg:hidden" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <Link href="/" className="group shrink-0" aria-label="Storefront home">
          <span className="block text-[25px] font-semibold leading-none tracking-[-.09em]">storefront<span className="text-[#6f927b]">.</span></span>
          <span className="mt-2 block text-[8px] font-bold uppercase tracking-[.25em] text-[#879087]">Commerce, considered</span>
        </Link>

        <nav className="hidden h-full items-center gap-5 xl:gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} aria-current={pathname === item.href.split('?')[0] ? 'page' : undefined} className="relative flex h-full items-center text-[11px] font-semibold text-[#526057] transition-colors hover:text-[#315b49] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#315b49] after:transition-all hover:after:w-full">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <form onSubmit={submitSearch} className="hidden h-10 w-[clamp(150px,17vw,240px)] lg:flex items-center gap-2 rounded-full border border-[#dedfd6] bg-white/70 px-4 transition focus-within:border-[#829b88] focus-within:bg-white xl:flex">
            <Search size={15} className="shrink-0 text-[#78847b]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search products" placeholder="Search products..." className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-[#969e96]" />
            <button type="submit" aria-label="Submit search" className="text-[#315b49]"><ArrowUpRight size={15} /></button>
          </form>

          <Link href="/account/wishlist" className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-[#e9e9df]" aria-label={`Wishlist, ${items.length} items`}>
            <Heart size={19} strokeWidth={1.55} />
            {items.length > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#315b49] px-1 text-[9px] text-white">{items.length}</span>}
          </Link>

          <div className="relative">
            {user ? (
              <>
                <button type="button" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen} aria-label="Open account menu" className="flex h-10 items-center gap-2 rounded-full border border-[#dedfd6] px-3 transition-colors hover:bg-white">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#dce5dc] text-[10px] font-bold uppercase text-[#315b49]">{(user.name || user.email || 'U').slice(0, 1)}</span>
                  <span className="hidden max-w-[90px] truncate text-[10px] font-semibold xl:block">{user.name || 'Account'}</span>
                  <ChevronDown size={13} className="hidden xl:block" />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-[calc(100%+12px)] w-56 border border-[#e5e4dc] bg-[#fffefa] p-2 shadow-[0_18px_50px_rgba(28,41,36,.14)]">
                    <div className="border-b border-[#e5e4dc] px-3 py-3">
                      <p className="truncate text-xs font-semibold">{user.name || 'Your account'}</p>
                      <p className="mt-1 truncate text-[10px] text-[#899189]">{user.email}</p>
                    </div>
                    <Link onClick={() => setAccountOpen(false)} href="/account" className="block px-3 py-3 text-xs hover:bg-[#f2f2ec]">Account overview</Link>
                    <Link onClick={() => setAccountOpen(false)} href="/account/orders" className="block px-3 py-3 text-xs hover:bg-[#f2f2ec]">Order history</Link>
                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-3 text-left text-xs text-[#9b5147] hover:bg-[#fbf0ed]"><LogOut size={14} /> Sign out</button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login" className="hidden h-10 items-center rounded-full border border-[#315b49] px-4 text-[10px] font-bold text-[#315b49] transition-colors hover:bg-[#315b49] hover:text-white sm:flex">
                {isLoading ? '…' : 'Sign in'}
              </Link>
            )}
          </div>

          {!user && <Link href="/register" className="hidden text-[10px] font-bold text-[#315b49] hover:underline xl:inline-flex">Create account</Link>}

          <Link href="/cart" className="relative ml-1 grid h-10 w-10 place-items-center rounded-full bg-[#315b49] text-white transition-colors hover:bg-[#214635]" aria-label={`Shopping bag, ${itemCount} items`}>
            <ShoppingBag size={18} strokeWidth={1.6} />
            {itemCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#d8b779] px-1 text-[9px] font-bold text-[#1c2924]">{itemCount}</span>}
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#e5e4dc] bg-[#f8f7f2] px-5 pb-6 pt-4 lg:hidden">
          <form onSubmit={submitSearch} className="mb-4 flex h-11 items-center gap-3 rounded-full border border-[#dedfd6] bg-white px-4">
            <Search size={16} className="text-[#78847b]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." aria-label="Search products" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
            <button type="submit" aria-label="Submit search"><ArrowUpRight size={16} /></button>
          </form>
          <nav className="grid grid-cols-2 gap-x-5" aria-label="Mobile navigation">
            {navItems.map((item) => <Link key={item.label} onClick={() => setMobileOpen(false)} href={item.href} className="border-b border-[#e5e4dc] py-4 text-sm font-medium text-[#43534a]">{item.label}</Link>)}
          </nav>
          {!user && <Link onClick={() => setMobileOpen(false)} href="/login" className="mt-5 flex h-11 items-center justify-center rounded-full bg-[#315b49] text-xs font-semibold text-white">Sign in to your account</Link>}
          {user && <Link onClick={() => setMobileOpen(false)} href="/account" className="mt-5 block py-3 text-sm font-semibold text-[#315b49]">My account <ArrowUpRight className="inline" size={14} /></Link>}
        </div>
      )}
    </header>
  );
}