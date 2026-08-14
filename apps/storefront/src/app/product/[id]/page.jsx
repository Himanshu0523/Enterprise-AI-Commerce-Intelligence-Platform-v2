'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Star,
  ShoppingBag,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';
import Navbar from '@/features/layouts/Navbar';
import Footer from '@/features/layouts/Footer';
import { Button, Price, Rating, Badge } from '@/features/shared/ui';
import ProductCard from '@/features/shared/ProductCard';

export default function ProductDetailPage({ params }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Midnight Black');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  const product = {
    id: 'aurora-headphones-1',
    name: 'Aurora Wireless ANC Headphones Ultra',
    category: 'Electronics & Audio',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewsCount: 342,
    aiMatch: 98,
    inStock: true,
    sku: 'AUR-ANC-2026-X',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&q=80'
    ],
    colors: ['Midnight Black', 'Starlight Silver', 'Cyber Violet'],
    aiSummary: 'Users love the 45-hour battery life and instant noise cancellation. Rated 98% compatible for commuters, gamers, and audiophiles.',
    specs: [
      { label: 'Active Noise Cancellation', value: 'Adaptive Hybrid ANC 45dB' },
      { label: 'Battery Life', value: '45 Hours (ANC On) / Fast Charge 10min = 5hr' },
      { label: 'Bluetooth Version', value: 'Bluetooth 5.4 Dual Connect' },
      { label: 'Weight', value: '240g Ultra Light Ergonomic Build' }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Main Product Hero Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Gallery Section */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {product.aiMatch}% Match for You
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Purchase Panel */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <Rating rating={product.rating} count={product.reviewsCount} size="md" />
                <span className="text-xs text-slate-400">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <Price price={product.price} originalPrice={product.originalPrice} size="lg" />
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  In Stock • Ships Within 24 Hours
                </p>
              </div>
              <Badge variant="accent" size="lg">20% OFF</Badge>
            </div>

            {/* AI Summary Banner */}
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-600" /> AI Insights Summary
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.aiSummary}
              </p>
            </div>

            {/* Color Variant Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Color: <span className="text-indigo-600">{selectedColor}</span>
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      selectedColor === color
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <div className="flex items-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 flex gap-3 w-full">
                <Link href="/cart" className="flex-1">
                  <Button variant="primary" size="lg" fullWidth icon={ShoppingBag}>
                    Add to Shopping Cart
                  </Button>
                </Link>
                <button className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-rose-50 hover:border-rose-300 text-slate-600 hover:text-rose-600 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Guarantee Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <div className="p-2 space-y-1">
                <Truck className="w-5 h-5 mx-auto text-indigo-600" />
                <span className="block text-[11px] font-semibold">Free Shipping</span>
              </div>
              <div className="p-2 space-y-1">
                <RotateCcw className="w-5 h-5 mx-auto text-indigo-600" />
                <span className="block text-[11px] font-semibold">30-Day Returns</span>
              </div>
              <div className="p-2 space-y-1">
                <ShieldCheck className="w-5 h-5 mx-auto text-indigo-600" />
                <span className="block text-[11px] font-semibold">2-Yr Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs & Overview Tabs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto">
            {['overview', 'specs', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-bold capitalize pb-2 border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'overview' ? 'Product Overview' : tab === 'specs' ? 'Technical Specifications' : 'Verified Reviews (342)'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                The Aurora Wireless ANC Headphones Ultra combine studio-grade 40mm titanium drivers with adaptive spatial audio algorithms.
                Designed for total immersion, these headphones analyze ambient acoustic noise 1000 times per second to deliver pure audio clarity.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specs.map((s, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex justify-between text-xs">
                  <span className="font-semibold text-slate-400">{s.label}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Customer Feedback Score</h4>
                  <Rating rating={product.rating} count={product.reviewsCount} size="md" />
                </div>
                <Link href={`/reviews/${product.id}`}>
                  <Button variant="secondary" size="sm" icon={MessageSquare}>Write Review</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
