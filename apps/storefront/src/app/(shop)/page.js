import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import RecentlyViewed from '@/components/product/RecentlyViewed';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import FlashSaleBanner from '@/components/home/FlashSaleBanner';
import TrustBadges from '@/components/home/TrustBadges';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import { getFeaturedProducts } from '@/lib/api/products';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Enterprise AI Commerce Platform | Modern Storefront 2026',
  description: 'Explore next-generation luxury apparel, intelligent wearables, high-tech audio, and curated best-sellers with AI recommendations.',
};

// Fallback high quality products if API returns empty
const fallbackProducts = [
  {
    id: 'aurora-headphones-1',
    name: 'Aurora Wireless ANC Headphones',
    description: 'Immersive studio sound with 40-hour battery life and active noise cancellation.',
    price: 199.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'],
    rating: 4.8,
    reviewCount: 128,
    isNew: true,
    stock: 15,
  },
  {
    id: 'chrono-classic-watch',
    name: 'Chrono Classic Minimalist Watch',
    description: 'Precision sapphire crystal timepiece with genuine Italian leather strap.',
    price: 149.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
    rating: 4.9,
    reviewCount: 94,
    isNew: false,
    stock: 8,
  },
  {
    id: 'leather-jacket-mens',
    name: 'Urban Crafted Leather Jacket',
    description: 'Handcrafted genuine leather coat engineered for style and weather resistance.',
    price: 179.99,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'],
    rating: 4.7,
    reviewCount: 64,
    isNew: true,
    stock: 12,
  },
  {
    id: 'smart-fitness-tracker',
    name: 'Pulse Pro Fitness & Health Tracker',
    description: 'Real-time heart rate, sleep monitoring, and GPS tracking with AMOLED display.',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80'],
    rating: 4.6,
    reviewCount: 210,
    isNew: false,
    stock: 25,
  },
];

export default async function HomePage() {
  let featuredProducts = [];
  try {
    featuredProducts = await getFeaturedProducts(8);
  } catch (err) {
    console.error('Failed to fetch featured products:', err);
  }

  const productsToDisplay = featuredProducts && featuredProducts.length > 0 ? featuredProducts : fallbackProducts;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* 1. Dynamic Hero Banner */}
      <HeroBanner />

      {/* 2. Trust Badges & Value Propositions */}
      <TrustBadges />

      {/* 3. Shop By Category */}
      <CategoryGrid />

      {/* 4. Limited Time Flash Sale Widget */}
      <FlashSaleBanner />

      {/* 5. Featured & Trending Products */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              <Sparkles className="w-4 h-4" /> Curated Selections
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Featured & Trending Arrivals
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productsToDisplay.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Best Sellers Highlight */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
                <TrendingUp className="w-4 h-4" /> Community Favorites
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Top Rated Best Sellers
              </h2>
            </div>
            <Link
              href="/products?sort=popular"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <span>View Leaderboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {fallbackProducts.map((product) => (
              <ProductCard key={`bs-${product.id}`} product={{ ...product, isNew: false }} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews & Social Proof */}
      <Testimonials />

      {/* 8. Recently Viewed */}
      <section className="py-16 container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Recently Viewed Products</h2>
          <p className="text-sm text-slate-500">Pick up right where you left off.</p>
        </div>
        <RecentlyViewed />
      </section>

      {/* 9. VIP Newsletter Callout */}
      <Newsletter />
    </div>
  );
}