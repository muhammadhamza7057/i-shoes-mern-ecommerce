import ApiError from '../../utils/ApiError.js';
import { sendSuccess } from '../../utils/response.js';
import { buildPaginationMeta, parsePagination } from '../../utils/helpers.js';
import { users as User, products as Product, categories as Category, orders as Order, counts } from '../../repositories/index.js';
import * as productsService from '../products/products.service.js';
import * as categoriesService from '../categories/categories.service.js';
import * as ordersService from '../orders/orders.service.js';
import { serializeProduct } from '../products/product.serializer.js';
import { serializeOrder } from '../orders/order.serializer.js';

export const getDashboard = async () => {
  const [productCount, orderCount, userCount, orders, products] = await Promise.all([
    counts.table('products'),
    counts.table('orders'),
    counts.table('users', { role: 'customer' }),
    Order.list({ admin: true, limit: 10000 }),
    Product.list({ publicOnly: false, limit: 10000 }),
  ]);

  const revenue = orders.items
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrders = orders.items.filter((o) => o.status === 'pending').length;

  const avgRating = products.items.length
    ? products.items.reduce((s, p) => s + (p.ratingAvg || 0), 0) / products.items.length
    : 0;

  return {
    stats: {
      products: productCount,
      orders: orderCount,
      users: userCount,
      revenue,
      pendingOrders,
      avgRating: Number(avgRating.toFixed(1)),
    },
  };
};

export const adminListProducts = async (query) => {
  const pagination = parsePagination(query, 20, 200);
  const result = await productsService.listProducts({
    query,
    pagination,
    publicOnly: false,
  });
  return result;
};

export const adminCreateProduct = async (body) => {
  const product = await productsService.createProduct(body);
  return { product };
};

export const adminUpdateProduct = async (id, body) => {
  const product = await productsService.updateProduct(id, body);
  return { product };
};

export const adminDeleteProduct = async (id) => {
  const product = await productsService.deleteProduct(id);
  return { product };
};

export const adminListCategories = async (query) => {
  const pagination = parsePagination(query, 20, 100);
  const items = await Category.list({ offset: pagination.skip, limit: pagination.limit });
  return {
    categories: items.items,
    pagination: buildPaginationMeta(items.total, pagination.page, pagination.limit),
  };
};

export const adminCreateCategory = async (body) => {
  const category = await categoriesService.createCategory(body);
  return { category };
};

export const adminUpdateCategory = async (id, body) => {
  const category = await categoriesService.updateCategory(id, body);
  return { category };
};

export const adminDeleteCategory = async (id) => {
  const category = await categoriesService.deleteCategory(id);
  return { category };
};

export const adminListOrders = async (query) => {
  const pagination = parsePagination(query, 20, 200);
  const filter = {};
  if (query.status) filter.status = query.status;

  const orders = await Order.list({ admin: true, status: query.status, offset: pagination.skip, limit: pagination.limit });

  return {
    orders: orders.items.map(serializeOrder),
    pagination: buildPaginationMeta(orders.total, pagination.page, pagination.limit),
  };
};

export const adminGetOrder = async (id) => {
  const order = await ordersService.getOrderById(null, id, { admin: true });
  return { order };
};

export const adminUpdateOrderStatus = async (id, status) => {
  const order = await ordersService.updateOrderStatus(id, status);
  return { order };
};

export const adminListUsers = async (query) => {
  const pagination = parsePagination(query, 20, 200);
  const users = await User.list({ offset: pagination.skip, limit: pagination.limit });

  const mapped = users.items.map((u) => ({
    ...u,
    firstName: u.name?.split(' ')[0] || u.name,
    lastName: u.name?.split(' ').slice(1).join(' ') || '',
  }));

  return {
    users: mapped,
    pagination: buildPaginationMeta(users.total, pagination.page, pagination.limit),
  };
};

export default {
  getDashboard,
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminListOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
  adminListUsers,
};
