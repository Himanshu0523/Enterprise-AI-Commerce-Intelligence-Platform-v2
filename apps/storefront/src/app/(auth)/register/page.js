'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Use at least six characters for your password.');
    if (!agreeTerms) return setError('Please accept the Terms of Service and Privacy Policy.');
    try {
      await register(name, email, password);
      router.replace('/');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const field = 'h-12 w-full border border-[#dedfd6] bg-white pl-11 pr-4 text-sm text-[#1c2924] outline-none transition placeholder:text-[#a5aaa3] focus:border-[#829b88]';

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#668775]">A place for your discoveries</p>
      <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-.045em] text-[#1c2924] sm:text-5xl">Create your space.</h2>
      <p className="mt-4 text-sm leading-6 text-[#788078]">Save the pieces you love and keep your shopping experience in one place.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] px-4 py-3 text-xs text-[#9b5147]"><AlertCircle size={15} />{error}</div>}
        <div><label htmlFor="register-name" className="mb-2 block text-[11px] font-semibold text-[#43534a]">Full name</label><div className="relative"><User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c968d]" /><input id="register-name" required autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className={field} /></div></div>
        <div><label htmlFor="register-email" className="mb-2 block text-[11px] font-semibold text-[#43534a]">Email address</label><div className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c968d]" /><input id="register-email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className={field} /></div></div>
        <div><label htmlFor="register-password" className="mb-2 block text-[11px] font-semibold text-[#43534a]">Password</label><div className="relative"><Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c968d]" /><input id="register-password" type={showPassword?'text':'password'} required minLength={6} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" className={`${field} pr-12`} /><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Hide password':'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c968d]">{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div><PasswordStrengthMeter password={password}/></div>
        <div><label htmlFor="register-confirm" className="mb-2 block text-[11px] font-semibold text-[#43534a]">Confirm password</label><div className="relative"><Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c968d]" /><input id="register-confirm" type={showPassword?'text':'password'} required autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className={field}/></div></div>
        <label className="flex items-start gap-2.5 text-xs leading-5 text-[#788078]"><input type="checkbox" checked={agreeTerms} onChange={e=>setAgreeTerms(e.target.checked)} className="mt-1 accent-[#315b49]"/><span>I agree to the <Link href="/terms" className="font-semibold text-[#315b49] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="font-semibold text-[#315b49] hover:underline">Privacy Policy</Link>.</span></label>
        <button type="submit" disabled={isLoading} className="group flex h-13 w-full items-center justify-between bg-[#315b49] px-5 text-xs font-semibold text-white transition hover:bg-[#214635] disabled:opacity-60"><span>{isLoading?'Creating your account…':'Create account'}</span><ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></button>
      </form>
      <p className="mt-8 text-center text-xs text-[#788078]">Already have an account? <Link href="/login" className="font-bold text-[#315b49] hover:underline">Sign in</Link></p>
    </div>
  );
}