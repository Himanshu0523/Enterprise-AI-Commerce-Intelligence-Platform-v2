import { Star } from 'lucide-react';

export default function Info({ name, price, rating, reviewCount, description, stock }) {
  const inStock=Number(stock)>0;
  return <div>
    <p className="editorial-kicker">Product details</p>
    <h1 className="editorial-heading mt-3 text-4xl leading-tight sm:text-5xl">{name}</h1>
    {Number(reviewCount)>0?<div className="mt-4 flex items-center gap-2"><span className="flex gap-1 text-[#c39a55]">{[1,2,3,4,5].map(n=><Star key={n} size={13} className={n<=Math.round(rating||0)?'fill-current':'text-[#d9ddd4]'}/>)}</span><span className="text-[10px] text-[#879087]">{Number(rating).toFixed(1)} · {reviewCount} reviews</span></div>:<p className="mt-4 text-[10px] text-[#879087]">No reviews yet</p>}
    <p className="mt-6 text-2xl font-semibold tracking-tight text-[#315b49]">USD {Number(price||0).toFixed(2)}</p>
    <p className="mt-5 max-w-xl text-sm leading-7 text-[#657168]">{description}</p>
    <div className="mt-6 inline-flex items-center gap-2 border border-[#e5e4dc] bg-[#fffefa] px-3 py-2 text-[10px] font-semibold"><span className={'h-2 w-2 rounded-full '+(inStock?'bg-[#6b9276]':'bg-[#bd7770]')}/>{inStock?'Available in sample catalogue':'Out of stock'}</div>
  </div>;
}