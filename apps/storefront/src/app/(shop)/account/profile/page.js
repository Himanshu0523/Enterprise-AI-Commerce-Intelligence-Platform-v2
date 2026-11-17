'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/lib/contexts/AuthContext';
import { UserRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateLocalUser } = useAuth();
  const [name,setName]=useState(user?.name||'');
  const [email,setEmail]=useState(user?.email||'');
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');

  useEffect(()=>{let active=true;apiClient('/users/me').then(r=>{if(active){setName(r.profile?.displayName||user?.name||'');setEmail(r.profile?.email||user?.email||'')}}).catch(e=>{if(active)setError(e.message||'Unable to load profile details.')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[user?.name,user?.email]);

  const save=async(event)=>{event.preventDefault();setSaving(true);setError('');setMessage('');try{await apiClient('/users/me',{method:'PUT',body:JSON.stringify({displayName:name.trim()})});setMessage('Profile name updated.')}catch(e){setError(e.message||'Unable to update profile.')}finally{setSaving(false)}};

  return <div className="max-w-2xl space-y-6">
    <header><p className="editorial-kicker">Account</p><h1 className="page-title mt-3">Profile details.</h1><p className="page-description">Update the name associated with your account.</p></header>
    <form onSubmit={save} className="surface-card space-y-5 p-6 sm:p-8">
      <div className="flex items-center gap-4 border-b border-[#e5e4dc] pb-5"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#e8eee7] text-[#315b49]"><UserRound size={21}/></span><div><p className="text-sm font-semibold">{name||'Account holder'}</p><p className="mt-1 text-xs text-[#879087]">{email}</p></div></div>
      {error&&<p role="alert" className="flex gap-2 text-xs text-[#9b5147]"><AlertCircle size={14}/>{error}</p>}
      {message&&<p className="flex gap-2 text-xs text-[#315b49]"><CheckCircle2 size={14}/>{message}</p>}
      <label className="block text-xs font-semibold text-[#43534a]">Display name<input required minLength={2} maxLength={50} value={name} onChange={e=>setName(e.target.value)} className="field-control mt-2"/></label>
      <label className="block text-xs font-semibold text-[#43534a]">Email address<input disabled value={email} className="field-control mt-2 cursor-not-allowed bg-[#f3f3ee] text-[#879087]"/></label>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e4dc] pt-5"><Link href="/forget-password" className="inline-flex items-center gap-2 text-xs font-semibold text-[#315b49]">Reset password <ArrowRight size={13}/></Link><button disabled={loading||saving||!name.trim()} className="primary-action">{saving?'Saving…':'Save profile'}</button></div>
    </form>
  </div>;
}