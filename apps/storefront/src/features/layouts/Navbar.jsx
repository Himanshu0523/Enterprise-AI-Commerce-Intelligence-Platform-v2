'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Percent,
  Compass,
  Flame,
  Zap,
  Tag
} from 'lucide-react';
import { Badge, Button } from '@/features/shared/ui';

export default function Navbar({ cartCount = 3, wishlistCount = 5, user }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'Electronics', href: '/category/electronics', icon: Zap, items: ['Smartphones', 'Laptops', 'Audio & Headphones', 'Wearables', 'Gaming Consoles'] },
    { name: 'Fashion', href: '/category/fashion', icon: Tag, items: ['Men\'s Wear', 'Women\'s Apparel', 'Footwear', 'Watches', 'Jewelry'] },
    { name: 'Home & Kitchen', href: '/category/kitchen', icon: Compass, items: ['Smart Home', 'Cookware', 'Furniture', 'Lighting', 'Decor'] },
    { name: 'AI Curated', href: '/ai/recommendations', icon: Sparkles, badge: 'AI Power', items: ['Personalized Styles', 'Smart Bundles', 'Trend Forecast', 'Price Drop Alert'] }
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px]">
          <Flame className="w-3 h-3 fill-slate-950" /> FLASH SALE
        </span>
        <span>Get 25% OFF on AI-Recommended Tech & Fashion with code <strong>AURORA25</strong></span>
        <Link href="/coupons" className="underline font-bold hover:text-amber-300 ml-2">
          Claim Coupon
        </Link>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80 shadow-lg'
            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-300 bg-clip-text text-transparent">
                    AURORA
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest -mt-1 uppercase">
                    AI Commerce
                  </span>
                </div>
              </Link>

              {/* Mega Menu Trigger */}
              <div
                className="hidden lg:block relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 px-3 rounded-xl transition-colors">
                  Categories <ChevronDown className={`w-4 h-4 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown */}
                {megaMenuOpen && (
                  <div className="absolute top-full left-0 w-[680px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 grid grid-cols-2 gap-6 z-50 animate-scale-up">
                    {categories.map((cat, idx) => (
                      <div key={idx} className="space-y-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <cat.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <Link href={cat.href} className="font-bold text-slate-900 dark:text-slate-100 hover:underline">
                            {cat.name}
                          </Link>
                          {cat.badge && (
                            <Badge variant="ai" size="sm">
                              {cat.badge}
                            </Badge>
                          )}
                        </div>
                        <ul className="space-y-1.5 pl-7">
                          {cat.items.map((item, i) => (
                            <li key={i}>
                              <Link
                                href={`/search?q=${encodeURIComponent(item)}`}
                                className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Central Search Bar with AI Option */}
            <div className="hidden md:flex flex-1 max-w-xl relative items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products, brands, or ask AI assistant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-11 pr-24 py-2.5 rounded-2xl text-sm border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Link
                    href={`/search/ai?q=${encodeURIComponent(searchQuery)}`}
                    className="flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-xl shadow-sm hover:shadow-indigo-500/30 transition-all hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Ask AI
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl transition-colors flex items-center gap-2"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="w-5 h-5 bg-indigo-600 text-white font-bold text-[11px] rounded-full flex items-center justify-center shadow-md shadow-indigo-500/30">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account / Login */}
              <Link href={user ? "/profile" : "/login"}>
                <Button variant="outline" size="sm" icon={User} className="hidden sm:flex">
                  {user ? user.name || "Account" : "Sign In"}
                </Button>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search & Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4 animate-fade-in">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/categories" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" /> All Categories
              </Link>
              <Link href="/ai/chat" className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-sm font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" /> AI Assistant
              </Link>
              <Link href="/deals" className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-sm font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" /> Today's Deals
              </Link>
              <Link href="/orders" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" /> My Orders
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 py-2 px-6 flex items-center justify-around">
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}>
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link href="/categories" className={`flex flex-col items-center gap-1 ${pathname?.startsWith('/categories') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}>
          <Tag className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </Link>
        <Link href="/ai/chat" className={`flex flex-col items-center gap-1 ${pathname?.startsWith('/ai') ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg -mt-4">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px]">AI Studio</span>
        </Link>
        <Link href="/cart" className={`flex flex-col items-center gap-1 ${pathname === '/cart' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}>
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-indigo-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </div>
          <span className="text-[10px]">Cart</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center gap-1 ${pathname?.startsWith('/profile') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}>
          <User className="w-5 h-5" />
          <span className="text-[10px]">Account</span>
        </Link>
      </div>
    </header>
  );
}
