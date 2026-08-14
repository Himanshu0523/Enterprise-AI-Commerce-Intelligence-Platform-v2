'use client';

import React from 'react';

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = ''
}) {
  const base = 'animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl';

  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'h-64 w-full rounded-2xl'
  };

  const style = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined
  };

  return (
    <div
      className={`${base} ${variants[variant] || ''} ${className}`}
      style={style}
    />
  );
}
