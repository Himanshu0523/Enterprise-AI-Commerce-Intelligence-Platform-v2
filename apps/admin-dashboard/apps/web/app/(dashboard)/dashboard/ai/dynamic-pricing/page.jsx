'use client';

import { useState } from 'react';
import {
  DollarSign, ArrowUpRight, RefreshCw, TrendingUp,
  TrendingDown, Zap, AlertCircle, ChevronDown,
  ToggleLeft, ToggleRight,
} from 'lucide-react';

const METRICS = [
  { label: 'Revenue Lift', value: '+12.4%', delta: '+1.8%', up: true },
  { label: 'Margin Protected', value: '94.7%', delta: '+0.3%', up: true },
  { label: 'Price Changes / Day', value: '3,841', delta: '+412', up: true },
  { label: 'Avg Price Index', value: '1.03x', delta: '-0.01x', up: false },
];

const RULES = [
  { name: 'Competitor Match', desc: 'Match lowest competitor price + 2% margin floor', enabled: true },
  { name: 'Demand Surge', desc: 'Raise price up to 15% when demand spikes > 40%', enabled: true },
  { name: 'Flash Sale Override', desc: 'Allow discounts up to 30% during scheduled flash events', enabled: false },
  { name: 'Clearance Mode', desc: 'Aggressively reduce to 50% off for items > 90d stale', enabled: true },
  { name: 'Bundle Incentive', desc: 'Offer 8% discount on bundles with 3+ units', enabled: false },
];

const PRODUCTS = [
  { name: 'Nike Air Max 270', base: 130, current: 142, competitor: 138, demand: 'High', change: '+9.2%', dir: 'up' },
  { name: 'Sony WH-1000XM5', base: 350, current: 339, competitor: 329, demand: 'Medium', change: '-3.1%', dir: 'down' },
  { name: 'Apple Watch S9', base: 399, current: 421, competitor: 410, demand: 'Very High', change: '+5.5%', dir: 'up' },
  { name: "Levi's 512 Slim", base: 70, current: 64, competitor: 68, demand: 'Low', change: '-8.6%', dir: 'down' },
  { name: 'Instant Pot Duo', base: 99, current: 102, competitor: 97, demand: 'Medium', change: '+3.0%', dir: 'up' },
];

const PRICE_HISTORY = [72, 78, 84, 89, 95, 102, 109, 114, 108, 104, 102, 105];
const max = Math.max(...PRICE_HISTORY);
const min = Math.min(...PRICE_HISTORY);

export default function DynamicPricingPage() {
  const [rules, setRules] = useState(RULES);
  const [autoMode, setAutoMode] = useState(true);

  const toggleRule = (i) =>
    setRules((prev) => prev.map((r, idx) => idx === i ? { ...r, enabled: !r.enabled } : r));

  const pts = PRICE_HISTORY.map((v, i) => {
    const x = (i / (PRICE_HISTORY.length - 1)) * 100;
    const y = 100 - ((v - min) / (max - min)) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={18} className="text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">AI Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Dynamic Pricing</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time price optimization based on demand elasticity, competition, and margin targets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoMode((a) => !a)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              autoMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Zap size={14} /> {autoMode ? 'Auto Mode ON' : 'Auto Mode OFF'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
            <RefreshCw size={14} /> Recalculate
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5">
            <p className="text-xs text-slate-400 mb-2">{m.label}</p>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <span className={`text-xs font-medium mt-1 inline-flex items-center gap-1 ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>
              <ArrowUpRight size={11} className={m.up ? '' : 'rotate-180'} /> {m.delta}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Price History Sparkline */}
        <div className="xl:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Catalog-Wide Avg Price Index (12m)</h2>
              <p className="text-xs text-slate-400 mt-0.5">Relative to base prices — 1.00x = no change</p>
            </div>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-36 w-full">
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              points={pts}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* Product Table */}
          <div className="mt-4 rounded-xl border border-white/[0.07] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400">Product</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-400">Base</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-400">Current</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-400">Competitor</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-400">Change</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-400">Demand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {PRODUCTS.map((p) => (
                  <tr key={p.name} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 text-white font-medium text-sm">{p.name}</td>
                    <td className="px-4 py-2.5 text-right text-slate-400">${p.base}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-white">${p.current}</td>
                    <td className="px-4 py-2.5 text-right text-slate-400">${p.competitor}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`text-xs font-semibold flex items-center justify-end gap-1 ${p.dir === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {p.dir === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {p.change}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.demand === 'Very High' ? 'bg-emerald-500/20 text-emerald-400'
                        : p.demand === 'High' ? 'bg-blue-500/20 text-blue-400'
                        : p.demand === 'Medium' ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                      }`}>{p.demand}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Rules */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Pricing Rules</h2>
          <div className="space-y-3">
            {rules.map((r, i) => (
              <div key={r.name} className={`rounded-2xl border p-4 transition-all ${r.enabled ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/[0.07] bg-white/[0.03]'}`}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleRule(i)} className="mt-0.5 flex-shrink-0">
                    {r.enabled
                      ? <ToggleRight size={22} className="text-emerald-400" />
                      : <ToggleLeft size={22} className="text-slate-600" />}
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-white">{r.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
