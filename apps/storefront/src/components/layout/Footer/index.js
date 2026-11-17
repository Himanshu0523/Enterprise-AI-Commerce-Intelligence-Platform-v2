import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#35483d] bg-[#1c2924] text-[#f5f4ef]">
      <div className="editorial-shell py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div><Link href="/" className="text-2xl font-semibold tracking-[-.07em]">storefront<span className="text-[#9ab3a0]">.</span></Link><p className="mt-4 max-w-xs text-xs leading-6 text-[#aab5ad]">A product discovery experience with intelligent shopping tools.</p></div>
          <div><h3 className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9ab3a0]">Explore</h3><ul className="mt-5 space-y-3 text-xs text-[#e1e5df]">
            <li><Link className="hover:text-white" href="/products">All products</Link></li><li><Link className="hover:text-white" href="/new-arrivals">New arrivals</Link></li><li><Link className="hover:text-white" href="/compare">Compare products</Link></li>
          </ul></div>
          <div><h3 className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9ab3a0]">Account</h3><ul className="mt-5 space-y-3 text-xs text-[#e1e5df]">
            <li><Link className="hover:text-white" href="/account">Overview</Link></li><li><Link className="hover:text-white" href="/account/orders">Orders</Link></li><li><Link className="hover:text-white" href="/account/wishlist">Wishlist</Link></li><li><Link className="hover:text-white" href="/cart">Shopping bag</Link></li>
          </ul></div>
          <div><h3 className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9ab3a0]">Information</h3><ul className="mt-5 space-y-3 text-xs text-[#e1e5df]">
            <li><Link className="hover:text-white" href="/about">About</Link></li><li><Link className="hover:text-white" href="/faq">FAQs</Link></li><li><Link className="hover:text-white" href="/contact">Contact</Link></li><li><Link className="hover:text-white" href="/privacy">Privacy</Link></li>
          </ul></div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] tracking-wide text-[#98a59c] sm:flex-row"><span>© {new Date().getFullYear()} Storefront</span><Link href="/products" className="inline-flex items-center gap-1 hover:text-white">Browse products <ArrowUpRight size={12}/></Link></div>
      </div>
    </footer>
  );
}