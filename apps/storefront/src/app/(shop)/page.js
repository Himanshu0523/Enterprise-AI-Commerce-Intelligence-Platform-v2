import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import RecentlyViewed from '@/components/product/RecentlyViewed';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import { getFeaturedProducts } from '@/lib/api/products';
import { ArrowUpRight, ScanSearch, GitCompareArrows, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Product discovery',
  description: 'Explore the catalogue, compare products and use intelligent discovery tools.',
};

const PILLARS = [
  { number: '01', icon: ScanSearch, title: 'Discover', description: 'Find products through a clear catalogue and focused search.' },
  { number: '02', icon: GitCompareArrows, title: 'Compare', description: 'Review product details side by side before making a choice.' },
  { number: '03', icon: MessageCircle, title: 'Ask', description: 'Explore product questions with the integrated assistant.' },
];

export default function HomePage() {
  const products = getFeaturedProducts(8);

  return (
    <div className="min-h-screen bg-[#f5f4ef] text-[#1c2924]">
      <HeroBanner />
      <CategoryGrid />

      <section id="featured" className="editorial-section border-y border-[#e5e4dc] bg-[#fffefa]">
        <div className="editorial-shell">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="editorial-kicker">Selected products</p>
              <h2 className="editorial-heading mt-3 max-w-[620px] text-4xl leading-[.98] sm:text-6xl">Explore the collection.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#788078]">Sample catalogue content for this project showcase. Open a product to inspect its details, compare it or add it to your bag.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 pb-1 text-xs font-semibold text-[#315b49]">View all products <ArrowUpRight size={15} /></Link>
          </div>
          {products.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="border border-dashed border-[#d9dbd2] px-6 py-16 text-center">
              <p className="text-sm text-[#788078]">No featured products are available yet.</p>
              <Link href="/products" className="mt-3 inline-flex text-xs font-semibold text-[#315b49]">Browse catalogue <ArrowUpRight size={14}/></Link>
            </div>
          )}
        </div>
      </section>

      <section className="editorial-section bg-[#e9e9df]">
        <div className="editorial-shell">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="editorial-kicker">An intelligent layer</p>
              <h2 className="editorial-heading mt-3 text-4xl leading-[.98] sm:text-6xl">Explore with more context.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#657168]">Search the catalogue, compare product details and ask the connected assistant about the collection.</p>
            </div>
            <div className="grid gap-0 border-t border-[#cfd3c9] sm:grid-cols-3 sm:border-l">
              {PILLARS.map(({number,icon:Icon,title,description}) => (
                <div key={number} className="border-b border-[#cfd3c9] py-6 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-6">
                  <div className="flex items-center justify-between text-[#315b49]"><span className="text-[10px] font-bold tracking-[.18em]">{number}</span><Icon size={18} strokeWidth={1.5}/></div>
                  <h3 className="editorial-heading mt-8 text-3xl">{title}</h3>
                  <p className="mt-3 text-xs leading-6 text-[#657168]">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section bg-[#fffefa]">
        <div className="editorial-shell">
          <p className="editorial-kicker">Recently viewed</p>
          <h2 className="editorial-heading mt-3 text-4xl sm:text-5xl">Continue exploring.</h2>
          <div className="mt-8"><RecentlyViewed /></div>
        </div>
      </section>
    </div>
  );
}