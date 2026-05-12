import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { createError } from '../middleware/errorHandler.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phone: user.phone,
  role: user.role,
  avatar: user.avatar,
  addresses: user.addresses,
  wishlist: user.wishlist,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError('Email already registered', 409);
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: 'user'
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw createError('Invalid email or password', 401);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw createError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw createError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export default { register, login, me, updateProfile };
