'use client';

import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="relative inline-block">
      <span className="text-2xl">🛒</span>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}