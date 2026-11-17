'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, KeyRound, AlertCircle, CheckCircle2, Copy, ArrowUpRight } from 'lucide-react';

async function authApi(path, body = {}) {
  const token = localStorage.getItem('auth_access_token');
  const response = await fetch('/api/auth/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.msg || data.message || 'Authentication request failed.');
  return data;
}

async function getMfaStatus() {
  const token = localStorage.getItem('auth_access_token');
  const response = await fetch('/api/auth/mfa/status', { headers: token ? { Authorization: 'Bearer ' + token } : {} });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.msg || 'Unable to read MFA status.');
  return data;
}

export default function SecurityPage() {
  const [enabled,setEnabled]=useState(false);
  const [qrCode,setQrCode]=useState('');
  const [secret,setSecret]=useState('');
  const [token,setToken]=useState('');
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');

  
  useEffect(()=>{let active=true;getMfaStatus().then(r=>{if(active)setEnabled(Boolean(r.enabled))}).catch(e=>{if(active)setError(e.message||'Unable to load security settings.')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);

  const beginSetup=async()=>{setBusy(true);setError('');setMessage('');try{const result=await authApi('mfa/setup');setQrCode(result.qrCode||'');setSecret(result.secret||'')}catch(e){setError(e.message||'Unable to start authenticator setup.')}finally{setBusy(false)}};
  const verify=async(event)=>{event.preventDefault();setBusy(true);setError('');setMessage('');try{await authApi('mfa/verify-enable',{token});setEnabled(true);setQrCode('');setSecret('');setToken('');setMessage('Two-factor authentication is enabled.')}catch(e){setError(e.message||'The verification code was not accepted.')}finally{setBusy(false)}};
  const disable=async(event)=>{event.preventDefault();setBusy(true);setError('');setMessage('');try{await authApi('mfa/disable',{token});setEnabled(false);setToken('');setMessage('Two-factor authentication is disabled.')}catch(e){setError(e.message||'Unable to disable two-factor authentication.')}finally{setBusy(false)}};

  return <div className="max-w-2xl space-y-6">
    <header><p className="editorial-kicker">Account</p><h1 className="page-title mt-3">Security.</h1><p className="page-description">Manage two-factor authentication for your sign-in.</p></header>
    {error&&<div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] p-4 text-xs text-[#9b5147]"><AlertCircle size={15}/>{error}</div>}
    {message&&<div className="flex gap-2 border border-[#d5e2d6] bg-[#edf3ed] p-4 text-xs text-[#315b49]"><CheckCircle2 size={15}/>{message}</div>}
    <section className="surface-card p-6 sm:p-8">
      <div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center bg-[#e8eee7] text-[#315b49]"><ShieldCheck size={20}/></span><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-semibold">Authenticator-based two-factor authentication</h2><span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#315b49]">{loading?'Checking…':enabled?'Enabled':'Not enabled'}</span></div><p className="mt-2 text-xs leading-6 text-[#788078]">Use an authenticator app to generate a one-time code when signing in.</p></div></div>
      {!loading&&!enabled&&!qrCode&&<button onClick={beginSetup} disabled={busy} className="primary-action mt-6">{busy?'Preparing…':'Set up authenticator'}</button>}
      {qrCode&&<div className="mt-7 border-t border-[#e5e4dc] pt-6"><p className="text-sm font-semibold">1. Scan this QR code</p><img src={qrCode} alt="Authenticator setup QR code" className="mt-4 h-44 w-44 border border-[#e5e4dc] bg-white p-2"/><p className="mt-4 text-xs text-[#788078]">Or enter this setup key manually:</p><div className="mt-2 flex flex-wrap items-center gap-2"><code className="bg-[#f0f1eb] px-3 py-2 text-xs">{secret}</code><button onClick={()=>navigator.clipboard.writeText(secret)} aria-label="Copy setup key" className="secondary-action"><Copy size={13}/> Copy</button></div><form onSubmit={verify} className="mt-6 space-y-3"><label className="block text-xs font-semibold">2. Enter the six-digit code<input value={token} onChange={e=>setToken(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required className="field-control mt-2 max-w-xs tracking-[.3em]"/></label><button disabled={busy||token.length!==6} className="primary-action">{busy?'Verifying…':'Verify and enable'}</button></form></div>}
      {enabled&&<form onSubmit={disable} className="mt-6 border-t border-[#e5e4dc] pt-6"><p className="text-xs leading-6 text-[#788078]">To disable this protection, enter a current authenticator code.</p><div className="mt-3 flex flex-wrap gap-2"><input value={token} onChange={e=>setToken(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required placeholder="6-digit code" className="field-control max-w-[180px] tracking-[.25em]"/><button disabled={busy||token.length!==6} className="secondary-action">{busy?'Updating…':'Disable 2FA'}</button></div></form>}
    </section>
    <section className="surface-card flex items-start gap-4 p-6"><KeyRound size={18} className="mt-1 text-[#668775]"/><div><h2 className="text-sm font-semibold">Password recovery</h2><p className="mt-2 text-xs leading-6 text-[#788078]">Use the account recovery flow to change a forgotten password.</p><Link href="/forget-password" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#315b49]">Open password recovery <ArrowUpRight size={13}/></Link></div></section>
  </div>;
}