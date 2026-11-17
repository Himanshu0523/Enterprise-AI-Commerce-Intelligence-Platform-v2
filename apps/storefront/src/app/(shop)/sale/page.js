import { Suspense } from 'react';
import ProductListingWithFilters from '@/components/product/ProductFilters/ProductListingWithFilters';

export default function SalePage() {
  return (
    <Suspense fallback={<div className="editorial-shell py-20 text-center text-sm text-[#788078]">Loading offers…</div>}>
      <ProductListingWithFilters collection="sale" title="Selected offers" />
    </Suspense>
  );
}
