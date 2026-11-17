'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.msg || data.message || 'Unable to request a password reset.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Link href="/login" className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-[#788078] hover:text-[#315b49]"><ArrowLeft size={14}/> Back to sign in</Link>
      {!submitted ? <>
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#668775]">Account recovery</p>
        <h1 className="mt-3 font-serif text-4xl tracking-[-.045em] text-[#1c2924]">Reset your password.</h1>
        <p className="mt-4 text-sm leading-6 text-[#788078]">Enter your account email. If it matches an account, the authentication service will send a reset link.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && <div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] px-4 py-3 text-xs text-[#9b5147]"><AlertCircle size={15}/>{error}</div>}
          <div><label htmlFor="recovery-email" className="mb-2 block text-[11px] font-semibold text-[#43534a]">Email address</label><div className="flex h-12 items-center gap-3 border border-[#dedfd6] bg-white px-4 focus-within:border-[#829b88]"><Mail size={16} className="text-[#8c968d]"/><input id="recovery-email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent text-sm outline-none"/></div></div>
          <button disabled={isSubmitting} className="flex h-12 w-full items-center justify-between bg-[#315b49] px-5 text-xs font-semibold text-white hover:bg-[#214635] disabled:opacity-60"><span>{isSubmitting?'Sending request…':'Send recovery link'}</span><Send size={15}/></button>
        </form>
      </> : <div className="py-10 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e8eee7] text-[#315b49]"><CheckCircle2 size={25}/></div><h1 className="mt-5 font-serif text-3xl text-[#1c2924]">Check your inbox.</h1><p className="mt-3 text-sm leading-6 text-[#788078]">If an account exists for <strong>{email}</strong>, password reset instructions will arrive by email.</p><Link href="/login" className="mt-7 inline-flex text-xs font-bold text-[#315b49] hover:underline">Return to sign in</Link></div>}
    </div>
  );
}