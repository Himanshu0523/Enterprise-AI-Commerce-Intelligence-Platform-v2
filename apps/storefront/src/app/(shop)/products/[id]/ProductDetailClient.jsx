'use client';

import { useEffect, useState } from 'react';
import QuantitySelector from '@/components/product/ProductDetail/QuantitySelector';
import AddToCartButton from '@/components/product/ProductDetail/AddToCartButton';
import WishlistToggle from '@/components/product/WishlistToggle';
import CompareButton from '@/components/product/CompareButton';
import ReviewList from '@/components/product/ProductReviews/ReviewList';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';

export default function ProductDetailClient({ product }) {
  const [quantity,setQuantity]=useState(1);
  const { add:addRecent }=useRecentlyViewed();
  useEffect(()=>{addRecent(product.id)},[product.id,addRecent]);

  return <>
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <QuantitySelector quantity={quantity} onQuantityChange={setQuantity}/>
      <AddToCartButton productId={product.id} name={product.name} price={product.flashSalePrice??product.price} image={product.images?.[0]||'/placeholder.jpg'} quantity={quantity} disabled={product.stock===0}/>
      <WishlistToggle productId={product.id} size={23}/>
      <CompareButton productId={product.id}/>
    </div>
    <ReviewList productId={product.id}/>
  </>;
}