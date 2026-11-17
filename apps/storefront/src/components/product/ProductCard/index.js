'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye } from 'lucide-react';
import WishlistToggle from '@/components/product/WishlistToggle';
import CompareButton from '@/components/product/CompareButton';
import AddToCartButton from '@/components/product/ProductDetail/AddToCartButton';
import { useQuickView } from '@/lib/contexts/QuickViewContext';
import '@/types/product';

export default function ProductCard({ product, view = 'grid' }) {
  const { id, name, price, flashSalePrice, images, rating, reviewCount, isNew, stock, category } = product;
  const image = images?.[0] || '/placeholder.jpg';
  const displayPrice = flashSalePrice ?? price;
  const { openQuickView } = useQuickView();

  const handleQuickViewClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    openQuickView?.(product);
  };

  const formattedPrice = Number(displayPrice || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });

  if (view === 'list') {
    return (
      <article className="group flex flex-col gap-5 border-b border-[#e5e4dc] py-6 sm:flex-row">
        <div className="relative aspect-square w-full overflow-hidden bg-[#eeeee8] sm:h-44 sm:w-44 sm:shrink-0">
          <Link href={`/products/${id}`} className="block h-full">
            <Image src={image} alt={name} fill sizes="(max-width: 640px) 100vw, 176px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </Link>
          <div className="absolute right-3 top-3"><WishlistToggle productId={id} size={19} /></div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
          <div>
            <p className="editorial-kicker">{category || 'Selected product'}</p>
            <Link href={`/products/${id}`}><h3 className="mt-2 text-lg font-semibold tracking-tight text-[#1c2924] hover:text-[#557563]">{name}</h3></Link>
            {rating > 0 && <p className="mt-2 flex items-center gap-1 text-xs text-[#737c74]"><Star size={13} className="fill-[#c39a55] text-[#c39a55]" /> {Number(rating).toFixed(1)} <span>({reviewCount || 0})</span></p>}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-base font-semibold">{formattedPrice}</span>
            <div className="flex items-center gap-3"><AddToCartButton productId={id} name={name} price={displayPrice} image={image} quantity={1} disabled={stock === 0} stock={stock} compact /><CompareButton productId={id} /></div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[.82] overflow-hidden bg-[#eeeee8]">
        <Link href={`/products/${id}`} className="block h-full" aria-label={`View ${name}`}>
          <Image src={image} alt={name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]" />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {isNew && <span className="bg-[#f5f4ef] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.16em] text-[#315b49]">New arrival</span>}
          {flashSalePrice && <span className="bg-[#315b49] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.16em] text-white">Special price</span>}
        </div>
        <div className="absolute right-3 top-3"><WishlistToggle productId={id} size={19} /></div>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <button type="button" onClick={handleQuickViewClick} className="flex flex-1 items-center justify-center gap-2 bg-[#f5f4ef] px-3 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#1c2924] shadow-lg">
            <Eye size={14} /> Quick view
          </button>
          <div className="bg-[#f5f4ef] p-2.5 shadow-lg"><CompareButton productId={id} /></div>
        </div>
      </div>
      <div className="flex items-start justify-between gap-3 pt-4">
        <div className="min-w-0">
          <p className="editorial-kicker text-[9px]">{category || 'Collection'}</p>
          <Link href={`/products/${id}`}><h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-5 text-[#27362e] transition-colors hover:text-[#668775]">{name}</h3></Link>
          {rating > 0 && <p className="mt-2 flex items-center gap-1 text-[10px] text-[#7b827b]"><Star size={11} className="fill-[#c39a55] text-[#c39a55]" /> {Number(rating).toFixed(1)} <span>· {reviewCount || 0} reviews</span></p>}
        </div>
        <span className="shrink-0 pt-4 text-xs font-semibold text-[#315b49]">{formattedPrice}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[#e5e4dc] pt-3">
        <AddToCartButton productId={id} name={name} price={displayPrice} image={image} quantity={1} disabled={stock === 0} stock={stock} />
      </div>
    </article>
  );
}