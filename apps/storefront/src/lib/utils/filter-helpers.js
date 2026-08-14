
/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string[]} images
 * @property {number} rating
 * @property {number} reviewCount
 * @property {string} category
 * @property {string} brand
 * @property {string} description
 */

/**
 * @typedef {Object} FilterState
 * @property {string[]} brands
 * @property {number|null} priceMin
 * @property {number|null} priceMax
 * @property {number|null} rating
 */

/**
 * @typedef {'price-asc' | 'price-desc' | 'rating' | 'name'} SortOption
 */

/**
 * Apply filters to products
 * @param {Product[]} products
 * @param {FilterState} filters
 * @param {string} [category]
 * @param {string} [query]
 * @returns {Product[]}
 */
export function applyFilters(
  products,
  filters,
  category,
  query
) {
  let filtered = [...products];

  if (category) {
    const normalizedSlug = category.toLowerCase().replace(/-/g, ' ');
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === normalizedSlug
    );
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (filters.brands.length > 0) {
    filtered = filtered.filter((p) => filters.brands.includes(p.brand));
  }

  if (filters.priceMin !== null) {
    filtered = filtered.filter((p) => p.price >= filters.priceMin);
  }
  if (filters.priceMax !== null) {
    filtered = filtered.filter((p) => p.price <= filters.priceMax);
  }

  // Rating (minimum stars)
  if (filters.rating !== null) {
    filtered = filtered.filter((p) => p.rating >= filters.rating);
  }

  return filtered;
}

/**
 * Sort products based on sort option
 * @param {Product[]} products
 * @param {SortOption} sortBy
 * @returns {Product[]}
 */
export function sortProducts(products, sortBy) {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }
  return sorted;
}

/**
 * Get unique categories from products
 * @param {Product[]} products
 * @returns {string[]}
 */
export function getUniqueCategories(products) {
  return Array.from(new Set(products.map((p) => p.category)));
}

/**
 * Get unique brands from products
 * @param {Product[]} products
 * @returns {string[]}
 */
export function getUniqueBrands(products) {
  return Array.from(new Set(products.map((p) => p.brand)));
}

/**
 * Get price range from products
 * @param {Product[]} products
 * @returns {{ min: number; max: number }}
 */
export function getPriceRange(products) {
  const prices = products.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}