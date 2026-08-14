'use client';

import React, { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Products page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Something went wrong!</h2>
      <p className="text-sm text-slate-500 mb-6">{error?.message || 'Failed to load products.'}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
