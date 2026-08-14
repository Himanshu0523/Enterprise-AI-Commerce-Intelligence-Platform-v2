'use client';

import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon
}) {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    primary: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    ai: 'bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30',
    accent: 'bg-amber-400 text-slate-950 font-bold'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1 rounded-md font-medium',
    md: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg font-medium',
    lg: 'px-3 py-1.5 text-sm gap-2 rounded-xl font-semibold'
  };

  return (
    <span className={`inline-flex items-center justify-center transition-colors ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
