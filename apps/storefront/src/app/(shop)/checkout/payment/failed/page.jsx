import { redirect } from 'next/navigation';

export default function LegacyPaymentFailedPage() {
  redirect('/checkout/payment');
}
