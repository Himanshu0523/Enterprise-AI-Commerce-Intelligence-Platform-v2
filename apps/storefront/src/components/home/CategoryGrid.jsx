'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Men',
    label: 'Men’s Apparel & Urban Style',
    itemsCount: '120+ Products',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    gradient: 'from-blue-600/80 to-slate-900/90',
    href: '/products?category=Men'
  },
  {
    name: 'Women',
    label: 'Women’s High Fashion & Essentials',
    itemsCount: '180+ Products',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    gradient: 'from-pink-600/80 to-purple-900/90',
    href: '/products?category=Women'
  },
  {
    name: 'Kids',
    label: 'Kids Playful Wear & Gear',
    itemsCount: '75+ Products',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    gradient: 'from-amber-500/80 to-rose-900/90',
    href: '/products?category=Kids'
  },
  {
    name: 'Accessories',
    label: 'Luxury Watches, Bags & Leather Goods',
    itemsCount: '90+ Products',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    gradient: 'from-emerald-600/80 to-teal-950/90',
    href: '/products?category=Accessories'
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              <Sparkles className="w-4 h-4" /> Collections Overview
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Popular Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 block"
            >
              {/* Background Image */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                    {cat.itemsCount}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-1 text-white">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {cat.label}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
