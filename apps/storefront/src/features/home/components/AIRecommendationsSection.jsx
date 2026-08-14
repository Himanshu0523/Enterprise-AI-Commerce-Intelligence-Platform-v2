'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import ProductCard from '@/features/shared/ProductCard';

export default function AIRecommendationsSection() {
  const recommendedProducts = [
    {
      id: 'ai-1',
      name: 'Aurora Minimalist Smart Glasses V2',
      slug: 'aurora-minimalist-smart-glasses-v2',
      category: 'Tech Accessories',
      price: 299.00,
      originalPrice: 349.00,
      rating: 4.9,
      reviewsCount: 142,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
      aiMatch: 99,
      isNew: true
    },
    {
      id: 'ai-2',
      name: 'Organic Wool Oversized Trench Coat',
      slug: 'organic-wool-oversized-trench-coat',
      category: 'Fashion',
      price: 189.00,
      originalPrice: 240.00,
      rating: 4.85,
      reviewsCount: 88,
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
      aiMatch: 97,
      isNew: false
    },
    {
      id: 'ai-3',
      name: 'Ergonomic Mesh Task Chair Ultra',
      slug: 'ergonomic-mesh-task-chair-ultra',
      category: 'Home & Office',
      price: 349.99,
      originalPrice: 420.00,
      rating: 4.92,
      reviewsCount: 230,
      image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&q=80',
      aiMatch: 96,
      isNew: true
    },
    {
      id: 'ai-4',
      name: 'Pro DSLR Mirrorless Camera 4K',
      slug: 'pro-dslr-mirrorless-camera-4k',
      category: 'Photography',
      price: 1199.00,
      originalPrice: 1399.00,
      rating: 4.98,
      reviewsCount: 310,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      aiMatch: 98,
      isNew: false
    }
  ];

  return (
    <section className="my-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Curated By Gemini 3.0 Pro
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Recommended For You
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hyper-personalized based on your browsing history, preferences, and trending styles.
          </p>
        </div>

        <Link
          href="/ai/recommendations"
          className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View Full AI Studio <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
