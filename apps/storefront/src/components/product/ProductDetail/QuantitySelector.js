'use client';

import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ quantity = 1, onQuantityChange, max = 99 }) {
  const decrement = () => onQuantityChange?.(Math.max(1, quantity - 1));
  const increment = () => onQuantityChange?.(Math.min(max, quantity + 1));
  return <div className="inline-flex h-11 items-center border border-[#dedfd6] bg-white">
    <button type="button" onClick={decrement} disabled={quantity<=1} aria-label="Decrease quantity" className="grid h-10 w-10 place-items-center text-[#59665e] hover:bg-[#f0f1eb] disabled:opacity-30"><Minus size={14}/></button>
    <input type="number" min={1} max={max} value={quantity} onChange={event=>{const value=Number.parseInt(event.target.value,10);if(Number.isFinite(value))onQuantityChange?.(Math.max(1,Math.min(max,value)));}} aria-label="Quantity" className="h-10 w-12 border-x border-[#e5e4dc] bg-transparent text-center text-xs font-semibold outline-none"/>
    <button type="button" onClick={increment} disabled={quantity>=max} aria-label="Increase quantity" className="grid h-10 w-10 place-items-center text-[#59665e] hover:bg-[#f0f1eb] disabled:opacity-30"><Plus size={14}/></button>
  </div>;
}