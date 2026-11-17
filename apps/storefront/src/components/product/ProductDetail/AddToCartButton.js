'use client';

import { useCart } from '@/lib/contexts/CartContext';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartButton({ productId, name, price, image, quantity = 1, disabled = false, compact = false, stock = 99 }) {
  const { addItem } = useCart();
  const [added,setAdded]=useState(false);
  const handleAddToCart=()=>{
    if(disabled)return;
    addItem({productId,name,price:Number(price),image,stock:Number(stock)},quantity);
    setAdded(true);
    window.setTimeout(()=>setAdded(false),1400);
  };
  return <button type="button" onClick={handleAddToCart} disabled={disabled} className={'inline-flex min-h-10 items-center justify-center gap-2 bg-[#315b49] px-4 text-[10px] font-bold uppercase tracking-[.12em] text-white transition hover:bg-[#214635] disabled:cursor-not-allowed disabled:bg-[#b7beb7] '+(compact?'w-auto':'w-full')} aria-label={disabled?'Out of stock':'Add '+name+' to bag'}>
    {disabled?'Unavailable':added?<><Check size={14}/> Added</>:<><ShoppingBag size={14}/> Add to bag</>}
  </button>;
}