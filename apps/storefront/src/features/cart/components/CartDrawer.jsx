'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight, Trash2, Sparkles } from 'lucide-react';
import Price from '@/features/shared/ui/Price';
import Button from '@/features/shared/ui/Button';

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemove,
  subtotal = 0,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Your Cart
                </h2>
                <p className="text-xs text-slate-500">{items.reduce((acc, i) => acc + i.quantity, 0)} items</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Banner */}
          <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>AI Smart Cart: FREE shipping on orders over $150</span>
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Your Cart is Empty
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                  Looks like you haven't added anything yet. Discover our AI-recommended items!
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.color} {item.size && `• ${item.size}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1.5 py-0.5 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          -
                        </button>
                        <span className="px-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          +
                        </button>
                      </div>

                      <Price amount={item.price * item.quantity} currency="$" size="sm" weight="bold" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout Button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Subtotal</span>
                <Price amount={subtotal} currency="$" size="lg" weight="extrabold" />
              </div>
              <p className="text-[11px] text-slate-400">
                Taxes and shipping calculated at checkout.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/cart" onClick={onClose} className="w-full">
                  <Button variant="outline" size="md" className="w-full text-xs">
                    View Full Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={onClose} className="w-full">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
