import { redirect } from 'next/navigation';

export default function LegacyOrderSuccessPage() {
  redirect('/account/orders');
}
