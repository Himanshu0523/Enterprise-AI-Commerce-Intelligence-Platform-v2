'use client';

import React from 'react';
import { useWishlist } from '@/lib/contexts/WishlistContext';
import { getAllProducts } from '@/lib/api/products';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';

/**
 * Wishlist Page Component
 */
export default function WishlistPage() {
  const { items } = useWishlist();
  const allProducts = getAllProducts();
  const wishlistProducts = allProducts.filter((p) => items.includes(p.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">My Wishlist</h1>
      {wishlistProducts.length === 0 ? (
        <div className="py-12 text-center">
          <Heart className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-gray-600">Save items you love by clicking the heart icon.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}