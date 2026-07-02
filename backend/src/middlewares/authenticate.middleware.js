import ApiError from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/jwt.js';

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Access token is required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      tokenVersion: decoded.tokenVersion,
    };

    next();
  } catch {
    return next(ApiError.unauthorized('Invalid or expired access token'));
  }
};

export default authenticate;
