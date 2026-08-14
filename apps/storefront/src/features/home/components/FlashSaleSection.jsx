'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import ProductCard from '@/features/shared/ProductCard';

export default function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = [
    {
      id: 'fs-1',
      name: 'Smart OLED Fit Watch Series 7',
      slug: 'smart-oled-fit-watch-7',
      category: 'Wearables',
      price: 149.99,
      originalPrice: 229.99,
      rating: 4.9,
      reviewsCount: 184,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      aiMatch: 99,
      isNew: false
    },
    {
      id: 'fs-2',
      name: 'Wireless Spatial Audio Earbuds Pro',
      slug: 'wireless-spatial-audio-earbuds-pro',
      category: 'Audio',
      price: 89.00,
      originalPrice: 149.00,
      rating: 4.7,
      reviewsCount: 420,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
      aiMatch: 95,
      isNew: true
    },
    {
      id: 'fs-3',
      name: 'Ultra Slim Dual Screen Laptop i9',
      slug: 'ultra-slim-dual-screen-laptop-i9',
      category: 'Computers',
      price: 1299.00,
      originalPrice: 1699.00,
      rating: 4.95,
      reviewsCount: 96,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
      aiMatch: 97,
      isNew: true
    },
    {
      id: 'fs-4',
      name: 'Cybernetic RGB Mechanical Keyboard',
      slug: 'cybernetic-rgb-mechanical-keyboard',
      category: 'Accessories',
      price: 119.50,
      originalPrice: 179.99,
      rating: 4.85,
      reviewsCount: 512,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
      aiMatch: 94,
      isNew: false
    }
  ];

  return (
    <section className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/20 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 text-rose-500 rounded-2xl border border-rose-500/30 animate-pulse">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Limited-Time Flash Deals
            </h2>
            <p className="text-xs text-slate-400">Exclusive discounts refreshed daily. Grab before stock runs out!</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400 font-medium">Ends in:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-sm text-white">
            <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-lg border border-rose-500/30">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            :
            <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-lg border border-rose-500/30">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            :
            <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-lg border border-rose-500/30">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {flashProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
