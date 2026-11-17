'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCheckout } from '@/lib/contexts/CheckoutContext';
import { useCart } from '@/lib/contexts/CartContext';
import { LockKeyhole, ArrowLeft, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

const STANDARD_DELIVERY = 5.99;

export default function PaymentPage() {
  const { state, placeOrder } = useCheckout();
  const { getTotalPrice, getTotalItems } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const itemCount = getTotalItems();
  const subtotal = getTotalPrice();
  const total = subtotal + STANDARD_DELIVERY;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!itemCount) {
      router.replace('/cart');
      return;
    }
    if (!state.shippingAddress || !state.shippingMethod) {
      router.replace('/checkout/shipping');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      // Explicit showcase mode: the API only accepts this when
      // ALLOW_MOCK_PAYMENTS=true is enabled on the payment service.
      const orderId = await placeOrder('DEMO');
      router.replace('/checkout/confirmation/' + encodeURIComponent(orderId));
      router.refresh();
    } catch (err) {
      setError(err.message || 'Unable to submit the demonstration order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="mb-8 border-b border-[#e5e4dc] pb-6">
        <p className="editorial-kicker">Checkout · Payment</p>
        <h1 className="page-title mt-3">Review and submit.</h1>
        <p className="page-description">A transparent demonstration checkout. No real card details are collected and no real payment is charged.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={handleSubmit} className="surface-card p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-[#e5e4dc] pb-6">
            <div className="grid h-11 w-11 shrink-0 place-items-center bg-[#e8eee7] text-[#315b49]"><LockKeyhole size={19} /></div>
            <div>
              <h2 className="text-base font-semibold text-[#1c2924]">Demo payment</h2>
              <p className="mt-1 text-xs leading-5 text-[#788078]">The order service runs the checkout workflow and records a clearly labelled mock payment. This is not a live payment gateway.</p>
            </div>
          </div>

          <div className="mt-6 border border-[#d9ddd4] bg-[#f7f7f2] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#668775]">Showcase environment</p>
            <p className="mt-2 text-sm font-semibold text-[#1c2924]">No card information required</p>
            <p className="mt-2 text-xs leading-6 text-[#788078]">Selecting Place demo order submits the cart, delivery address and delivery method to the order service. Mock payment must be enabled on the payment service.</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-[#55745f]"><ShieldCheck size={14} /> No real charge will be made</div>
          </div>

          {error && <div role="alert" className="mt-5 flex items-start gap-2 border border-[#edd5d0] bg-[#fbf1ef] px-4 py-3 text-xs leading-5 text-[#9b5147]"><AlertCircle size={15} className="mt-0.5 shrink-0" />{error}</div>}

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Link href="/checkout/shipping" className="secondary-action"><ArrowLeft size={14} /> Back to shipping</Link>
            <button type="submit" disabled={isSubmitting || itemCount === 0} className="primary-action disabled:cursor-not-allowed disabled:opacity-40">
              {isSubmitting ? 'Submitting order…' : 'Place demo order'} <ArrowRight size={14} />
            </button>
          </div>
        </form>

        <aside className="surface-card h-fit p-6">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <div className="mt-5 space-y-3 text-xs text-[#788078]">
            <div className="flex justify-between"><span>Items ({itemCount})</span><span>USD {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Standard delivery</span><span>USD {STANDARD_DELIVERY.toFixed(2)}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-[#e5e4dc] pt-4 text-sm font-semibold"><span>Demo total</span><span className="text-[#315b49]">USD {total.toFixed(2)}</span></div>
          <p className="mt-4 text-[10px] leading-5 text-[#929990]">The order service calculates the final order total. This summary is an estimate for the standard delivery option.</p>
        </aside>
      </div>
    </div>
  );
}
