'use client';

import { useState } from 'react';
import {
  Sparkles, Send, Bot, User, ArrowRight, TrendingUp, AlertTriangle,
  Zap, Lightbulb, CheckCircle2, RefreshCw, BarChart2
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  '⚡ Identify products with low stock & generate reorder alerts',
  '📈 Forecast Q4 revenue growth based on last 90 days',
  '🎯 Which customer segment has the highest churn rate?',
  '💡 Suggest optimal pricing for Wireless Noise-Canceling Headphones',
];

const INITIAL_MESSAGES = [
  {
    sender: 'ai',
    text: "Hello! I'm your Enterprise AI Commerce Intelligence Assistant. I am continuously monitoring your store's sales, stock levels, and customer behavior. How can I help optimize your business today?",
    timestamp: '10:00 AM'
  }
];

export default function AICopilotPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add User Message
    const userMsg = { sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setIsTyping(true);

    // Simulate AI response after delay
    setTimeout(() => {
      let aiResponseText = "Based on current real-time metrics across your platform, your store is performing 18% above monthly targets. However, 2 items in 'Electronics' are approaching safety stock thresholds.";

      if (text.includes('low stock') || text.includes('reorder')) {
        aiResponseText = "⚠️ Stock Risk Alert: 'Ultra-Wide Curved Gaming Monitor 34\"' currently has only 8 units left. Based on an average sales velocity of 3.2 units/day, stock out is predicted in ~2.5 days. Recommended Action: Trigger automated reorder of 50 units from primary distributor.";
      } else if (text.includes('Q4 revenue') || text.includes('Forecast')) {
        aiResponseText = "📈 Q4 Revenue Forecast: Projected $420,000 to $480,000 GMV (+32% YoY growth). Primary growth driver is estimated to be Audio & Gaming Accessories during Black Friday / Cyber Monday.";
      } else if (text.includes('pricing') || text.includes('Headphones')) {
        aiResponseText = "💡 Dynamic Pricing Recommendation: Competitor price monitoring indicates room for a +$15.00 markup on 'Wireless Noise-Canceling Headphones' without reducing conversion velocity (estimated +$4,200 monthly profit increase).";
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-violet-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Generative Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Commerce AI Copilot</h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-600/10 border border-violet-500/20 text-xs font-semibold text-violet-300">
          <Zap size={14} className="text-amber-400 fill-amber-400" />
          Model: Enterprise Gemini 3 Pro
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 rounded-2xl bg-[#0f1117] border border-white/5 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-violet-600/30">
                  <Bot size={20} />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-violet-600 text-white rounded-br-none shadow-lg shadow-violet-600/20'
                    : 'bg-white/[0.03] border border-white/10 text-slate-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="block mt-2 text-[10px] opacity-60 text-right">{msg.timestamp}</span>
              </div>

              {msg.sender === 'user' && (
                <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 items-center text-xs text-slate-400">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                <Bot size={20} />
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="h-2 w-2 rounded-full bg-violet-400 animate-ping" />
                <span>AI Assistant analyzing commerce metrics...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts & Input Bar */}
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-violet-600/20 hover:border-violet-500/40 whitespace-nowrap transition-all text-[11px]"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Text Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-violet-500 transition-colors"
          >
            <input
              type="text"
              placeholder="Ask AI Copilot for insights, revenue forecasts, or stock alerts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-violet-600/30"
            >
              <span>Ask AI</span>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
