import { Star } from 'lucide-react';

/**
 * Info Component
 * @param {Object} props
 * @param {string} props.name
 * @param {number} props.price
 * @param {number} props.rating
 * @param {number} props.reviewCount
 * @param {string} props.description
 * @param {number} props.stock
 */
export default function Info({
  name,
  price,
  rating,
  reviewCount,
  description,
  stock,
}) {
  const isInStock = stock > 0;

  return (
    <div>
      <h1 className="text-3xl font-bold">{name}</h1>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={20}
              className={
                i < Math.floor(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
      </div>

      <p className="mt-4 text-3xl font-bold text-indigo-600">
        ${price.toFixed(2)}
      </p>

      <p className="mt-4 text-gray-700">{description}</p>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
            isInStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isInStock ? `In Stock (${stock})` : 'Out of Stock'}
        </span>
      </div>
    </div>
  );
}