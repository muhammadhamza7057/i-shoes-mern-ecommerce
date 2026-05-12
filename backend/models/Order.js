import mongoose from 'mongoose';

/**
 * Order Schema
 * ─────────────
 * Stores complete order data including items snapshot, shipping address,
 * payment info, and a full status history for tracking.
 *
 * STATUS FLOW:
 *   pending → processing → ready_for_delivery → shipped → delivered
 *   Any status → cancelled
 */

const statusHistorySchema = new mongoose.Schema(
  {
    status:    { type: String, required: true },
    note:      { type: String, default: '' },
    updatedBy: { type: String, default: 'system' }, // 'admin' | 'system' | userId
    changedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },

    items: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        productName: { type: String, required: true },
        quantity:    { type: Number, required: true, min: 1 },
        price:       { type: Number, required: true },
        discount:    { type: Number, default: 0 },
        size:        String,
        color:       String,
        image:       String
      }
    ],

    subtotal:     { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    discount:     { type: Number, default: 0, min: 0 },
    totalPrice:   { type: Number, required: true, min: 0 },

    shippingAddress: {
      firstName:  String,
      lastName:   String,
      email:      String,
      phone:      String,
      street:     String,
      city:       String,
      state:      String,
      postalCode: String,
      country:    String
    },

    billingAddress: {
      street:     String,
      city:       String,
      state:      String,
      postalCode: String,
      country:    String
    },

    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod'],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },

    /**
     * Order status enum — includes 'ready_for_delivery' as a distinct step
     * between processing and shipped.
     */
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'ready_for_delivery', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true
    },

    /**
     * Full status history — every status change is recorded here.
     * Allows users to see a timeline of their order.
     */
    statusHistory: {
      type: [statusHistorySchema],
      default: []
    },

    transactionId:      { type: String, default: null },
    notes:              { type: String, default: '' },
    estimatedDelivery:  { type: Date },
    deliveredAt:        { type: Date },
    cancelledAt:        { type: Date },
    cancellationReason: { type: String }
  },
  {
    timestamps: true
  }
);

/* ── Pre-save: compute subtotal + totalPrice ─────────────────────────────── */
orderSchema.pre('save', function (next) {
  this.subtotal   = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  this.totalPrice = this.subtotal + (this.shippingCost || 0) - (this.discount || 0);
  next();
});

/* ── Instance method: populate user + product details ───────────────────── */
orderSchema.methods.populateDetails = async function () {
  return await this.populate([
    { path: 'userId',          select: 'email firstName lastName phone' },
    { path: 'items.productId', select: 'name price images' }
  ]);
};

export default mongoose.model('Order', orderSchema);
