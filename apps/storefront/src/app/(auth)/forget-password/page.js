'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Simulate API call to send reset email link
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSubmitted(true);
    } catch (err) {
      setError('Unable to send reset email. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition mb-2">
        <ArrowLeft className="h-4 w-4" /> Back to Sign In
      </Link>

      {!submitted ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Reset Password</h2>
            <p className="text-sm text-zinc-400">
              Enter your registered email address and we will send you a secure link to reset your account password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Registered Email</label>
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                'Sending Link...'
              ) : (
                <>
                  Send Recovery Link <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Recovery Email Sent!</h3>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto">
              We have sent password reset instructions to <span className="font-semibold text-zinc-200">{email}</span>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-xs text-zinc-400 space-y-2 text-left">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <ShieldCheck className="h-4 w-4" /> What happens next?
            </div>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Check your inbox and spam folder for the email.</li>
              <li>Click the secure single-use recovery link inside.</li>
              <li>The link expires in 15 minutes for your security.</li>
            </ul>
          </div>

          <button
            onClick={() => setSubmitted(false)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
          >
            Didn't receive email? Try again
          </button>
        </div>
      )}
    </>
  );
}