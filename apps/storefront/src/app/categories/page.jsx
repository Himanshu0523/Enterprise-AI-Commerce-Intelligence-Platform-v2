'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shirt, Home, Watch, Camera, Gamepad, Sparkles } from 'lucide-react';
import Navbar from '@/features/layouts/Navbar';
import Footer from '@/features/layouts/Footer';

export default function CategoriesPage() {
  const allCategories = [
    {
      id: 'electronics',
      name: 'Electronics & Audio',
      icon: Zap,
      count: '1,240 Items',
      subcategories: ['Headphones', 'Speakers', 'Smartphones', 'Audio Cables'],
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'
    },
    {
      id: 'fashion',
      name: 'Fashion & Apparel',
      icon: Shirt,
      count: '3,850 Items',
      subcategories: ['Men Fashion', 'Women Wear', 'Footwear', 'Streetwear'],
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80'
    },
    {
      id: 'home',
      name: 'Smart Home & Living',
      icon: Home,
      count: '980 Items',
      subcategories: ['Robotic Vacuums', 'Smart Lighting', 'Furniture', 'Decor'],
      image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&q=80'
    },
    {
      id: 'wearables',
      name: 'Smart Wearables',
      icon: Watch,
      count: '640 Items',
      subcategories: ['Fitness Watches', 'Smart Rings', 'Health Trackers'],
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'
    },
    {
      id: 'gaming',
      name: 'Gaming & VR Gear',
      icon: Gamepad,
      count: '820 Items',
      subcategories: ['Keyboards', 'Mice', 'VR Headsets', 'Gaming Chairs'],
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'
    },
    {
      id: 'photography',
      name: 'Photography & Drones',
      icon: Camera,
      count: '430 Items',
      subcategories: ['DSLR Cameras', 'Lenses', '4K Drones', 'Tripods'],
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            All Product Categories
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore our curated catalog enhanced with AI filtering and smart style matching.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                      <cat.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">{cat.name}</h3>
                  </div>
                  <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-semibold">
                    {cat.count}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {cat.subcategories.map((sub, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl">
                      {sub}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/category/${cat.id}`}
                  className="w-full py-3 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 hover:text-white dark:hover:text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  Browse {cat.name} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
