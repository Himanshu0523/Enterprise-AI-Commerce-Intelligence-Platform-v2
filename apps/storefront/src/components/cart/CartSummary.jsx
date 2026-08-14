import Link from 'next/link';

/**
 * @typedef {Object} CartSummaryProps
 * @property {number} totalItems
 * @property {number} totalPrice
 */

/**
 * @param {CartSummaryProps} props
 */
export default function CartSummary({ totalItems, totalPrice }) {
  return (
    <div className="rounded-lg border bg-gray-50 p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Items ({totalItems})</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <Link
        href="/checkout"
        className="mt-4 block w-full rounded bg-indigo-600 py-2 text-center text-white hover:bg-indigo-700"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}