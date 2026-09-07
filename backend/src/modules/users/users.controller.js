import ApiError from '../../utils/ApiError.js';
import { sendSuccess } from '../../utils/response.js';
import { users as User } from '../../repositories/index.js';
import { comparePassword, hashPassword } from '../auth/auth.utils.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  addresses: user.addresses,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getMe = async (req, res) => {
  sendSuccess(res, { user: sanitizeUser(req.user) });
};

export const updateMe = async (req, res) => {
  const updates = req.body;
  const user = await User.update(req.user._id, updates);

  sendSuccess(res, { user: sanitizeUser(user) }, 'Profile updated');
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.passwordHash = await hashPassword(newPassword);
  user.refreshTokens = [];
  await User.update(req.user._id, { passwordHash: user.passwordHash, refreshTokens: [] });

  sendSuccess(res, null, 'Password updated');
};

export default { getMe, updateMe, changePassword };
