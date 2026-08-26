'use client';

import { useState } from 'react';
import {
  Star, ThumbsUp, ShieldAlert, MessageSquare, Search, Filter, CheckCircle2, XCircle, Sparkles
} from 'lucide-react';

const INITIAL_REVIEWS = [
  { id: 'REV-801', product: 'Sony WH-1000XM5 Headphones', customer: 'Alex Johnson', rating: 5, date: '2026-08-14', comment: 'Best noise cancellation on the market! Battery life easily lasts my entire international flight.', status: 'Approved', sentiment: 'Positive (98%)' },
  { id: 'REV-802', product: 'MacBook Pro 16" M3 Max', customer: 'Sarah Connor', rating: 4, date: '2026-08-13', comment: 'Incredible performance for video editing, though it runs a bit warm during heavy 8K rendering.', status: 'Approved', sentiment: 'Positive (85%)' },
  { id: 'REV-803', product: 'Apple Watch Ultra 2', customer: 'David Kim', rating: 1, date: '2026-08-12', comment: 'Package arrived with a damaged box and missing charger cable. Need a replacement ASAP!', status: 'Flagged', sentiment: 'Negative (92%)' },
  { id: 'REV-804', product: 'Samsung Galaxy S24 Ultra', customer: 'Elena Rostova', rating: 5, date: '2026-08-10', comment: 'The anti-reflective screen is a game changer in bright sunlight. Camera zoom is absurdly clear.', status: 'Approved', sentiment: 'Positive (99%)' },
  { id: 'REV-805', product: 'Logitech MX Master 3S', customer: 'Michael Chen', rating: 2, date: '2026-08-09', comment: 'Scroll wheel started glitching after two weeks. Waiting on customer support response.', status: 'Pending', sentiment: 'Negative (78%)' },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);

  const filtered = reviews.filter((rev) => {
    const matchesSearch = rev.product.toLowerCase().includes(search.toLowerCase()) || rev.customer.toLowerCase().includes(search.toLowerCase()) || rev.comment.toLowerCase().includes(search.toLowerCase());
    const matchesRating = ratingFilter === 'ALL' || rev.rating === parseInt(ratingFilter, 10);
    const matchesStatus = statusFilter === 'ALL' || rev.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className={i < rating ? 'fill-amber-400' : 'text-slate-600'} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="text-amber-400 fill-amber-400" /> Customer Reviews & Ratings
          </h1>
          <p className="text-sm text-slate-400">Monitor customer feedback, sentiment analysis, and moderate user reviews.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Average Rating</span>
            <Star size={16} className="text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">4.8 / 5.0</p>
          <p className="text-xs text-slate-500">Based on 1,420 total reviews</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>AI Sentiment Score</span>
            <Sparkles size={16} className="text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">92% Positive</p>
          <p className="text-xs text-slate-500">Analyzed by AI Commerce Engine</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Pending Moderation</span>
            <MessageSquare size={16} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {reviews.filter((r) => r.status === 'Pending').length} Reviews
          </p>
          <p className="text-xs text-slate-500">Requires store manager approval</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Flagged Reviews</span>
            <ShieldAlert size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400">
            {reviews.filter((r) => r.status === 'Flagged').length} Reviews
          </p>
          <p className="text-xs text-slate-500">Low rating or policy alert</p>
        </div>
      </div>

      {/* Filter & Review List */}
      <div className="bg-[#151821] rounded-2xl border border-white/5 overflow-hidden p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, customer, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500"
            >
              <option value="ALL">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="FLAGGED">Flagged</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((rev) => (
            <div key={rev.id} className="p-4 bg-[#0f1117] rounded-xl border border-white/5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white text-sm">{rev.customer}</span>
                    {renderStars(rev.rating)}
                    <span className="text-xs text-slate-500">{rev.date}</span>
                  </div>
                  <p className="text-xs text-violet-400 font-medium mt-0.5">{rev.product}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-md">
                    Sentiment: {rev.sentiment}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    rev.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                    rev.status === 'Flagged' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {rev.status}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300">{rev.comment}</p>

              <div className="flex items-center justify-between pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span>Review ID: {rev.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  {rev.status !== 'Approved' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'Approved')}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition"
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                  )}
                  {rev.status !== 'Flagged' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'Flagged')}
                      className="flex items-center gap-1 px-3 py-1 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition"
                    >
                      <XCircle size={14} /> Flag
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm">
              No reviews match the selected filter parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
