"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LucideLock, LucideMail, LucideShieldCheck, LucideArrowRight,
  LucideShieldAlert, LucideEye, LucideEyeOff, LucideFingerprint,
} from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [otp, setOtp] = useState("");
  const [step2FA, setStep2FA] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(step2FA ? "/api/session/verify-mfa" : "/api/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(step2FA ? { mfaToken, token: otp } : { email, password }),
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Authentication failed.");
      if (!step2FA && data.requireMFA) {
        if (!data.mfaToken) throw new Error("The identity service did not issue an MFA challenge.");
        setMfaToken(data.mfaToken);
        setStep2FA(true);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-100 p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/25 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/25 rounded-full blur-[128px] pointer-events-none" />
      <div className="w-full max-w-xl relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-semibold tracking-wider uppercase">
            <LucideShieldCheck className="h-4 w-4" /> Enterprise Security Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <span className="text-indigo-500">◆</span> AURA COMMAND CENTER
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Restricted access for authorized platform administrators.
          </p>
        </div>
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
          {error && (
            <div role="alert" className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
              <LucideShieldAlert className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {!step2FA ? (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5" htmlFor="admin-email">Administrator email</label>
                <div className="relative">
                  <LucideMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5" htmlFor="admin-password">Password</label>
                <div className="relative">
                  <LucideLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your account password" className="w-full pl-10 pr-11 py-3 text-sm rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                    {showPassword ? <LucideEyeOff className="h-4 w-4" /> : <LucideEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-50">
                {isLoading ? "Verifying credentials…" : <>Sign in securely <LucideArrowRight className="h-4 w-4" /></>}
              </button>
              <p className="text-center text-[11px] text-zinc-500">Access is granted only to accounts with an administrator role.</p>
            </form>
          ) : (
            <form onSubmit={submit} className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <LucideFingerprint className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Two-factor verification</h2>
                <p className="text-xs text-zinc-400">Enter the current six-digit code from your authenticator app.</p>
              </div>
              <input aria-label="Authenticator code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\\D/g, "").slice(0, 6))} placeholder="000000" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-4 text-center text-2xl tracking-[0.5em] text-white outline-none focus:border-indigo-500" />
              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep2FA(false); setMfaToken(""); setOtp(""); setError(""); }} className="w-1/3 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold">Back</button>
                <button type="submit" disabled={isLoading || otp.length !== 6} className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-50">
                  {isLoading ? "Verifying…" : "Verify and continue"}
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500">
          <LucideShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Credentials verified by the central identity service
        </div>
      </div>
    </div>
  );
}
