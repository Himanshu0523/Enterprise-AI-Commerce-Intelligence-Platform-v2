'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, ShoppingBag, Heart, Scale, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
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

  const closeQuickView = useCallback(() => {
    setProduct(null);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.flashSalePrice ?? product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.flashSalePrice ?? product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity,
    });
    closeQuickView();
    router.push('/checkout');
  };

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView, quickViewProduct: product }}>
      {children}

      {/* Quick View Modal Overlay */}
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 text-gray-800 transition-all transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Gallery */}
              <div className="space-y-4">
                <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                  <Image
                    src={product.images?.[selectedImage] || product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {product.flashSalePrice && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      Sale
                    </span>
                  )}
                  {product.isNew && !product.flashSalePrice && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      New
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          selectedImage === idx ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Actions */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    <span>{product.brand || 'Premium Brand'}</span>
                    <span>•</span>
                    <span>{product.category || 'General'}</span>
                  </div>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h2>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(product.rating || 4.5)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {product.rating ? product.rating.toFixed(1) : '4.5'} ({product.reviewCount || 12} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-gray-900">
                      ${(product.flashSalePrice ?? product.price).toFixed(2)}
                    </span>
                    {product.flashSalePrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                    {product.description || 'High quality product designed for style, comfort and reliability. Exceptional craftmanship and premium materials.'}
                  </p>

                  {/* Stock Badge */}
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        (product.stock ?? 10) > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${ (product.stock ?? 10) > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {(product.stock ?? 10) > 0 ? `In Stock (${product.stock ?? 10} available)` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Quantity selector */}
                  <div className="mt-6 flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-sm font-semibold text-gray-900 min-w-[2.5rem] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={(product.stock ?? 10) === 0}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white shadow-md transition-all ${
                        isAdded
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : (product.stock ?? 10) === 0
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={18} />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={18} />
                          Add to Cart
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={(product.stock ?? 10) === 0}
                      className="px-6 py-3 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow"
                    >
                      Buy Now
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <WishlistToggle productId={product.id} size={20} />
                        <span className="text-xs text-gray-600 font-medium">Wishlist</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CompareButton productId={product.id} />
                      </div>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      onClick={closeQuickView}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Full Details <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Extra Assurance Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Truck size={14} className="text-indigo-600 flex-shrink-0" />
                      <span>Free Express Delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-indigo-600 flex-shrink-0" />
                      <span>2-Year Warranty</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error('useQuickView must be used within a QuickViewProvider');
  }
  return context;
}
