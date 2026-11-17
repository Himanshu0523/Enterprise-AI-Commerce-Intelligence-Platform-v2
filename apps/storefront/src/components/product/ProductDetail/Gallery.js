'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Gallery({ images, productName }) {
  const [selectedIndex,setSelectedIndex]=useState(0);
  if(!images?.length)return <div className="grid aspect-[.9] place-items-center bg-[#eeeee8] text-xs text-[#879087]">No product image available</div>;
  return <div className="space-y-3"><div className="relative aspect-[.9] overflow-hidden bg-[#eeeee8]"><Image src={images[selectedIndex]} alt={productName} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover"/></div>{images.length>1&&<div className="flex gap-2 overflow-x-auto">{images.map((src,index)=><button key={src} type="button" onClick={()=>setSelectedIndex(index)} aria-label={'View product image '+(index+1)} aria-pressed={selectedIndex===index} className={'relative h-20 w-20 shrink-0 overflow-hidden border-2 '+(selectedIndex===index?'border-[#315b49]':'border-transparent')}><Image src={src} alt="" fill sizes="80px" className="object-cover"/></button>)}</div>}</div>;
}