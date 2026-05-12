import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },

    description: {
      type: String,
      required: [true, 'Product description is required']
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },

    // Price after discount
    finalPrice: {
      type: Number,
      default: function () {
        return this.price - (this.price * this.discount) / 100;
      }
    },

    brand: {
      type: String,
      required: [true, 'Brand is required']
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Sneakers', 'Formal Shoes', 'Slippers', 'Sports Shoes', 'Boots']
    },

    collection: {
      type: String,
      enum: ['Summer Collection', 'Winter Collection', 'New Arrivals', 'Best Sellers'],
      default: 'New Arrivals'
    },

    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['men', 'women', 'unisex']
    },

    sizes: {
      type: [Number],
      required: [true, 'At least one size is required'],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: 'Product must have at least one size available'
      }
    },

    colors: {
      type: [String],
      required: [true, 'At least one color is required'],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: 'Product must have at least one color available'
      }
    },

    images: [
      {
        url: String,
        altText: String,
        color: String
      }
    ],

    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      default: 0,
      min: [0, 'Stock cannot be negative']
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },

    reviews: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        userName: String,
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    soldCount: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true
  }
);

// Update final price before saving
productSchema.pre('save', function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
  next();
});

// Calculate average rating
productSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    return;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10;
};

export default mongoose.model('Product', productSchema);
