'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/lib/contexts/WishlistContext';

export default function WishlistToggle({ productId, className = '', size = 24 }) {
  const { isInWishlist, toggleItem } = useWishlist();
  const active = isInWishlist(productId);
  return <button type="button" onClick={event=>{event.preventDefault();event.stopPropagation();toggleItem(productId)}} className={'grid h-9 w-9 place-items-center rounded-full bg-[#fffefa]/95 shadow-sm transition hover:bg-white '+className} aria-label={active?'Remove from wishlist':'Add to wishlist'} aria-pressed={active}>
    <Heart size={size} strokeWidth={1.7} className={active?'fill-[#315b49] text-[#315b49]':'text-[#66736a] transition-colors hover:text-[#315b49]'}/>
  </button>;
}