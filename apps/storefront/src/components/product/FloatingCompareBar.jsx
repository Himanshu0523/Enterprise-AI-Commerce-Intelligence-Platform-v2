'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompare } from '@/lib/hooks/useCompare';
import productsData from '@/lib/mock-data/products.json';

export default function FloatingCompareBar() {
  const { ids, remove, clear, maxCount } = useCompare();

  if (!ids || ids.length === 0) return null;

  // Find products matching the compare IDs
  const comparedProducts = ids
    .map((id) => productsData.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-4xl bg-gray-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-gray-800 transition-all animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left info & thumbnails */}
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow">
              <Scale size={20} />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Compare Mode</div>
              <div className="text-sm font-bold">
                {ids.length} of {maxCount} Selected
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-800 hidden sm:block" />

          {/* Thumbnails */}
          <div className="flex items-center gap-2">
            {comparedProducts.map((product) => (
              <div key={product.id} className="relative group flex-shrink-0">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                  <Image
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <button
                  onClick={() => remove(product.id)}
                  className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  title="Remove from comparison"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Empty slots placeholders */}
            {Array.from({ length: maxCount - ids.length }).map((_, idx) => (
              <div
                key={idx}
                className="h-12 w-12 rounded-lg border border-dashed border-gray-700 flex items-center justify-center text-gray-600 text-xs font-medium"
              >
                +
              </div>
            ))}
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={clear}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <Trash2 size={14} />
            Clear
          </button>

          <Link
            href={`/compare?ids=${ids.join(',')}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-indigo-500/20"
          >
            Compare Now ({ids.length})
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
