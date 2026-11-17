'use client';

import { useState } from 'react';
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import ProductSort from '@/components/product/ProductSort';
import ProductFilters from './index';
import { useProductFilters } from '@/lib/hooks/useProductFilters';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function ProductListingWithFilters({ initialCategory, initialQuery, collection, title = 'Products' }) {
  const [viewMode, setViewMode] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { filteredProducts, totalResults, brands, priceRange, filters, sortBy, toggleBrand, setPriceRange, setRating, setSortBy, clearFilters } = useProductFilters({ initialCategory, initialQuery, collection });
  const breadcrumbItems = [{ label: 'Products', href: '/products' }, ...(initialCategory ? [{ label: initialCategory }] : []), ...(initialQuery ? [{ label: 'Search: ' + initialQuery }] : [])];

  return (
    <div className="page-shell">
      <Breadcrumbs items={breadcrumbItems}/>
      <header className="mb-9 mt-5 flex flex-col justify-between gap-5 border-b border-[#e5e4dc] pb-7 sm:flex-row sm:items-end">
        <div><p className="editorial-kicker">The catalogue</p><h1 className="page-title mt-3">{title}</h1><p className="page-description">{totalResults} {totalResults === 1 ? 'product' : 'products'} in this collection</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={()=>setFiltersOpen(v=>!v)} className="secondary-action lg:hidden"><SlidersHorizontal size={14}/> Filters</button>
          <div className="flex h-10 items-center border border-[#dedfd6] bg-white p-1">
            <button type="button" onClick={()=>setViewMode('grid')} aria-label="Grid view" aria-pressed={viewMode==='grid'} className={'grid h-8 w-8 place-items-center ' + (viewMode==='grid'?'bg-[#e8eee7] text-[#315b49]':'text-[#8b948b]')}><LayoutGrid size={16}/></button>
            <button type="button" onClick={()=>setViewMode('list')} aria-label="List view" aria-pressed={viewMode==='list'} className={'grid h-8 w-8 place-items-center ' + (viewMode==='list'?'bg-[#e8eee7] text-[#315b49]':'text-[#8b948b]')}><List size={16}/></button>
          </div>
          <ProductSort value={sortBy} onChange={setSortBy}/>
        </div>
      </header>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className={(filtersOpen?'block':'hidden') + ' w-full shrink-0 lg:block lg:w-60'}>
          <div className="mb-3 flex items-center justify-between lg:hidden"><span className="text-sm font-semibold">Filters</span><button onClick={()=>setFiltersOpen(false)} aria-label="Close filters"><X size={18}/></button></div>
          <ProductFilters priceRange={priceRange} filters={filters} onPriceChange={setPriceRange} onClear={clearFilters}/>
        </aside>
        <section className="min-w-0 flex-1">
          {filteredProducts.length === 0 ? <div className="surface-card px-6 py-20 text-center"><p className="editorial-heading text-3xl">No matching products.</p><p className="mt-3 text-sm text-[#788078]">Adjust your search or clear the filters.</p><button onClick={clearFilters} className="primary-action mt-6">Clear filters</button></div> : <div className={viewMode==='list'?'flex flex-col':'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3'}>{filteredProducts.map(product=><ProductCard key={product.id} product={product} view={viewMode}/>)}</div>}
        </section>
      </div>
    </div>
  );
}
