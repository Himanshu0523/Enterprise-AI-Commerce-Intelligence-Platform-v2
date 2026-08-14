import productsData from '@/lib/mock-data/products.json';
import '@/types/product';
import { getProductReviews } from '@/lib/utils/review-helpers';

/**
 * @returns {import('@/types/product').Product[]}
 */
export function getAllProducts() {
  return /** @type {import('@/types/product').Product[]} */ (productsData);
}

/**
 * @param {number} [limit=4]
 * @returns {import('@/types/product').Product[]}
 */
export function getFeaturedProducts(limit = 4) {
  return /** @type {import('@/types/product').Product[]} */ (
    productsData.filter((p) => p.isFeatured).slice(0, limit)
  );
}

/**
 * @param {string} id
 * @returns {import('@/types/product').Product|undefined}
 */
export function getProductById(id) {
  const product = productsData.find((p) => p.id === id);
  if (!product) return undefined;
  const reviews = getProductReviews(id, product.reviews || []);
  return /** @type {import('@/types/product').Product} */ ({
    ...product,
    reviews,
  });
}

/**
 * @param {string} category
 * @returns {import('@/types/product').Product[]}
 */
export function getProductsByCategory(category) {
  return /** @type {import('@/types/product').Product[]} */ (
    productsData.filter((p) => p.category === category)
  );
}

/**
 * @param {string} brand
 * @returns {import('@/types/product').Product[]}
 */
export function getProductsByBrand(brand) {
  return /** @type {import('@/types/product').Product[]} */ (
    productsData.filter((p) => p.brand === brand)
  );
}

/**
 * @param {string} query
 * @returns {import('@/types/product').Product[]}
 */
export function searchProducts(query) {
  const lower = query.toLowerCase();
  return /** @type {import('@/types/product').Product[]} */ (
    productsData.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    )
  );
}