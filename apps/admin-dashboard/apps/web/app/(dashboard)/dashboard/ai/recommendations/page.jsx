'use client';

import { useState } from 'react';
import {
  Sparkles, TrendingUp, Users, ArrowUpRight, RefreshCw,
  Settings2, ToggleLeft, ToggleRight, ChevronDown, Filter,
  Star, ShoppingCart, Eye,
} from 'lucide-react';

const METRICS = [
  { label: 'Click-Through Rate', value: '23.4%', delta: '+4.2%', up: true },
  { label: 'Conversion Lift', value: '18.7%', delta: '+2.1%', up: true },
  { label: 'Avg Order Value', value: '$94.20', delta: '+$8.50', up: true },
  { label: 'Coverage', value: '87.3%', delta: '-0.8%', up: false },
];

const ENGINES = [
  { id: 'collab', name: 'Collaborative Filtering', status: 'active', accuracy: 91, latency: '24ms', model: 'SVD++ v3.2' },
  { id: 'content', name: 'Content-Based', status: 'active', accuracy: 84, latency: '18ms', model: 'TF-IDF + Embeddings' },
  { id: 'hybrid', name: 'Hybrid Ensemble', status: 'active', accuracy: 95, latency: '38ms', model: 'Weighted Blend v2' },
  { id: 'session', name: 'Session-Based (RNN)', status: 'testing', accuracy: 88, latency: '45ms', model: 'GRU v1.4 (beta)' },
];

const PLACEMENTS = [
  { name: 'Homepage Hero', enabled: true, impressions: '142K', ctr: '8.4%' },
  { name: 'Product Detail Page', enabled: true, impressions: '89K', ctr: '12.1%' },
  { name: 'Cart Sidebar', enabled: true, impressions: '34K', ctr: '19.8%' },
  { name: 'Email Campaigns', enabled: false, impressions: '0', ctr: '—' },
  { name: 'Post-Purchase', enabled: true, impressions: '12K', ctr: '6.2%' },
  { name: 'Search Results', enabled: false, impressions: '0', ctr: '—' },
];

const SAMPLE_RECS = [
  { name: 'Nike Air Max 270', category: 'Footwear', score: 0.97, views: 4210, conversions: 312, img: '👟' },
  { name: 'Sony WH-1000XM5', category: 'Electronics', score: 0.93, views: 3880, conversions: 287, img: '🎧' },
  { name: 'Levi\'s 512 Slim Taper', category: 'Apparel', score: 0.91, views: 2940, conversions: 198, img: '👖' },
  { name: 'Apple Watch Series 9', category: 'Electronics', score: 0.89, views: 5120, conversions: 401, img: '⌚' },
  { name: 'Instant Pot Duo 7-in-1', category: 'Kitchen', score: 0.87, views: 1820, conversions: 134, img: '🍲' },
];

function StatCard({ label, value, delta, up }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5">
      <p className="text-xs text-slate-400 mb-2">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      <span className={`text-xs font-medium mt-1 inline-flex items-center gap-1 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
        <ArrowUpRight size={11} className={up ? '' : 'rotate-180'} /> {delta} vs last month
      </span>
    </div>
  );
}

function Toggle({ enabled, onToggle }) {
  return (
    <button onClick={onToggle} className="flex-shrink-0">
      {enabled
        ? <ToggleRight size={24} className="text-violet-400" />
        : <ToggleLeft size={24} className="text-slate-600" />}
    </button>
  );
}

export default function RecommendationsPage() {
  const [placements, setPlacements] = useState(PLACEMENTS);
  const [activeEngine, setActiveEngine] = useState('hybrid');

  const togglePlacement = (idx) =>
    setPlacements((prev) => prev.map((p, i) => i === idx ? { ...p, enabled: !p.enabled } : p));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">AI Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Recommendations Engine</h1>
          <p className="text-sm text-slate-400 mt-1">ML-powered product suggestions tailored per user behavior and purchase affinity.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
          <RefreshCw size={14} /> Retrain Models
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map((m) => <StatCard key={m.label} {...m} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Engines */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-white">Recommendation Engines</h2>
          <div className="space-y-3">
            {ENGINES.map((eng) => (
              <div
                key={eng.id}
                onClick={() => setActiveEngine(eng.id)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                  activeEngine === eng.id
                    ? 'border-violet-500/50 bg-violet-500/10'
                    : 'border-white/[0.07] bg-white/[0.03] hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{eng.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{eng.model}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    eng.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    {eng.status}
                  </span>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-slate-500">Accuracy</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 w-28 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400" style={{ width: `${eng.accuracy}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-white">{eng.accuracy}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Latency</p>
                    <p className="text-sm font-semibold text-white mt-1">{eng.latency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placements */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Placement Controls</h2>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] divide-y divide-white/[0.05]">
            {placements.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 px-4 py-3">
                <Toggle enabled={p.enabled} onToggle={() => togglePlacement(i)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{p.name}</p>
                  {p.enabled && (
                    <p className="text-xs text-slate-400 mt-0.5">{p.impressions} impressions · {p.ctr} CTR</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Recommended Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Top Recommended Products</h2>
          <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <Filter size={12} /> Filter
          </button>
        </div>
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Category</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400">Score</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400">
                  <span className="flex items-center justify-end gap-1"><Eye size={11} />Views</span>
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400">
                  <span className="flex items-center justify-end gap-1"><ShoppingCart size={11} />Conv.</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {SAMPLE_RECS.map((r) => (
                <tr key={r.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{r.img}</span>
                      <span className="text-white font-medium text-sm">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{r.category}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Star size={11} className="text-amber-400" />
                      <span className="text-white font-semibold">{r.score.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300">{r.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-medium">{r.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
