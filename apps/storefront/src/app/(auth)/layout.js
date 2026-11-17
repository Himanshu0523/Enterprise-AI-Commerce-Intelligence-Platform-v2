import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-[#f5f4ef] text-[#1c2924]">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden min-h-screen overflow-hidden bg-[#263d32] lg:block">
          <Image src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=90" alt="Sunlit modern boutique interior" fill priority sizes="(max-width: 1024px) 0vw, 55vw" className="object-cover opacity-65"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#15251d]/90 via-[#1d3026]/35 to-[#1d3026]/35"/>
          <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-16">
            <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-3 text-white">
              <span className="text-2xl font-semibold tracking-[-.08em]">storefront<span className="text-[#b7cbb8]">.</span></span>
              <span className="border-l border-white/35 pl-3 text-[9px] font-semibold uppercase tracking-[.2em] text-white/70">Product discovery</span>
            </Link>
            <div className="relative z-10 max-w-[620px] pb-8">
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d4e1d4]">Your collection, in one place</p>
              <h1 className="mt-6 font-serif text-5xl font-normal leading-[1.04] tracking-[-.045em] text-white xl:text-7xl">Discover what feels <span className="italic text-[#c5d5c4]">right.</span></h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/75">Sign in to manage your account, saved products and shopping activity.</p>
            </div>
            <div className="relative z-10 flex items-center justify-between text-[10px] text-white/55"><span>Storefront</span><Link href="/" className="inline-flex items-center gap-1 hover:text-white">Back to store <ArrowUpRight size={13}/></Link></div>
          </div>
        </section>
        <section className="relative flex min-h-screen flex-col justify-center px-5 py-8 sm:px-10 lg:px-14 xl:px-20">
          <Link href="/" className="mb-10 inline-flex w-fit items-center gap-2 text-[11px] font-semibold text-[#788078] transition hover:text-[#315b49] lg:absolute lg:left-14 lg:top-10 xl:left-20"><ArrowLeft size={14}/> Back to storefront</Link>
          <div className="mx-auto w-full max-w-[440px]">
            <div className="mb-8 lg:hidden"><Link href="/" className="text-2xl font-semibold tracking-[-.08em]">storefront<span className="text-[#6f927b]">.</span></Link></div>
            {children}
          </div>
          <p className="mx-auto mt-10 max-w-[440px] text-center text-[10px] leading-5 text-[#929990]">Your account is managed by the platform authentication service.</p>
        </section>
      </div>
    </main>
  );
}