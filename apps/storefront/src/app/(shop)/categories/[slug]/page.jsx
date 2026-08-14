import { Suspense } from 'react';
import ProductListingWithFilters from '@/components/product/ProductFilters/ProductListingWithFilters';

/**
 * @typedef {Object} CategoryPageProps
 * @property {Object} params
 * @property {string} params.slug
 */

/**
 * @param {CategoryPageProps} props
 */
export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const title = resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-gray-500">Loading category...</div>}>
      <ProductListingWithFilters
        initialCategory={resolvedParams.slug}
        title={title}
      />
    </Suspense>
  );
}