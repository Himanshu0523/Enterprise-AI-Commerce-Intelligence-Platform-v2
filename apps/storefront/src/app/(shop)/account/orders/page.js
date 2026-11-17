'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrdersByUser } from '@/lib/api/orders';
import { Package, ArrowRight, AlertCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{
    let active=true;
    getOrdersByUser().then(data=>{if(active)setOrders(data)}).catch(err=>{if(active)setError(err.message || 'Unable to load orders.')}).finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[]);

  return <div className="space-y-6">
    <header className="border-b border-[#e5e4dc] pb-6"><p className="editorial-kicker">Account</p><h1 className="page-title mt-3">Your orders.</h1><p className="page-description">Orders returned by your account service.</p></header>
    {loading?<p className="py-10 text-sm text-[#879087]">Loading order history…</p>:error?<div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] p-4 text-xs text-[#9b5147]"><AlertCircle size={15}/>{error}</div>:orders.length===0?<div className="surface-card px-6 py-16 text-center"><Package size={30} className="mx-auto text-[#829b88]"/><h2 className="editorial-heading mt-4 text-3xl">No orders to show.</h2><p className="mt-2 text-xs text-[#879087]">Your order history will appear here after an order is accepted.</p><Link href="/products" className="primary-action mt-6">Browse products</Link></div>:<div className="space-y-3">{orders.map(order=><Link key={order.id} href={'/account/orders/'+encodeURIComponent(order.id)} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5 transition hover:border-[#9bad9e]"><span className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center bg-[#e8eee7] text-[#315b49]"><Package size={18}/></span><span><span className="block text-sm font-semibold">Order {order.id}</span><span className="mt-1 block text-xs text-[#879087]">{order.date?new Date(order.date).toLocaleDateString():'Date unavailable'} · {order.items.length} item(s) · {order.status}</span></span></span><span className="flex items-center gap-4"><strong className="text-sm">USD {order.total.toFixed(2)}</strong><ArrowRight size={15} className="text-[#668775]"/></span></Link>)}</div>}
  </div>;
}