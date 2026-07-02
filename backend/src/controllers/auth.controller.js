import HTTP_STATUS from '../constants/httpStatus.js';
import { REFRESH_TOKEN_COOKIE } from '../constants/auth.js';
import {
  getClearRefreshTokenCookieOptions,
  getRefreshTokenCookieOptions,
} from '../config/cookies.js';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAuthTokens,
  registerUser,
} from '../services/auth.service.js';
import {
  resendVerificationEmail,
  verifyEmailWithToken,
} from '../services/emailVerification.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

const buildAuthResponse = (user, accessToken) => ({
  user: user.toPublicJSON(),
  accessToken,
});

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, getRefreshTokenCookieOptions());
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, getClearRefreshTokenCookieOptions());
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const { user } = await registerUser({
    name,
    email,
    password,
    role,
  });

  sendSuccess(
    res,
    HTTP_STATUS.CREATED,
    'Registration successful. Please check your email to verify your account.',
    { user: user.toPublicJSON() }
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await loginUser({ email, password });

  setRefreshTokenCookie(res, refreshToken);

  sendSuccess(res, HTTP_STATUS.OK, 'Login successful', buildAuthResponse(user, accessToken));
});

const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user.userId);
  clearRefreshTokenCookie(res);

  sendSuccess(res, HTTP_STATUS.OK, 'Logout successful');
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies[REFRESH_TOKEN_COOKIE];
  const { user, accessToken, refreshToken: newRefreshToken } = await refreshAuthTokens(token);

  setRefreshTokenCookie(res, newRefreshToken);

  sendSuccess(res, HTTP_STATUS.OK, 'Token refreshed successfully', buildAuthResponse(user, accessToken));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.userId);

  sendSuccess(res, HTTP_STATUS.OK, 'User profile fetched successfully', {
    user: user.toPublicJSON(),
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const user = await verifyEmailWithToken(token);

  sendSuccess(res, HTTP_STATUS.OK, 'Email verified successfully', {
    user: user.toPublicJSON(),
  });
});

const resendVerificationEmailHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await resendVerificationEmail(email);

  sendSuccess(res, HTTP_STATUS.OK, 'Verification email sent successfully');
});

export {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  verifyEmail,
  resendVerificationEmailHandler,
};
