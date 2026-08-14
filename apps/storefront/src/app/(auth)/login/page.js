'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Github } from 'lucide-react';
import OtpModal from '@/components/auth/OtpModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      await login(email, password);
      // Optional 2FA simulation for demo or direct login
      if (email.includes('2fa')) {
        setShowOtpModal(true);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Try demo@example.com / password');
    }
  };

  const handleSocialLogin = (provider) => {
    setError(`Connecting with ${provider}...`);
    setTimeout(() => {
      login('demo@example.com', 'password');
      router.push('/');
    }, 1000);
  };

  const handleOtpSuccess = () => {
    setShowOtpModal(false);
    router.push('/');
  };

  return (
    <>
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Welcome Back</h2>
        <p className="text-sm text-zinc-400">
          Sign in to access your wishlist, order status, and personalized AI deals.
        </p>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold hover:bg-zinc-800/60 transition shadow-sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('GitHub')}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold hover:bg-zinc-800/60 transition shadow-sm"
        >
          <Github className="h-4 w-4 text-zinc-100" />
          GitHub
        </button>
      </div>

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
        <span className="relative px-3 bg-zinc-950 text-xs text-zinc-500 uppercase tracking-widest">Or email sign in</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition shadow-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-zinc-300">Password</label>
              <Link href="/forget-password" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-zinc-400 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-800 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            Keep me signed in
          </label>
          <span className="text-zinc-500 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Protected by 2FA
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          {isLoading ? (
            'Authenticating...'
          ) : (
            <>
              Sign In to Account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-zinc-400 pt-2">
          New to Aura Store?{' '}
          <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition">
            Create an Account
          </Link>
        </p>
      </form>

      {/* 2FA Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={email}
        onVerifySuccess={handleOtpSuccess}
      />
    </>
  );
}