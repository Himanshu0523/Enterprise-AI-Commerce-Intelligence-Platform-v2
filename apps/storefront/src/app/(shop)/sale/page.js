import Link from 'next/link';
import { ArrowUpRight, Tag } from 'lucide-react';

export default function SalePage() {
  return <div className="page-shell"><div className="surface-card mx-auto max-w-2xl px-6 py-16 text-center sm:px-12"><Tag size={28} className="mx-auto text-[#829b88]"/><p className="editorial-kicker mt-6">Offers</p><h1 className="editorial-heading mt-3 text-4xl">No active offers.</h1><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#788078]">Promotions are not configured for this demonstration catalogue. Browse the current collection instead.</p><Link href="/products" className="primary-action mt-7">Explore products <ArrowUpRight size={14}/></Link></div></div>;
}