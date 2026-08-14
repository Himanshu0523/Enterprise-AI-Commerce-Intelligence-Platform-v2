'use client';

import React, { useState } from 'react';
import { Shield, Key, Smartphone, Globe, AlertTriangle, Eye, EyeOff, CheckCircle, LogOut, Monitor, Clock } from 'lucide-react';

const MOCK_SESSIONS = [
  { id: 1, device: 'Chrome on Windows 11', location: 'Mumbai, IN', lastActive: 'Active now', isCurrent: true },
  { id: 2, device: 'Safari on iPhone 15', location: 'Mumbai, IN', lastActive: '2 hours ago', isCurrent: false },
  { id: 3, device: 'Firefox on MacOS', location: 'Pune, IN', lastActive: '3 days ago', isCurrent: false },
];

function InputField({ label, type = 'text', placeholder, value, onChange, required }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <div className="relative">
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function SecurityPage() {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strength = getStrength(newPwd);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][strength];

  const handlePwdChange = async (e) => {
    e.preventDefault();
    setPwdError('');
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match.'); return; }
    if (strength < 2) { setPwdError('Password is too weak.'); return; }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setPwdSaved(true);
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    setTimeout(() => setPwdSaved(false), 3000);
  };

  const revokeSession = (id) => setSessions((s) => s.filter((sess) => sess.id !== id));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Security</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your password, two-factor auth, and active sessions.</p>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
            <Key size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Change Password</h2>
        </div>
        <form onSubmit={handlePwdChange} className="p-6 space-y-5">
          <InputField label="Current Password" type="password" placeholder="Enter current password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} required />
          <InputField label="New Password" type="password" placeholder="Enter new password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required />

          {/* Strength meter */}
          {newPwd && (
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-200 dark:bg-gray-700'}`} />
                ))}
              </div>
              <p className={`text-xs font-medium ${['','text-red-500','text-amber-500','text-blue-500','text-emerald-500'][strength]}`}>{strengthLabel}</p>
            </div>
          )}

          <InputField label="Confirm New Password" type="password" placeholder="Confirm new password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required />

          {pwdError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle size={14} /> {pwdError}
            </div>
          )}

          <div className="flex items-center justify-end gap-4">
            {pwdSaved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle size={14} /> Password updated!
              </span>
            )}
            <button type="submit" disabled={isSaving || !currentPwd || !newPwd || !confirmPwd}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Updating...</> : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Auth */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
            <Shield size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
          <span className={`ml-auto inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${mfaEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
            {mfaEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            Add an extra layer of security to your account. When enabled, you'll need your phone in addition to your password to sign in.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex-shrink-0">
              <Smartphone size={22} className="text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Authenticator App (TOTP)</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Use an app like Google Authenticator or Authy.</p>
            </div>
            <button
              onClick={() => setMfaEnabled(!mfaEnabled)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all shadow-sm ${
                mfaEnabled
                  ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {mfaEnabled ? 'Disable' : 'Enable 2FA'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
            <Globe size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Active Sessions</h2>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{sessions.length} device{sessions.length !== 1 ? 's' : ''}</span>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {sessions.map((sess) => (
            <li key={sess.id} className="flex items-center gap-4 px-6 py-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${sess.isCurrent ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Monitor size={18} className={sess.isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{sess.device}</p>
                  {sess.isCurrent && <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-400">Current</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <Globe size={10} /> {sess.location} · <Clock size={10} /> {sess.lastActive}
                </p>
              </div>
              {!sess.isCurrent && (
                <button
                  onClick={() => revokeSession(sess.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  <LogOut size={12} /> Revoke
                </button>
              )}
            </li>
          ))}
        </ul>
        {sessions.length > 1 && (
          <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4">
            <button
              onClick={() => setSessions(sessions.filter((s) => s.isCurrent))}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 hover:underline"
            >
              Sign out of all other sessions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
