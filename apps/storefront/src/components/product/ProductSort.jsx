'use client';

export default function ProductSort({ value, onChange }) {
  return <label className="flex h-10 items-center gap-2 border border-[#dedfd6] bg-white px-3 text-[10px] text-[#788078]"><span className="hidden sm:inline">Sort</span><select aria-label="Sort products" value={value} onChange={e=>onChange(e.target.value)} className="bg-transparent text-[11px] font-semibold text-[#43534a] outline-none"><option value="name">Name A–Z</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>;
}
