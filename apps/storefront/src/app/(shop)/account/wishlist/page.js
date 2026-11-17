'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/lib/contexts/WishlistContext';
import { getAllProducts } from '@/lib/api/products';
import ProductCard from '@/components/product/ProductCard';
import { Heart, ArrowUpRight, Trash2, Bookmark } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const products = useMemo(
    () => getAllProducts().filter((product) => items.includes(product.id)),
    [items]
  );

  const clearSavedItems = () => products.forEach((product) => removeItem(product.id));

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e4dc] pb-6">
        <div>
          <p className="editorial-kicker">Your personal collection</p>
          <h1 className="page-title mt-3">Saved pieces.</h1>
          <p className="page-description">{products.length} {products.length === 1 ? 'product' : 'products'} saved in this browser.</p>
        </div>
        {products.length > 0 && (
          <button type="button" onClick={clearSavedItems} className="inline-flex items-center gap-2 px-3 py-2 text-[10px] font-semibold text-[#9b5147] transition hover:bg-[#fbf1ef]">
            <Trash2 size={13} /> Clear saved list
          </button>
        )}
      </header>

      {products.length === 0 ? (
        <section className="border border-[#e5e4dc] bg-[#fffefa] px-6 py-16 text-center sm:py-20">
          <span className="mx-auto grid h-14 w-14 place-items-center bg-[#e8eee7] text-[#315b49]"><Heart size={23} /></span>
          <p className="editorial-kicker mt-6">A collection of your own</p>
          <h2 className="editorial-heading mt-3 text-3xl sm:text-4xl">Keep what catches your eye.</h2>
          <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[#788078]">Tap the heart on any product to save it here. Your saved list stays in this browser.</p>
          <Link href="/products" className="primary-action mt-7">Discover products <ArrowUpRight size={14} /></Link>
        </section>
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-[#e5e4dc] pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#43534a]"><Bookmark size={14} className="text-[#668775]" /> Your saved collection</div>
            <span className="text-[10px] text-[#929990]">Select the heart to remove an item</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </>
      )}
    </div>
  );
}
