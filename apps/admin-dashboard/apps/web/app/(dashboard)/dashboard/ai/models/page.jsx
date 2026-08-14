'use client';

import { useState } from 'react';
import {
  Cpu, ArrowUpRight, Plus, RefreshCw, Upload,
  CheckCircle, Clock, AlertTriangle, XCircle,
  TrendingUp, Zap, Activity,
} from 'lucide-react';

const METRICS = [
  { label: 'Models Deployed', value: '6', delta: '+1', up: true },
  { label: 'Avg Inference Time', value: '31ms', delta: '-4ms', up: true },
  { label: 'Requests / Day', value: '847K', delta: '+62K', up: true },
  { label: 'Error Rate', value: '0.04%', delta: '-0.01%', up: true },
];

const MODELS = [
  {
    id: 'rec-v3', name: 'Recommendations Engine', version: 'v3.2', type: 'Collaborative Filter',
    status: 'production', accuracy: 95, p99: '42ms', rpm: 18400, updated: '3d ago',
    framework: 'PyTorch', size: '1.2 GB',
  },
  {
    id: 'fraud-v2', name: 'Fraud Detection', version: 'v2.8', type: 'Gradient Boosting',
    status: 'production', accuracy: 99.2, p99: '28ms', rpm: 12100, updated: '1w ago',
    framework: 'XGBoost', size: '340 MB',
  },
  {
    id: 'price-v1', name: 'Dynamic Pricing', version: 'v1.9', type: 'Reinforcement Learning',
    status: 'production', accuracy: 91, p99: '35ms', rpm: 9800, updated: '5d ago',
    framework: 'TensorFlow', size: '890 MB',
  },
  {
    id: 'demand-v4', name: 'Demand Forecasting', version: 'v4.1', type: 'LSTM Time-Series',
    status: 'production', accuracy: 94, p99: '61ms', rpm: 4200, updated: '2d ago',
    framework: 'Keras', size: '620 MB',
  },
  {
    id: 'seg-v2', name: 'Customer Segmentation', version: 'v2.3', type: 'K-Means + RFM',
    status: 'production', accuracy: 88, p99: '19ms', rpm: 2100, updated: '2w ago',
    framework: 'scikit-learn', size: '95 MB',
  },
  {
    id: 'rec-v4', name: 'Recommendations v4 (beta)', version: 'v4.0-beta', type: 'Transformer',
    status: 'testing', accuracy: 97, p99: '58ms', rpm: 340, updated: '1d ago',
    framework: 'PyTorch', size: '3.1 GB',
  },
];

const STATUS_CONFIG = {
  production: { label: 'Production', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', icon: CheckCircle },
  testing: { label: 'Testing', color: 'bg-amber-500/15 text-amber-400 border-amber-500/25', icon: Clock },
  degraded: { label: 'Degraded', color: 'bg-red-500/15 text-red-400 border-red-500/25', icon: AlertTriangle },
  offline: { label: 'Offline', color: 'bg-slate-500/15 text-slate-400 border-slate-500/25', icon: XCircle },
};

export default function ModelManagementPage() {
  const [models, setModels] = useState(MODELS);
  const [selected, setSelected] = useState(null);

  const promoteModel = (id) => {
    setModels((prev) => prev.map((m) => m.id === id ? { ...m, status: 'production' } : m));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu size={18} className="text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">AI Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Model Management</h1>
          <p className="text-sm text-slate-400 mt-1">Deploy, version, monitor, and rollback ML models in production.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-colors">
            <Upload size={14} /> Deploy Model
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium transition-colors">
            <Plus size={14} /> Register New
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

      {/* Model Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {models.map((model) => {
          const cfg = STATUS_CONFIG[model.status];
          const StatusIcon = cfg.icon;
          return (
            <div
              key={model.id}
              className={`rounded-2xl border p-5 cursor-pointer transition-all hover:border-white/15 ${
                selected === model.id ? 'border-violet-500/40 bg-violet-500/5' : 'border-white/[0.07] bg-white/[0.03]'
              }`}
              onClick={() => setSelected(selected === model.id ? null : model.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{model.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{model.type} · {model.framework}</p>
                </div>
                <span className={`flex-shrink-0 ml-2 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                  <StatusIcon size={10} /> {cfg.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Version</p>
                  <p className="text-xs font-mono font-semibold text-slate-200 mt-0.5">{model.version}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Accuracy</p>
                  <p className="text-xs font-semibold text-white mt-0.5">{model.accuracy}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">P99</p>
                  <p className="text-xs font-semibold text-white mt-0.5">{model.p99}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Activity size={10} /> {model.rpm.toLocaleString()} RPM</span>
                <span>{model.size} · {model.updated}</span>
              </div>

              {selected === model.id && (
                <div className="flex gap-2 pt-3 border-t border-white/[0.07]">
                  {model.status === 'testing' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); promoteModel(model.id); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
                    >
                      <Zap size={11} /> Promote to Production
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 border border-white/10 hover:bg-white/5 transition-colors">
                    <TrendingUp size={11} /> View Metrics
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 border border-white/10 hover:bg-white/5 transition-colors">
                    <RefreshCw size={11} /> Rollback
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
