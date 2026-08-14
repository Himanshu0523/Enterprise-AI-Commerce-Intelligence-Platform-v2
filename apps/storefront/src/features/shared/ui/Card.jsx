'use client';

import React from 'react';

export default function Card({
  children,
  className = '',
  hover = true,
  glass = false,
  bordered = true,
  padding = 'md',
  ...props
}) {
  const paddings = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${
        glass
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl'
          : 'bg-white dark:bg-slate-900'
      } ${
        bordered ? 'border border-slate-200/80 dark:border-slate-800/80' : ''
      } ${
        hover
          ? 'hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 hover:-translate-y-0.5'
          : 'shadow-sm'
      } ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
