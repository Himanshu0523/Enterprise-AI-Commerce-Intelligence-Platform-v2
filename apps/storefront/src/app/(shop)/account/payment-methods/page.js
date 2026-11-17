'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { CreditCard, AlertCircle, ShieldCheck } from 'lucide-react';

export default function PaymentMethodsPage() {
  const [methods,setMethods]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{let active=true;apiClient('/users/me/payment-methods').then(r=>{if(active)setMethods(r.paymentMethods||[])}).catch(e=>{if(active)setError(e.message||'Unable to load saved payment references.')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
  return <div className="space-y-6"><header><p className="editorial-kicker">Account</p><h1 className="page-title mt-3">Payment methods.</h1><p className="page-description">Only payment references returned by the payment service are shown here. Card numbers are not stored in this storefront.</p></header>
    {error&&<div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] p-4 text-xs text-[#9b5147]"><AlertCircle size={15}/>{error}</div>}
    {loading?<p className="py-10 text-sm text-[#879087]">Loading payment references…</p>:methods.length===0?<div className="surface-card px-6 py-16 text-center"><CreditCard size={28} className="mx-auto text-[#829b88]"/><h2 className="editorial-heading mt-4 text-3xl">No saved payment methods.</h2><p className="mt-2 text-xs text-[#879087]">A payment method will appear here only after the payment service returns a saved reference.</p></div>:<div className="grid gap-3 md:grid-cols-2">{methods.map(method=><div key={method.id} className="surface-card flex items-center gap-4 p-5"><span className="grid h-11 w-11 place-items-center bg-[#e8eee7] text-[#315b49]"><CreditCard size={18}/></span><span><span className="block text-sm font-semibold capitalize">{method.type||'Payment method'} ···· {method.last4||'—'}</span><span className="mt-1 block text-xs text-[#879087]">{method.isDefault?'Default method':'Saved reference'}</span></span></div>)}</div>}
    <p className="flex gap-2 text-[11px] leading-5 text-[#879087]"><ShieldCheck size={14} className="mt-0.5 shrink-0"/>Do not enter card numbers or CVV values into this account page. Checkout should use the payment provider's secure components.</p>
  </div>;
}