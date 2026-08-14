'use client';

import React from 'react';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Sarah Jenkins',
    role: 'Verified Buyer • New York',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    comment: 'The quality of the leather jacket and headphones blew my expectations away. Fast delivery in 2 days, crisp packaging, and unmatched build quality!',
    rating: 5,
    product: 'Aurora Headphones & Urban Jacket'
  },
  {
    name: 'David Chen',
    role: 'Verified Buyer • San Francisco',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    comment: 'I was hesitant to order electronics online, but the 2-year warranty and seamless checkout convinced me. Customer support resolved my inquiry in 5 minutes.',
    rating: 5,
    product: 'Chrono Classic Watch'
  },
  {
    name: 'Elena Rostova',
    role: 'Verified Buyer • London',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    comment: 'Top-notch e-commerce experience! The instant live search and recommendations helped me find the perfect gift set within minutes.',
    rating: 5,
    product: 'Women’s Summer Collection'
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Customer Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Loved by Over 50,000+ Shoppers
          </h2>
          <p className="text-sm text-slate-400">
            Read real stories from our global community of fashion & tech enthusiasts.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }, (_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-white/20" />
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-indigo-400"
                />
                <div>
                  <h4 className="font-bold text-xs text-white flex items-center gap-1">
                    {rev.name}
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline" />
                  </h4>
                  <p className="text-[10px] text-slate-400">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
