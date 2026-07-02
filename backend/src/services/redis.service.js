import redisClient from '../config/redis.js';
import logger from '../utils/logger.js';

const BASE_PREFIX = 'job_portal:';

/**
 * Generic Caching: Store a key-value pair with an expiration time.
 */
const set = async (key, value, ttlInSeconds = 3600) => {
  try {
    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
    await redisClient.set(`${BASE_PREFIX}cache:${key}`, serializedValue, {
      EX: ttlInSeconds,
    });
  } catch (error) {
    logger.error(`Redis SET execution failed for key [${key}]: ${error.message}`);
  }
};

/**
 * Generic Caching: Retrieve and parse data from cache.
 */
const get = async (key) => {
  try {
    const rawData = await redisClient.get(`${BASE_PREFIX}cache:${key}`);
    if (!rawData) return null;

    try {
      return JSON.parse(rawData);
    } catch {
      return rawData;
    }
  } catch (error) {
    logger.error(`Redis GET execution failed for key [${key}]: ${error.message}`);
    return null;
  }
};

/**
 * Generic Caching: Evict an item from cache by key.
 */
const del = async (key) => {
  try {
    await redisClient.del(`${BASE_PREFIX}cache:${key}`);
  } catch (error) {
    logger.error(`Redis DEL execution failed for key [${key}]: ${error.message}`);
  }
};

/**
 * Token Blacklist: Drop a compromised/logged-out JWT token into the blacklist block.
 */
const blacklistToken = async (token, ttlInSeconds) => {
  try {
    await redisClient.set(`${BASE_PREFIX}blacklist:${token}`, 'true', {
      EX: ttlInSeconds,
    });
  } catch (error) {
    logger.error(`Redis Token Blacklist storage failed: ${error.message}`);
  }
};

/**
 * Token Blacklist: Check if a token currently exists within the blacklist.
 */
const isTokenBlacklisted = async (token) => {
  try {
    const exists = await redisClient.get(`${BASE_PREFIX}blacklist:${token}`);
    return exists === 'true';
  } catch (error) {
    logger.error(`Redis Blacklist evaluation failed: ${error.message}`);
    return false;
  }
};

/**
 * Rate Limiting Atomic Counter: Atomically increments requests and sets an expiry on the first hit.
 */
const increment = async (key, ttlInSeconds) => {
  try {
    const rateLimitKey = `${BASE_PREFIX}rate_limit:${key}`;
    const currentHits = await redisClient.incr(rateLimitKey);

    if (currentHits === 1) {
      await redisClient.expire(rateLimitKey, ttlInSeconds);
    }

    return currentHits;
  } catch (error) {
    logger.error(`Redis INCR execution failed for rate limit key [${key}]: ${error.message}`);
    return 0; 
  }
};

export const redisService = {
  set,
  get,
  del,
  blacklistToken,
  isTokenBlacklisted,
  increment,
};