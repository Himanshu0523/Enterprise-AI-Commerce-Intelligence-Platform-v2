'use client';

import Link from 'next/link';
import {
  Sparkles, TrendingUp, DollarSign, ShieldAlert, PieChart,
  BookOpen, MessageSquareText, Cpu, FileText, ArrowRight,
  Zap, Brain,
} from 'lucide-react';

const AI_MODULES = [
  {
    href: '/dashboard/ai/recommendations',
    icon: Sparkles,
    label: 'Recommendations',
    desc: 'ML-powered product suggestions tailored per user behavior and affinity.',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10 border-violet-500/20',
    stat: '↑ 23% CTR',
  },
  {
    href: '/dashboard/ai/demand-forecast',
    icon: TrendingUp,
    label: 'Demand Forecast',
    desc: 'Predict future inventory needs with time-series ML models.',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    stat: '94% accuracy',
  },
  {
    href: '/dashboard/ai/dynamic-pricing',
    icon: DollarSign,
    label: 'Dynamic Pricing',
    desc: 'Real-time price optimization based on demand, competition, and margins.',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    stat: '↑ 12% revenue',
  },
  {
    href: '/dashboard/ai/fraud-detection',
    icon: ShieldAlert,
    label: 'Fraud Detection',
    desc: 'Anomaly detection on transactions, accounts, and order patterns.',
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-500/10 border-red-500/20',
    stat: '99.2% precision',
  },
  {
    href: '/dashboard/ai/segmentation',
    icon: PieChart,
    label: 'Customer Segmentation',
    desc: 'Behavioral clustering to power hyper-targeted marketing campaigns.',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10 border-amber-500/20',
    stat: '8 segments live',
  },
  {
    href: '/dashboard/ai/knowledge-base',
    icon: BookOpen,
    label: 'Knowledge Base',
    desc: 'RAG-powered document store for support, policies, and product FAQs.',
    gradient: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    stat: '1,240 docs',
  },
  {
    href: '/dashboard/ai/assistant',
    icon: MessageSquareText,
    label: 'AI Assistant',
    desc: 'Conversational business intelligence — query your data in plain English.',
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-500/10 border-pink-500/20',
    stat: 'GPT-4o powered',
  },
  {
    href: '/dashboard/ai/models',
    icon: Cpu,
    label: 'Model Management',
    desc: 'Deploy, version, monitor, and rollback ML models in production.',
    gradient: 'from-slate-400 to-gray-500',
    bg: 'bg-slate-500/10 border-slate-500/20',
    stat: '6 models active',
  },
  {
    href: '/dashboard/ai/prompts',
    icon: FileText,
    label: 'Prompt Management',
    desc: 'Version-control and A/B test prompts across all AI-powered features.',
    gradient: 'from-fuchsia-500 to-purple-600',
    bg: 'bg-fuchsia-500/10 border-fuchsia-500/20',
    stat: '34 prompts',
  },
];

const HERO_STATS = [
  { label: 'AI Modules Active', value: '9' },
  { label: 'Avg Lift (Revenue)', value: '+18.4%' },
  { label: 'Predictions Today', value: '142K' },
  { label: 'Models Deployed', value: '6' },
];

export default function AIIndexPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain size={20} className="text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">AI Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Intelligence Platform</h1>
          <p className="text-sm text-slate-400 mt-1">ML-powered modules that drive growth, security, and personalization.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <Zap size={12} />
          All systems operational
        </div>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {HERO_STATS.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-4 text-center">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {AI_MODULES.map(({ href, icon: Icon, label, desc, gradient, bg, stat }) => (
          <Link
            key={href}
            href={href}
            className={`group relative flex flex-col gap-4 rounded-2xl border ${bg} p-5 transition-all hover:scale-[1.02] hover:shadow-xl`}
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-300 bg-white/5 rounded-full px-2.5 py-1">{stat}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{label}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-white transition-colors mt-auto">
              Open module <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
