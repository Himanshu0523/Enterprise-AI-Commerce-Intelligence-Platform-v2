'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center space-y-6">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" /> Join VIP Club
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Get 15% Off Your First Order
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Subscribe to our VIP newsletter for exclusive drop alerts, secret flash sales, and personalized curated recommendations.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Success! Check your inbox for your 15% discount promo code.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md text-white placeholder-slate-400 text-sm rounded-full pl-11 pr-4 py-3.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <Mail className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all flex-shrink-0"
            >
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-slate-400">
          We respect your privacy. Unsubscribe at any time with one click.
        </p>

      </div>
    </section>
  );
}
