'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/contexts/CartContext';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ArrowUpRight, ShieldCheck } from 'lucide-react';

const money = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(Number(value) || 0);

export default function CartPage() {
  const { items, clearCart, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const itemCount = getTotalItems();
  const subtotal = getTotalPrice();

  if (!items.length) {
    return (
      <div className="page-shell">
        <div className="mx-auto max-w-2xl border border-[#e5e4dc] bg-[#fffefa] px-6 py-16 text-center sm:px-12 sm:py-20">
          <span className="mx-auto grid h-16 w-16 place-items-center bg-[#e8eee7] text-[#315b49]"><ShoppingBag size={25} /></span>
          <p className="editorial-kicker mt-7">Your selection</p>
          <h1 className="editorial-heading mt-3 text-4xl sm:text-5xl">A little room for something good.</h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#788078]">Your bag is currently empty. Explore the collection and add the pieces you would like to keep.</p>
          <Link href="/products" className="primary-action mt-8">Explore the collection <ArrowUpRight size={14} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e4dc] pb-6">
        <div>
          <p className="editorial-kicker">Your selection</p>
          <h1 className="page-title mt-3">Shopping bag.</h1>
          <p className="page-description">{itemCount} {itemCount === 1 ? 'piece' : 'pieces'} selected for you.</p>
        </div>
        <Link href="/products" className="inline-flex items-center gap-2 pb-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#557563] hover:text-[#315b49]">Continue exploring <ArrowUpRight size={13} /></Link>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-8">
        <section className="min-w-0 border border-[#e5e4dc] bg-[#fffefa]">
          <div className="flex items-center justify-between border-b border-[#e5e4dc] px-5 py-4 sm:px-6">
            <div><h2 className="text-xs font-semibold text-[#27362e]">Your items</h2><p className="mt-1 text-[10px] text-[#929990]">{itemCount} in your bag</p></div>
            <button type="button" onClick={clearCart} className="inline-flex items-center gap-2 px-2 py-2 text-[10px] font-semibold text-[#9b5147] transition hover:bg-[#fbf1ef]"><Trash2 size={13} /> Clear bag</button>
          </div>

          <ul className="divide-y divide-[#e5e4dc]">
            {items.map((item) => {
              const atStockLimit = Number(item.stock) > 0 && item.quantity >= Number(item.stock);
              const unavailable = item.stock !== undefined && Number(item.stock) <= 0;
              return (
                <li key={item.productId} className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:gap-5 sm:p-6">
                  <Link href={'/products/' + item.productId} className="relative aspect-[4/5] overflow-hidden bg-[#eeeee8]">
                    {item.image ? <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover transition-transform duration-500 hover:scale-105" /> : <span className="grid h-full place-items-center text-[#a4aaa1]"><ShoppingBag size={20} /></span>}
                  </Link>

                  <div className="flex min-w-0 flex-col justify-between gap-4">
                    <div className="min-w-0">
                      <p className="editorial-kicker">Selected product</p>
                      <Link href={'/products/' + item.productId} className="mt-2 block text-sm font-semibold leading-5 text-[#27362e] transition hover:text-[#557563]">{item.name}</Link>
                      <p className="mt-2 text-xs text-[#788078]">{money(item.price)} each</p>
                      {unavailable && <p className="mt-2 text-[10px] font-semibold text-[#9b5147]">Currently unavailable</p>}
                      {atStockLimit && <p className="mt-2 text-[10px] text-[#788078]">Maximum available quantity selected</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="inline-flex h-9 items-center border border-[#dedfd6] bg-white">
                        <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label={'Decrease quantity of ' + item.name} className="grid h-8 w-8 place-items-center text-[#59665e] transition hover:bg-[#f2f2ec]"><Minus size={13} /></button>
                        <span className="w-7 text-center text-xs tabular-nums">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label={'Increase quantity of ' + item.name} disabled={unavailable || atStockLimit} className="grid h-8 w-8 place-items-center text-[#59665e] transition hover:bg-[#f2f2ec] disabled:cursor-not-allowed disabled:opacity-30"><Plus size={13} /></button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.productId)} className="text-[10px] font-semibold text-[#9b5147] underline-offset-4 hover:underline">Remove</button>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center justify-between border-t border-[#efeee8] pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-1 sm:text-right">
                    <span className="text-[10px] text-[#929990] sm:hidden">Line total</span>
                    <strong className="text-sm font-semibold text-[#315b49]">{money(item.price * item.quantity)}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="border border-[#e5e4dc] bg-[#fffefa] p-5 sm:p-6 lg:sticky lg:top-40">
          <p className="editorial-kicker">At a glance</p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-[#27362e]">Order summary.</h2>
          <div className="mt-6 space-y-4 text-xs text-[#788078]">
            <div className="flex justify-between gap-4"><span>Items ({itemCount})</span><span className="font-medium text-[#27362e]">{money(subtotal)}</span></div>
            <div className="flex justify-between gap-4"><span>Delivery</span><span className="text-right">Calculated at checkout</span></div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-[#e5e4dc] pt-5">
            <span className="text-sm font-semibold text-[#27362e]">Subtotal</span>
            <span className="text-lg font-semibold tracking-tight text-[#315b49]">{money(subtotal)}</span>
          </div>
          <p className="mt-3 text-[10px] leading-5 text-[#929990]">Delivery, taxes and final order charges are confirmed by the checkout service.</p>
          <Link href="/checkout/shipping" className="primary-action mt-6 w-full">Continue to checkout <ArrowRight size={14} /></Link>
          <div className="mt-5 flex items-start gap-2 border-t border-[#e5e4dc] pt-4 text-[10px] leading-5 text-[#929990]"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#668775]" /> Your bag is saved in this browser while you explore.</div>
        </aside>
      </div>
    </div>
  );
}
