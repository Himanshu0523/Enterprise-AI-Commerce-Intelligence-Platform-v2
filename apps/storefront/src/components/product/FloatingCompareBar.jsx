'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCompare } from '@/lib/hooks/useCompare';
import productsData from '@/lib/mock-data/products.json';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

export default function FloatingCompareBar() {
  const { ids, remove, clear, maxCount } = useCompare();
  if (!ids?.length) return null;
  const comparedProducts=ids.map(id=>productsData.find(product=>product.id===id)).filter(Boolean);
  return <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-24px)] max-w-4xl -translate-x-1/2 border border-[#d9ddd4] bg-[#fffefa]/95 p-3 text-[#1c2924] shadow-[0_18px_55px_rgba(28,41,36,.18)] backdrop-blur-xl sm:p-4">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center bg-[#e8eee7] text-[#315b49]"><Scale size={18}/></span><div className="shrink-0"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#829087]">Compare</p><p className="text-xs font-semibold">{ids.length} of {maxCount} selected</p></div><div className="flex min-w-0 items-center gap-2 overflow-x-auto">{comparedProducts.map(product=><div key={product.id} className="group relative h-10 w-10 shrink-0 overflow-hidden bg-[#eeeee8]"><Image src={product.images?.[0]||'/placeholder.jpg'} alt={product.name} fill sizes="40px" className="object-cover"/><button onClick={()=>remove(product.id)} aria-label={'Remove '+product.name} className="absolute inset-0 grid place-items-center bg-[#1c2924]/65 text-white opacity-0 transition group-hover:opacity-100"><X size={14}/></button></div>)}</div></div>
      <div className="flex shrink-0 items-center justify-end gap-3"><button onClick={clear} className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#879087] hover:text-[#9b5147]"><Trash2 size={13}/> Clear</button><Link href="/compare" className="inline-flex items-center gap-3 bg-[#315b49] px-4 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-white hover:bg-[#214635]">Compare now <ArrowRight size={14}/></Link></div>
    </div>
  </div>;
}