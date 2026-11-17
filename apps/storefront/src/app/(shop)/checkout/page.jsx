import { redirect } from 'next/navigation';

export default function CheckoutEntryPage() {
  redirect('/checkout/shipping');
}
