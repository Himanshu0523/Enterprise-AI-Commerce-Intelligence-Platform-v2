'use client';

import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hi! I'm Aurora AI, your personal shopping assistant. Tell me what you're looking for or your budget!",
      recommendedProducts: [
        { id: '1', name: 'Aurora Wireless ANC Headphones', price: '$199.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
        { id: '2', name: 'UltraSmart OLED Watch Pro', price: '$249.00', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Based on your request "${input}", I found 3 highly-rated items that match your style preference and fit your budget!`,
        recommendedProducts: [
          { id: '3', name: 'Minimalist Mechanical Keyboard', price: '$129.50', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80' }
        ]
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl shadow-purple-600/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap pr-1">
          Ask AI Shopping Assistant
        </span>
      </button>

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm flex items-center gap-1.5">
                  Aurora AI Shopping Guide <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[11px] text-purple-200">Powered by Gemini 3.0 Pro</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* AI Product Suggestions Carousel */}
                  {msg.recommendedProducts && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-[10px] uppercase text-indigo-600 dark:text-indigo-400">
                        Suggested Items:
                      </p>
                      {msg.recommendedProducts.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
                        >
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-[11px] truncate text-slate-900 dark:text-slate-100">{item.name}</h5>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.price}</span>
                          </div>
                          <Link href={`/product/${item.id}`} className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <Bot className="w-4 h-4 text-purple-600 animate-spin" />
                <span>Aurora AI is searching items...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask for fashion advice, laptops, or deals..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
