'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getOrdersByUser } from '@/lib/api/orders';
import { ShoppingBag, Heart, MapPin, UserRound, ShieldCheck, ArrowUpRight, Package, AlertCircle } from 'lucide-react';

const links = [
  { href:'/account/orders', label:'Orders', detail:'Order history and status', icon:ShoppingBag },
  { href:'/account/wishlist', label:'Wishlist', detail:'Products you have saved', icon:Heart },
  { href:'/account/addresses', label:'Addresses', detail:'Delivery address book', icon:MapPin },
  { href:'/account/profile', label:'Profile', detail:'Your account details', icon:UserRound },
  { href:'/account/security', label:'Security', detail:'Sign-in protection', icon:ShieldCheck },
];

export default function AccountPage() {
  const { user } = useAuth();
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');

  useEffect(()=>{
    let active=true;
    getOrdersByUser().then(data=>{if(active)setOrders(data)}).catch(err=>{if(active)setError(err.message || 'Unable to load orders.')}).finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[]);

  return (
    <div className="space-y-10">
      <header className="surface-card p-6 sm:p-8">
        <p className="editorial-kicker">Account overview</p>
        <h1 className="editorial-heading mt-3 text-4xl">Hello, {(user?.name || user?.email || 'there').split(' ')[0]}.</h1>
        <p className="mt-3 text-sm text-[#788078]">{user?.email}</p>
      </header>
      <section>
        <div className="mb-5"><p className="editorial-kicker">Account</p><h2 className="editorial-heading mt-2 text-3xl">Manage your space.</h2></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {links.map(({href,label,detail,icon:Icon})=><Link key={href} href={href} className="surface-card group flex items-center gap-4 p-5 transition hover:border-[#9bad9e]"><span className="grid h-11 w-11 shrink-0 place-items-center bg-[#e8eee7] text-[#315b49]"><Icon size={19}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{label}</span><span className="mt-1 block text-xs text-[#879087]">{detail}</span></span><ArrowUpRight size={15} className="text-[#879087] transition group-hover:-translate-y-1 group-hover:translate-x-1"/></Link>)}
        </div>
      </section>
      <section>
        <div className="mb-5 flex items-end justify-between"><div><p className="editorial-kicker">Order activity</p><h2 className="editorial-heading mt-2 text-3xl">Recent orders.</h2></div><Link href="/account/orders" className="text-xs font-semibold text-[#315b49]">View all</Link></div>
        {loading ? <p className="py-8 text-sm text-[#879087]">Loading orders…</p> : error ? <div className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] p-4 text-xs text-[#9b5147]"><AlertCircle size={15}/>{error}</div> : orders.length ? <div className="space-y-2">{orders.slice(0,3).map(order=><Link key={order.id} href={'/account/orders/'+encodeURIComponent(order.id)} className="surface-card flex flex-wrap items-center justify-between gap-4 p-4"><span className="flex items-center gap-3"><Package size={18} className="text-[#668775]"/><span><span className="block text-sm font-semibold">Order {order.orderNumber || order.id}</span><span className="mt-1 block text-xs text-[#879087]">{order.items.length} item(s) · {order.status}</span></span></span><span className="text-sm font-semibold">USD {order.total.toFixed(2)}</span></Link>)}</div> : <div className="surface-card px-6 py-12 text-center"><p className="editorial-heading text-2xl">No orders yet.</p><p className="mt-2 text-xs text-[#879087]">Orders accepted by the order service will appear here.</p><Link href="/products" className="primary-action mt-5">Explore products</Link></div>}
      </section>
    </div>
  );
}