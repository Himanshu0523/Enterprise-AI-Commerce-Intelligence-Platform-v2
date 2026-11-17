'use client';

import { useCallback, useEffect, useState } from 'react';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';
import { getProductReviews, getProductReviewSummary } from '@/lib/api/reviews';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';

export default function ReviewList({ productId }) {
  const [reviews,setReviews]=useState([]);
  const [summary,setSummary]=useState({averageRating:0,totalReviews:0,distribution:{1:0,2:0,3:0,4:0,5:0}});
  const [page,setPage]=useState(1);
  const [pages,setPages]=useState(1);
  const [sort,setSort]=useState('newest');
  const [loading,setLoading]=useState(true);
  const [showForm,setShowForm]=useState(false);
  const [error,setError]=useState('');

  const load=useCallback(async()=>{
    setLoading(true);setError('');
    try{
      const [reviewResult,summaryResult]=await Promise.all([getProductReviews(productId,{page,limit:5,sort}),getProductReviewSummary(productId)]);
      setReviews(reviewResult.reviews||[]);
      setPages(reviewResult.pagination?.totalPages||1);
      setSummary(summaryResult||{averageRating:0,totalReviews:0,distribution:{}});
    }catch(e){setError(e.message||'Unable to load product reviews.')}
    finally{setLoading(false)}
  },[productId,page,sort]);

  useEffect(()=>{load()},[load]);

  const afterSubmit=()=>{setShowForm(false);if(page===1)load();else setPage(1)};

  return <section className="mt-14 border-t border-[#e5e4dc] pt-9">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="editorial-kicker">Reviews</p><h2 className="editorial-heading mt-2 text-3xl">Product reviews.</h2></div><button onClick={()=>setShowForm(v=>!v)} className="secondary-action">{showForm?'Close':'Write a review'}</button></div>
    <div className="mt-7 grid gap-6 border-y border-[#e5e4dc] py-6 sm:grid-cols-[180px_1fr]">
      <div><p className="editorial-heading text-5xl">{summary.totalReviews?summary.averageRating.toFixed(1):'—'}</p><div className="mt-2 flex gap-1 text-[#c39a55]">{[1,2,3,4,5].map(n=><Star key={n} size={13} className={n<=Math.round(summary.averageRating)?'fill-current':'text-[#d9ddd4]'}/>)}</div><p className="mt-2 text-[10px] text-[#879087]">{summary.totalReviews} {summary.totalReviews===1?'review':'reviews'}</p></div>
      <div className="space-y-2">{[5,4,3,2,1].map(star=>{const count=summary.distribution?.[star]||0;const pct=summary.totalReviews?count/summary.totalReviews*100:0;return <div key={star} className="flex items-center gap-3 text-[10px] text-[#879087]"><span className="w-8">{star} star</span><div className="h-1.5 flex-1 bg-[#e9e9e2]"><div className="h-full bg-[#8ca18e]" style={{width:pct+'%'}}/></div><span className="w-5 text-right">{count}</span></div>})}</div>
    </div>
    {showForm&&<div className="mt-6"><ReviewForm productId={productId} onReviewAdded={afterSubmit}/></div>}
    {error&&<p role="alert" className="mt-6 flex gap-2 text-xs text-[#9b5147]"><AlertCircle size={14}/>{error}</p>}
    <div className="mt-6 flex items-center justify-between gap-4"><p className="text-xs text-[#879087]">{summary.totalReviews} total</p><label className="text-[10px] text-[#879087]">Sort<select value={sort} onChange={e=>{setSort(e.target.value);setPage(1)}} className="ml-2 border border-[#dedfd6] bg-white px-2 py-2 text-xs text-[#43534a]"><option value="newest">Newest</option><option value="rating-high">Highest rating</option><option value="rating-low">Lowest rating</option></select></label></div>
    {loading?<p className="py-10 text-center text-xs text-[#879087]">Loading reviews…</p>:reviews.length===0?<div className="py-12 text-center"><MessageSquare size={25} className="mx-auto text-[#aab5ad]"/><p className="mt-3 text-sm font-semibold">No reviews yet.</p><p className="mt-1 text-xs text-[#879087]">Be the first to share feedback on this product.</p></div>:<div className="mt-2 divide-y divide-[#e5e4dc]">{reviews.map(review=><ReviewItem key={review.id} review={review}/>)}</div>}
    {pages>1&&<div className="mt-6 flex items-center justify-between border-t border-[#e5e4dc] pt-5"><span className="text-[10px] text-[#879087]">Page {page} of {pages}</span><div className="flex gap-2"><button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="secondary-action disabled:opacity-40">Previous</button><button disabled={page===pages} onClick={()=>setPage(p=>Math.min(pages,p+1))} className="secondary-action disabled:opacity-40">Next</button></div></div>}
  </section>;
}