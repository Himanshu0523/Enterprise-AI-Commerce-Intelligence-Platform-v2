'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCheckout } from '@/lib/contexts/CheckoutContext';
import { useCart } from '@/lib/contexts/CartContext';
import { LockKeyhole, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

const DEMO_ENABLED = process.env.NEXT_PUBLIC_PAYMENT_DEMO_MODE === 'true';

export default function PaymentPage() {
  const { setPaymentMethod, placeOrder } = useCheckout();
  const { getTotalPrice, getTotalItems } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!DEMO_ENABLED) return;
    setError('');
    setIsSubmitting(true);
    try {
      setPaymentMethod('DEMO');
      const orderId = await placeOrder();
      router.replace('/checkout/confirmation/' + encodeURIComponent(orderId));
    } catch (err) {
      setError(err.message || 'Unable to submit this order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="mb-8"><p className="editorial-kicker">Checkout · Step 3 of 3</p><h1 className="page-title mt-3">Review and submit.</h1><p className="page-description">Payment details are handled by the configured payment service. This storefront does not collect raw card numbers.</p></div>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="surface-card p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-[#e5e4dc] pb-6">
            <div className="grid h-11 w-11 shrink-0 place-items-center bg-[#e8eee7] text-[#315b49]"><LockKeyhole size={19}/></div>
            <div><h2 className="text-base font-semibold">Payment processing</h2><p className="mt-1 text-xs leading-5 text-[#788078]">No card number, expiry date or security code is requested on this page.</p></div>
          </div>
          {DEMO_ENABLED ? (
            <div className="mt-6 border border-[#d9ddd4] bg-[#f7f7f2] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#668775]">Demo environment</p>
              <p className="mt-2 text-sm font-semibold text-[#1c2924]">Place a demonstration order</p>
              <p className="mt-2 text-xs leading-6 text-[#788078]">This uses explicitly enabled mock-payment mode. It does not charge a real payment method.</p>
            </div>
          ) : (
            <div className="mt-6 flex gap-3 border border-[#e7d8c8] bg-[#faf5ed] p-4 text-xs leading-6 text-[#7a5b3d]"><AlertCircle size={16} className="mt-1 shrink-0"/>The payment provider is not configured for this environment. Order submission is disabled until a verified payment flow or explicit demo-payment mode is enabled.</div>
          )}
          {error && <p role="alert" className="mt-5 text-xs text-[#a34e43]">{error}</p>}
          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Link href="/checkout/shipping" className="secondary-action"><ArrowLeft size={14}/> Back to shipping</Link>
            <button type="submit" disabled={!DEMO_ENABLED || isSubmitting || getTotalItems()===0} className="primary-action disabled:cursor-not-allowed disabled:opacity-40">{isSubmitting?'Submitting…':'Place demo order'} <ArrowRight size={14}/></button>
          </div>
        </form>
        <aside className="surface-card h-fit p-6">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <div className="mt-5 flex justify-between text-xs text-[#788078]"><span>Items ({getTotalItems()})</span><span>${getTotalPrice().toFixed(2)}</span></div>
          <div className="mt-4 flex justify-between border-t border-[#e5e4dc] pt-4 text-sm font-semibold"><span>Subtotal</span><span>${getTotalPrice().toFixed(2)}</span></div>
          <p className="mt-4 text-[10px] leading-5 text-[#929990]">Shipping and final charges are calculated by the order service.</p>
        </aside>
      </div>
    </div>
  );
}