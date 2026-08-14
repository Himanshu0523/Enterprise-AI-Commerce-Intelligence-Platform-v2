'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Search, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    tag: '⚡ SUMMER COLLECTION 2026',
    title: 'Discover Next-Gen Fashion & Tech Hybrids',
    subtitle: 'Upgrade your daily lifestyle with curated luxury accessories, intelligent wearables, and eco-crafted apparel up to 40% OFF.',
    primaryCta: 'Explore Collection',
    primaryHref: '/products',
    secondaryCta: 'View Deals',
    secondaryHref: '/products?onSale=true',
    badge: 'Trending Now',
    bgGradient: 'from-indigo-900 via-purple-900 to-slate-900',
    accentColor: 'indigo-500',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    stats: { discount: '40% OFF', rating: '4.9★', happyCustomers: '50k+' }
  },
  {
    id: 2,
    tag: '🎧 PREMIUM AUDIO & ACCESSORIES',
    title: 'Immersive Sound & Wireless Innovation',
    subtitle: 'Experience studio-grade acoustics, active noise cancellation, and ergonomic design engineered for audiophiles.',
    primaryCta: 'Shop Electronics',
    primaryHref: '/products?category=Electronics',
    secondaryCta: 'Learn More',
    secondaryHref: '/product/aurora-headphones-1',
    badge: 'Editor’s Choice',
    bgGradient: 'from-slate-950 via-blue-950 to-indigo-950',
    accentColor: 'blue-500',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    stats: { discount: 'FREE SHIPPING', rating: '4.8★', happyCustomers: '12k+' }
  },
  {
    id: 3,
    tag: '✨ LIMITED TIME FLASH SALE',
    title: 'Exclusive Deals on Best Sellers',
    subtitle: 'Grab top-tier products before stock runs out. Verified authentic quality with 2-year warranty guaranteed.',
    primaryCta: 'Claim Deals Now',
    primaryHref: '/products?sort=popular',
    secondaryCta: 'Flash Sale Grid',
    secondaryHref: '/products',
    badge: 'Limited Stock',
    bgGradient: 'from-purple-950 via-pink-950 to-slate-950',
    accentColor: 'pink-500',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
    stats: { discount: 'SAVE $120', rating: '5.0★', happyCustomers: '85k+' }
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative min-h-[560px] lg:min-h-[620px] w-full overflow-hidden bg-slate-950 text-white flex items-center">
      {/* Background Image Overlay with Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          className="object-cover object-center opacity-30 blur-[2px] transition-all duration-1000 scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-90 transition-all duration-700`} />
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider text-indigo-300 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{slide.tag}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              {slide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={slide.primaryHref}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-200"
              >
                <span>{slide.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href={slide.secondaryHref}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm transition-all duration-200"
              >
                <span>{slide.secondaryCta}</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Authentic Products</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Over 50,000+ Happy Customers</span>
              </div>
            </div>

          </div>

          {/* Featured Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4 transform hover:scale-[1.01] transition-transform duration-300">
              
              {/* Top Card Badge */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-indigo-500/80 backdrop-blur-md rounded-full text-xs font-bold text-white tracking-wide">
                  {slide.badge}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  Updated Live
                </span>
              </div>

              {/* Main Preview Image */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/10 shadow-inner group">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-bold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    {slide.stats.discount}
                  </span>
                  <span className="text-xs font-bold bg-amber-500/90 text-slate-950 px-2.5 py-1 rounded-full flex items-center gap-1">
                    ★ {slide.stats.rating}
                  </span>
                </div>
              </div>

              {/* Quick Search Overlay Widget */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/products?query=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Quick search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/80 text-white placeholder-slate-400 text-xs rounded-xl pl-10 pr-24 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Search
                </button>
              </form>

            </div>
          </div>

        </div>

        {/* Carousel Slider Controls */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-indigo-500' : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
