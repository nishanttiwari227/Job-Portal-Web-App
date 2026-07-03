import User from '../models/User.model.js';
import ApiError from '../utils/apiError.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { REGISTERABLE_ROLES } from '../constants/auth.js';
import { sendVerificationEmailToUser } from './emailVerification.service.js';
import env from '../config/env.js';

const buildTokenPayload = (user) => ({
  userId: user._id.toString(),
  role: user.role,
  tokenVersion: user.tokenVersion,
});

const issueAuthTokens = async (user) => {
  const payload = buildTokenPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = await hashPassword(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = async ({ name, email, password, role }) => {
  if (!REGISTERABLE_ROLES.includes(role)) {
    throw ApiError.badRequest('Invalid role. Only candidate and recruiter registration is allowed');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw ApiError.conflict('Email is already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (env.skipEmailVerification) {
    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationTokenHash = null;
    user.emailVerificationTokenExpiresAt = null;
    await user.save({ validateBeforeSave: false });
  } else {
    try {
      await sendVerificationEmailToUser(user);
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }
  }

  return { user };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isEmailVerified) {
    throw ApiError.forbidden('Please verify your email before logging in');
  }

  const tokens = await issueAuthTokens(user);

  return { user, ...tokens };
};

const refreshAuthTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.unauthorized('Refresh token is required');
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user || !user.refreshToken) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  if (!user.isEmailVerified) {
    throw ApiError.forbidden('Please verify your email before accessing your account');
  }

  if (decoded.tokenVersion !== user.tokenVersion) {
    throw ApiError.unauthorized('Refresh token has been revoked');
  }

  const isRefreshTokenValid = await comparePassword(refreshToken, user.refreshToken);

  if (!isRefreshTokenValid) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const tokens = await issueAuthTokens(user);

  return { user, ...tokens };
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId).select('+refreshToken');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
};

export {
  registerUser,
  loginUser,
  refreshAuthTokens,
  logoutUser,
  getCurrentUser,
};
