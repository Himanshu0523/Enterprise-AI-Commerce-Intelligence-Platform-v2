'use client';

import { useState } from 'react';
import {
  FileText, ArrowUpRight, Plus, Copy, Edit2,
  Trash2, GitBranch, CheckCircle, FlaskConical,
  ChevronDown, Search,
} from 'lucide-react';

const METRICS = [
  { label: 'Total Prompts', value: '34', delta: '+4', up: true },
  { label: 'Active A/B Tests', value: '3', delta: '+1', up: true },
  { label: 'Avg Token Cost', value: '$0.0018', delta: '-$0.0003', up: true },
  { label: 'Prompt Eval Score', value: '8.7/10', delta: '+0.4', up: true },
];

const PROMPTS = [
  {
    id: 'p-001', name: 'Product Description Generator', feature: 'Catalog', version: 'v2.1',
    model: 'gpt-4o', tokens: 420, status: 'production', tests: 2, score: 9.1,
    preview: 'You are an expert e-commerce copywriter. Generate a compelling product description for {{product_name}} in the {{category}} category. Highlight key features: {{features}}. Tone: {{tone}}.',
  },
  {
    id: 'p-002', name: 'Customer Support Reply', feature: 'Support', version: 'v3.4',
    model: 'gpt-4o-mini', tokens: 310, status: 'production', tests: 1, score: 8.8,
    preview: 'You are a friendly customer support agent for NexusShop. Respond to the following customer inquiry: {{inquiry}}. Customer order: {{order_id}}. Be empathetic, concise, and solution-oriented.',
  },
  {
    id: 'p-003', name: 'Fraud Risk Explanation', feature: 'Fraud Detection', version: 'v1.2',
    model: 'gpt-4o', tokens: 280, status: 'production', tests: 0, score: 8.4,
    preview: 'Analyze this transaction for fraud risk. Transaction: {{transaction_data}}. Provide a risk score (0-1) and a one-sentence human-readable explanation suitable for a compliance officer.',
  },
  {
    id: 'p-004', name: 'Email Campaign Copy', feature: 'Marketing', version: 'v1.0',
    model: 'gpt-4o', tokens: 550, status: 'testing', tests: 3, score: 7.9,
    preview: 'Write a personalized marketing email for segment {{segment_name}}. The campaign is about {{campaign_topic}}. Include a subject line and body. Target audience: {{audience_desc}}.',
  },
  {
    id: 'p-005', name: 'Review Sentiment Classifier', feature: 'Analytics', version: 'v2.0',
    model: 'gpt-4o-mini', tokens: 180, status: 'production', tests: 1, score: 9.3,
    preview: 'Classify the sentiment of the following product review as POSITIVE, NEUTRAL, or NEGATIVE, and extract the top 3 mentioned aspects. Review: {{review_text}}',
  },
  {
    id: 'p-006', name: 'Inventory Reorder Suggestion', feature: 'Inventory', version: 'v1.1',
    model: 'gpt-4o-mini', tokens: 260, status: 'draft', tests: 0, score: null,
    preview: 'Given the following inventory data for SKU {{sku}}: current stock {{stock}}, 30-day forecast {{forecast}}, supplier lead time {{lead_time}} days — suggest an optimal reorder quantity and timing.',
  },
];

const STATUS_CONFIG = {
  production: 'bg-emerald-500/15 text-emerald-400',
  testing: 'bg-amber-500/15 text-amber-400',
  draft: 'bg-slate-500/15 text-slate-400',
};

const FEATURES = ['All', 'Catalog', 'Support', 'Fraud Detection', 'Marketing', 'Analytics', 'Inventory'];

export default function PromptManagementPage() {
  const [prompts, setPrompts] = useState(PROMPTS);
  const [search, setSearch] = useState('');
  const [feature, setFeature] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = prompts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFeature = feature === 'All' || p.feature === feature;
    return matchSearch && matchFeature;
  });

  const deletePrompt = (id) => setPrompts((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={18} className="text-fuchsia-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-fuchsia-400">AI Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Prompt Management</h1>
          <p className="text-sm text-slate-400 mt-1">Version-control, evaluate, and A/B test prompts across all AI-powered features.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-medium transition-colors">
          <Plus size={14} /> New Prompt
        </button>
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

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500/50"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {FEATURES.map((f) => (
            <button
              key={f}
              onClick={() => setFeature(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                feature === f ? 'bg-fuchsia-600 text-white border-fuchsia-500' : 'text-slate-400 border-white/[0.07] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt List */}
      <div className="space-y-3">
        {filtered.map((prompt) => (
          <div key={prompt.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden">
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpanded(expanded === prompt.id ? null : prompt.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-white">{prompt.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[prompt.status]}`}>{prompt.status}</span>
                  <span className="text-xs text-slate-500 font-mono">{prompt.version}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="bg-fuchsia-500/10 text-fuchsia-400 px-2 py-0.5 rounded-full">{prompt.feature}</span>
                  <span>{prompt.model}</span>
                  <span>~{prompt.tokens} tokens</span>
                  {prompt.tests > 0 && (
                    <span className="flex items-center gap-1 text-amber-400">
                      <FlaskConical size={10} /> {prompt.tests} A/B tests
                    </span>
                  )}
                  {prompt.score && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle size={10} /> {prompt.score}/10
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform flex-shrink-0 ${expanded === prompt.id ? 'rotate-180' : ''}`} />
            </div>

            {expanded === prompt.id && (
              <div className="px-5 pb-5 border-t border-white/[0.07]">
                <div className="mt-4 rounded-xl bg-black/30 border border-white/[0.05] p-4 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {prompt.preview}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-fuchsia-400 border border-fuchsia-500/30 hover:bg-fuchsia-500/10 transition-colors">
                    <Edit2 size={11} /> Edit
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 border border-white/10 hover:bg-white/5 transition-colors">
                    <Copy size={11} /> Duplicate
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 border border-white/10 hover:bg-white/5 transition-colors">
                    <GitBranch size={11} /> New Version
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition-colors">
                    <FlaskConical size={11} /> A/B Test
                  </button>
                  <button
                    onClick={() => deletePrompt(prompt.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors ml-auto"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
