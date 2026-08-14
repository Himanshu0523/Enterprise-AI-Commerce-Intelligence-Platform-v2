'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Sparkles, Star } from 'lucide-react';
import { Badge, Price, Rating } from '@/features/shared/ui';

export default function ProductCard({
  product = {
    id: '1',
    name: 'Aurora Wireless ANC Headphones Ultra',
    slug: 'aurora-wireless-anc-headphones',
    category: 'Electronics',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    isNew: true,
    aiMatch: 98,
    inStock: true
  },
  onAddToCart,
  onQuickView
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      if (onAddToCart) onAddToCart(product);
    }, 600);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/30">
              NEW
            </span>
          )}
          {product.aiMatch && (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-md shadow-purple-600/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {product.aiMatch}% Match
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex-1 py-2.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-2xl backdrop-blur-md shadow-lg flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-4 h-4" /> Quick View
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {product.category}
          </span>

          <Link href={`/product/${product.slug || product.id}`}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          <Rating rating={product.rating} count={product.reviewsCount} size="sm" />
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <Price price={product.price} originalPrice={product.originalPrice} size="sm" />

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`p-2.5 rounded-2xl transition-all flex items-center justify-center ${
              isAdding
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 hover:text-white dark:hover:text-white'
            }`}
            aria-label="Add to Cart"
          >
            {isAdding ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
