'use client';

import { useState } from 'react';
import {
  PieChart, ArrowUpRight, RefreshCw, Users,
  TrendingUp, ShoppingBag, DollarSign, Target,
} from 'lucide-react';

const METRICS = [
  { label: 'Active Segments', value: '8', delta: '+2', up: true },
  { label: 'Segmented Users', value: '148K', delta: '+12K', up: true },
  { label: 'Campaign Lift', value: '+34.2%', delta: '+6.1%', up: true },
  { label: 'Coverage', value: '91.4%', delta: '+3.2%', up: true },
];

const SEGMENTS = [
  {
    id: 'champions', name: 'Champions', color: '#8b5cf6', users: 12400, pct: 8.4,
    ltv: '$1,840', orders: 14.2, retention: 96, desc: 'High-frequency, high-spend loyalists',
    tags: ['VIP', 'Loyal', 'High LTV'],
  },
  {
    id: 'loyal', name: 'Loyal Customers', color: '#3b82f6', users: 28700, pct: 19.4,
    ltv: '$920', orders: 7.8, retention: 88, desc: 'Regular buyers with solid engagement',
    tags: ['Loyal', 'Engaged'],
  },
  {
    id: 'potential', name: 'Potential Loyalists', color: '#06b6d4', users: 31200, pct: 21.1,
    ltv: '$440', orders: 3.1, retention: 72, desc: 'New or growing customers showing promise',
    tags: ['Growing', 'Nurture'],
  },
  {
    id: 'atrisk', name: 'At-Risk Customers', color: '#f59e0b', users: 19800, pct: 13.4,
    ltv: '$380', orders: 2.4, retention: 41, desc: 'Previously active, now disengaging',
    tags: ['Churn Risk', 'Win-Back'],
  },
  {
    id: 'needing', name: 'Need Attention', color: '#ef4444', users: 14100, pct: 9.5,
    ltv: '$210', orders: 1.8, retention: 28, desc: 'Declining activity and purchase frequency',
    tags: ['Re-engage'],
  },
  {
    id: 'new', name: 'New Customers', color: '#10b981', users: 22600, pct: 15.3,
    ltv: '$124', orders: 1.1, retention: 55, desc: 'First-time buyers in last 30 days',
    tags: ['Onboard', 'Nurture'],
  },
  {
    id: 'price', name: 'Price Sensitive', color: '#f97316', users: 9200, pct: 6.2,
    ltv: '$190', orders: 2.8, retention: 48, desc: 'Discount-driven, coupon-heavy buyers',
    tags: ['Promo', 'Bundle'],
  },
  {
    id: 'dormant', name: 'Dormant', color: '#64748b', users: 9800, pct: 6.7,
    ltv: '$85', orders: 0.3, retention: 8, desc: 'No activity in 6+ months',
    tags: ['Reactivation'],
  },
];

export default function SegmentationPage() {
  const [selected, setSelected] = useState(SEGMENTS[0]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PieChart size={18} className="text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">AI Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Customer Segmentation</h1>
          <p className="text-sm text-slate-400 mt-1">Behavioral clustering via RFM analysis and ML to power hyper-targeted campaigns.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors">
          <RefreshCw size={14} /> Re-Cluster
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5">
            <p className="text-xs text-slate-400 mb-2">{m.label}</p>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <span className={`text-xs font-medium mt-1 inline-flex items-center gap-1 ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>
              <ArrowUpRight size={11} /> {m.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Visual Bubbles + Detail */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Segment Grid */}
        <div className="xl:col-span-2 grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 gap-3">
          {SEGMENTS.map((seg) => (
            <button
              key={seg.id}
              onClick={() => setSelected(seg)}
              className={`rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] ${
                selected.id === seg.id
                  ? 'border-violet-500/50 shadow-lg'
                  : 'border-white/[0.07] bg-white/[0.03]'
              }`}
              style={selected.id === seg.id ? { background: `${seg.color}15`, borderColor: `${seg.color}50` } : {}}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                <span className="text-xs font-semibold text-white truncate">{seg.name}</span>
              </div>
              <p className="text-xl font-bold text-white">{seg.users.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-0.5">{seg.pct}% of base</p>
              <div className="mt-2 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${seg.pct * 4}%`, background: seg.color }} />
              </div>
            </button>
          ))}
        </div>

        {/* Segment Detail */}
        <div className="rounded-2xl border p-6 transition-all" style={{ borderColor: `${selected.color}40`, background: `${selected.color}08` }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full" style={{ background: selected.color }} />
            <h2 className="text-sm font-bold text-white">{selected.name}</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">{selected.desc}</p>

          <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-xs text-slate-400"><Users size={11} /> Users</span>
              <span className="text-sm font-semibold text-white">{selected.users.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-xs text-slate-400"><DollarSign size={11} /> Avg LTV</span>
              <span className="text-sm font-semibold text-white">{selected.ltv}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-xs text-slate-400"><ShoppingBag size={11} /> Avg Orders</span>
              <span className="text-sm font-semibold text-white">{selected.orders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-xs text-slate-400"><Target size={11} /> Retention</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${selected.retention}%`, background: selected.color }} />
                </div>
                <span className="text-sm font-semibold text-white">{selected.retention}%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {selected.tags.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${selected.color}20`, color: selected.color }}>
                {t}
              </span>
            ))}
          </div>

          <button className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-colors" style={{ background: selected.color }}>
            Create Campaign →
          </button>
        </div>
      </div>
    </div>
  );
}
