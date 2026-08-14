'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex items-center rounded border border-gray-300">
      <button
        onClick={decrement}
        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val) && val > 0) setQuantity(val);
        }}
        className="w-12 border-x border-gray-300 text-center text-sm focus:outline-none"
      />
      <button
        onClick={increment}
        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}