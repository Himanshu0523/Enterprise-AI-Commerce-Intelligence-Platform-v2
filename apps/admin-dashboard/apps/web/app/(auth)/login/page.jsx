"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LucideLock,
  LucideMail,
  LucideShieldCheck,
  LucideKeyRound,
  LucideCpu,
  LucideArrowRight,
  LucideShieldAlert,
  LucideEye,
  LucideEyeOff,
  LucideFingerprint,
} from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin");
  const [role, setRole] = useState("super_admin");
  const [showPassword, setShowPassword] = useState(false);
  const [step2FA, setStep2FA] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInitialLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Prompt 2FA step-up security clearance
      setStep2FA(true);
    }, 800);
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      document.cookie = `admin_token=mock_token_${role}; path=/; max-age=86400`;
      document.cookie = `admin_role=${role}; path=/; max-age=86400`;
      router.push("/");
    }, 1000);
  };

  const handleDemoFill = (selectedRole, demoEmail, demoPass) => {
    setRole(selectedRole);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-100 p-4 relative overflow-hidden font-sans">
      {/* Cyber Grid & Glowing Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/25 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/25 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 space-y-6">
        {/* Portal Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-semibold tracking-wider uppercase">
            <LucideShieldCheck className="h-4 w-4" /> Enterprise Security Portal v4.2
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <LucideCpu className="h-8 w-8 text-indigo-500" /> AURA COMMAND CENTER
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Restricted access portal for authorized platform directors & operations officers.
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
          {!step2FA ? (
            <form onSubmit={handleInitialLogin} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                  <LucideShieldAlert className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Role Selection Bar */}
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Select Security Role & Clearance Level
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  {[
                    { id: "super_admin", label: "Super Admin", desc: "Full Master Access" },
                    { id: "catalog_mgr", label: "Catalog Mgr", desc: "Products & Stock" },
                    { id: "fulfillment", label: "Fulfillment", desc: "Orders & Shipping" },
                    { id: "ai_director", label: "AI Systems", desc: "Analytics & ML" },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        role === r.id
                          ? "bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="font-bold text-zinc-200">{r.label}</div>
                      <div className="text-[10px] text-zinc-500">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Credentials Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Admin Identification (Email)</label>
                  <div className="relative">
                    <LucideMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Security Passkey</label>
                  <div className="relative">
                    <LucideLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <LucideEyeOff className="h-4 w-4" /> : <LucideEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
              >
                {isLoading ? (
                  "Authorizing Credential Token..."
                ) : (
                  <>
                    Proceed to 2FA Step-Up Clearance <LucideArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Quick Fill Demo Credentials */}
              <div className="pt-2 border-t border-zinc-800/80 text-center">
                <span className="text-[11px] text-zinc-500 font-mono block mb-2">QUICK DEMO PRESETS</span>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoFill("super_admin", "admin@example.com", "admin")}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 font-mono"
                  >
                    SuperAdmin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill("catalog_mgr", "catalog@example.com", "admin")}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 font-mono"
                  >
                    CatalogMgr
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill("fulfillment", "logistics@example.com", "admin")}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 font-mono"
                  >
                    Fulfillment
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* 2FA Challenge Form */
            <form onSubmit={handleVerify2FA} className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-inner">
                <LucideFingerprint className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Hardware Key / 2FA Security Token</h3>
                <p className="text-xs text-zinc-400">
                  Enter 6-digit TOTP clearance token generated for <span className="text-zinc-200 font-mono">{email}</span>
                </p>
              </div>

              {/* OTP Input Grid */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={otpCode[idx] || "8"}
                    readOnly
                    className="w-11 h-13 text-center text-xl font-mono font-bold rounded-xl border border-indigo-500/50 bg-indigo-950/40 text-indigo-300 shadow-inner"
                  />
                ))}
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                <span>CLEARANCE LEVEL:</span>
                <span className="text-emerald-400 font-bold uppercase">{role}</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep2FA(false)}
                  className="w-1/3 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
                >
                  {isLoading ? "Authenticating Session..." : "Initialize Command Center"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Audit Badge */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-2">
          <span>SESSION IP: 192.168.1.104 (ENCRYPTED)</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <LucideKeyRound className="h-3 w-3" /> TLS 1.3 256-BIT
          </span>
        </div>
      </div>
    </div>
  );
}
