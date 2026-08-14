'use client';

import React from 'react';

export default function Price({
  price,
  originalPrice,
  currency = '$',
  size = 'md',
  showDiscount = true,
  className = ''
}) {
  const numPrice = Number(price) || 0;
  const numOriginal = Number(originalPrice) || 0;
  const hasDiscount = numOriginal > numPrice;
  const discountPercent = hasDiscount
    ? Math.round(((numOriginal - numPrice) / numOriginal) * 100)
    : 0;

  const sizeClasses = {
    sm: { main: 'text-sm font-bold', original: 'text-xs', badge: 'text-[10px] px-1.5 py-0.5' },
    md: { main: 'text-base font-bold', original: 'text-xs', badge: 'text-xs px-2 py-0.5' },
    lg: { main: 'text-xl sm:text-2xl font-extrabold', original: 'text-sm', badge: 'text-xs px-2.5 py-1' }
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={`text-slate-900 dark:text-slate-100 ${selectedSize.main}`}>
        {currency}{numPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>

      {hasDiscount && (
        <>
          <span className={`line-through text-slate-400 dark:text-slate-500 font-normal ${selectedSize.original}`}>
            {currency}{numOriginal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>

          {showDiscount && discountPercent > 0 && (
            <span className={`font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-md border border-rose-500/20 ${selectedSize.badge}`}>
              {discountPercent}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
}
