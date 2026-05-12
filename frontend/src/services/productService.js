import api from './api';

// Product APIs
export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.patch(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  searchProducts: (query) => api.get('/products', { params: { search: query } })
};

export default productService;
