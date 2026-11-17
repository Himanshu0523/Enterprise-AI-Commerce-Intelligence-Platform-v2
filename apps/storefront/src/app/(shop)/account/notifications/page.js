'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Bell, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  const [enabled,setEnabled]=useState(true);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [saved,setSaved]=useState(false);
  useEffect(()=>{let active=true;apiClient('/users/me').then(r=>{if(active)setEnabled(r.profile?.preferences?.notifications!==false)}).catch(e=>{if(active)setError(e.message||'Unable to load notification preference.')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
  const save=async()=>{setSaving(true);setError('');setSaved(false);try{await apiClient('/users/me',{method:'PUT',body:JSON.stringify({preferences:{notifications:enabled}})});setSaved(true)}catch(e){setError(e.message||'Unable to save notification preference.')}finally{setSaving(false)}};
  return <div className="max-w-2xl space-y-6"><header><p className="editorial-kicker">Account</p><h1 className="page-title mt-3">Notifications.</h1><p className="page-description">Store your account notification preference. Delivery channels are not connected yet.</p></header>
    {error&&<div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] p-4 text-xs text-[#9b5147]"><AlertCircle size={15}/>{error}</div>}
    <section className="surface-card p-6 sm:p-8"><div className="flex items-start gap-4"><span className="grid h-11 w-11 place-items-center bg-[#e8eee7] text-[#315b49]"><Bell size={19}/></span><div className="flex-1"><h2 className="text-sm font-semibold">Account notifications</h2><p className="mt-2 text-xs leading-6 text-[#788078]">This preference is stored on your user profile. Separate email, SMS and push-channel preferences are not exposed by the current profile API.</p></div></div>
      <label className="mt-7 flex items-center justify-between border-t border-[#e5e4dc] pt-5"><span><span className="block text-sm font-semibold">Enable notifications</span><span className="mt-1 block text-xs text-[#879087]">Save your preference for future notification integration.</span></span><input type="checkbox" checked={enabled} disabled={loading} onChange={e=>setEnabled(e.target.checked)} className="h-5 w-5 accent-[#315b49]"/></label>
      <div className="mt-6 flex items-center justify-end gap-4">{saved&&<span className="flex items-center gap-1 text-xs text-[#315b49]"><CheckCircle2 size={14}/> Saved</span>}<button onClick={save} disabled={loading||saving} className="primary-action">{saving?'Saving…':'Save preference'}</button></div>
    </section>
  </div>;
}