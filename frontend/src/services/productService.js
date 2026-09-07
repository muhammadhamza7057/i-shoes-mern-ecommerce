import api from './api';

// Product APIs
export const productService = {
  getAllProducts: async (params) => (await api.get('/products', { params })).data,
  getProductById: async (id) => (await api.get(`/products/${id}`)).data,
  createProduct: async (productData) => (await api.post('/admin/products', productData)).data,
  updateProduct: async (id, productData) => (await api.patch(`/admin/products/${id}`, productData)).data,
  deleteProduct: async (id) => (await api.delete(`/admin/products/${id}`)).data,
  searchProducts: async (query) => (await api.get('/products', { params: { search: query } })).data
};

export default productService;
