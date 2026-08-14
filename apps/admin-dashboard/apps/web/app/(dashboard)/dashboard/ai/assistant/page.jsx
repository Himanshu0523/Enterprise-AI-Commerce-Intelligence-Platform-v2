'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText, Send, Sparkles, RefreshCw,
  User, BarChart2, Package, Users, TrendingUp,
} from 'lucide-react';

const QUICK_PROMPTS = [
  { icon: BarChart2, text: 'What was revenue last week?' },
  { icon: Package, text: 'Which products are low on stock?' },
  { icon: Users, text: 'Show top 5 customers by LTV' },
  { icon: TrendingUp, text: 'What\'s trending in Electronics?' },
];

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    content: "Hi! I'm your AI Business Intelligence assistant. Ask me anything about your store — revenue, orders, inventory, customers, and more. I have access to real-time data.",
    time: '17:30',
  },
];

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        isUser ? 'bg-violet-600 text-white' : 'bg-gradient-to-br from-pink-500 to-rose-600 text-white'
      }`}>
        {isUser ? <User size={14} /> : <Sparkles size={14} />}
      </div>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-violet-600 text-white rounded-tr-md'
          : 'bg-white/[0.05] border border-white/[0.07] text-slate-200 rounded-tl-md'
      }`}>
        {msg.content}
        {msg.data && (
          <div className="mt-3 rounded-xl bg-white/10 p-3 text-xs font-mono whitespace-pre-wrap text-slate-300">
            {msg.data}
          </div>
        )}
      </div>
    </div>
  );
}

const AI_RESPONSES = {
  revenue: {
    content: "Last week's revenue was **$184,290** — up 12.3% vs the previous week. Friday was the best day with $38,420 in sales.",
    data: "Mon $21,840  |  Tue $24,110\nWed $28,320  |  Thu $31,780\nFri $38,420  |  Sat $23,180\nSun $16,640",
  },
  stock: {
    content: "6 products are below their reorder threshold. Most critical: Apple Watch S9 (12 units, 310 forecast) and Samsung S24 Ultra (8 units).",
    data: "Apple Watch S9     → 12 units  ⚠️\nSamsung S24 Ultra  → 8 units   🔴\nNike AM270 Wht     → 18 units  ⚠️",
  },
  customer: {
    content: "Here are your top 5 customers by lifetime value:",
    data: "1. Marcus T.   → $12,840 LTV · 142 orders\n2. Sarah K.    → $9,420 LTV · 98 orders\n3. Raj P.      → $8,180 LTV · 87 orders\n4. Emma L.     → $7,240 LTV · 71 orders\n5. Daniel F.   → $6,990 LTV · 68 orders",
  },
  trending: {
    content: "In Electronics, the top trending items this week are wireless earbuds (+41% views), gaming keyboards (+28%), and portable chargers (+19%). Driven by a back-to-school campaign.",
    data: null,
  },
  default: {
    content: "I've analyzed your store data. Revenue is up 8.4% this month with 3,812 new orders. Would you like a detailed breakdown by category or time period?",
    data: null,
  },
};

function getAIResponse(text) {
  const lower = text.toLowerCase();
  if (lower.includes('revenue') || lower.includes('sales')) return AI_RESPONSES.revenue;
  if (lower.includes('stock') || lower.includes('inventory') || lower.includes('low')) return AI_RESPONSES.stock;
  if (lower.includes('customer') || lower.includes('ltv')) return AI_RESPONSES.customer;
  if (lower.includes('trend') || lower.includes('electronics')) return AI_RESPONSES.trending;
  return AI_RESPONSES.default;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    const resp = getAIResponse(text);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', ...resp, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquareText size={18} className="text-pink-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-pink-400">AI Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
          <p className="text-sm text-slate-400 mt-1">Query your business data in plain English — powered by GPT-4o.</p>
        </div>
        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} /> Clear Chat
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
        {QUICK_PROMPTS.map(({ icon: Icon, text }) => (
          <button
            key={text}
            onClick={() => sendMessage(text)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-slate-300 hover:text-white hover:border-pink-500/40 hover:bg-pink-500/5 transition-all"
          >
            <Icon size={11} /> {text}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 space-y-4 mb-4">
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600">
              <Sparkles size={14} className="text-white animate-pulse" />
            </div>
            <div className="rounded-2xl rounded-tl-md bg-white/[0.05] border border-white/[0.07] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 flex-shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Ask anything about your store..."
          className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500/50 transition-colors"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
