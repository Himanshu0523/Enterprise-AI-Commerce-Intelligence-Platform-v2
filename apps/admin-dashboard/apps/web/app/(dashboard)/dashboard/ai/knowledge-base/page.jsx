'use client';

import { useState } from 'react';
import {
  BookOpen, ArrowUpRight, Plus, Search, Upload,
  File, Trash2, Tag, RefreshCw, CheckCircle,
} from 'lucide-react';

const METRICS = [
  { label: 'Total Documents', value: '1,240', delta: '+38', up: true },
  { label: 'Avg Query Match', value: '94.7%', delta: '+1.2%', up: true },
  { label: 'Queries Resolved', value: '98.1%', delta: '+0.4%', up: true },
  { label: 'Vector Store Size', value: '2.4 GB', delta: '+120 MB', up: false },
];

const DOCS = [
  { id: 1, title: 'Return & Refund Policy', category: 'Policy', chunks: 12, updated: '2d ago', status: 'indexed' },
  { id: 2, title: 'Shipping FAQ', category: 'FAQ', chunks: 8, updated: '5d ago', status: 'indexed' },
  { id: 3, title: 'Product Care Instructions – Electronics', category: 'Product', chunks: 34, updated: '1w ago', status: 'indexed' },
  { id: 4, title: 'Seller Agreement v3.2', category: 'Legal', chunks: 51, updated: '2w ago', status: 'indexed' },
  { id: 5, title: 'Coupon & Promo Terms', category: 'Policy', chunks: 9, updated: '3d ago', status: 'indexed' },
  { id: 6, title: 'How to Track Your Order', category: 'FAQ', chunks: 6, updated: '1d ago', status: 'processing' },
  { id: 7, title: 'Account Security Guidelines', category: 'Policy', chunks: 14, updated: '4d ago', status: 'indexed' },
  { id: 8, title: 'B2B Bulk Ordering Guide', category: 'Guide', chunks: 22, updated: '3w ago', status: 'indexed' },
];

const CATEGORIES = ['All', 'Policy', 'FAQ', 'Product', 'Legal', 'Guide'];

const CAT_COLORS = {
  Policy: 'bg-violet-500/15 text-violet-400',
  FAQ: 'bg-blue-500/15 text-blue-400',
  Product: 'bg-emerald-500/15 text-emerald-400',
  Legal: 'bg-red-500/15 text-red-400',
  Guide: 'bg-amber-500/15 text-amber-400',
};

export default function KnowledgeBasePage() {
  const [docs, setDocs] = useState(DOCS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = docs.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || d.category === category;
    return matchSearch && matchCat;
  });

  const deleteDoc = (id) => setDocs((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">AI Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
          <p className="text-sm text-slate-400 mt-1">RAG-powered document store for support, policies, and product FAQs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-colors">
            <Upload size={14} /> Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
            <Plus size={14} /> Add Document
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5">
            <p className="text-xs text-slate-400 mb-2">{m.label}</p>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <span className={`text-xs font-medium mt-1 inline-flex items-center gap-1 ${m.up ? 'text-emerald-400' : 'text-amber-400'}`}>
              <ArrowUpRight size={11} className={m.up ? '' : 'rotate-180'} /> {m.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex rounded-xl border border-white/[0.07] overflow-hidden text-xs font-medium">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 transition-colors ${category === c ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Document Table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        <div className="divide-y divide-white/[0.05]">
          {filtered.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 px-4 py-4 hover:bg-white/[0.02] transition-colors group">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${CAT_COLORS[doc.category] || 'bg-slate-500/15 text-slate-400'}`}>
                <File size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{doc.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CAT_COLORS[doc.category]}`}>{doc.category}</span>
                  <span className="text-xs text-slate-500">{doc.chunks} chunks · Updated {doc.updated}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {doc.status === 'indexed'
                  ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle size={12} /> Indexed</span>
                  : <span className="flex items-center gap-1 text-xs text-amber-400"><RefreshCw size={12} className="animate-spin" /> Processing</span>
                }
                <button
                  onClick={() => deleteDoc(doc.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No documents found for "{search}" in {category}
        </div>
      )}
    </div>
  );
}
