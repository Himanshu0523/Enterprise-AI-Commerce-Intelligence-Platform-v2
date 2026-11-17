'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getOrderById } from '@/lib/api/orders';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, AlertCircle } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order,setOrder] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');

  useEffect(()=>{
    let active=true;
    getOrderById(params?.id).then(data=>{if(active)setOrder(data)}).catch(err=>{if(active)setError(err.message || 'Unable to load this order.')}).finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[params?.id]);

  if (loading) return <div className="py-20 text-center text-sm text-[#879087]">Loading order…</div>;
  if (error || !order) return <div className="surface-card px-6 py-16 text-center"><AlertCircle size={28} className="mx-auto text-[#9b5147]"/><h1 className="editorial-heading mt-4 text-3xl">Order unavailable.</h1><p className="mt-2 text-xs text-[#879087]">{error || 'This order could not be found for your account.'}</p><button onClick={()=>router.push('/account/orders')} className="primary-action mt-6"><ArrowLeft size={14}/> Back to orders</button></div>;

  const status = String(order.status || 'pending').toLowerCase();
  const address = order.shippingAddress || {};

  return (
    <div className="space-y-7">
      <button onClick={()=>router.push('/account/orders')} className="inline-flex items-center gap-2 text-xs font-semibold text-[#668775] hover:text-[#315b49]"><ArrowLeft size={14}/> Back to orders</button>
      <header className="border-b border-[#e5e4dc] pb-6">
        <p className="editorial-kicker">Order details</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="page-title">Order {order.orderNumber || order.id}</h1><p className="mt-3 text-xs text-[#879087]">Placed {order.date ? new Date(order.date).toLocaleString() : 'Date unavailable'}</p></div><span className="border border-[#d9ddd4] bg-[#e8eee7] px-3 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#315b49]">{status}</span></div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="surface-card">
          <div className="border-b border-[#e5e4dc] px-5 py-4"><h2 className="text-sm font-semibold">Items</h2></div>
          <ul className="divide-y divide-[#e5e4dc]">{order.items.map((item,index)=><li key={item.productId || index} className="flex items-center gap-4 p-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#eeeee8]">{item.image && <Image src={item.image} alt={item.name || 'Product'} fill sizes="80px" className="object-cover"/>}</div>
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.name || 'Product'}</p><p className="mt-1 text-xs text-[#879087]">Quantity: {item.quantity}</p></div>
            <p className="text-sm font-semibold">USD {(Number(item.price||0)*Number(item.quantity||0)).toFixed(2)}</p>
          </li>)}</ul>
          <div className="flex justify-between border-t border-[#e5e4dc] px-5 py-5"><span className="text-sm font-semibold">Order total</span><strong className="text-sm text-[#315b49]">USD {order.total.toFixed(2)}</strong></div>
        </section>
        <aside className="space-y-4">
          <div className="surface-card p-5"><div className="flex items-center gap-2"><MapPin size={16} className="text-[#668775]"/><h2 className="text-sm font-semibold">Delivery address</h2></div><address className="mt-4 space-y-1 text-xs not-italic leading-5 text-[#788078]"><p className="font-semibold text-[#1c2924]">{address.fullName}</p><p>{address.addressLine1}</p><p>{address.city}, {address.state} {address.postalCode}</p><p>{address.country}</p><p>{address.phone}</p></address></div>
          <div className="surface-card p-5"><div className="flex items-center gap-2"><Truck size={16} className="text-[#668775]"/><h2 className="text-sm font-semibold">Fulfilment</h2></div><p className="mt-3 text-xs text-[#788078]">Shipping method: {order.shippingMethod || 'Not available'}</p>{order.trackingNumber ? <Link href={'/account/orders/'+order.id+'/track'} className="mt-3 inline-flex text-xs font-semibold text-[#315b49]">View tracking details</Link> : <p className="mt-2 text-xs text-[#929990]">Tracking information has not been assigned.</p>}</div>
          <div className="surface-card p-5"><div className="flex items-center gap-2"><CreditCard size={16} className="text-[#668775]"/><h2 className="text-sm font-semibold">Payment</h2></div><p className="mt-3 text-xs text-[#788078]">Method: {order.paymentMethod === 'DEMO' ? 'Demo payment · no real charge' : order.paymentMethod || 'Not recorded'}</p><p className="mt-2 text-xs text-[#788078]">Status: {order.paymentMethod === 'DEMO' ? 'Demo accepted' : String(order.paymentStatus || 'unknown').toLowerCase()}</p></div>
        </aside>
      </div>
      <div className="flex flex-wrap gap-3"><Link href="/products" className="secondary-action">Continue browsing</Link><Link href="/account/orders" className="primary-action">Order history</Link></div>
    </div>
  );
}