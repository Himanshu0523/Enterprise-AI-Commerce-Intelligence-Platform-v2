'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/lib/contexts/WishlistContext';

/**
 * @param {Object} props
 * @param {string} props.productId
 * @param {string} [props.className='']
 * @param {number} [props.size=24]
 */
export default function WishlistToggle({
  productId,
  className = '',
  size = 24,
}) {
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent navigation if inside a link
        e.stopPropagation();
        toggleItem(productId);
      }}
      className={`transition-colors ${className}`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={size}
        className={
          inWishlist
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 hover:text-red-500'
        }
      />
    </button>
  );
}