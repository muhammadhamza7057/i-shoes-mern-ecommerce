import api from './api';

// Order APIs
export const orderService = {
  createOrder: async (orderData) => (await api.post('/orders', orderData)).data,
  getMyOrders: async () => (await api.get('/orders')).data,
  getOrderById: async (id) => (await api.get(`/orders/${id}`)).data,
  getAllOrders: async (params) => (await api.get('/admin/orders', { params })).data,
  updateOrderStatus: async (id, status) => (await api.patch(`/admin/orders/${id}/status`, { status })).data,
  cancelOrder: async (id) => (await api.patch(`/orders/${id}/cancel`)).data
};

export default orderService;
