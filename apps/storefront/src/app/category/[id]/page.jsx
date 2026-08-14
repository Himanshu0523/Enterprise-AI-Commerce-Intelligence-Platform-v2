'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Filter, SlidersHorizontal, Grid, List, Sparkles, ChevronDown, Check, Star } from 'lucide-react';
import Navbar from '@/features/layouts/Navbar';
import Footer from '@/features/layouts/Footer';
import ProductCard from '@/features/shared/ProductCard';

export default function CategoryDetailPage({ params }) {
  const categoryId = params?.id || 'electronics';
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('ai-match');
  const [priceRange, setPriceRange] = useState(500);

  const mockProducts = [
    {
      id: 'p-1',
      name: 'Aurora Wireless ANC Headphones Ultra',
      slug: 'aurora-wireless-anc-headphones',
      category: 'Electronics',
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.8,
      reviewsCount: 342,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      isNew: true,
      aiMatch: 98
    },
    {
      id: 'p-2',
      name: 'Smart OLED Fit Watch Series 7',
      slug: 'smart-oled-fit-watch-7',
      category: 'Electronics',
      price: 249.00,
      originalPrice: 320.00,
      rating: 4.9,
      reviewsCount: 184,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      isNew: false,
      aiMatch: 96
    },
    {
      id: 'p-3',
      name: 'Wireless Spatial Audio Earbuds Pro',
      slug: 'wireless-spatial-audio-earbuds-pro',
      category: 'Electronics',
      price: 89.00,
      originalPrice: 149.00,
      rating: 4.7,
      reviewsCount: 420,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      isNew: true,
      aiMatch: 94
    },
    {
      id: 'p-4',
      name: 'Cybernetic RGB Mechanical Keyboard',
      slug: 'cybernetic-rgb-mechanical-keyboard',
      category: 'Electronics',
      price: 119.50,
      originalPrice: 179.99,
      rating: 4.85,
      reviewsCount: 512,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      isNew: false,
      aiMatch: 93
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Category Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-2 max-w-xl">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">Category Catalog</span>
            <h1 className="text-3xl font-black capitalize tracking-tight">{categoryId} Products</h1>
            <p className="text-xs text-slate-300">
              Showing top results matched with AI personal preferences and real-time inventory updates.
            </p>
          </div>
        </div>

        {/* Toolbar Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Showing 4 Results</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-1.5 font-semibold focus:outline-none"
              >
                <option value="ai-match">✨ Best AI Match</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 shadow text-indigo-600' : 'text-slate-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 shadow text-indigo-600' : 'text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter Panel */}
          <div className="space-y-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl h-fit">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Filter className="w-4 h-4 text-indigo-600" /> Filter Options
            </h3>

            {/* Max Price Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Max Price:</span>
                <span className="text-indigo-600 font-bold">${priceRange}</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Brands Checkbox */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase text-slate-400">Brands</h4>
              {['Aurora Tech', 'CyberPulse', 'Sony', 'Apple'].map((brand, idx) => (
                <label key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" defaultChecked={idx === 0} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span>{brand}</span>
                </label>
              ))}
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase text-slate-400">Minimum Rating</h4>
              {[4, 3, 2].map((stars) => (
                <label key={stars} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="radio" name="rating-filter" defaultChecked={stars === 4} className="text-indigo-600 focus:ring-indigo-500" />
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    {stars}★ & above
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {mockProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
