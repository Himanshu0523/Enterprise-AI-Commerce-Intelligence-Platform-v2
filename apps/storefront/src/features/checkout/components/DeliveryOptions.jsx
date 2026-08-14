'use client';

import React, { useState } from 'react';
import { Truck, Zap, Leaf, Sparkles, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '@/features/shared/ui/Button';

const OPTIONS = [
  {
    id: 'eco',
    title: 'AI Smart Eco Delivery',
    time: '3-4 Business Days',
    price: 0,
    icon: Leaf,
    badge: 'Recommended',
    description: 'AI optimizes carrier routes to reduce carbon emissions by 40%.',
    highlight: 'FREE',
  },
  {
    id: 'standard',
    title: 'Standard Ground Shipping',
    time: '2-3 Business Days',
    price: 7.99,
    icon: Truck,
    description: 'Reliable door-to-door delivery with live GPS tracking.',
  },
  {
    id: 'express',
    title: 'Priority Overnight Express',
    time: 'Next Day Air (by 10:30 AM)',
    price: 19.99,
    icon: Zap,
    badge: 'Fastest',
    description: 'Guaranteed next-day delivery with real-time SMS status updates.',
  },
];

export default function DeliveryOptions({ onBack, onSubmitNext, initialMethod = 'eco' }) {
  const [selectedId, setSelectedId] = useState(initialMethod);

  const handleSubmit = (e) => {
    e.preventDefault();
    const chosen = OPTIONS.find((o) => o.id === selectedId);
    onSubmitNext(chosen);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Delivery Method
        </h2>
        <p className="text-xs text-slate-500">Choose your preferred shipping speed</p>
      </div>

      <div className="space-y-4">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedId === option.id;

          return (
            <div
              key={option.id}
              onClick={() => setSelectedId(option.id)}
              className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {option.title}
                    </span>
                    {option.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                        {option.badge}
                      </span>
                    )}
                  </div>

                  <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {option.price === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        FREE
                      </span>
                    ) : (
                      `$${option.price.toFixed(2)}`
                    )}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  Est. Delivery: {option.time}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {option.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button variant="ghost" size="md" type="button" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Shipping
        </Button>
        <Button variant="primary" size="lg" type="submit" className="flex items-center gap-2 px-8">
          <span>Continue to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
