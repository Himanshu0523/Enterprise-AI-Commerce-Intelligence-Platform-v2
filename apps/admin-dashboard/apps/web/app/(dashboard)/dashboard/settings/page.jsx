'use client';

import { useState } from 'react';
import {
  Settings, Save, Key, Globe, Shield, Bell, Database, CheckCircle2, RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    storeName: 'Enterprise AI Commerce Platform',
    supportEmail: 'admin@enterprise-commerce.io',
    currency: 'USD ($)',
    timezone: 'UTC-05:00 (Eastern Time)',
    apiGatewayUrl: 'http://localhost:8000',
    authServiceUrl: 'http://localhost:8001',
    productServiceUrl: 'http://localhost:8002',
    orderServiceUrl: 'http://localhost:8003',
    aiServiceUrl: 'http://localhost:8004',
    aiModel: 'Gemini 3 Pro',
    enableAutoReorder: true,
    enableNotifications: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings size={20} className="text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">System Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage store profile, microservices endpoints, and AI parameters.</p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 animate-fade-in">
            <CheckCircle2 size={16} /> Settings Saved Successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Settings */}
        <div className="p-6 rounded-2xl bg-[#0f1117] border border-white/5 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Globe size={18} className="text-violet-400" /> Store Identity & Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Default Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="USD ($)" className="bg-zinc-900">USD ($)</option>
                <option value="EUR (€)" className="bg-zinc-900">EUR (€)</option>
                <option value="GBP (£)" className="bg-zinc-900">GBP (£)</option>
                <option value="INR (₹)" className="bg-zinc-900">INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Timezone</label>
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Microservices API Endpoints */}
        <div className="p-6 rounded-2xl bg-[#0f1117] border border-white/5 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Database size={18} className="text-blue-400" /> Microservices Endpoints & API Gateway
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">API Gateway URL</label>
              <input
                type="text"
                value={formData.apiGatewayUrl}
                onChange={(e) => setFormData({ ...formData, apiGatewayUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">AI Intelligence Service URL</label>
              <input
                type="text"
                value={formData.aiServiceUrl}
                onChange={(e) => setFormData({ ...formData, aiServiceUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="font-semibold text-white">API Gateway Status: Online (Latency 14ms)</p>
                <p className="text-[11px] text-slate-400">All 5 microservices responding with HTTP 200 OK</p>
              </div>
            </div>
            <button type="button" className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium transition-colors">
              Ping Services
            </button>
          </div>
        </div>

        {/* AI & Automation Preferences */}
        <div className="p-6 rounded-2xl bg-[#0f1117] border border-white/5 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Key size={18} className="text-amber-400" /> AI Copilot & Automation Controls
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <p className="text-xs font-semibold text-white">Enable Automated Low Stock Re-ordering</p>
                <p className="text-[11px] text-slate-400">Allows AI Copilot to place purchase orders when inventory reaches safety threshold.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableAutoReorder}
                onChange={(e) => setFormData({ ...formData, enableAutoReorder: e.target.checked })}
                className="h-4 w-4 rounded accent-violet-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <p className="text-xs font-semibold text-white">Real-Time Anomaly Notifications</p>
                <p className="text-[11px] text-slate-400">Receive alerts on sudden sales spikes or payment gateway failures.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableNotifications}
                onChange={(e) => setFormData({ ...formData, enableNotifications: e.target.checked })}
                className="h-4 w-4 rounded accent-violet-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 transition-all"
          >
            <Save size={16} /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
