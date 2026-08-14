'use client';

import React, { Suspense } from 'react';
import { useCompare } from '@/lib/hooks/useCompare';
import { Scale } from 'lucide-react';

/**
 * Inner Compare Button — must stay inside a Suspense boundary because
 * useCompare() calls useSearchParams() internally.
 * @param {Object} props
 * @param {string} props.productId
 * @param {string} [props.className='']
 */
function CompareButtonInner({ productId, className = '' }) {
  const { ids, isComparing, toggle } = useCompare();
  const active = isComparing(productId);
  const compareCount = ids.length;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={`inline-flex items-center gap-1 text-sm ${className}`}
      title={active ? 'Remove from compare' : 'Add to compare'}
    >
      <div className="relative">
        <Scale size={18} className={active ? 'text-indigo-600' : 'text-gray-400'} />
        {compareCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {compareCount}
          </span>
        )}
      </div>
      <span className={active ? 'text-indigo-600' : 'text-gray-500'}>
        {active ? 'Comparing' : 'Compare'}
      </span>
    </button>
  );
}

/**
 * Compare Button Component (Suspense-wrapped)
 * Wrapping in Suspense ensures useSearchParams() inside useCompare
 * never causes a CSR bailout / 500 during prerender.
 * @param {Object} props
 * @param {string} props.productId
 * @param {string} [props.className='']
 */
export default function CompareButton({ productId, className = '' }) {
  return (
    <Suspense fallback={
      <button
        className={`inline-flex items-center gap-1 text-sm ${className}`}
        disabled
        aria-label="Compare"
      >
        <Scale size={18} className="text-gray-300" />
        <span className="text-gray-300">Compare</span>
      </button>
    }>
      <CompareButtonInner productId={productId} className={className} />
    </Suspense>
  );
}