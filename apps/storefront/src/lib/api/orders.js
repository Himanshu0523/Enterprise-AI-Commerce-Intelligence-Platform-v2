import { apiClient } from '@/lib/api/client';

function normalizeOrder(order = {}) {
  return {
    ...order,
    id: order.orderNumber || order._id || order.id,
    date: order.createdAt || order.date,
    total: Number(order.totalAmount ?? order.total ?? 0),
    status: String(order.orderStatus || order.status || 'pending').toLowerCase(),
    items: Array.isArray(order.items) ? order.items : [],
  };
}

export async function getOrdersByUser() {
  const response = await apiClient('/orders?limit=50');
  const orders = response.orders || response.data?.orders || [];
  return orders.map(normalizeOrder);
}

export async function getOrderById(id) {
  if (!id) return null;
  const response = await apiClient('/orders/' + encodeURIComponent(id));
  const order = response.data || response.order || response;
  return normalizeOrder(order);
}
