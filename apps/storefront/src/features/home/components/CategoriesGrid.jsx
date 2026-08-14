'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Zap, Shirt, Home as HomeIcon, Sparkles, Watch, Camera } from 'lucide-react';

export default function CategoriesGrid() {
  const categories = [
    {
      id: 'electronics',
      name: 'Electronics & Audio',
      count: '1,240 Products',
      icon: Zap,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      color: 'from-blue-600/80 to-indigo-900/90'
    },
    {
      id: 'fashion',
      name: 'Fashion & Apparel',
      count: '3,850 Products',
      icon: Shirt,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
      color: 'from-pink-600/80 to-purple-900/90'
    },
    {
      id: 'home',
      name: 'Smart Home & Living',
      count: '980 Products',
      icon: HomeIcon,
      image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&q=80',
      color: 'from-emerald-600/80 to-teal-900/90'
    },
    {
      id: 'wearables',
      name: 'Smart Wearables',
      count: '640 Products',
      icon: Watch,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      color: 'from-amber-600/80 to-orange-900/90'
    }
  ];

  return (
    <section className="my-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Explore Top Categories
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse our curated collections with AI filter intelligence
          </p>
        </div>
        <Link
          href="/categories"
          className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          All Categories <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className="group relative h-64 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6"
          >
            {/* Background Image & Gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} transition-opacity duration-300 opacity-90 group-hover:opacity-95`} />

            {/* Content */}
            <div className="relative z-10 text-white space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                <cat.icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>

              <p className="text-xs text-slate-200">{cat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
