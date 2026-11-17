'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { createReview } from '@/lib/api/reviews';

export default function ReviewForm({ productId, onReviewAdded }) {
  const { user } = useAuth();
  const [rating,setRating]=useState(0);
  const [title,setTitle]=useState('');
  const [comment,setComment]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');

  if(!user)return <div className="border border-[#e5e4dc] bg-[#f7f7f2] p-5"><p className="text-sm font-semibold">Sign in to write a review.</p><p className="mt-2 text-xs text-[#788078]">Reviews are linked to your authenticated account.</p><Link href="/login" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#315b49]">Sign in <ArrowRight size={13}/></Link></div>;

  const submit=async(event)=>{event.preventDefault();setError('');if(!rating)return setError('Select a rating before submitting.');setBusy(true);try{const review=await createReview({productId,rating,title:title.trim(),comment:comment.trim()});setTitle('');setComment('');setRating(0);onReviewAdded?.(review)}catch(e){setError(e.message||'Unable to submit your review.')}finally{setBusy(false)}};

  return <form onSubmit={submit} className="space-y-4 border border-[#e5e4dc] bg-[#fffefa] p-5 sm:p-6">
    <div><p className="editorial-kicker">Your feedback</p><h3 className="editorial-heading mt-2 text-2xl">Write a review.</h3></div>
    <div><label className="block text-xs font-semibold text-[#43534a]">Your rating</label><div className="mt-2 flex items-center gap-1">{[1,2,3,4,5].map(value=><button key={value} type="button" onClick={()=>setRating(value)} aria-label={value+' stars'} className="p-1"><Star size={21} className={value<=rating?'fill-[#c39a55] text-[#c39a55]':'text-[#cfd3c9]'}/></button>)}</div></div>
    <label className="block text-xs font-semibold text-[#43534a]">Review title<input required minLength={3} maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} className="field-control mt-2" placeholder="Summarize your experience"/></label>
    <label className="block text-xs font-semibold text-[#43534a]">Your review<textarea required minLength={5} maxLength={2000} rows={4} value={comment} onChange={e=>setComment(e.target.value)} className="field-control mt-2" placeholder="Share specific product feedback"/></label>
    {error&&<p role="alert" className="flex gap-2 text-xs text-[#9b5147]"><AlertCircle size={14}/>{error}</p>}
    <button disabled={busy} className="primary-action">{busy?'Submitting…':'Submit review'} <ArrowRight size={14}/></button>
  </form>;
}