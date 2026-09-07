import supabase from '../config/supabase.js';

const unwrap = ({ data, error }) => {
  if (error) throw error;
  return data;
};

const userFromRow = (row) => row && ({
  _id: row.id,
  name: row.name,
  email: row.email,
  passwordHash: row.password_hash,
  role: row.role,
  phone: row.phone,
  addresses: row.addresses || [],
  isActive: row.is_active,
  refreshTokens: row.refresh_tokens || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const categoryFromRow = (row) => row && ({
  _id: row.id,
  name: row.name,
  slug: row.slug,
  parent: row.parent_id,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const variantFromRow = (row) => row && ({
  _id: row.id,
  variantId: row.id,
  size: row.size,
  color: row.color,
  sku: row.sku,
  price: Number(row.price),
  stock: row.stock,
  reservedStock: row.reserved_stock,
  soldStock: row.sold_stock,
});

const productFromRows = (row, variants = [], category = null) => row && ({
  _id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  brand: row.brand,
  category: category || row.category_id,
  images: row.images || [],
  thumbnail: row.thumbnail,
  basePrice: Number(row.base_price),
  salePrice: row.sale_price == null ? null : Number(row.sale_price),
  variants: variants.map(variantFromRow),
  featured: row.featured,
  status: row.status,
  tags: row.tags || [],
  ratingAvg: Number(row.rating_avg || 0),
  ratingCount: row.rating_count || 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const orderFromRows = (row, items = [], user = null) => row && ({
  _id: row.id,
  user: user || row.user_id,
  items: items.map((item) => ({
    _id: item.id,
    product: item.product_id,
    variant: item.variant || {},
    quantity: item.quantity,
    priceAtPurchase: Number(item.price_at_purchase),
    productName: item.product_name,
    image: item.image,
  })),
  shippingAddress: row.shipping_address,
  subtotal: Number(row.subtotal),
  total: Number(row.total),
  status: row.status,
  paymentMethod: row.payment_method,
  paymentStatus: row.payment_status,
  cancelReason: row.cancel_reason,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const users = {
  async findById(id) {
    return userFromRow(unwrap(await supabase.from('users').select('*').eq('id', id).maybeSingle()));
  },
  async findByEmail(email) {
    return userFromRow(unwrap(await supabase.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle()));
  },
  async create(input) {
    const row = unwrap(await supabase.from('users').insert({
      name: input.name,
      email: input.email.toLowerCase(),
      password_hash: input.passwordHash,
      role: input.role || 'customer',
      phone: input.phone || '',
      is_active: input.isActive ?? true,
    }).select('*').single());
    return userFromRow(row);
  },
  async update(id, input) {
    const values = {};
    if (input.name !== undefined) values.name = input.name;
    if (input.email !== undefined) values.email = input.email.toLowerCase();
    if (input.phone !== undefined) values.phone = input.phone;
    if (input.addresses !== undefined) values.addresses = input.addresses;
    if (input.passwordHash !== undefined) values.password_hash = input.passwordHash;
    if (input.refreshTokens !== undefined) values.refresh_tokens = input.refreshTokens;
    if (input.role !== undefined) values.role = input.role;
    if (input.isActive !== undefined) values.is_active = input.isActive;
    return userFromRow(unwrap(await supabase.from('users').update(values).eq('id', id).select('*').single()));
  },
  async list({ offset = 0, limit = 20 } = {}) {
    const result = await supabase.from('users').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (result.error) throw result.error;
    return { items: result.data.map(userFromRow), total: result.count || 0 };
  },
};

export const categories = {
  async list({ active, parent, offset = 0, limit = 20 } = {}) {
    let query = supabase.from('categories').select('*', { count: 'exact' }).order('name').range(offset, offset + limit - 1);
    if (active !== undefined) query = query.eq('is_active', active);
    if (parent !== undefined) query = parent === null ? query.is('parent_id', null) : query.eq('parent_id', parent);
    const result = await query;
    if (result.error) throw result.error;
    return { items: result.data.map(categoryFromRow), total: result.count || 0 };
  },
  async findById(id) { return categoryFromRow(unwrap(await supabase.from('categories').select('*').eq('id', id).maybeSingle())); },
  async findBySlug(slug) { return categoryFromRow(unwrap(await supabase.from('categories').select('*').eq('slug', slug).maybeSingle())); },
  async findByName(name) { return categoryFromRow(unwrap(await supabase.from('categories').select('*').ilike('name', name).maybeSingle())); },
  async create(input) { return categoryFromRow(unwrap(await supabase.from('categories').insert({ name: input.name, slug: input.slug, parent_id: input.parent || null, is_active: input.isActive ?? true }).select('*').single())); },
  async update(id, input) {
    const values = {};
    if (input.name !== undefined) values.name = input.name;
    if (input.slug !== undefined) values.slug = input.slug;
    if (input.parent !== undefined) values.parent_id = input.parent;
    if (input.isActive !== undefined) values.is_active = input.isActive;
    return categoryFromRow(unwrap(await supabase.from('categories').update(values).eq('id', id).select('*').single()));
  },
};

const loadProduct = async (row) => {
  if (!row) return null;
  const [variants, category] = await Promise.all([
    supabase.from('product_variants').select('*').eq('product_id', row.id).order('size'),
    supabase.from('categories').select('*').eq('id', row.category_id).maybeSingle(),
  ]);
  if (variants.error) throw variants.error;
  if (category.error) throw category.error;
  return productFromRows(row, variants.data, category.data ? categoryFromRow(category.data) : null);
};

export const products = {
  async list({ query = {}, publicOnly = true, offset = 0, limit = 20 } = {}) {
    let request = supabase.from('products').select('*', { count: 'exact' }).range(offset, offset + limit - 1);
    if (publicOnly) request = request.eq('status', 'active');
    else if (query.status) request = request.eq('status', query.status);
    if (query.featured === true || query.featured === 'true') request = request.eq('featured', true);
    if (query.category) request = request.eq('category_id', query.category);
    if (query.brand) request = request.ilike('brand', `%${query.brand}%`);
    if (query.minPrice !== '' && query.minPrice != null) request = request.gte('base_price', query.minPrice);
    if (query.maxPrice !== '' && query.maxPrice != null) request = request.lte('base_price', query.maxPrice);
    if (query.rating !== '' && query.rating != null) request = request.gte('rating_avg', query.rating);
    if (query.search) request = request.or(`name.ilike.%${query.search}%,description.ilike.%${query.search}%,brand.ilike.%${query.search}%`);
    const sortField = { createdAt: 'created_at', basePrice: 'base_price', ratingAvg: 'rating_avg', name: 'name' }[query.sortBy] || 'created_at';
    const result = await request.order(sortField, { ascending: query.sortOrder === 'asc' });
    if (result.error) throw result.error;
    return { items: await Promise.all(result.data.map(loadProduct)), total: result.count || 0 };
  },
  async findById(id, { publicOnly = false } = {}) {
    let request = supabase.from('products').select('*').eq('id', id);
    if (publicOnly) request = request.eq('status', 'active');
    return loadProduct(unwrap(await request.maybeSingle()));
  },
  async findBySlug(slug) { return loadProduct(unwrap(await supabase.from('products').select('*').eq('slug', slug).maybeSingle())); },
  async create(input) {
    const row = unwrap(await supabase.from('products').insert({ category_id: input.category, name: input.name, slug: input.slug, description: input.description || '', brand: input.brand || 'I.Shoes', images: input.images || [], thumbnail: input.thumbnail || '', base_price: input.basePrice, sale_price: input.salePrice, featured: input.featured ?? false, status: input.status || 'draft', tags: input.tags || [] }).select('*').single());
    const variants = input.variants.map((v) => ({ product_id: row.id, size: v.size, color: v.color, sku: v.sku, price: v.price, stock: v.stock, reserved_stock: v.reservedStock || 0, sold_stock: v.soldStock || 0 }));
    if (variants.length) unwrap(await supabase.from('product_variants').insert(variants));
    return loadProduct(row);
  },
  async update(id, input) {
    const values = {};
    const map = { category: 'category_id', name: 'name', slug: 'slug', description: 'description', brand: 'brand', images: 'images', thumbnail: 'thumbnail', basePrice: 'base_price', salePrice: 'sale_price', featured: 'featured', status: 'status', tags: 'tags' };
    for (const [key, column] of Object.entries(map)) if (input[key] !== undefined) values[column] = input[key];
    if (Object.keys(values).length) unwrap(await supabase.from('products').update(values).eq('id', id));
    if (input.variants) {
      unwrap(await supabase.from('product_variants').delete().eq('product_id', id));
      const variants = input.variants.map((v) => ({ product_id: id, size: v.size, color: v.color, sku: v.sku, price: v.price, stock: v.stock, reserved_stock: v.reservedStock || 0, sold_stock: v.soldStock || 0 }));
      if (variants.length) unwrap(await supabase.from('product_variants').insert(variants));
    }
    return this.findById(id);
  },
};

export const variants = {
  async find(id) { return variantFromRow(unwrap(await supabase.from('product_variants').select('*').eq('id', id).maybeSingle())); },
  async findForProduct(productId, selector) {
    let query = supabase.from('product_variants').select('*').eq('product_id', productId);
    if (selector.sku) query = query.eq('sku', selector.sku);
    else { query = query.ilike('size', selector.size).ilike('color', selector.color); }
    return variantFromRow(unwrap(await query.maybeSingle()));
  },
  async reserve(id, amount) { unwrap(await supabase.rpc('reserve_variant_stock', { variant: id, amount })); },
  async release(id, amount) { unwrap(await supabase.rpc('release_variant_stock', { variant: id, amount })); },
  async finalize(id, amount) {
    const current = unwrap(await supabase.from('product_variants').select('*').eq('id', id).single());
    if (current.stock < amount || current.reserved_stock < amount) {
      throw new Error('Insufficient reserved stock');
    }

    unwrap(await supabase.from('product_variants').update({
      stock: current.stock - amount,
      reserved_stock: current.reserved_stock - amount,
      sold_stock: current.sold_stock + amount,
    }).eq('id', id));
  },
};

export const carts = {
  async getOrCreate(userId) {
    let cart = unwrap(await supabase.from('carts').select('*').eq('user_id', userId).maybeSingle());
    if (!cart) cart = unwrap(await supabase.from('carts').insert({ user_id: userId }).select('*').single());
    const items = unwrap(await supabase.from('cart_items').select('*').eq('cart_id', cart.id));
    const variantIds = items.map((item) => item.variant_id).filter(Boolean);
    const variantRows = variantIds.length
      ? unwrap(await supabase.from('product_variants').select('id,product_id').in('id', variantIds))
      : [];
    const productByVariant = new Map(variantRows.map((variant) => [variant.id, variant.product_id]));
    return {
      id: cart.id,
      userId,
      items: items.map((item) => ({
        _id: item.id,
        product: productByVariant.get(item.variant_id),
        variantId: item.variant_id,
        quantity: item.quantity,
        priceSnapshot: Number(item.price_snapshot),
      })),
    };
  },
  async upsertItem(cartId, variantId, quantity, priceSnapshot) {
    if (!cartId || !variantId) throw new Error('Cart and product variant IDs are required');
    return unwrap(await supabase.from('cart_items').upsert({ cart_id: cartId, variant_id: variantId, quantity, price_snapshot: priceSnapshot }, { onConflict: 'cart_id,variant_id' }).select('*').single());
  },
  async updateItem(id, quantity) { return unwrap(await supabase.from('cart_items').update({ quantity }).eq('id', id).select('*').single()); },
  async removeItem(id) { unwrap(await supabase.from('cart_items').delete().eq('id', id)); },
  async clear(cartId) { unwrap(await supabase.from('cart_items').delete().eq('cart_id', cartId)); },
};

const loadOrder = async (row) => {
  if (!row) return null;
  const [items, user] = await Promise.all([
    supabase.from('order_items').select('*').eq('order_id', row.id),
    supabase.from('users').select('id,name,email').eq('id', row.user_id).maybeSingle(),
  ]);
  if (items.error) throw items.error;
  if (user.error) throw user.error;
  const variantIds = items.data.map((item) => item.variant_id).filter(Boolean);
  const variants = variantIds.length
    ? await supabase.from('product_variants').select('*').in('id', variantIds)
    : { data: [], error: null };
  if (variants.error) throw variants.error;
  const variantMap = new Map(variants.data.map((variant) => [variant.id, variantFromRow(variant)]));
  const mappedItems = items.data.map((item) => ({ ...item, variant: variantMap.get(item.variant_id) || {} }));
  return orderFromRows(row, mappedItems, user.data && { _id: user.data.id, name: user.data.name, email: user.data.email });
};

export const orders = {
  async create(input) {
    const row = unwrap(await supabase.from('orders').insert({ user_id: input.user, shipping_address: input.shippingAddress, subtotal: input.subtotal, total: input.total, status: input.status, payment_method: input.paymentMethod, payment_status: input.paymentStatus }).select('*').single());
    const items = input.items.map((item) => ({ order_id: row.id, product_id: item.product, variant_id: item.variant.variantId, quantity: item.quantity, price_at_purchase: item.priceAtPurchase, product_name: item.productName, image: item.image }));
    unwrap(await supabase.from('order_items').insert(items));
    return loadOrder(row);
  },
  async list({ user, status, offset = 0, limit = 20, admin = false } = {}) {
    let request = supabase.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (!admin) request = request.eq('user_id', user);
    if (status) request = request.eq('status', status);
    const result = await request;
    if (result.error) throw result.error;
    return { items: await Promise.all(result.data.map(loadOrder)), total: result.count || 0 };
  },
  async findById(id, { user, admin = false } = {}) {
    let request = supabase.from('orders').select('*').eq('id', id);
    if (!admin) request = request.eq('user_id', user);
    return loadOrder(unwrap(await request.maybeSingle()));
  },
  async update(id, input) {
    const values = {};
    for (const [key, column] of Object.entries({ status: 'status', cancelReason: 'cancel_reason', paymentStatus: 'payment_status' })) if (input[key] !== undefined) values[column] = input[key];
    const row = unwrap(await supabase.from('orders').update(values).eq('id', id).select('*').single());
    return loadOrder(row);
  },
};

export const counts = {
  async table(table, filter) {
    let request = supabase.from(table).select('*', { count: 'exact', head: true });
    for (const [column, value] of Object.entries(filter || {})) request = request.eq(column, value);
    const result = await request;
    if (result.error) throw result.error;
    return result.count || 0;
  },
};

export default { users, categories, products, variants, carts, orders, counts };
