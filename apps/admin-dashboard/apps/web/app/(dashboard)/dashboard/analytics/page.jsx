'use client';

import { useState } from 'react';
import {
  BarChart2, TrendingUp, Users, ArrowUpRight, ArrowDownRight,
  Globe, Smartphone, Laptop, Filter, Download, PieChart, RefreshCw
} from 'lucide-react';

const METRICS = [
  { label: 'Conversion Rate', value: '3.84%', change: '+0.6%', positive: true },
  { label: 'Average Order Value', value: '$86.60', change: '+$4.20', positive: true },
  { label: 'Customer Lifetime Value', value: '$420.50', change: '+$18.00', positive: true },
  { label: 'Cart Abandonment Rate', value: '24.1%', change: '-2.4%', positive: true },
];

const CATEGORIES_BREAKDOWN = [
  { category: 'Electronics & Gadgets', sales: '$54,200', percent: 42, color: 'bg-violet-500' },
  { category: 'Fashion & Apparel', sales: '$32,100', percent: 25, color: 'bg-indigo-500' },
  { category: 'Home & Kitchen', sales: '$24,500', percent: 19, color: 'bg-blue-500' },
  { category: 'Beauty & Personal Care', sales: '$17,650', percent: 14, color: 'bg-emerald-500' },
];

const TRAFFIC_SOURCES = [
  { source: 'Organic Search (Google)', visitors: '45,210', share: '48%', color: 'from-violet-500 to-indigo-600' },
  { source: 'Direct Access', visitors: '22,400', share: '24%', color: 'from-blue-500 to-cyan-500' },
  { source: 'Social Media (Instagram/TikTok)', visitors: '16,800', share: '18%', color: 'from-pink-500 to-rose-500' },
  { source: 'Email Campaigns', visitors: '9,350', share: '10%', color: 'from-emerald-500 to-teal-500' },
];

export default function AnalyticsPage() {
  const [timeline, setTimeline] = useState('30d');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={20} className="text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Business Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Analytics & Performance</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time data insights, conversion metrics, and traffic breakdown.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#0f1117] border border-white/10 p-1 rounded-xl">
            {['7d', '30d', '90d', '1y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeline(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  timeline === t ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition-all shadow-lg shadow-violet-600/20">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-2xl bg-[#0f1117] border border-white/5 p-5">
            <p className="text-xs text-slate-400 font-medium">{m.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{m.value}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${m.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {m.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {m.change}
              </span>
              <span className="text-[11px] text-slate-500">vs previous period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales by Category (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0f1117] border border-white/5 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Sales Distribution by Category</h2>
              <p className="text-xs text-slate-400 mt-0.5">Revenue generated per main product category</p>
            </div>
            <span className="text-xs font-semibold text-violet-400">Total $128,450</span>
          </div>

          <div className="space-y-4">
            {CATEGORIES_BREAKDOWN.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>{cat.category}</span>
                  <span className="font-bold text-white">{cat.sales} ({cat.percent}%)</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-white/[0.02]">
              <p className="text-[11px] text-slate-400">Top Category</p>
              <p className="text-xs font-bold text-white mt-1">Electronics</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02]">
              <p className="text-[11px] text-slate-400">Growth Leader</p>
              <p className="text-xs font-bold text-emerald-400 mt-1">Apparel (+24%)</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02]">
              <p className="text-[11px] text-slate-400">Avg Margin</p>
              <p className="text-xs font-bold text-white mt-1">38.5%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02]">
              <p className="text-[11px] text-slate-400">Refund Rate</p>
              <p className="text-xs font-bold text-amber-400 mt-1">1.2%</p>
            </div>
          </div>
        </div>

        {/* Device Breakdown & Traffic */}
        <div className="rounded-2xl bg-[#0f1117] border border-white/5 p-6 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              Traffic Sources
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Top channels driving visitor traffic</p>

            <div className="mt-6 space-y-3">
              {TRAFFIC_SOURCES.map((src) => (
                <div key={src.source} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{src.source}</span>
                    <span className="font-bold text-violet-400">{src.share}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{src.visitors} sessions</span>
                    <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${src.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center">
            <p className="text-xs font-semibold text-violet-300">Mobile Traffic Spike</p>
            <p className="text-[11px] text-slate-400 mt-1">68% of all purchases originated from mobile devices this week.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
