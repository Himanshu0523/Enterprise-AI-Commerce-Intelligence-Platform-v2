import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/api/products';
import Gallery from '@/components/product/ProductDetail/Gallery';
import Info from '@/components/product/ProductDetail/Info';
import Attributes from '@/components/product/ProductDetail/Attributes';
import ProductDetailClient from './ProductDetailClient';
import Breadcrumbs from '@/components/common/Breadcrumbs';

/**
 * Product Detail Page Component
 * @param {Object} props
 * @param {Object} props.params
 * @param {string} props.params.id
 */
export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          ...(product.category ? [{ label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` }] : []),
          { label: product.name }
        ]}
      />
      <div className="flex flex-col gap-8 md:flex-row mt-4">
        <div className="md:w-1/2">
          <Gallery images={product.images} productName={product.name} />
        </div>
        <div className="md:w-1/2">
          <Info
            name={product.name}
            price={product.price}
            rating={product.rating}
            reviewCount={product.reviewCount}
            description={product.description}
            stock={product.stock}
          />
          <div className="mt-6 border-t pt-6">
            <Attributes />
          </div>
          <ProductDetailClient product={product} />
        </div>
      </div>
    </div>
  );
}