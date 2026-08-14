'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headset, Lock } from 'lucide-react';

const BADGES = [
  {
    icon: Truck,
    title: 'Free Worldwide Express',
    desc: 'On all orders over $99. Fast & tracked delivery right to your door.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/50'
  },
  {
    icon: ShieldCheck,
    title: '100% Authentic Guaranteed',
    desc: 'Sourced directly from verified manufacturers with full warranty.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50'
  },
  {
    icon: RefreshCw,
    title: '30-Day Easy Returns',
    desc: 'No questions asked hassle-free return and instant exchange policy.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/50'
  },
  {
    icon: Headset,
    title: '24/7 Dedicated Support',
    desc: 'Our customer support team is available round-the-clock via live chat.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/50'
  }
];

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className={`p-3 rounded-2xl ${item.bg} ${item.color} flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
