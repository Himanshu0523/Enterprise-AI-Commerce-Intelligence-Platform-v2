'use client';

import { useState } from 'react';
import {
  ShieldAlert, ArrowUpRight, RefreshCw, AlertTriangle,
  CheckCircle, XCircle, Eye, Clock, MapPin, Zap,
} from 'lucide-react';

const METRICS = [
  { label: 'Precision', value: '99.2%', delta: '+0.4%', up: true },
  { label: 'Recall', value: '96.8%', delta: '+0.9%', up: true },
  { label: 'Fraud Blocked Today', value: '$41,280', delta: '+$8,120', up: true },
  { label: 'False Positive Rate', value: '0.8%', delta: '-0.2%', up: true },
];

const RISK_CATEGORIES = [
  { label: 'Account Takeover', count: 14, pct: 38, color: 'bg-red-500' },
  { label: 'Card Testing', count: 9, pct: 24, color: 'bg-orange-500' },
  { label: 'Refund Abuse', count: 7, pct: 19, color: 'bg-amber-500' },
  { label: 'Promo Stacking', count: 5, pct: 14, color: 'bg-yellow-500' },
  { label: 'Bot Activity', count: 2, pct: 5, color: 'bg-violet-500' },
];

const ALERTS = [
  {
    id: 'FRD-0041', type: 'Account Takeover', risk: 'Critical', score: 0.98,
    user: 'u_827491', order: '#ORD-29182', amount: '$1,240', location: 'Lagos, NG',
    time: '2m ago', status: 'blocked',
  },
  {
    id: 'FRD-0040', type: 'Card Testing', risk: 'High', score: 0.87,
    user: 'u_291847', order: '#ORD-29170', amount: '$4.99', location: 'Bucharest, RO',
    time: '14m ago', status: 'blocked',
  },
  {
    id: 'FRD-0039', type: 'Refund Abuse', risk: 'Medium', score: 0.71,
    user: 'u_502918', order: '#ORD-29143', amount: '$89.00', location: 'Houston, US',
    time: '1h ago', status: 'review',
  },
  {
    id: 'FRD-0038', type: 'Bot Activity', risk: 'Low', score: 0.52,
    user: 'bot_00291', order: '—', amount: '—', location: 'Unknown',
    time: '2h ago', status: 'flagged',
  },
  {
    id: 'FRD-0037', type: 'Promo Stacking', risk: 'Medium', score: 0.68,
    user: 'u_104728', order: '#ORD-29100', amount: '$230.00', location: 'Berlin, DE',
    time: '3h ago', status: 'review',
  },
];

const RISK_COLORS = {
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Low: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const STATUS_ICONS = {
  blocked: <XCircle size={14} className="text-red-400" />,
  review: <Eye size={14} className="text-amber-400" />,
  flagged: <AlertTriangle size={14} className="text-orange-400" />,
};

export default function FraudDetectionPage() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState('all');

  const dismiss = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));
  const approve = (id) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: 'cleared' } : a));

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert size={18} className="text-red-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">AI Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Fraud Detection</h1>
          <p className="text-sm text-slate-400 mt-1">Anomaly detection across transactions, accounts, and behavioral patterns.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          <Zap size={12} className="animate-pulse" /> Live monitoring active
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
        {/* Risk Category Breakdown */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Risk Breakdown (Today)</h2>
          <div className="space-y-3">
            {RISK_CATEGORIES.map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">{c.label}</span>
                  <span className="text-slate-400">{c.count} alerts</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.07]">
            <p className="text-xs text-slate-400">Total flagged today</p>
            <p className="text-3xl font-bold text-white mt-1">{RISK_CATEGORIES.reduce((a, c) => a + c.count, 0)}</p>
          </div>
        </div>

        {/* Alert Feed */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Alert Feed</h2>
            <div className="flex rounded-xl border border-white/[0.07] overflow-hidden text-xs font-medium">
              {['all', 'blocked', 'review', 'flagged'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 capitalize transition-colors ${filter === f ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filtered.map((alert) => (
              <div key={alert.id} className={`rounded-2xl border p-4 transition-all ${
                alert.status === 'cleared' ? 'border-emerald-500/20 bg-emerald-500/5 opacity-60' : 'border-white/[0.07] bg-white/[0.03]'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RISK_COLORS[alert.risk]}`}>
                        {alert.risk}
                      </span>
                      <span className="text-xs text-white font-semibold">{alert.type}</span>
                      <span className="text-xs text-slate-500 font-mono">{alert.id}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={10} /> {alert.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {alert.location}</span>
                      <span>User: <span className="text-slate-300">{alert.user}</span></span>
                      <span>Amount: <span className="text-red-400 font-semibold">{alert.amount}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Risk Score</p>
                      <p className="text-lg font-bold text-red-400">{alert.score.toFixed(2)}</p>
                    </div>
                    {STATUS_ICONS[alert.status]}
                  </div>
                </div>
                {alert.status !== 'cleared' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                    <button
                      onClick={() => approve(alert.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
                    >
                      <CheckCircle size={11} /> Approve
                    </button>
                    <button
                      onClick={() => dismiss(alert.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
                    >
                      <XCircle size={11} /> Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
