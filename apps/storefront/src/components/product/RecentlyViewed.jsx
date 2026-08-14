'use client';

import React from 'react';
import Link from 'next/link';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';
import { getAllProducts } from '@/lib/api/products';
import ProductCard from './ProductCard';
import '@/types/product';

/**
 * Recently Viewed Component
 * Displays a grid/row of recently viewed products.
 */
export default function RecentlyViewed() {
  const { ids } = useRecentlyViewed();
  const allProducts = getAllProducts();
  const recentProducts = ids
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 6);

  if (recentProducts.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recently Viewed</h2>
        <Link href="/products" className="text-sm text-indigo-600 hover:underline">
          View All Products
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {recentProducts.map((product) => (
          <div key={product.id} className="transition-transform hover:scale-105">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}