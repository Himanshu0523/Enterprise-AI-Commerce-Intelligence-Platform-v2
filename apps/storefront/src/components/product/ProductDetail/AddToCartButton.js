'use client';

import { useCart } from '@/lib/contexts/CartContext';

/**
 * Add To Cart Button Component
 * @param {Object} props
 * @param {string} props.productId
 * @param {string} props.name
 * @param {number} props.price
 * @param {string} props.image
 * @param {number} props.quantity
 */
export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  quantity,
}) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ productId, name, price, image }, quantity);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Add to Cart
    </button>
  );
}