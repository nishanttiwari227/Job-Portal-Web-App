import { createClient } from 'redis';
import env from './env.js';
import logger from '../utils/logger.js';

const redisClient = createClient(
  env.redis.url ? { url: env.redis.url } : undefined
);

if (env.redis.url) {
  redisClient.on('error', (err) => logger.error(`Redis Client Error: ${err.message}`));
  redisClient.on('connect', () => logger.info('Redis Client: Connecting to cluster...'));
  redisClient.on('ready', () => logger.info('Redis Client: Connection established and ready.'));
}

export const connectRedis = async () => {
  if (!env.redis.url) {
    logger.info('Redis is not configured; skipping Redis connection.');
    return;
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;