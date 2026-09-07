import api from './api';

export const userService = {
  getUsers: async (params) => (await api.get('/admin/users', { params })).data,
  getUserById: async (id) => (await api.get(`/admin/users/${id}`)).data,
  createUser: async (userData) => (await api.post('/admin/users', userData)).data,
  updateUser: async (id, userData) => (await api.patch(`/admin/users/${id}`, userData)).data,
  deleteUser: async (id) => (await api.delete(`/admin/users/${id}`)).data
};

export default userService;
