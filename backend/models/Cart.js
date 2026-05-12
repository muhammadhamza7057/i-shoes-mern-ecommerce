import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true
    },

    items: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        },
        price: {
          type: Number,
          required: true
        },
        discount: {
          type: Number,
          default: 0
        },
        size: String,
        color: String,
        image: String,
        productName: String,
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    subtotal: {
      type: Number,
      default: 0
    },

    totalItems: {
      type: Number,
      default: 0
    },

    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Calculate subtotal before saving
cartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => {
    const itemPrice = item.price - (item.price * (item.discount || 0)) / 100;
    return sum + (itemPrice * item.quantity);
  }, 0);

  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.lastModified = new Date();

  next();
});

// Method to add item to cart
cartSchema.methods.addItem = async function (productId, quantity = 1, size, color, productData) {
  const existingItem = this.items.find(
    item => item.productId.toString() === productId && item.size === size && item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      _id: new mongoose.Types.ObjectId(),
      productId,
      quantity,
      size,
      color,
      price: productData.finalPrice,
      discount: productData.discount,
      image: productData.images[0]?.url || '',
      productName: productData.name
    });
  }

  return await this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function (itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId);
  return await this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = async function (itemId, quantity) {
  const item = this.items.find(item => item._id.toString() === itemId);

  if (item) {
    if (quantity <= 0) {
      return await this.removeItem(itemId);
    }
    item.quantity = quantity;
  }

  return await this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  return await this.save();
};

export default mongoose.model('Cart', cartSchema);
