import { Suspense } from 'react';
import ProductListingWithFilters from '@/components/product/ProductFilters/ProductListingWithFilters';

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const category = typeof params?.category === 'string' ? params.category : undefined;

  return (
    <Suspense fallback={<div className="editorial-shell py-20 text-center text-sm text-[#788078]">Loading collection…</div>}>
      <ProductListingWithFilters
        initialCategory={category}
        title={category ? `${category} collection` : 'The collection'}
      />
    </Suspense>
  );
}