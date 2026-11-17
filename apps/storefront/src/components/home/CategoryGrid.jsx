import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  { name: 'Men', label: 'Modern essentials and considered silhouettes', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=85', href: '/products?category=Men', number: '01' },
  { name: 'Women', label: 'Expressive pieces for everyday living', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85', href: '/products?category=Women', number: '02' },
  { name: 'Kids', label: 'Playful details, made for movement', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&q=85', href: '/products?category=Kids', number: '03' },
  { name: 'Accessories', label: 'The finishing touch to every point of view', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85', href: '/products?category=Accessories', number: '04' },
];

export default function CategoryGrid() {
  return (
    <section className="editorial-section bg-[#f5f4ef]">
      <div className="editorial-shell">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="editorial-kicker">Browse by point of view</p>
            <h2 className="editorial-heading mt-3 text-4xl leading-none sm:text-6xl">The collections.</h2>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-xs font-semibold text-[#315b49]">All products <ArrowUpRight size={15} /></Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link key={category.name} href={category.href} className="group relative block">
              <div className="relative aspect-[.78] overflow-hidden bg-[#e6e6de]">
                <Image src={category.image} alt={category.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14251d]/70 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 text-[10px] font-semibold tracking-[.18em] text-white/80">{category.number} / 04</span>
                <span className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="flex items-center justify-between">
                    <span className="editorial-heading text-3xl">{category.name}</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/60 transition-all group-hover:bg-white group-hover:text-[#1c2924]"><ArrowUpRight size={16} /></span>
                  </span>
                  <span className="mt-2 block max-w-[220px] text-[11px] leading-5 text-white/75">{category.label}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}