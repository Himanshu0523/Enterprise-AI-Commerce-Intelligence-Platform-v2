'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById } from '@/lib/api/orders';
import { ArrowLeft, Truck, Package, AlertCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const params=useParams();
  const router=useRouter();
  const [order,setOrder]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{
    let active=true;
    getOrderById(params?.id).then(data=>{if(active)setOrder(data)}).catch(err=>{if(active)setError(err.message || 'Unable to load tracking details.')}).finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[params?.id]);

  if(loading)return <p className="py-16 text-center text-sm text-[#879087]">Loading tracking details…</p>;
  if(error || !order)return <div className="surface-card p-10 text-center"><AlertCircle size={26} className="mx-auto text-[#9b5147]"/><h1 className="editorial-heading mt-4 text-3xl">Tracking unavailable.</h1><p className="mt-2 text-xs text-[#879087]">{error || 'Order not found.'}</p></div>;

  return <div className="space-y-6"><button onClick={()=>router.push('/account/orders/'+order.id)} className="inline-flex items-center gap-2 text-xs font-semibold text-[#668775]"><ArrowLeft size={14}/> Back to order</button><header><p className="editorial-kicker">Shipment</p><h1 className="page-title mt-3">Tracking details.</h1><p className="page-description">Order {order.orderNumber || order.id}</p></header><div className="surface-card p-6 sm:p-8"><div className="flex items-start gap-4"><span className="grid h-12 w-12 place-items-center bg-[#e8eee7] text-[#315b49]"><Truck size={20}/></span><div><h2 className="text-sm font-semibold">Carrier tracking</h2><p className="mt-1 text-xs text-[#788078]">Shipment status: {order.status}</p></div></div>{order.trackingNumber?<div className="mt-6 border-t border-[#e5e4dc] pt-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#929990]">Tracking number</p><p className="mt-2 text-sm font-semibold text-[#315b49]">{order.trackingNumber}</p></div>:<div className="mt-6 border border-dashed border-[#d9ddd4] p-6 text-center"><Package size={24} className="mx-auto text-[#829b88]"/><p className="mt-3 text-sm font-semibold">No tracking number yet.</p><p className="mt-2 text-xs text-[#879087]">The order service has not assigned a carrier reference. Tracking events will appear when the carrier integration provides them.</p></div>}</div></div>;
}