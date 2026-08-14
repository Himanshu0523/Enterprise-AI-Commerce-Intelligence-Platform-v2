// src/types/product.js

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} author
 * @property {string} date - ISO string
 * @property {number} rating - 1-5
 * @property {string} comment
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string[]} images
 * @property {number} rating
 * @property {number} reviewCount
 * @property {string} category
 * @property {string} brand
 * @property {number} stock
 * @property {boolean} isFeatured
 * @property {boolean} isNew
 * @property {Review[]} [reviews] - optional, some products may not have reviews
 */

export {};