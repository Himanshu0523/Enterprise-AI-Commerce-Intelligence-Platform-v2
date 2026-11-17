import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import RecentlyViewed from '@/components/product/RecentlyViewed';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import { getFeaturedProducts } from '@/lib/api/products';
import { ArrowUpRight, ScanSearch, GitCompareArrows, MessageCircle, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Enterprise AI Commerce Platform | Intelligent Storefront',
  description: 'An editorial storefront experience built around intelligent product discovery, comparison and shopping interactions.',
};

const demoProducts = [
  {
    id: 'aurora-headphones-1',
    name: 'Aurora Wireless ANC Headphones',
    description: 'Immersive studio sound with active noise cancellation.',
    price: 199.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=85'],
    isNew: true,
  },
  {
    id: 'chrono-classic-watch',
    name: 'Chrono Classic Minimalist Watch',
    description: 'A clean, understated timepiece for everyday wear.',
    price: 149.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85'],
  },
  {
    id: 'leather-jacket-mens',
    name: 'Urban Crafted Leather Jacket',
    description: 'A structured outer layer with a timeless silhouette.',
    price: 179.99,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85'],
    isNew: true,
  },
  {
    id: 'smart-fitness-tracker',
    name: 'Pulse Pro Fitness Tracker',
    description: 'A streamlined wearable for everyday activity tracking.',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=900&q=85'],
  },
];

const INTELLIGENCE_PILLARS = [
  { number: '01', icon: ScanSearch, title: 'Discover', description: 'Explore a product catalogue through a focused, low-friction discovery experience.' },
  { number: '02', icon: GitCompareArrows, title: 'Evaluate', description: 'Bring product details together and make comparison part of the shopping flow.' },
  { number: '03', icon: MessageCircle, title: 'Ask', description: 'Use the integrated AI assistant as a conversational entry point to product discovery.' },
];

export default async function HomePage() {
  let featuredProducts = [];
  try {
    const response = await getFeaturedProducts(8);
    featuredProducts = Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
  }

  const products = featuredProducts.length ? featuredProducts : demoProducts;

  return (
    <main className="min-h-screen bg-[#f5f4ef] text-[#1c2924]">
      <HeroBanner />
      <CategoryGrid />

      <section id="featured" className="editorial-section border-y border-[#e5e4dc] bg-[#fffefa]">
        <div className="editorial-shell">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="editorial-kicker">A closer look</p>
              <h2 className="editorial-heading mt-3 max-w-[620px] text-4xl leading-[.98] sm:text-6xl">Objects worth discovering.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#788078]">A selection from the catalogue. Open a product to explore its details and shopping interactions.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 pb-1 text-xs font-semibold text-[#315b49]">Explore all products <ArrowUpRight size={15} /></Link>
          </div>

          {products.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
              {products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="border border-dashed border-[#d9dbd2] px-6 py-16 text-center">
              <p className="text-sm text-[#788078]">The catalogue is currently empty.</p>
              <Link href="/products" className="mt-3 inline-flex text-xs font-semibold text-[#315b49]">Open catalogue <ArrowUpRight size={14} /></Link>
            </div>
          )}
        </div>
      </section>

      <section className="editorial-section bg-[#e9e9df]">
        <div className="editorial-shell">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="editorial-kicker">Beyond the product grid</p>
              <h2 className="editorial-heading mt-3 text-4xl leading-[.98] sm:text-6xl">Commerce with a layer of intelligence.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#657168]">The experience is designed around three useful moments: finding an item, evaluating it and asking better questions.</p>
            </div>
            <div className="grid gap-0 border-t border-[#cfd3c9] sm:grid-cols-3 sm:border-l">
              {INTELLIGENCE_PILLARS.map(({ number, icon: Icon, title, description }) => (
                <div key={number} className="border-b border-[#cfd3c9] py-6 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-6">
                  <div className="flex items-center justify-between text-[#315b49]"><span className="text-[10px] font-bold tracking-[.18em]">{number}</span><Icon size={18} strokeWidth={1.5} /></div>
                  <h3 className="editorial-heading mt-8 text-3xl">{title}</h3>
                  <p className="mt-3 text-xs leading-6 text-[#657168]">{description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#cfd3c9] pt-6">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#315b49]"><Sparkles size={13} /> Explore the integrated assistant</span>
            <span className="text-xs text-[#788078]">Open the assistant from the chat control on this page.</span>
          </div>
        </div>
      </section>

      <section className="editorial-section bg-[#fffefa]">
        <div className="editorial-shell">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="editorial-kicker">Your browsing trail</p>
              <h2 className="editorial-heading mt-2 text-4xl sm:text-5xl">Pick up where you left off.</h2>
            </div>
          </div>
          <RecentlyViewed />
        </div>
      </section>
    </main>
  );
}