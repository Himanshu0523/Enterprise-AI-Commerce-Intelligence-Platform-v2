'use client';

export default function ProductFilters({ priceRange, filters, onPriceChange, onClear }) {
  return (
    <div className="space-y-7 border-t border-[#e5e4dc] pt-5 lg:border-t-0 lg:pt-0">
      <div className="flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-[.16em] text-[#43534a]">Refine</h3><button onClick={onClear} className="text-[10px] font-semibold text-[#668775] hover:text-[#315b49]">Clear all</button></div>
      <section><h4 className="text-xs font-semibold">Price range</h4><p className="mt-1 text-[10px] text-[#929990]">USD</p><div className="mt-3 grid grid-cols-2 gap-2"><label className="text-[10px] text-[#788078]">Minimum<input type="number" min="0" value={filters.priceMin??''} onChange={e=>onPriceChange(e.target.value?Number(e.target.value):null,filters.priceMax)} placeholder={String(priceRange.min)} className="field-control mt-1"/></label><label className="text-[10px] text-[#788078]">Maximum<input type="number" min="0" value={filters.priceMax??''} onChange={e=>onPriceChange(filters.priceMin,e.target.value?Number(e.target.value):null)} placeholder={String(priceRange.max)} className="field-control mt-1"/></label></div></section>
    </div>
  );
}
