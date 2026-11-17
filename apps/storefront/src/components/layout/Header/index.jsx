'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Search, ShoppingBag, Heart, Menu, X, ArrowUpRight, ChevronDown,
  LogOut, UserRound, LayoutDashboard, Package, UserPlus,
} from 'lucide-react';
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState('');
  const accountRef = useRef(null);
  const itemCount = getTotalItems();
  const activeCategory = searchParams.get('category');
  const displayName = user?.name || user?.email?.split('@')[0] || 'Your account';
  const initials = displayName.trim().charAt(0).toUpperCase() || 'U';

  const isNavActive = (item) => {
    if (item.href.startsWith('/products?category=')) {
      return pathname === '/products' && activeCategory === new URLSearchParams(item.href.split('?')[1]).get('category');
    }
    if (item.href === '/products') return pathname === '/products' && !activeCategory;
    return pathname === item.href || (item.href === '/new-arrivals' && pathname.startsWith('/new-arrivals/'));
  };

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) setAccountOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setMobileOpen(false);
    router.push('/search?q=' + encodeURIComponent(value));
  };

  const handleLogout = async () => {
    setAccountOpen(false);
    setMobileOpen(false);
    try {
      await logout();
    } catch (error) {
      // AuthContext clears the local session even if the server revoke request fails.
      console.error('Sign-out request failed; local session was cleared.', error);
    } finally {
      router.replace('/');
      router.refresh();
    }
  };

  const searchForm = (mobile = false) => (
    <form onSubmit={submitSearch} role="search" className={mobile
      ? 'flex h-11 w-full items-center gap-3 border border-[#dedfd6] bg-white px-4 focus-within:border-[#829b88]'
      : 'hidden h-11 w-full max-w-[430px] items-center gap-3 border border-[#dedfd6] bg-white/80 px-4 transition focus-within:border-[#829b88] focus-within:bg-white md:flex'}>
      <Search size={16} className="shrink-0 text-[#78847b]" />
      <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search products" placeholder="Search products, categories…" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#969e96]" />
      <button type="submit" aria-label="Submit search" className="grid h-7 w-7 shrink-0 place-items-center text-[#315b49] hover:bg-[#edf1eb]"><ArrowUpRight size={15} /></button>
    </form>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e4dc] bg-[#fbfaf6]/95 text-[#1c2924] shadow-[0_4px_24px_rgba(28,41,36,.035)] backdrop-blur-xl">
      <div className="bg-[#203b30] text-[#f4f2e9]">
        <div className="editorial-shell flex min-h-8 items-center justify-between gap-3 text-[9px] font-semibold uppercase tracking-[.16em]">
          <span className="truncate">A considered product discovery experience</span>
          <Link href="/about" className="hidden shrink-0 items-center gap-1 text-white/75 transition hover:text-white sm:inline-flex">About this project <ArrowUpRight size={11} /></Link>
        </div>
      </div>

      <div className="editorial-shell flex min-h-[76px] items-center justify-between gap-3 sm:gap-5">
        <button type="button" onClick={() => setMobileOpen((open) => !open)} className="grid h-10 w-10 shrink-0 place-items-center border border-[#dedfd6] text-[#315b49] transition hover:bg-[#edf1eb] lg:hidden" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} aria-controls="storefront-mobile-navigation">
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <Link href="/" className="group min-w-0 shrink-0" aria-label="Storefront home">
          <span className="block text-[25px] font-semibold leading-none tracking-[-.09em] sm:text-[28px]">storefront<span className="text-[#6f927b]">.</span></span>
          <span className="mt-2 hidden text-[8px] font-bold uppercase tracking-[.25em] text-[#879087] sm:block">Commerce, considered</span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center px-5 md:flex">{searchForm()}</div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link href="/account/wishlist" className="relative grid h-10 w-10 place-items-center text-[#43534a] transition hover:bg-[#edf1eb]" aria-label={'Wishlist, ' + items.length + ' saved items'}>
            <Heart size={19} strokeWidth={1.55} />
            {items.length > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center bg-[#315b49] px-1 text-[9px] font-semibold text-white">{items.length}</span>}
          </Link>

          {!user && (
            <Link href="/login" aria-label="Sign in to your account" title="Sign in" className="grid h-10 w-10 place-items-center text-[#315b49] transition hover:bg-[#edf1eb] sm:hidden">
              <UserRound size={19} />
            </Link>
          )}

          <div className="relative" ref={accountRef}>
            {user ? (
              <>
                <button type="button" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen} aria-haspopup="menu" aria-label="Open account menu" className="flex h-10 items-center gap-2 border border-[#dedfd6] px-2.5 transition hover:border-[#a9b8aa] hover:bg-white sm:px-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#dce5dc] text-[10px] font-bold uppercase text-[#315b49]">{initials}</span>
                  <span className="hidden max-w-[100px] truncate text-[10px] font-semibold lg:block">{displayName}</span>
                  <ChevronDown size={13} className="hidden text-[#788078] sm:block" />
                </button>
                {accountOpen && (
                  <div role="menu" className="absolute right-0 top-[calc(100%+12px)] z-[60] w-[260px] border border-[#e5e4dc] bg-[#fffefa] p-2 shadow-[0_20px_55px_rgba(28,41,36,.16)]">
                    <div className="border-b border-[#e5e4dc] px-3 py-3">
                      <p className="truncate text-xs font-semibold text-[#1c2924]">{displayName}</p>
                      <p className="mt-1 truncate text-[10px] text-[#899189]">{user.email}</p>
                    </div>
                    <Link role="menuitem" onClick={() => setAccountOpen(false)} href="/account" className="flex items-center gap-3 px-3 py-3 text-xs text-[#43534a] transition hover:bg-[#f2f2ec] hover:text-[#315b49]"><LayoutDashboard size={15} /> Account overview</Link>
                    <Link role="menuitem" onClick={() => setAccountOpen(false)} href="/account/orders" className="flex items-center gap-3 px-3 py-3 text-xs text-[#43534a] transition hover:bg-[#f2f2ec] hover:text-[#315b49]"><Package size={15} /> Order history</Link>
                    <Link role="menuitem" onClick={() => setAccountOpen(false)} href="/account/profile" className="flex items-center gap-3 px-3 py-3 text-xs text-[#43534a] transition hover:bg-[#f2f2ec] hover:text-[#315b49]"><UserRound size={15} /> Profile settings</Link>
                    <div className="my-1 border-t border-[#e5e4dc]" />
                    <button role="menuitem" type="button" onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-3 text-left text-xs font-semibold text-[#9b5147] transition hover:bg-[#fbf0ed]"><LogOut size={15} /> Sign out</button>
                  </div>
                )}
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/login" className="inline-flex h-10 items-center justify-center border border-[#315b49] px-4 text-[10px] font-bold text-[#315b49] transition hover:bg-[#edf1eb]">Sign in</Link>
                <Link href="/register" className="hidden h-10 items-center justify-center gap-2 bg-[#315b49] px-4 text-[10px] font-bold text-white transition hover:bg-[#214635] md:inline-flex">Create account <UserPlus size={13} /></Link>
              </div>
            )}
          </div>

          <Link href="/cart" className="relative ml-1 grid h-10 w-10 place-items-center bg-[#315b49] text-white transition hover:bg-[#214635]" aria-label={'Shopping bag, ' + itemCount + ' items'}>
            <ShoppingBag size={18} strokeWidth={1.6} />
            {itemCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center bg-[#d8b779] px-1 text-[9px] font-bold text-[#1c2924]">{itemCount}</span>}
          </Link>
        </div>
      </div>

      <div className="hidden border-t border-[#ecebe4] lg:block">
        <nav className="editorial-shell flex h-12 items-center justify-center gap-5 xl:gap-8" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} aria-current={isNavActive(item) ? 'page' : undefined} className={'relative flex h-full items-center text-[10px] font-bold uppercase tracking-[.12em] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#315b49] after:transition-all hover:text-[#315b49] ' + (isNavActive(item) ? 'text-[#315b49] after:w-full' : 'text-[#69756c] after:w-0 hover:after:w-full')}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {mobileOpen && (
        <div id="storefront-mobile-navigation" className="border-t border-[#e5e4dc] bg-[#fbfaf6] px-4 pb-6 pt-4 shadow-[0_18px_35px_rgba(28,41,36,.08)] sm:px-6 lg:hidden">
          <div className="md:hidden">{searchForm(true)}</div>
          <nav className="mt-4 grid grid-cols-2 gap-x-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link key={item.label} onClick={() => setMobileOpen(false)} href={item.href} aria-current={isNavActive(item) ? 'page' : undefined} className={'border-b border-[#e5e4dc] py-3.5 text-xs font-semibold ' + (isNavActive(item) ? 'text-[#315b49]' : 'text-[#43534a]')}>
                {item.label}
              </Link>
            ))}
          </nav>
          {user ? (
            <div className="mt-5 border-t border-[#e5e4dc] pt-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dce5dc] text-xs font-bold text-[#315b49]">{initials}</span>
                <span className="min-w-0"><span className="block truncate text-xs font-semibold">{displayName}</span><span className="mt-1 block truncate text-[10px] text-[#899189]">{user.email}</span></span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link onClick={() => setMobileOpen(false)} href="/account" className="flex h-10 items-center justify-center gap-2 border border-[#dedfd6] text-[11px] font-semibold text-[#315b49]"><UserRound size={14} /> My account</Link>
                <button type="button" onClick={handleLogout} className="flex h-10 items-center justify-center gap-2 border border-[#edd5d0] text-[11px] font-semibold text-[#9b5147]"><LogOut size={14} /> Sign out</button>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#e5e4dc] pt-4">
              <Link onClick={() => setMobileOpen(false)} href="/login" className="flex h-11 items-center justify-center border border-[#315b49] text-xs font-bold text-[#315b49]">Sign in</Link>
              <Link onClick={() => setMobileOpen(false)} href="/register" className="flex h-11 items-center justify-center gap-2 bg-[#315b49] text-xs font-bold text-white">Create account <UserPlus size={14} /></Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}