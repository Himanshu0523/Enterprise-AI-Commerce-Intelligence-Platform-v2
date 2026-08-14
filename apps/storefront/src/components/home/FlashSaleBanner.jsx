'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Clock, ArrowRight, ShoppingBag, Star } from 'lucide-react';

const FLASH_PRODUCTS = [
  {
    id: 'aurora-headphones-1',
    name: 'Aurora Wireless ANC Headphones',
    category: 'Electronics',
    price: 199.99,
    originalPrice: 249.99,
    discount: '20% OFF',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    stockLeft: 8
  },
  {
    id: 'chrono-classic-watch',
    name: 'Chrono Classic Minimalist Watch',
    category: 'Accessories',
    price: 149.99,
    originalPrice: 199.99,
    discount: '25% OFF',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    stockLeft: 4
  },
  {
    id: 'leather-jacket-mens',
    name: 'Urban Crafted Leather Jacket',
    category: 'Men',
    price: 179.99,
    originalPrice: 229.99,
    discount: '22% OFF',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    stockLeft: 12
  }
];

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-purple-500/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-y border-amber-500/20">
      <div className="container mx-auto px-4">
        
        {/* Header with Timer */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
              <Flame className="w-4 h-4 fill-white" /> Flash Deal of the Day
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Hurry! Offers End Soon
            </h2>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-4 h-4 text-rose-500" /> Ends In:
            </span>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white font-mono font-bold text-lg shadow-md border border-slate-700">
                {String(timeLeft.hours).padStart(2, '0')}
                <span className="text-[9px] text-slate-400 font-sans font-normal uppercase">Hrs</span>
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white">:</span>
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white font-mono font-bold text-lg shadow-md border border-slate-700">
                {String(timeLeft.minutes).padStart(2, '0')}
                <span className="text-[9px] text-slate-400 font-sans font-normal uppercase">Min</span>
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white">:</span>
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-rose-600 text-white font-mono font-bold text-lg shadow-md animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
                <span className="text-[9px] text-rose-200 font-sans font-normal uppercase">Sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Deals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FLASH_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                {/* Image Box */}
                <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {prod.discount}
                  </span>
                  <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <Star className="w-3.5 h-3.5 fill-slate-950" /> {prod.rating}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                    {prod.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                    {prod.name}
                  </h3>
                </div>

                {/* Pricing & Stock Meter */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    ${prod.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    ${prod.originalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Stock remaining:</span>
                    <span className="text-rose-600 font-bold">{prod.stockLeft} left</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full"
                      style={{ width: `${(prod.stockLeft / 15) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <Link
                href={`/products/${prod.id}`}
                className="mt-5 w-full py-3 rounded-2xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Claim Flash Deal
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
