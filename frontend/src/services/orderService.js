import api from './api';

// Order APIs
export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getAllOrders: () => api.get('/orders/all'), // Admin only
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.delete(`/orders/${id}`)
};

export default orderService;
