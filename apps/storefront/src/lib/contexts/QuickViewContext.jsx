'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from './CartContext';
import WishlistToggle from '@/components/product/WishlistToggle';
import CompareButton from '@/components/product/CompareButton';
import { useRouter } from 'next/navigation';

const QuickViewContext = createContext(undefined);

export function QuickViewProvider({ children }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const openQuickView = useCallback((productData) => {
    setProduct(productData);
    setQuantity(1);
    setSelectedImage(0);
    setIsAdded(false);
  }, []);

  const closeQuickView = useCallback(() => setProduct(null), []);

  const handleAddToCart = () => {
    if (!product || Number(product.stock) <= 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.flashSalePrice ?? product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      stock,
    }, quantity);
    setIsAdded(true);
  };

  const handleBuyNow = () => {
    if (!product || Number(product.stock) <= 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.flashSalePrice ?? product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      stock,
    }, quantity);
    closeQuickView();
    router.push('/checkout/shipping');
  };

  const price = Number(product?.flashSalePrice ?? product?.price ?? 0);
  const stock = Number(product?.stock ?? 0);
  const images = product?.images?.length ? product.images : ['/placeholder.jpg'];

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView, quickViewProduct: product }}>
      {children}
      {product && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#14231c]/65 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeQuickView(); }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="quick-view-title" className="relative grid max-h-[92dvh] w-full max-w-5xl overflow-y-auto bg-[#fffefa] text-[#1c2924] shadow-[0_30px_100px_rgba(0,0,0,.25)] md:grid-cols-[1.05fr_.95fr]">
            <button type="button" onClick={closeQuickView} aria-label="Close product preview" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-[#e5e4dc] bg-[#fffefa]/95 text-[#43534a] hover:bg-[#e8eee7]"><X size={18}/></button>

            <div className="min-w-0 bg-[#f0f0e9] p-4 sm:p-7">
              <div className="relative aspect-[.9] overflow-hidden bg-[#e6e7df]">
                <Image src={images[selectedImage] || images[0]} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover"/>
              </div>
              {images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{images.map((src,index)=><button key={src+index} type="button" onClick={()=>setSelectedImage(index)} aria-label={`View image ${index+1}`} aria-pressed={selectedImage===index} className={`relative h-16 w-14 shrink-0 overflow-hidden border ${selectedImage===index?'border-[#315b49]':'border-[#d9ddd4]'}`}><Image src={src} alt="" fill sizes="56px" className="object-cover"/></button>)}</div>}
            </div>

            <div className="flex min-w-0 flex-col p-6 sm:p-9">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#668775]"><span>{product.category || 'Collection'}</span>{product.isNew && <><span className="text-[#c2c8bf]">/</span><span>New arrival</span></>}</div>
              <h2 id="quick-view-title" className="editorial-heading mt-4 pr-8 text-3xl leading-tight sm:text-4xl">{product.name}</h2>
              <p className="mt-5 text-2xl font-semibold tracking-tight text-[#315b49]">USD {price.toFixed(2)}</p>
              {product.description && <p className="mt-5 text-sm leading-7 text-[#657168]">{product.description}</p>}

              <div className="mt-6 border-y border-[#e5e4dc] py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#879087]">Catalogue status</p>
                <p className="mt-2 text-xs text-[#59665e]">{stock > 0 ? 'Listed in the demonstration catalogue' : 'Marked as unavailable in the catalogue'}</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-semibold">Quantity</span>
                <div className="flex items-center border border-[#dedfd6]">
                  <button type="button" onClick={()=>setQuantity(value=>Math.max(1,value-1))} disabled={quantity<=1} aria-label="Decrease quantity" className="grid h-10 w-10 place-items-center disabled:opacity-30"><Minus size={13}/></button>
                  <span className="w-10 text-center text-xs tabular-nums">{quantity}</span>
                  <button type="button" onClick={()=>setQuantity(value=>Math.min(Math.max(stock,1),value+1))} disabled={quantity>=stock} aria-label="Increase quantity" className="grid h-10 w-10 place-items-center disabled:opacity-30"><Plus size={13}/></button>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <button type="button" onClick={handleAddToCart} disabled={stock<=0} className="flex h-12 w-full items-center justify-between bg-[#315b49] px-5 text-xs font-bold text-white transition hover:bg-[#214635] disabled:cursor-not-allowed disabled:bg-[#aeb7ae]">
                  <span className="flex items-center gap-2"><ShoppingBag size={16}/>{isAdded?'Added to bag':'Add to bag'}</span><span>{isAdded?'✓':<ArrowRight size={16}/>}</span>
                </button>
                <div className="mt-4 flex items-center justify-between border-t border-[#e5e4dc] pt-4">
                  <div className="flex items-center gap-4"><WishlistToggle productId={product.id} size={19}/><CompareButton productId={product.id}/></div>
                  <Link href={`/products/${product.id}`} onClick={closeQuickView} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#315b49]">Full details <ArrowRight size={13}/></Link>
                </div>
                <button type="button" onClick={handleBuyNow} disabled={stock<=0} className="mt-3 w-full py-2 text-[10px] font-semibold text-[#788078] underline underline-offset-4 hover:text-[#315b49] disabled:opacity-40">Continue to checkout</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (!context) throw new Error('useQuickView must be used within a QuickViewProvider');
  return context;
}