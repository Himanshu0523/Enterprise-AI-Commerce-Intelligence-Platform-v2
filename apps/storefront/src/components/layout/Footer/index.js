import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#35483d] bg-[#1c2924] text-[#f5f4ef]">
      <div className="editorial-shell py-14 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-2xl font-semibold tracking-[-.07em]">storefront<span className="text-[#9ab3a0]">.</span></Link>
            <p className="mt-4 max-w-xs text-xs leading-6 text-[#aab5ad]">A considered commerce experience shaped by product discovery and intelligent interactions.</p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9ab3a0]">Explore</h3>
            <ul className="mt-5 space-y-3 text-xs text-[#e1e5df]">
              <li><Link className="hover:text-white" href="/products">All products</Link></li>
              <li><Link className="hover:text-white" href="/products?sort=popular">Popular</Link></li>
              <li><Link className="hover:text-white" href="/account/wishlist">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9ab3a0]">Your account</h3>
            <ul className="mt-5 space-y-3 text-xs text-[#e1e5df]">
              <li><Link className="hover:text-white" href="/account">Profile</Link></li>
              <li><Link className="hover:text-white" href="/account/orders">Orders</Link></li>
              <li><Link className="hover:text-white" href="/cart">Shopping bag</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9ab3a0]">Continue exploring</h3>
            <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-xs text-[#e1e5df] hover:text-white">Browse the catalogue <ArrowUpRight size={14} /></Link>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] tracking-wide text-[#98a59c] sm:flex-row">
          <span>© {new Date().getFullYear()} Storefront. All rights reserved.</span>
          <span>Designed for considered discovery.</span>
        </div>
      </div>
    </footer>
  );
}