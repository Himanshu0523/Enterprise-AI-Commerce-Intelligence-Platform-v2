import { Suspense } from 'react';
import ProductListingWithFilters from '@/components/product/ProductFilters/ProductListingWithFilters';

/**
 * @typedef {Object} SearchPageProps
 * @property {Promise<{ q?: string }> | { q?: string }} searchParams
 */

/**
 * Search Page Component
 * @param {SearchPageProps} props
 */
export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q || '';

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-gray-500">Searching...</div>}>
      <ProductListingWithFilters
        initialQuery={query}
        title={`Search results for "${query}"`}
      />
    </Suspense>
  );
}