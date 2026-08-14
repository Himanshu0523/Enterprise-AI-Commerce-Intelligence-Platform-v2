'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthSuccessPage() {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/20">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="h-3.5 w-3.5" /> Authentication Confirmed
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back!</h1>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto">
          You are securely signed in. Redirecting to your personal store dashboard in <span className="font-bold text-indigo-400">{countdown}s</span>...
        </p>
      </div>

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all"
        >
          Enter Marketplace Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
