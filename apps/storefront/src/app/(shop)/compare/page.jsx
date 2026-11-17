'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCompare } from '@/lib/hooks/useCompare';
import { getAllProducts } from '@/lib/api/products';
import { X, Scale, ArrowUpRight } from 'lucide-react';

function CompareContent(){
 const {ids,remove,clear}=useCompare();
 const products=getAllProducts();
 const selected=ids.map(id=>products.find(p=>p.id===id)).filter(Boolean);
 if(!selected.length)return <div className="page-shell"><div className="surface-card mx-auto max-w-xl px-6 py-16 text-center"><Scale size={28} className="mx-auto text-[#829b88]"/><h1 className="editorial-heading mt-4 text-4xl">Nothing to compare.</h1><p className="mt-3 text-xs text-[#879087]">Add products using the compare control on a product card.</p><Link href="/products" className="primary-action mt-6">Browse products <ArrowUpRight size={14}/></Link></div></div>;
 return <div className="page-shell"><header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e4dc] pb-6"><div><p className="editorial-kicker">Product exploration</p><h1 className="page-title mt-3">Compare products.</h1><p className="page-description">{selected.length} products selected for comparison.</p></div><button onClick={clear} className="secondary-action"><X size={14}/> Clear comparison</button></header>
 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{selected.map(product=><article key={product.id} className="surface-card overflow-hidden"><div className="relative aspect-[.95] bg-[#eeeee8]"><Image src={product.images?.[0]||'/placeholder.jpg'} alt={product.name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover"/></div><div className="p-5"><p className="editorial-kicker">{product.category}</p><h2 className="editorial-heading mt-2 text-2xl">{product.name}</h2><p className="mt-3 text-sm font-semibold text-[#315b49]">USD {Number(product.price).toFixed(2)}</p><p className="mt-4 min-h-12 text-xs leading-6 text-[#788078]">{product.description}</p><div className="mt-4 border-t border-[#e5e4dc] pt-4 text-xs text-[#788078]"><span className={product.stock>0?'text-[#315b49]':'text-[#9b5147]'}>{product.stock>0?'Available in sample catalogue':'Out of stock'}</span></div><div className="mt-5 flex items-center justify-between"><Link href={'/products/'+product.id} className="text-xs font-semibold text-[#315b49]">View details <ArrowUpRight size={13} className="inline"/></Link><button onClick={()=>remove(product.id)} className="text-xs text-[#9b5147]">Remove</button></div></div></article>)}</div></div>;
}
export default function ComparePage(){return <Suspense fallback={<div className="page-shell py-16 text-center text-xs text-[#879087]">Loading comparison…</div>}><CompareContent/></Suspense>}
