'use client';

import { useState } from 'react';
import { Star, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { markHelpful } from '@/lib/api/reviews';

export default function ReviewItem({ review }) {
  const [helpful,setHelpful]=useState(review.helpfulCount||0);
  const [voted,setVoted]=useState(false);
  const [busy,setBusy]=useState(false);
  const submitHelpful=async()=>{if(voted||busy)return;setBusy(true);try{await markHelpful(review.id);setHelpful(n=>n+1);setVoted(true)}catch(error){console.error('Unable to mark review helpful',error)}finally{setBusy(false)}};
  return <article className="py-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold text-[#27362e]">{review.author||'Account'}</p><p className="mt-1 text-[10px] text-[#929990]">{review.date?new Date(review.date).toLocaleDateString():'Date unavailable'}</p></div><div className="flex gap-1 text-[#c39a55]">{[1,2,3,4,5].map(n=><Star key={n} size={13} className={n<=review.rating?'fill-current':'text-[#d9ddd4]'}/>)}</div></div>{review.title&&<h3 className="mt-4 text-sm font-semibold">{review.title}</h3>}<p className="mt-2 text-sm leading-6 text-[#657168]">{review.comment}</p>{review.isVerifiedPurchase&&<p className="mt-3 inline-flex items-center gap-1 text-[10px] text-[#315b49]"><CheckCircle2 size={12}/> Verified purchase</p>}<button onClick={submitHelpful} disabled={voted||busy} className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold text-[#788078] hover:text-[#315b49] disabled:opacity-50"><ThumbsUp size={13}/> Helpful {helpful>0?'('+helpful+')':''}</button></article>;
}