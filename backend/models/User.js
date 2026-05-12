import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },

    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },

    phone: {
      type: String,
      default: ''
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },

    addresses: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        label: String, // Home, Office, etc.
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: Boolean
      }
    ],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to get full name
userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

export default mongoose.model('User', userSchema);
