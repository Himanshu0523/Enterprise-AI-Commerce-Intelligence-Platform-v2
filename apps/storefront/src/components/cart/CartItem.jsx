'use client';

import Image from 'next/image';
import { useCart } from '@/lib/contexts/CartContext';
import { X } from 'lucide-react';

/**
 * @typedef {Object} CartItemType
 * @property {string} productId
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {number} quantity
 */

/**
 * @typedef {Object} CartItemProps
 * @property {CartItemType} item
 */

/**
 * @param {CartItemProps} props
 */
export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <li className="flex items-center gap-4 p-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded border border-gray-300">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeItem(item.productId)}
          className="text-gray-400 hover:text-red-600"
          aria-label="Remove item"
        >
          <X size={18} />
        </button>
      </div>
    </li>
  );
}