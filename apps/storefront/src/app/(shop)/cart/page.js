'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/contexts/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, clearCart, getTotalItems, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-gray-600">Start shopping to add items.</p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="rounded-lg border shadow-sm">
            <div className="border-b p-4">
              <div className="flex justify-between">
                <span className="font-semibold">{getTotalItems()} items</span>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                  Clear Cart
                </button>
              </div>
            </div>
            <ul className="divide-y">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:w-80">
          <CartSummary totalItems={getTotalItems()} totalPrice={getTotalPrice()} />
        </div>
      </div>
    </div>
  );
}