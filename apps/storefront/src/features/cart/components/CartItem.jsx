'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, Heart, Sparkles, AlertCircle } from 'lucide-react';
import Price from '@/features/shared/ui/Price';
import Badge from '@/features/shared/ui/Badge';

export default function CartItem({ item, onUpdateQuantity, onRemove, onMoveToWishlist }) {
  const {
    id,
    name,
    price,
    originalPrice,
    image,
    color,
    size,
    quantity,
    inStock = true,
    aiSavingsHint,
    badge,
  } = item;

  return (
    <div className="group relative flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Product Image */}
      <div className="relative w-full sm:w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-2 left-2">
            <Badge variant="purple" size="sm">
              {badge}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/product/${id}`}
              className="text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
            >
              {name}
            </Link>
            {/* Desktop Price */}
            <div className="hidden sm:block text-right">
              <Price amount={price * quantity} currency="$" size="lg" weight="bold" />
              {originalPrice && originalPrice > price && (
                <div className="text-xs text-slate-400 line-through">
                  ${(originalPrice * quantity).toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Variants & Attributes */}
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
            {color && (
              <span className="flex items-center gap-1">
                Color: <strong className="text-slate-700 dark:text-slate-300 font-medium">{color}</strong>
              </span>
            )}
            {size && (
              <span className="flex items-center gap-1">
                Size: <strong className="text-slate-700 dark:text-slate-300 font-medium">{size}</strong>
              </span>
            )}
            <span className="flex items-center gap-1">
              Status:{' '}
              {inStock ? (
                <strong className="text-emerald-600 dark:text-emerald-400 font-medium">In Stock</strong>
              ) : (
                <strong className="text-rose-500 font-medium flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> Low Stock
                </strong>
              )}
            </span>
          </div>

          {/* AI Smart Hint */}
          {aiSavingsHint && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/50 dark:border-indigo-800/50 text-xs text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse flex-shrink-0" />
              <span>{aiSavingsHint}</span>
            </div>
          )}
        </div>

        {/* Action Controls & Mobile Price */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Quantity Controls */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1">
            <button
              onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Price */}
          <div className="sm:hidden text-right">
            <Price amount={price * quantity} currency="$" size="md" weight="bold" />
          </div>

          {/* Item Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onMoveToWishlist?.(id)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Save for later</span>
            </button>
            <button
              onClick={() => onRemove(id)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
