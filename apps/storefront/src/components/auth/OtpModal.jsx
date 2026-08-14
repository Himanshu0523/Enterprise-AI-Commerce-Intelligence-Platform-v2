'use client';

import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, X, ArrowRight } from 'lucide-react';

export default function OtpModal({ isOpen, onClose, email, onVerifySuccess }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance cursor
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter all 6 verification digits');
      return;
    }

    setError('');
    setIsVerifying(true);

    try {
      // Simulate verification call
      await new Promise((res) => setTimeout(res, 1200));
      onVerifySuccess();
    } catch (err) {
      setError('Invalid security code. Please check and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Two-Factor Security</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
            We sent a 6-digit security passkey to <span className="font-semibold text-zinc-800 dark:text-zinc-200">{email || 'your email'}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e.target.value ? e : e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
              />
            ))}
          </div>

          {error && <p className="text-center text-xs font-medium text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
          >
            {isVerifying ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Verify Security Code <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Didn't receive code?{' '}
          {timer > 0 ? (
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Resend in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Resend Code Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
