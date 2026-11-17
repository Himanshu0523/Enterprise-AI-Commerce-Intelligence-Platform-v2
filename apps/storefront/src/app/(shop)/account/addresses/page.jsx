'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { MapPin, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const emptyAddress = { addressLine1:'', addressLine2:'', city:'', state:'', country:'India', postalCode:'', type:'shipping', isDefault:false };

export default function AddressesPage() {
  const [addresses,setAddresses]=useState([]);
  const [form,setForm]=useState(emptyAddress);
  const [showForm,setShowForm]=useState(false);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');

  const load=async()=>{const result=await apiClient('/users/me/addresses');setAddresses(result.addresses||[]);};
  useEffect(()=>{let active=true;apiClient('/users/me/addresses').then(r=>{if(active)setAddresses(r.addresses||[])}).catch(e=>{if(active)setError(e.message||'Unable to load addresses.')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);

  const save=async(event)=>{
    event.preventDefault();setSaving(true);setError('');
    try{const result=await apiClient('/users/me/addresses',{method:'POST',body:JSON.stringify(form)});setAddresses(result.addresses||[]);setForm(emptyAddress);setShowForm(false)}
    catch(e){setError(e.message||'Unable to save address.')}
    finally{setSaving(false)}
  };
  const remove=async(id)=>{setError('');try{const result=await apiClient('/users/me/addresses/'+encodeURIComponent(id),{method:'DELETE'});setAddresses(result.addresses||[])}catch(e){setError(e.message||'Unable to delete address.')}};
  const setDefault=async(address)=>{try{const result=await apiClient('/users/me/addresses/'+encodeURIComponent(address.id),{method:'PUT',body:JSON.stringify({addressLine1:address.addressLine1,addressLine2:address.addressLine2,city:address.city,state:address.state,country:address.country,postalCode:address.postalCode,type:address.type,isDefault:true})});setAddresses(result.addresses||[])}catch(e){setError(e.message||'Unable to update address.')}};

  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e4dc] pb-6"><div><p className="editorial-kicker">Account</p><h1 className="page-title mt-3">Address book.</h1><p className="page-description">Manage delivery addresses saved to your account.</p></div><button onClick={()=>setShowForm(v=>!v)} className="primary-action"><Plus size={15}/>{showForm?'Close form':'Add address'}</button></header>
    {error&&<div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] p-4 text-xs text-[#9b5147]"><AlertCircle size={15}/>{error}</div>}
    {showForm&&<form onSubmit={save} className="surface-card grid gap-4 p-6 sm:grid-cols-2">
      {[
        ['addressLine1','Address line 1'],['addressLine2','Address line 2'],['city','City'],['state','State / region'],['postalCode','Postal code'],['country','Country']
      ].map(([key,label])=><label key={key} className="text-xs font-semibold text-[#43534a]">{label}<input required={key!=='addressLine2'} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} className="field-control mt-2"/></label>)}
      <label className="flex items-center gap-2 text-xs text-[#43534a]"><input type="checkbox" checked={form.isDefault} onChange={e=>setForm(p=>({...p,isDefault:e.target.checked}))}/> Set as default address</label>
      <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={()=>setShowForm(false)} className="secondary-action">Cancel</button><button disabled={saving} className="primary-action">{saving?'Saving…':'Save address'}</button></div>
    </form>}
    {loading?<p className="py-10 text-sm text-[#879087]">Loading addresses…</p>:addresses.length===0?<div className="surface-card px-6 py-16 text-center"><MapPin size={28} className="mx-auto text-[#829b88]"/><h2 className="editorial-heading mt-4 text-3xl">No saved addresses.</h2><p className="mt-2 text-xs text-[#879087]">Add a delivery address to your account for future orders.</p><button onClick={()=>setShowForm(true)} className="primary-action mt-6"><Plus size={14}/> Add address</button></div>:<div className="grid gap-4 md:grid-cols-2">{addresses.map(address=><article key={address.id||address._id} className="surface-card p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><MapPin size={16} className="text-[#668775]"/><span className="text-sm font-semibold">{address.type==='billing'?'Billing':'Shipping'} address</span></div>{address.isDefault&&<span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#315b49]"><CheckCircle2 size={12}/> Default</span>}</div><address className="mt-4 space-y-1 text-xs not-italic leading-5 text-[#788078]"><p>{address.addressLine1}</p>{address.addressLine2&&<p>{address.addressLine2}</p>}<p>{address.city}, {address.state} {address.postalCode}</p><p>{address.country}</p></address><div className="mt-5 flex items-center justify-between border-t border-[#e5e4dc] pt-4">{!address.isDefault&&<button onClick={()=>setDefault(address)} className="text-xs font-semibold text-[#315b49]">Set default</button>}<button onClick={()=>remove(address.id||address._id)} className="ml-auto inline-flex items-center gap-1 text-xs text-[#9b5147]"><Trash2 size={13}/> Remove</button></div></article>)}</div>}
  </div>;
}