'use client';

/**
 * @typedef {Object} FilterState
 * @property {string[]} brands
 * @property {number|null} priceMin
 * @property {number|null} priceMax
 * @property {number|null} rating
 */

/**
 * @typedef {Object} ProductFiltersProps
 * @property {string[]} brands
 * @property {{ min: number; max: number }} priceRange
 * @property {FilterState} filters
 * @property {(brand: string) => void} onToggleBrand
 * @property {(min: number|null, max: number|null) => void} onPriceChange
 * @property {(rating: number|null) => void} onRatingChange
 * @property {() => void} onClear
 */

/**
 * Product Filters Component
 * @param {ProductFiltersProps} props
 */
export default function ProductFilters({
  brands,
  priceRange,
  filters,
  onToggleBrand,
  onPriceChange,
  onRatingChange,
  onClear,
}) {
  return (
    <div className="space-y-6">
      {/* Clear all */}
      <button
        onClick={onClear}
        className="text-sm text-indigo-600 hover:underline"
      >
        Clear All Filters
      </button>

      {/* Brand filter */}
      <div>
        <h3 className="font-semibold">Brands</h3>
        <div className="mt-2 space-y-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => onToggleBrand(brand)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-semibold">Price Range</h3>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            value={filters.priceMin ?? ''}
            onChange={(e) =>
              onPriceChange(
                e.target.value ? Number(e.target.value) : null,
                filters.priceMax
              )
            }
            placeholder="Min"
            className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
          />
          <span>–</span>
          <input
            type="number"
            value={filters.priceMax ?? ''}
            onChange={(e) =>
              onPriceChange(
                filters.priceMin,
                e.target.value ? Number(e.target.value) : null
              )
            }
            placeholder="Max"
            className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* Rating filter */}
      <div>
        <h3 className="font-semibold">Minimum Rating</h3>
        <div className="mt-2 space-y-1">
          {[4, 3, 2, 1].map((stars) => (
            <label key={stars} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === stars}
                onChange={() => onRatingChange(stars)}
                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              {stars} ★ & up
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="rating"
              checked={filters.rating === null}
              onChange={() => onRatingChange(null)}
              className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            All ratings
          </label>
        </div>
      </div>
    </div>
  );
}