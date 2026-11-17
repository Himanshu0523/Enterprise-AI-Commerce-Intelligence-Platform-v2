'use client';

import { Suspense } from 'react';
import { useCompare } from '@/lib/hooks/useCompare';
import { Scale } from 'lucide-react';

function CompareButtonInner({ productId, className = '' }) {
  const { ids, isComparing, toggle } = useCompare();
  const active = isComparing(productId);
  return <button type="button" onClick={event=>{event.preventDefault();event.stopPropagation();toggle(productId)}} className={'inline-flex items-center gap-1.5 text-[10px] font-semibold transition '+(active?'text-[#315b49]':'text-[#7d887f] hover:text-[#315b49]')+' '+className} aria-pressed={active} aria-label={active?'Remove from comparison':'Add to comparison'}>
    <Scale size={15}/><span>{active?'Comparing':'Compare'}</span>{ids.length>0&&<span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#e8eee7] px-1 text-[9px] text-[#315b49]">{ids.length}</span>}
  </button>;
}
export default function CompareButton({ productId, className = '' }) {
  return <Suspense fallback={<span className="text-[10px] text-[#a0a89f]">Compare</span>}><CompareButtonInner productId={productId} className={className}/></Suspense>;
}