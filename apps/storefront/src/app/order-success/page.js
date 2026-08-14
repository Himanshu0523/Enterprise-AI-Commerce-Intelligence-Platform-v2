'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/features/layouts/Navbar';
import Footer from '@/features/layouts/Footer';
import Button from '@/features/shared/ui/Button';
import Price from '@/features/shared/ui/Price';
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  Sparkles,
  Download,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Headphones,
} from 'lucide-react';

const TRACKING_TIMELINE = [
  { step: 'Order Placed', time: 'Today, 2:45 PM', status: 'completed', desc: 'Verified & sent to warehouse' },
  { step: 'AI Route Optimization', time: 'Today, 2:46 PM', status: 'completed', desc: 'Eco-shipping carrier selected' },
  { step: 'Packing & Quality Check', time: 'In Progress', status: 'current', desc: 'Preparing eco-friendly packaging' },
  { step: 'Out for Express Delivery', time: 'Tomorrow, 9:00 AM', status: 'upcoming', desc: 'Live GPS tracking will activate' },
];

export default function OrderSuccessPage() {
  const orderId = 'ORD-892415';
  const orderDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header Badge & Title */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Order #{orderId} Confirmed
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We've received your order and initiated automated AI dispatch. Expect live updates on your mobile device.
            </p>
          </div>

          {/* AI Tracking Timeline Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-400">Target Delivery Window</p>
                <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> 2-3 Business Days
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Invoice PDF
                </Button>
              </div>
            </div>

            {/* Timeline steps */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Status Updates
              </h3>

              <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 dark:border-slate-800">
                {TRACKING_TIMELINE.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 transition-all ${
                        item.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500'
                          : item.status === 'current'
                          ? 'bg-indigo-600 border-indigo-600 ring-4 ring-indigo-500/20'
                          : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                      }`}
                    />

                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          {item.step}
                          {item.status === 'current' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold animate-pulse">
                              ACTIVE NOW
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Actions & Support */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold">24/7 AI Order Support</h4>
                <p className="text-[11px] text-slate-500">Need to modify address or items?</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold">30-Day Money Back</h4>
                <p className="text-[11px] text-slate-500">Free return label included</p>
              </div>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="text-center pt-4">
            <Link href="/">
              <Button variant="primary" size="lg" className="px-10 py-4 shadow-xl shadow-indigo-500/25">
                <span>Return to Storefront</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
