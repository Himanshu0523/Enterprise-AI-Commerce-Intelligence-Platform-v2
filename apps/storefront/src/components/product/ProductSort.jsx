'use client';

/**
 * @typedef {'price-asc' | 'price-desc' | 'rating' | 'name'} SortOption
 */

/**
 * @typedef {Object} ProductSortProps
 * @property {SortOption} value
 * @property {(value: SortOption) => void} onChange
 */

/**
 * @param {ProductSortProps} props
 */
export default function ProductSort({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-gray-300 px-3 py-1 text-sm"
    >
      <option value="rating">Best Rating</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name">Name (A-Z)</option>
    </select>
  );
}