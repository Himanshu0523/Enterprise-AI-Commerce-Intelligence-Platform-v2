'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquare, AlertCircle, Trash2 } from 'lucide-react';

async function reviewsRequest(path, options = {}) {
  const token = localStorage.getItem('auth_access_token');
  const response = await fetch(path, { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}), ...options.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || 'Review request failed.');
  return data;
}

export default function AccountReviewsPage() {
  const [reviews,setReviews]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{let active=true;reviewsRequest('/api/reviews/user').then(r=>{if(active)setReviews(Array.isArray(r)?r: r.reviews||[])}).catch(e=>{if(active)setError(e.message||'Unable to load reviews.')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
  const remove=async(id)=>{try{await reviewsRequest('/api/reviews/'+encodeURIComponent(id),{method:'DELETE'});setReviews(items=>items.filter(x=>(x._id||x.id)!==id))}catch(e){setError(e.message||'Unable to delete review.')}};
  return <div className="space-y-6"><header><p className="editorial-kicker">Account</p><h1 className="page-title mt-3">Your reviews.</h1><p className="page-description">Reviews saved under your account.</p></header>
    {error&&<div role="alert" className="flex gap-2 border border-[#edd5d0] bg-[#fbf1ef] p-4 text-xs text-[#9b5147]"><AlertCircle size={15}/>{error}</div>}
    {loading?<p className="py-10 text-sm text-[#879087]">Loading reviews…</p>:reviews.length===0?<div className="surface-card px-6 py-16 text-center"><MessageSquare size={28} className="mx-auto text-[#829b88]"/><h2 className="editorial-heading mt-4 text-3xl">No reviews yet.</h2><p className="mt-2 text-xs text-[#879087]">Reviews you submit on product pages will appear here.</p></div>:<div className="space-y-3">{reviews.map(review=><article key={review._id||review.id} className="surface-card p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">Product {review.productId}</p><div className="mt-2 flex items-center gap-1 text-[#b28b48]">{Array.from({length:5},(_,i)=><Star key={i} size={13} className={i<Number(review.rating)?'fill-current':'text-[#d9ddd4]'}/>)}</div></div><button onClick={()=>remove(review._id||review.id)} aria-label="Delete review" className="text-[#9b5147]"><Trash2 size={15}/></button></div><p className="mt-4 text-sm leading-6 text-[#59665e]">{review.comment}</p><p className="mt-3 text-[10px] text-[#929990]">{review.createdAt?new Date(review.createdAt).toLocaleDateString():'Date unavailable'}</p></article>)}</div>}
  </div>;
}