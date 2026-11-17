'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password.length < 6) return setError('Your password must contain at least six characters.');
    if (password !== confirmPassword) return setError('The passwords do not match.');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.msg || data.message || 'This reset link is invalid or expired.');
      setComplete(true);
    } catch (err) {
      setError(err.message || 'Unable to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {complete ? <div className="py-8 text-center"><CheckCircle2 size={36} className="mx-auto text-[#315b49]"/><h1 className="mt-5 font-serif text-3xl text-[#1c2924]">Password updated.</h1><p className="mt-3 text-sm text-[#788078]">Your password has been changed. Sign in with your new password.</p><Link href="/login" className="mt-7 inline-flex items-center gap-2 bg-[#315b49] px-5 py-3 text-xs font-semibold text-white">Return to sign in <ArrowRight size={14}/></Link></div> : <>
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#668775]">Account recovery</p>
        <h1 className="mt-3 font-serif text-4xl tracking-[-.045em] text-[#1c2924]">Choose a new password.</h1>
        <p className="mt-4 text-sm leading-6 text-[#788078]">Create a new password for your account.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && <div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] px-4 py-3 text-xs text-[#9b5147]"><AlertCircle size={15}/>{error}</div>}
          <div><label htmlFor="new-password" className="mb-2 block text-[11px] font-semibold text-[#43534a]">New password</label><div className="flex h-12 items-center gap-3 border border-[#dedfd6] bg-white px-4"><Lock size={16} className="text-[#8c968d]"/><input id="new-password" type={showPassword?'text':'password'} autoComplete="new-password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="At least 6 characters"/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label="Toggle password visibility" className="text-[#8c968d]">{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></div>
          <div><label htmlFor="confirm-new-password" className="mb-2 block text-[11px] font-semibold text-[#43534a]">Confirm new password</label><input id="confirm-new-password" type={showPassword?'text':'password'} autoComplete="new-password" required value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="h-12 w-full border border-[#dedfd6] bg-white px-4 text-sm outline-none focus:border-[#829b88]" placeholder="Enter it again"/></div>
          <button disabled={isSubmitting} className="flex h-12 w-full items-center justify-between bg-[#315b49] px-5 text-xs font-semibold text-white hover:bg-[#214635] disabled:opacity-60"><span>{isSubmitting?'Updating password…':'Update password'}</span><ArrowRight size={15}/></button>
        </form>
      </>}
    </div>
  );
}