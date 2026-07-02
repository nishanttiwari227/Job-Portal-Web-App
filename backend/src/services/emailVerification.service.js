import User from '../models/User.model.js';
import env from '../config/env.js';
import {
  EMAIL_VERIFICATION_TOKEN_EXPIRY_MS,
  VERIFICATION_EMAIL_RESEND_COOLDOWN_MS,
} from '../constants/email.js';
import { sendVerificationEmail } from './email.service.js';
import ApiError from '../utils/apiError.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import {
  generateEmailVerificationToken,
  parseEmailVerificationToken,
} from '../utils/verificationToken.js';

const buildVerificationUrl = (plainToken) => {
  const url = new URL('/verify-email', env.clientUrl);
  url.searchParams.set('token', plainToken);
  return url.toString();
};

const assignVerificationToken = async (user) => {
  const plainToken = generateEmailVerificationToken(user._id.toString());

  user.emailVerificationTokenHash = await hashPassword(plainToken);
  user.emailVerificationTokenExpiresAt = new Date(
    Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_MS
  );
  user.lastVerificationEmailSentAt = new Date();
  await user.save({ validateBeforeSave: false });

  return plainToken;
};

const sendVerificationEmailToUser = async (user) => {
  const plainToken = await assignVerificationToken(user);
  const verificationUrl = buildVerificationUrl(plainToken);

  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    verificationUrl,
  });
};

const verifyEmailWithToken = async (plainToken) => {
  const parsed = parseEmailVerificationToken(plainToken);

  if (!parsed) {
    throw ApiError.badRequest('Invalid verification token');
  }

  const user = await User.findById(parsed.userId).select('+emailVerificationTokenHash');

  if (!user) {
    throw ApiError.badRequest('Invalid verification token');
  }

  if (user.isEmailVerified) {
    throw ApiError.badRequest('Email is already verified');
  }

  if (!user.emailVerificationTokenHash || !user.emailVerificationTokenExpiresAt) {
    throw ApiError.badRequest('Invalid or expired verification token');
  }

  if (user.emailVerificationTokenExpiresAt.getTime() < Date.now()) {
    throw ApiError.badRequest('Verification token has expired');
  }

  const isTokenValid = await comparePassword(plainToken, user.emailVerificationTokenHash);

  if (!isTokenValid) {
    throw ApiError.badRequest('Invalid verification token');
  }

  user.isEmailVerified = true;
  user.emailVerifiedAt = new Date();
  user.emailVerificationTokenHash = null;
  user.emailVerificationTokenExpiresAt = null;
  await user.save({ validateBeforeSave: false });

  return user;
};

const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw ApiError.notFound('No account found with this email address');
  }

  if (user.isEmailVerified) {
    throw ApiError.badRequest('Email is already verified');
  }

  if (user.lastVerificationEmailSentAt) {
    const elapsed = Date.now() - user.lastVerificationEmailSentAt.getTime();

    if (elapsed < VERIFICATION_EMAIL_RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil(
        (VERIFICATION_EMAIL_RESEND_COOLDOWN_MS - elapsed) / 1000
      );
      throw ApiError.badRequest(
        `Please wait ${waitSeconds} seconds before requesting another verification email`
      );
    }
  }

  await sendVerificationEmailToUser(user);
};

export {
  sendVerificationEmailToUser,
  verifyEmailWithToken,
  resendVerificationEmail,
};
