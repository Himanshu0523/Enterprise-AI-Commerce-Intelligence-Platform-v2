import { redirect } from 'next/navigation';

export default function LegacyResetPasswordPage() {
  redirect('/forget-password');
}
