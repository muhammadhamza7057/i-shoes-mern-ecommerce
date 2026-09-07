import { users as User } from '../../repositories/index.js';
import ApiError from '../../utils/ApiError.js';
import { sendSuccess } from '../../utils/response.js';
import {
  hashPassword,
  comparePassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  refreshCookieOptions,
} from './auth.utils.js';

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

const storeRefreshToken = async (userId, refreshToken) => {
  const tokenHash = hashToken(refreshToken);
  const decoded = verifyRefreshToken(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  const user = await User.findById(userId);
  await User.update(userId, {
    refreshTokens: [...(user.refreshTokens || []), { tokenHash, expiresAt }],
  });
};

const rotateRefreshToken = async (user, oldToken) => {
  const oldHash = hashToken(oldToken);

  await User.update(user._id, {
    refreshTokens: (user.refreshTokens || []).filter((token) => token.tokenHash !== oldHash),
  });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  await storeRefreshToken(user._id, refreshToken);

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findByEmail(email);
  if (existing) {
    throw ApiError.conflict('Email already registered');
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    phone: phone || '',
    role: 'customer',
  });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  await storeRefreshToken(user._id, refreshToken);

  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  sendSuccess(
    res,
    { user: sanitizeUser(user), accessToken },
    'Registration successful',
    201
  );
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  await storeRefreshToken(user._id, refreshToken);

  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  sendSuccess(res, {
    user: sanitizeUser(user),
    accessToken,
  }, 'Login successful');
};

export const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw ApiError.unauthorized('Refresh token required');
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid account');
  }

  const tokenHash = hashToken(token);
  const stored = user.refreshTokens?.find((t) => t.tokenHash === tokenHash);
  if (!stored || stored.expiresAt < new Date()) {
    throw ApiError.unauthorized('Refresh token revoked or expired');
  }

  const { accessToken, refreshToken } = await rotateRefreshToken(user, token);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  sendSuccess(res, { accessToken }, 'Token refreshed');
};

export const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (token && req.user) {
    const tokenHash = hashToken(token);
    const user = await User.findById(req.user._id);
    await User.update(req.user._id, {
      refreshTokens: (user.refreshTokens || []).filter((stored) => stored.tokenHash !== tokenHash),
    });
  }

  res.clearCookie('refreshToken', { ...refreshCookieOptions, maxAge: 0 });
  sendSuccess(res, null, 'Logged out');
};

export const me = async (req, res) => {
  sendSuccess(res, { user: sanitizeUser(req.user) });
};

export default { register, login, refresh, logout, me };
