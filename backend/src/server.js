import app from './app.js';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import logger from './utils/logger.js';
import env from './config/env.js';

const startServer = async () => {
  try {
    // Verify database connections during startup
    await connectDatabase();
    await connectRedis();

    const appInstance = app();
    const PORT = env.port || 5000;
    appInstance.listen(PORT, () => {
      logger.info(`Server cleanly executing on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Critical failure during server startup:', error);
    process.exit(1);
  }
};

startServer();