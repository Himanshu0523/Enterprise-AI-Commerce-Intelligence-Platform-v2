import { redirect } from 'next/navigation';

export default function LegacyAuthSuccessPage() {
  redirect('/login');
}
