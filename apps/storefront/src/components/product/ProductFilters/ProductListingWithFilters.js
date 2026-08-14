'use client';

import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import ProductSort from '@/components/product/ProductSort';
import ProductFilters from './index';
import { useProductFilters } from '@/lib/hooks/useProductFilters';
import Breadcrumbs from '@/components/common/Breadcrumbs';

/**
 * @typedef {Object} ProductListingWithFiltersProps
 * @property {string} [initialCategory]
 * @property {string} [initialQuery]
 * @property {string} [title]
 */

/**
 * Product Listing With Filters Component
 * @param {ProductListingWithFiltersProps} props
 */
export default function ProductListingWithFilters({
  initialCategory,
  initialQuery,
  title = 'Products',
}) {
  const [viewMode, setViewMode] = useState('grid');
  const {
    filteredProducts,
    totalResults,
    brands,
    priceRange,
    filters,
    sortBy,
    toggleBrand,
    setPriceRange,
    setRating,
    setSortBy,
    clearFilters,
  } = useProductFilters({ initialCategory, initialQuery });

  const breadcrumbItems = [
    { label: 'Products', href: '/products' },
    ...(initialCategory ? [{ label: initialCategory }] : []),
    ...(initialQuery ? [{ label: `Search: "${initialQuery}"` }] : []),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{totalResults} products found</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="List View"
              aria-label="List View"
            >
              <List size={18} />
            </button>
          </div>
          <ProductSort value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters - sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters
            brands={brands}
            priceRange={priceRange}
            filters={filters}
            onToggleBrand={toggleBrand}
            onPriceChange={setPriceRange}
            onRatingChange={setRating}
            onClear={clearFilters}
          />
        </aside>

        {/* Products container */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <p className="text-lg font-medium text-gray-700 mb-1">No products found</p>
              <p className="text-sm text-gray-500 mb-4">Try adjusting or clearing your filters to see more results.</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'list'
                  ? 'flex flex-col gap-4'
                  : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} view={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}