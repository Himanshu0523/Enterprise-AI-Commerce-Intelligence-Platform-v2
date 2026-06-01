import API from "./api";


//Create order
export const createOrder = (data) => API.post("/orders" , data);

// Get order by ID
export const getOrder = (orderId) => API.get(`/orders/${orderId}`);

// Get user orders
export const getUserOrders = () => API.get("/orders");

// Get all orders (admin)
export const getAllOrders = () => API.get("/orders/admin");

// Update order status
export const updateOrder = (orderId , status) => API.put(`/orders/${orderId}/status` , { status });

// Delete order
export const deleteOrder = (orderId) => API.delete(`/orders/${orderId}`);
