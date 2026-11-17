'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useCheckout } from '@/lib/contexts/CheckoutContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ConfirmationPage() {
  const { state } = useCheckout();
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId;

  useEffect(() => {
    if (!state.orderId || state.orderId !== orderId) router.replace('/account/orders');
  }, [state.orderId, orderId, router]);

  if (!state.orderId || state.orderId !== orderId) return null;

  return (
    <div className="page-shell">
      <div className="surface-card mx-auto max-w-2xl px-6 py-14 text-center sm:px-12">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e8eee7] text-[#315b49]"><CheckCircle2 size={30}/></div>
        <p className="editorial-kicker mt-7">Order submitted</p>
        <h1 className="editorial-heading mt-3 text-4xl sm:text-5xl">{state.paymentMethod === 'DEMO' ? 'Demo order accepted.' : 'Your order is in the system.'}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#788078]">{state.paymentMethod === 'DEMO' ? 'The order service accepted the demonstration request. No real payment was charged.' : 'The order service accepted your request. Check the order record for its current processing and payment status.'}</p>
        <div className="mt-8 border-y border-[#e5e4dc] py-5 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#929990]">Order reference</p>
          <p className="mt-2 break-all text-sm font-semibold text-[#315b49]">{orderId}</p>
          <p className="mt-3 text-xs text-[#788078]">Shipping method: {state.shippingMethod || 'Not recorded'}</p>
          <p className="mt-1 text-xs text-[#788078]">Payment mode: {state.paymentMethod === 'DEMO' ? 'Demo payment' : 'Configured payment provider'}</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account/orders" className="primary-action">View orders <ArrowRight size={14}/></Link>
          <Link href="/products" className="secondary-action">Continue browsing</Link>
        </div>
      </div>
    </div>
  );
}