'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Headphones, Mail, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/features/shared/ui';

export default function Footer() {
  const trustBadges = [
    { icon: Truck, title: 'Free Express Delivery', desc: 'On all orders over $99' },
    { icon: ShieldCheck, title: 'Secure Encrypted Payments', desc: '100% Buyer Protection Guaranteed' },
    { icon: RotateCcw, title: '30-Day Hassle-Free Returns', desc: 'Instant refund authorization' },
    { icon: Headphones, title: '24/7 AI & Live Support', desc: 'Instant multi-lingual assistance' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Trust & Guarantee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-start gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <badge.icon className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-slate-100 text-sm">{badge.title}</h5>
                <p className="text-xs text-slate-400 mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white">
                  AURORA
                </span>
                <span className="text-[10px] font-bold text-indigo-400 tracking-widest -mt-1 uppercase">
                  AI Commerce Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Experience the future of shopping powered by hyper-personalized AI recommendations, real-time price intelligence, and ultra-fast global delivery.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Subscribe for Exclusive Deals & AI Insights
              </label>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-slate-900 border border-slate-800 text-slate-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 w-full"
                />
                <Button variant="primary" size="md" icon={ArrowRight}>
                  Join
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">Shop Categories</h6>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/category/electronics" className="hover:text-indigo-400 transition-colors">Electronics & Gadgets</Link></li>
              <li><Link href="/category/fashion" className="hover:text-indigo-400 transition-colors">Fashion & Apparel</Link></li>
              <li><Link href="/category/home" className="hover:text-indigo-400 transition-colors">Home & Living</Link></li>
              <li><Link href="/category/beauty" className="hover:text-indigo-400 transition-colors">Beauty & Personal Care</Link></li>
              <li><Link href="/category/gaming" className="hover:text-indigo-400 transition-colors">Gaming & VR Gear</Link></li>
            </ul>
          </div>

          {/* Customer Experience */}
          <div>
            <h6 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">Customer Care</h6>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/support" className="hover:text-indigo-400 transition-colors">Help Center & FAQ</Link></li>
              <li><Link href="/orders" className="hover:text-indigo-400 transition-colors">Track Order Status</Link></li>
              <li><Link href="/returns" className="hover:text-indigo-400 transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="hover:text-indigo-400 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/ai/support" className="hover:text-indigo-400 transition-colors">Talk to AI Shopping Guide</Link></li>
            </ul>
          </div>

          {/* Account & AI Tools */}
          <div>
            <h6 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">AI Features</h6>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/ai/recommendations" className="hover:text-purple-400 transition-colors flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Style Finder</Link></li>
              <li><Link href="/ai/visual-search" className="hover:text-purple-400 transition-colors flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Visual Image Search</Link></li>
              <li><Link href="/ai/price-tracker" className="hover:text-purple-400 transition-colors flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Smart Price Alerts</Link></li>
              <li><Link href="/coupons" className="hover:text-indigo-400 transition-colors">Exclusive Coupons</Link></li>
              <li><Link href="/seller/apply" className="hover:text-indigo-400 transition-colors">Become a Seller</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 AURORA AI Commerce Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-slate-400">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
