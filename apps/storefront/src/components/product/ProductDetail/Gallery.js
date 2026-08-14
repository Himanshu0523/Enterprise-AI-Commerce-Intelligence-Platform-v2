'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * Gallery Component
 * @param {Object} props
 * @param {string[]} props.images
 * @param {string} props.productName
 */
export default function Gallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative h-96 w-full bg-gray-200 rounded-lg">
        <div className="flex h-full items-center justify-center text-gray-500">
          No image available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 ${
                selectedIndex === idx ? 'border-indigo-600' : 'border-transparent'
              }`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}