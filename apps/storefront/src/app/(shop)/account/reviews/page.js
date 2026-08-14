'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Filter, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AccountReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: 'rev_1',
      productName: 'Aura Noise-Canceling Wireless Headphones Pro',
      productSlug: 'aura-noise-canceling-wireless-headphones-pro',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
      rating: 5,
      title: 'Best sound stage and active noise cancellation in class!',
      comment:
        'The ANC performance is phenomenal, especially on plane rides and commuting. Battery life lasts well over 30 hours. Highly recommend!',
      date: '2026-07-28',
      verified: true,
      helpfulCount: 14,
    },
    {
      id: 'rev_2',
      productName: 'Ergonomic Mesh Executive Chair Matrix',
      productSlug: 'ergonomic-mesh-executive-chair-matrix',
      productImage: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=300&q=80',
      rating: 4,
      title: 'Great lumbar support for long coding sessions',
      comment:
        'Very sturdy build and comfortable lumbar pad. Assembly took around 20 minutes. Minor issue with armrest adjustability.',
      date: '2026-06-15',
      verified: true,
      helpfulCount: 6,
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  const handleDelete = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === '5star') return r.rating === 5;
    if (activeFilter === '4star') return r.rating === 4;
    return true;
  });

  const averageRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Product Reviews</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Track and manage feedback you have submitted for purchased products.
          </p>
        </div>
      </div>

      {/* Review Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center font-bold text-xl">
            ★
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{averageRating}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Average Rating Given</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{reviews.length}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Total Reviews Written</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <ThumbsUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {reviews.reduce((acc, r) => acc + r.helpfulCount, 0)}
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Helpful Votes Received</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
        <Filter className="h-4 w-4 text-slate-400 mr-2" />
        {['all', '5star', '4star'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
              activeFilter === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
            }`}
          >
            {tab === 'all' ? 'All Reviews' : tab === '5star' ? '5 Star Reviews' : '4 Star Reviews'}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-12 text-center space-y-3">
          <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-500 dark:text-zinc-400">No reviews found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4 transition hover:border-indigo-500/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={rev.productImage}
                    alt={rev.productName}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-zinc-800"
                  />
                  <div>
                    <Link
                      href={`/products/${rev.productSlug}`}
                      className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition text-sm sm:text-base line-clamp-1"
                    >
                      {rev.productName}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className="text-xs text-slate-400">{rev.date}</span>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                    title="Delete Review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm mb-1">{rev.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <ThumbsUp className="h-3.5 w-3.5 text-indigo-500" />
                <span>{rev.helpfulCount} customers found this review helpful</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

