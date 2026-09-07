export const serializeOrder = (order) => {
  const doc = order.toObject ? order.toObject() : order;

  return {
    ...doc,
    orderStatus: doc.status,
    totalPrice: doc.total,
    userId: doc.user,
    shippingCost: 0,
    items: (doc.items || []).map((item) => ({
      ...item,
      productName: item.productName || item.product?.name || '',
      price: item.priceAtPurchase,
      size: item.variant?.size,
      color: item.variant?.color,
    })),
  };
};

export default { serializeOrder };
