import User from '../models/User.js';
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
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const getUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();
    const role = req.query.role?.trim();

    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password'),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      users: users.map(sanitizeUser),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) throw createError('User not found', 404);

    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'user', avatar, isActive = true } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw createError('Email already registered', 409);

    const user = await User.create({ email, password, firstName, lastName, phone, role, avatar, isActive });

    res.status(201).json({ success: true, message: 'User created successfully', user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'role', 'avatar', 'isActive'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.body.password) {
      updates.password = req.body.password;
    }

    const user = await User.findById(req.params.id).select('+password');
    if (!user) throw createError('User not found', 404);

    Object.assign(user, updates);
    await user.save();

    const refreshedUser = await User.findById(user._id).select('-password');

    res.status(200).json({ success: true, message: 'User updated successfully', user: sanitizeUser(refreshedUser) });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw createError('User not found', 404);

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
