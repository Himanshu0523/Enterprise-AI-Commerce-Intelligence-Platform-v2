'use client';

import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';
import { getAllProducts } from '@/lib/api/products';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
  const { ids } = useRecentlyViewed();
  const products = getAllProducts();
  const recentProducts = ids.map(id=>products.find(product=>product.id===id)).filter(Boolean).slice(0,4);
  if(!recentProducts.length)return <p className="text-xs text-[#929990]">Products you open will appear here during this browser session.</p>;
  return <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">{recentProducts.map(product=><ProductCard key={product.id} product={product}/>)}</div>;
}