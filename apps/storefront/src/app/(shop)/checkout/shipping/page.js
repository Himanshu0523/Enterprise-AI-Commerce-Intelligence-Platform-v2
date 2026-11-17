'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCheckout } from '@/lib/contexts/CheckoutContext';
import { useCart } from '@/lib/contexts/CartContext';
import { ArrowLeft, ArrowRight, Truck, AlertCircle } from 'lucide-react';

const methods=[
 {id:'standard',label:'Standard',detail:'Demo shipping option',price:5.99},
 {id:'express',label:'Express',detail:'Demo shipping option',price:12.99},
 {id:'overnight',label:'Overnight',detail:'Demo shipping option',price:24.99},
];
const empty={firstName:'',lastName:'',address:'',city:'',state:'',zip:'',country:'',phone:''};

export default function ShippingPage(){
 const {state,setShippingAddress,setShippingMethod}=useCheckout();
 const {getTotalItems,getTotalPrice}=useCart();
 const router=useRouter();
 const [address,setAddress]=useState(state.shippingAddress||empty);
 const [method,setMethod]=useState(state.shippingMethod||'standard');
 const [error,setError]=useState('');
 const [fieldErrors,setFieldErrors]=useState({});

 const submit=(event)=>{
  event.preventDefault();setError('');
  const errors={};
  ['firstName','lastName','address','city','state','zip','country','phone'].forEach(key=>{if(!String(address[key]||'').trim())errors[key]='Required'});
  setFieldErrors(errors);
  if(Object.keys(errors).length){setError('Complete the required delivery details.');return;}
  if(!getTotalItems()){router.push('/cart');return;}
  setShippingAddress(address);setShippingMethod(method);router.push('/checkout/payment');
 };

 const input=(key,label,wide=false)=> <label key={key} className={'block text-xs font-semibold text-[#43534a] '+(wide?'sm:col-span-2':'')}>{label}<input required value={address[key]||''} onChange={e=>setAddress(p=>({...p,[key]:e.target.value}))} className="field-control mt-2"/>{fieldErrors[key]&&<span className="mt-1 block text-[10px] text-[#a34e43]">{fieldErrors[key]}</span>}</label>;

 return <div className="page-shell"><header className="mb-8"><p className="editorial-kicker">Checkout · Delivery</p><h1 className="page-title mt-3">Delivery details.</h1><p className="page-description">Where should this order be sent?</p></header>
  <div className="grid gap-8 lg:grid-cols-[1fr_340px]"><form onSubmit={submit} className="surface-card p-6 sm:p-8">
   <h2 className="text-sm font-semibold">Shipping address</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{input('firstName','First name')}{input('lastName','Last name')}{input('address','Street address',true)}{input('city','City')}{input('state','State / region')}{input('zip','Postal code')}{input('country','Country')}{input('phone','Phone number')}</div>
   <div className="mt-9 border-t border-[#e5e4dc] pt-7"><h2 className="text-sm font-semibold">Delivery method <span className="ml-2 text-[9px] font-normal uppercase tracking-[.12em] text-[#929990]">Demo fees</span></h2><div className="mt-4 space-y-2">{methods.map(option=><label key={option.id} className={'flex cursor-pointer items-center gap-3 border p-4 transition '+(method===option.id?'border-[#829b88] bg-[#f1f4ef]':'border-[#e5e4dc] bg-white hover:border-[#c2ccc0]')}><input type="radio" name="shipping" value={option.id} checked={method===option.id} onChange={()=>setMethod(option.id)} className="accent-[#315b49]"/><span className="grid h-9 w-9 place-items-center bg-[#e8eee7] text-[#315b49]"><Truck size={16}/></span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold">{option.label}</span><span className="mt-1 block text-[10px] text-[#879087]">{option.detail}</span></span><strong className="text-xs">USD {option.price.toFixed(2)}</strong></label>)}</div></div>
   {error&&<p role="alert" className="mt-5 flex gap-2 text-xs text-[#a34e43]"><AlertCircle size={14}/>{error}</p>}
   <div className="mt-8 flex flex-wrap justify-between gap-3"><Link href="/cart" className="secondary-action"><ArrowLeft size={14}/> Back to bag</Link><button className="primary-action">Continue to payment <ArrowRight size={14}/></button></div>
  </form>
  <aside className="surface-card h-fit p-6"><h2 className="text-sm font-semibold">Order summary</h2><div className="mt-5 flex justify-between text-xs text-[#788078]"><span>Items ({getTotalItems()})</span><span>USD {getTotalPrice().toFixed(2)}</span></div><div className="mt-4 flex justify-between border-t border-[#e5e4dc] pt-4 text-sm font-semibold"><span>Subtotal</span><span>USD {getTotalPrice().toFixed(2)}</span></div><p className="mt-4 text-[10px] leading-5 text-[#929990]">Delivery fee is added to the order total by the checkout service.</p></aside></div>
 </div>;
}