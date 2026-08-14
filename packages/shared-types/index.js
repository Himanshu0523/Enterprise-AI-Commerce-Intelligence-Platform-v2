/**
 * Shared Type Enums and DTO Constants
 */
module.exports = {
  UserRoles: {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    SELLER: 'seller',
    SUPPORT: 'support',
  },
  OrderStatus: {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
  },
  PaymentStatus: {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
  },
  ShipmentStatus: {
    LABEL_CREATED: 'LABEL_CREATED',
    PICKED_UP: 'PICKED_UP',
    IN_TRANSIT: 'IN_TRANSIT',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    FAILED_ATTEMPT: 'FAILED_ATTEMPT',
  },
};
