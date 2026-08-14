'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Flame, ShieldCheck, Zap, Star } from 'lucide-react';
import { Button, Badge } from '@/features/shared/ui';

export default function HeroBanner() {
  const slides = [
    {
      id: 1,
      badge: 'AI Smart Match 2026',
      title: 'Next-Gen Headphones with ANC & Spatial Audio',
      subtitle: 'Experience studio-grade acoustic performance tuned by AI algorithms to your ears.',
      price: '$199.99',
      originalPrice: '$299.99',
      cta: 'Explore Sound Tech',
      href: '/category/electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
      gradient: 'from-purple-900/90 via-indigo-950/80 to-slate-950'
    },
    {
      id: 2,
      badge: 'Flash Sale • 40% OFF',
      title: 'Cyberpunk OLED Smartwatch Series 7',
      subtitle: 'Real-time health vitals, AI personal trainer, and 14-day ultra battery endurance.',
      price: '$249.00',
      originalPrice: '$399.00',
      cta: 'Claim Flash Deal',
      href: '/deals',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
      gradient: 'from-slate-950 via-slate-900 to-indigo-950/90'
    },
    {
      id: 3,
      badge: 'Trending Fashion 2026',
      title: 'Minimalist Urban Streetwear Collection',
      subtitle: 'Sustainable organic cotton tailored for extreme comfort and modern aesthetics.',
      price: '$89.00',
      originalPrice: '$120.00',
      cta: 'Shop Spring Lookbook',
      href: '/category/fashion',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
      gradient: 'from-pink-950/80 via-slate-950 to-purple-950'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] rounded-3xl overflow-hidden my-6 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl group">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 group-hover:scale-100"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} backdrop-blur-[2px]`} />
      </div>

      {/* Hero Text & Controls */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center text-white z-10 space-y-6">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            {slide.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed line-clamp-2">
            {slide.subtitle}
          </p>

          {/* Pricing Highlight */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl font-extrabold text-white">{slide.price}</span>
            <span className="text-base text-slate-400 line-through">{slide.originalPrice}</span>
            <Badge variant="accent" size="sm">SAVE 33%</Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link href={slide.href}>
            <Button variant="primary" size="lg" icon={ArrowRight}>
              {slide.cta}
            </Button>
          </Link>

          <Link href="/ai/chat">
            <Button variant="secondary" size="lg" icon={Sparkles} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md">
              Ask AI Recommendation
            </Button>
          </Link>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-6 sm:left-12 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-indigo-500' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
