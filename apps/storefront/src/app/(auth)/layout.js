'use client';

import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left Brand / Visual Showcase Panel (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between border-r border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 via-zinc-950/80 to-zinc-900/90 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block">AURA STORE</span>
            <span className="text-xs text-indigo-400 font-medium tracking-widest uppercase">Next-Gen Intelligence</span>
          </div>
        </div>

        {/* Feature Cards / Showcase */}
        <div className="space-y-8 z-10 my-auto">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Commerce Experience
            </span>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight text-white tracking-tight">
              Elevate Your Shopping with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Smart Intelligence</span>
            </h1>
            <p className="text-zinc-400 text-base max-w-lg leading-relaxed">
              Personalized recommendations, instant visual search, real-time tracking, and automated rewards tailored just for you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-md space-y-2">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <h3 className="font-semibold text-sm text-zinc-200">Bank-Grade 2FA</h3>
              <p className="text-xs text-zinc-400">Encrypted token validation & multi-factor protection.</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-md space-y-2">
              <Zap className="h-6 w-6 text-amber-400" />
              <h3 className="font-semibold text-sm text-zinc-200">Instant Checkout</h3>
              <p className="text-xs text-zinc-400">One-click payment simulation & live order tracking.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs text-zinc-500 flex items-center justify-between">
          <span>© 2026 Aura Enterprise Commerce.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-zinc-300 transition">Privacy</Link>
            <Link href="#" className="hover:text-zinc-300 transition">Terms</Link>
            <Link href="#" className="hover:text-zinc-300 transition">Security</Link>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}