import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/api/products';
import Gallery from '@/components/product/ProductDetail/Gallery';
import Info from '@/components/product/ProductDetail/Info';
import ProductDetailClient from './ProductDetailClient';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return <div className="page-shell">
    <Breadcrumbs items={[{label:'Products',href:'/products'},...(product.category?[{label:product.category,href:'/products?category='+encodeURIComponent(product.category)}]:[]),{label:product.name}]}/>
    <div className="mt-7 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
      <div className="min-w-0"><Gallery images={product.images} productName={product.name}/></div>
      <div className="min-w-0 lg:pt-5"><Info name={product.name} price={product.flashSalePrice??product.price} rating={product.rating} reviewCount={product.reviewCount} description={product.description} stock={product.stock}/><ProductDetailClient product={product}/></div>
    </div>
  </div>;
}