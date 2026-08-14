import ordersData from '@/lib/mock-data/orders.json';

/**
 * @typedef {Object} OrderItem
 * @property {string} productId
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 * @property {string} image
 */

/**
 * @typedef {Object} ShippingAddress
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} address
 * @property {string} city
 * @property {string} state
 * @property {string} zip
 * @property {string} country
 * @property {string} phone
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} date
 * @property {number} total
 * @property {'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'} status
 * @property {ShippingAddress} shippingAddress
 * @property {string} shippingMethod
 * @property {string} paymentMethod
 * @property {OrderItem[]} items
 */

/**
 * @returns {Order[]}
 */
export function getAllOrders() {
  return ordersData;
}

/**
 * @param {string} id
 * @returns {Order | undefined}
 */
export function getOrderById(id) {
  return ordersData.find((order) => order.id === id);
}

/** * @param {string} userId
 * @returns {Order[]}
 */
export function getOrdersByUser(userId) {
  return getAllOrders();
}