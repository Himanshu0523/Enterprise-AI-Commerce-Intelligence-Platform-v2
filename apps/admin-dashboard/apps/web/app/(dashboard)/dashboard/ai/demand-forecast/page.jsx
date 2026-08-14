'use client';

import { useState } from 'react';
import {
  TrendingUp, ArrowUpRight, RefreshCw, Calendar,
  Package, AlertTriangle, ChevronDown, BarChart2,
} from 'lucide-react';

const METRICS = [
  { label: 'Forecast Accuracy', value: '94.1%', delta: '+1.3%', up: true },
  { label: 'Stockout Prevention', value: '98.4%', delta: '+0.7%', up: true },
  { label: 'Overstock Reduction', value: '31.2%', delta: '+5.4%', up: true },
  { label: 'Inventory Cost Saved', value: '$284K', delta: '+$42K', up: true },
];

const FORECAST_DATA = [
  { sku: 'NKE-AM270-BLK', name: 'Nike Air Max 270 Black', current: 142, forecast: 389, confidence: 92, trend: 'up', alert: false },
  { sku: 'APL-W9-41MM', name: 'Apple Watch S9 41mm', current: 28, forecast: 310, confidence: 87, trend: 'up', alert: true },
  { sku: 'SNY-WH1000', name: 'Sony WH-1000XM5', current: 85, forecast: 201, confidence: 94, trend: 'up', alert: false },
  { sku: 'LVS-512-32', name: "Levi's 512 Slim 32W", current: 210, forecast: 165, confidence: 78, trend: 'down', alert: false },
  { sku: 'IP-DUO7-6Q', name: 'Instant Pot Duo 6Qt', current: 44, forecast: 88, confidence: 81, trend: 'up', alert: false },
  { sku: 'SAM-S24U-512', name: 'Samsung S24 Ultra 512GB', current: 12, forecast: 178, confidence: 89, trend: 'up', alert: true },
];

const CHART_BARS = [
  { month: 'Feb', actual: 68, forecast: 72 },
  { month: 'Mar', actual: 82, forecast: 79 },
  { month: 'Apr', actual: 75, forecast: 77 },
  { month: 'May', actual: 91, forecast: 88 },
  { month: 'Jun', actual: 103, forecast: 97 },
  { month: 'Jul', actual: 118, forecast: 112 },
  { month: 'Aug', actual: null, forecast: 124 },
  { month: 'Sep', actual: null, forecast: 131 },
];

const maxVal = 145;

export default function DemandForecastPage() {
  const [horizon, setHorizon] = useState('30d');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={18} className="text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">AI Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Demand Forecast</h1>
          <p className="text-sm text-slate-400 mt-1">Time-series ML models predicting future inventory needs with 94%+ accuracy.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-white/[0.07] overflow-hidden text-xs font-medium">
            {['7d', '30d', '90d'].map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-3 py-2 transition-colors ${horizon === h ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {h}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
            <RefreshCw size={14} /> Run Forecast
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

      {/* Demand Chart */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white">Aggregate Demand Curve</h2>
            <p className="text-xs text-slate-400 mt-0.5">Units sold vs. forecast (Feb – Sep 2025)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-blue-500 inline-block" /> Actual</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded border border-dashed border-blue-300 inline-block" /> Forecast</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-40">
          {CHART_BARS.map((b) => (
            <div key={b.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-0.5 justify-center" style={{ height: 128 }}>
                {b.actual != null && (
                  <div
                    className="flex-1 rounded-t bg-blue-500/80 max-w-[18px]"
                    style={{ height: `${(b.actual / maxVal) * 100}%` }}
                  />
                )}
                <div
                  className="flex-1 rounded-t border border-dashed border-blue-300/50 bg-blue-300/10 max-w-[18px]"
                  style={{ height: `${(b.forecast / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">{b.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SKU Forecast Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">SKU-Level Forecast</h2>
          <span className="text-xs text-slate-500">{horizon} horizon · Updated just now</span>
        </div>
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">SKU / Product</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400">Stock</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400">Forecast</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400">Confidence</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400">Trend</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {FORECAST_DATA.map((row) => (
                <tr key={row.sku} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium text-sm">{row.name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{row.sku}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${row.alert ? 'text-red-400' : 'text-slate-300'}`}>
                      {row.current}
                    </span>
                    {row.alert && <AlertTriangle size={12} className="text-red-400 inline ml-1" />}
                  </td>
                  <td className="px-4 py-3 text-right text-white font-semibold">{row.forecast}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${row.confidence}%` }} />
                      </div>
                      <span className="text-xs text-slate-300">{row.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-semibold ${row.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {row.trend === 'up' ? '↑ Rising' : '↓ Falling'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                      {row.alert ? 'Reorder' : 'Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
