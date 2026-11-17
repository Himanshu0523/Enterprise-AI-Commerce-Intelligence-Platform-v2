'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import OtpModal from '@/components/auth/OtpModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const getRedirectPath = () => new URLSearchParams(window.location.search).get('redirect') || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const result = await login(email, password);
      if (result.requiresMfa) {
        setShowOtpModal(true);
        return;
      }
      router.replace(getRedirectPath());
      router.refresh();
    } catch (err) {
      setError(err.message || 'Unable to sign in. Check your credentials and try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.assign('/api/auth/google');
  };

  const handleOtpSuccess = () => {
    setShowOtpModal(false);
    router.replace(searchParams.get('redirect') || '/');
    router.refresh();
  };

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#668775]">Your space, waiting</p>
      <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-.045em] text-[#1c2924] sm:text-5xl">Welcome back.</h2>
      <p className="mt-4 max-w-sm text-sm leading-6 text-[#788078]">Sign in to pick up where you left off and keep your discoveries together.</p>

      <button type="button" onClick={handleGoogleLogin} className="mt-8 flex h-12 w-full items-center justify-center gap-3 border border-[#dedfd6] bg-white text-xs font-semibold text-[#34443a] transition hover:border-[#9aaa9b] hover:bg-[#fbfbf8]">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
        Continue with Google
      </button>

      <div className="my-7 flex items-center gap-4"><span className="h-px flex-1 bg-[#e5e4dc]" /><span className="text-[9px] font-bold uppercase tracking-[.18em] text-[#a0a69f]">Or use email</span><span className="h-px flex-1 bg-[#e5e4dc]" /></div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div role="alert" className="flex items-start gap-2 border border-[#edd5d0] bg-[#fbf1ef] px-4 py-3 text-xs leading-5 text-[#9b5147]"><AlertCircle size={15} className="mt-0.5 shrink-0" />{error}</div>}
        <div>
          <label htmlFor="login-email" className="mb-2 block text-[11px] font-semibold text-[#43534a]">Email address</label>
          <div className="flex h-12 items-center gap-3 border border-[#dedfd6] bg-white px-4 transition focus-within:border-[#829b88]"><Mail size={16} className="text-[#8c968d]" /><input id="login-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full bg-transparent text-sm outline-none placeholder:text-[#a5aaa3]" /></div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between"><label htmlFor="login-password" className="text-[11px] font-semibold text-[#43534a]">Password</label><Link href="/forget-password" className="text-[10px] font-semibold text-[#668775] hover:text-[#315b49]">Forgot password?</Link></div>
          <div className="flex h-12 items-center gap-3 border border-[#dedfd6] bg-white px-4 transition focus-within:border-[#829b88]"><Lock size={16} className="text-[#8c968d]" /><input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="w-full bg-transparent text-sm outline-none placeholder:text-[#a5aaa3]" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="text-[#8c968d] hover:text-[#315b49]">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#899189]"><ShieldCheck size={14} className="text-[#668775]" /> Your account is authenticated by the platform identity service.</div>
        <button type="submit" disabled={isLoading} className="group flex h-13 w-full items-center justify-between bg-[#315b49] px-5 text-xs font-semibold text-white transition hover:bg-[#214635] disabled:cursor-wait disabled:opacity-60">
          <span>{isLoading ? 'Signing you in…' : 'Sign in to your account'}</span><ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-[#788078]">New here? <Link href="/register" className="font-bold text-[#315b49] hover:underline">Create an account</Link></p>
      <OtpModal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)} email={email} onVerifySuccess={handleOtpSuccess} />
    </div>
  );
}