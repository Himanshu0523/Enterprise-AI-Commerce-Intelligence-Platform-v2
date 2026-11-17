'use client';

import { useWishlist } from '@/lib/contexts/WishlistContext';
import { getAllProducts } from '@/lib/api/products';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';

export default function WishlistPage(){
 const {items}=useWishlist();
 const products=getAllProducts().filter(product=>items.includes(product.id));
 return <div className="space-y-7"><header className="border-b border-[#e5e4dc] pb-6"><p className="editorial-kicker">Saved products</p><h1 className="page-title mt-3">Your wishlist.</h1><p className="page-description">{products.length} saved {products.length===1?'product':'products'} on this browser.</p></header>{products.length===0?<div className="surface-card px-6 py-16 text-center"><Heart size={28} className="mx-auto text-[#829b88]"/><h2 className="editorial-heading mt-4 text-3xl">Your list is empty.</h2><p className="mt-2 text-xs text-[#879087]">Use the heart on a product to save it here.</p><Link href="/products" className="primary-action mt-6">Explore products <ArrowUpRight size={14}/></Link></div>:<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">{products.map(product=><ProductCard key={product.id} product={product}/>)}</div>}</div>;
}