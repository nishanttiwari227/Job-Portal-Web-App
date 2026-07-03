import env from './env.js';
import { AUTH_COOKIE_PATH } from '../constants/auth.js';

const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  // FIX: Changed 'strict' to 'none' for production cross-domain cookies
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  path: AUTH_COOKIE_PATH,
});

const getClearRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  // FIX: Changed 'strict' to 'none' for production cross-domain cookies
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  path: AUTH_COOKIE_PATH,
});

export { getRefreshTokenCookieOptions, getClearRefreshTokenCookieOptions };