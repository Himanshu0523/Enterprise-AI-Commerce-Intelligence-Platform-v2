'use client';

import { useState } from 'react';

export default function Attributes() {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Blue');

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];

  return (
    <div className="space-y-4">
      {/* Size */}
      <div>
        <h3 className="text-sm font-medium text-gray-700">Size</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded border px-4 py-2 text-sm ${
                selectedSize === size
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="text-sm font-medium text-gray-700">Color</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`rounded border px-4 py-2 text-sm ${
                selectedColor === color
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}