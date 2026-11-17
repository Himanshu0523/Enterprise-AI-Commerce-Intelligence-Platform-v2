'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#e9e9df] text-[#1c2924]">
      <div className="editorial-shell relative grid min-h-[650px] items-center gap-12 py-16 lg:min-h-[720px] lg:grid-cols-[.92fr_1.08fr] lg:py-20">
        <div className="relative z-10 max-w-[650px]">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#315b49]/20 bg-white/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#315b49]">
            <Sparkles size={13} />
            Intelligent commerce, thoughtfully designed
          </div>
          <p className="editorial-kicker mb-5">A new perspective on discovery</p>
          <h1 className="editorial-heading max-w-[760px] text-[clamp(3.6rem,7.5vw,7.4rem)] leading-[.91]">
            Find your
            <br />
            <span className="italic text-[#557563]">next</span> favourite.
          </h1>
          <p className="mt-8 max-w-[440px] text-sm leading-7 text-[#59665e] sm:text-base">
            A considered storefront where product discovery meets intelligent technology.
            Explore the collection and experience a more thoughtful way to shop.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              href="/products"
              className="group inline-flex items-center gap-8 rounded-full bg-[#315b49] px-6 py-4 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-[#214635]"
            >
              Explore collection
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <a href="#featured" className="inline-flex items-center gap-2 text-xs font-semibold text-[#315b49]">
              Discover the edit <ArrowDownRight size={15} />
            </a>
          </div>
          <div className="mt-16 flex items-center gap-4 border-t border-[#315b49]/15 pt-5">
            <span className="text-[10px] font-bold tracking-[.2em] text-[#315b49]">01 / 03</span>
            <span className="h-px w-12 bg-[#315b49]/30" />
            <span className="text-[10px] uppercase tracking-[.16em] text-[#758078]">Designed for discovery</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[680px] lg:ml-auto">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-[#315b49]/15" />
          <div className="relative aspect-[.88] overflow-hidden bg-[#d4d8ce] sm:aspect-[1.02]">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=90"
              alt="Editorial fashion collection"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14251d]/35 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[.22em] text-white/75">The considered edit</p>
                <p className="editorial-heading mt-2 text-3xl sm:text-4xl">Less, but better.</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/60">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden bg-[#f5f4ef] px-5 py-4 shadow-[0_12px_40px_rgba(28,41,36,.08)] sm:block">
            <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#7a827b]">The experience</p>
            <p className="mt-1 text-sm font-semibold text-[#315b49]">Explore. Compare. Discover.</p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full border border-[#315b49]/10" />
    </section>
  );
}