import { Suspense } from 'react';
import ProductListingWithFilters from '@/components/product/ProductFilters/ProductListingWithFilters';

export default function SalePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-gray-500">Loading sale items...</div>}>
      <ProductListingWithFilters title="Sale & Special Offers" />
    </Suspense>
  );
}
