'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye } from 'lucide-react';
import WishlistToggle from '@/components/product/WishlistToggle';
import CompareButton from '@/components/product/CompareButton';
import AddToCartButton from '@/components/product/ProductDetail/AddToCartButton';
import { useQuickView } from '@/lib/contexts/QuickViewContext';
import '@/types/product';

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {number} price
 * @property {string[]} images
 * @property {number} rating
 * @property {number} reviewCount
 * @property {boolean} [isNew]
 * @property {number} [stock]
 */

/**
 * @typedef {Object} ProductCardProps
 * @property {Product} product
 * @property {'grid'|'list'} [view='grid']
 */

/**
 * Product Card Component
 * @param {ProductCardProps} props
 */
export default function ProductCard({ product, view = 'grid' }) {
  const { id, name, description, price, flashSalePrice, images, rating, reviewCount, isNew, stock, category } = product;
  const image = images?.[0] || '/placeholder.jpg';
  const displayPrice = flashSalePrice ?? price;
  
  // Safely grab quickview context if available
  let openQuickView;
  try {
    const qv = useQuickView();
    openQuickView = qv?.openQuickView;
  } catch {
    openQuickView = null;
  }

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (openQuickView) {
      openQuickView(product);
    }
  };

  if (view === 'list') {
    return (
      <div className="group relative flex flex-col gap-4 rounded-xl border border-gray-200/80 p-4 shadow-sm hover:shadow-md transition-all duration-200 sm:flex-row bg-white">
        <div className="relative h-48 w-full sm:w-48 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 200px"
          />
          {flashSalePrice ? (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded shadow z-10">
              Sale
            </span>
          ) : isNew ? (
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded shadow z-10">
              New
            </span>
          ) : null}

          <div className="absolute right-2 top-2 z-10">
            <WishlistToggle productId={id} size={20} />
          </div>

          {openQuickView && (
            <button
              onClick={handleQuickViewClick}
              className="absolute inset-x-3 bottom-3 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-lg shadow-md flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-indigo-600 hover:text-white"
            >
              <Eye size={14} />
              Quick View
            </button>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {category && (
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                {category}
              </span>
            )}
            <Link href={`/products/${id}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors block mt-0.5">
              {name}
            </Link>
            {description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
            )}
            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < Math.floor(rating || 4) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">({reviewCount || 0})</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-xl font-extrabold text-gray-900">${displayPrice.toFixed(2)}</p>
              {flashSalePrice && (
                <p className="text-xs text-gray-400 line-through">${price.toFixed(2)}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
            <AddToCartButton
              productId={id}
              name={name}
              price={displayPrice}
              image={image}
              quantity={1}
              disabled={stock === 0}
            />
            <CompareButton productId={id} />
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group relative rounded-2xl border border-gray-200/80 p-3.5 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-white flex flex-col justify-between">
      <div>
        <div className="relative h-52 w-full overflow-hidden rounded-xl bg-gray-50">
          <Link href={`/products/${id}`} className="block h-full w-full">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>

          {flashSalePrice ? (
            <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full shadow z-10">
              Sale
            </span>
          ) : isNew ? (
            <span className="absolute top-2.5 left-2.5 bg-indigo-600 text-white text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full shadow z-10">
              New
            </span>
          ) : null}

          <div className="absolute right-2.5 top-2.5 z-10">
            <WishlistToggle productId={id} size={18} />
          </div>

          {openQuickView && (
            <button
              onClick={handleQuickViewClick}
              className="absolute inset-x-3 bottom-3 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-indigo-600 hover:text-white"
            >
              <Eye size={14} />
              Quick View
            </button>
          )}
        </div>

        <div className="mt-3.5">
          {category && (
            <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider block">
              {category}
            </span>
          )}
          <Link href={`/products/${id}`}>
            <h3 className="font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1 text-sm mt-0.5">
              {name}
            </h3>
          </Link>
          {description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{description}</p>
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(rating || 4) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-500 font-medium">({reviewCount || 0})</span>
            </div>
            
            {(stock ?? 10) <= 5 && (stock ?? 10) > 0 && (
              <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                Only {stock} left
              </span>
            )}
          </div>

          <div className="mt-2.5 flex items-baseline gap-2">
            <p className="text-base font-extrabold text-gray-900">${displayPrice.toFixed(2)}</p>
            {flashSalePrice && (
              <p className="text-xs text-gray-400 line-through">${price.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
        <AddToCartButton
          productId={id}
          name={name}
          price={displayPrice}
          image={image}
          quantity={1}
          disabled={stock === 0}
        />
        <CompareButton productId={id} />
      </div>
    </div>
  );
}