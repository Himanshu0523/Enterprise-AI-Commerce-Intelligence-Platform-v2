'use client';

import React, { Suspense } from 'react';
import { useCompare } from '@/lib/hooks/useCompare';
import { getAllProducts } from '@/lib/api/products';
import Image from 'next/image';
import Link from 'next/link';
import { X, Scale } from 'lucide-react';
import '@/types/product';

/**
 * Compare Page Content Component
 * Displays products in the compare list side-by-side with attributes.
 */
function CompareContent() {
  const { ids, remove, clear } = useCompare();
  const allProducts = getAllProducts();
  const compareProducts = ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

  if (compareProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Scale className="mx-auto h-16 w-16 text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold">No Products to Compare</h1>
        <p className="mt-2 text-gray-600">Add products using the &quot;Compare&quot; button.</p>
        <Link href="/products" className="mt-4 inline-block text-indigo-600 hover:underline">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compare Products</h1>
        <button
          onClick={clear}
          className="rounded border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-4 bg-gray-50 text-left font-medium w-32 text-gray-700">Product</th>
              {compareProducts.map((product) => (
                <th key={product.id} className="border-b border-l p-4 bg-gray-50 min-w-[200px] text-left">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-gray-800">{product.name}</span>
                    <button
                      onClick={() => remove(product.id)}
                      className="text-gray-400 hover:text-red-600 flex-shrink-0"
                      title="Remove from compare"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b p-4 font-medium text-gray-700 bg-gray-50/50">Image</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border-b border-l p-4 text-center">
                  <div className="relative h-32 w-32 mx-auto">
                    <Image
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                      sizes="128px"
                    />
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border-b p-4 font-medium text-gray-700 bg-gray-50/50">Brand</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border-b border-l p-4 text-center text-gray-600">
                  {product.brand}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border-b p-4 font-medium text-gray-700 bg-gray-50/50">Category</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border-b border-l p-4 text-center text-gray-600">
                  {product.category}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border-b p-4 font-medium text-gray-700 bg-gray-50/50">Price</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border-b border-l p-4 text-center font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border-b p-4 font-medium text-gray-700 bg-gray-50/50">Rating</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border-b border-l p-4 text-center text-gray-600">
                  {product.rating.toFixed(1)} ★ ({product.reviewCount})
                </td>
              ))}
            </tr>
            <tr>
              <td className="border-b p-4 font-medium text-gray-700 bg-gray-50/50">Stock</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border-b border-l p-4 text-center text-gray-600">
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border-b p-4 font-medium text-gray-700 bg-gray-50/50">Description</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border-b border-l p-4 text-sm text-gray-600">
                  {product.description}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-gray-700 bg-gray-50/50">Actions</td>
              {compareProducts.map((product) => (
                <td key={product.id} className="border-l p-4 text-center">
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-block rounded bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                  >
                    View
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 font-medium">Loading comparison...</p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}