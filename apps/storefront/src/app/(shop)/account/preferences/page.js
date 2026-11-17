'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

const LANGUAGES=[{value:'en',label:'English'},{value:'hi',label:'Hindi'}];
const CURRENCIES=[{value:'USD',label:'US Dollar (USD)'},{value:'INR',label:'Indian Rupee (INR)'},{value:'EUR',label:'Euro (EUR)'},{value:'GBP',label:'Pound Sterling (GBP)'}];

export default function PreferencesPage() {
  const [language,setLanguage]=useState('en');
  const [currency,setCurrency]=useState('USD');
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [saved,setSaved]=useState(false);
  useEffect(()=>{let active=true;apiClient('/users/me').then(r=>{if(active){setLanguage(r.profile?.preferences?.language||'en');setCurrency(r.profile?.preferences?.currency||'USD')}}).catch(e=>{if(active)setError(e.message||'Unable to load preferences.')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
  const save=async()=>{setSaving(true);setError('');setSaved(false);try{await apiClient('/users/me',{method:'PUT',body:JSON.stringify({preferences:{language,currency}})});setSaved(true)}catch(e){setError(e.message||'Unable to save preferences.')}finally{setSaving(false)}};
  return <div className="max-w-2xl space-y-6"><header><p className="editorial-kicker">Account</p><h1 className="page-title mt-3">Preferences.</h1><p className="page-description">Set language and currency preferences stored in your account profile. The catalogue currently displays USD and does not convert prices.</p></header>
    {error&&<div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] p-4 text-xs text-[#9b5147]"><AlertCircle size={15}/>{error}</div>}
    <section className="surface-card space-y-6 p-6 sm:p-8"><div className="flex items-center gap-3"><Globe size={18} className="text-[#668775]"/><h2 className="text-sm font-semibold">Regional settings</h2></div>
      <label className="block text-xs font-semibold text-[#43534a]">Language<select disabled={loading} value={language} onChange={e=>setLanguage(e.target.value)} className="field-control mt-2">{LANGUAGES.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
      <label className="block text-xs font-semibold text-[#43534a]">Preferred currency (stored preference; no price conversion)<select disabled={loading} value={currency} onChange={e=>setCurrency(e.target.value)} className="field-control mt-2">{CURRENCIES.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
      <div className="flex items-center justify-end gap-4 border-t border-[#e5e4dc] pt-5">{saved&&<span className="flex items-center gap-1 text-xs text-[#315b49]"><CheckCircle2 size={14}/> Saved</span>}<button onClick={save} disabled={loading||saving} className="primary-action">{saving?'Saving…':'Save preferences'}</button></div>
    </section>
  </div>;
}