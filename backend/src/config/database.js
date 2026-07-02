import mongoose from 'mongoose';
import env from './env.js';

const connectDatabase = async () => {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(env.mongodbUri);

  return mongoose.connection;
};

const disconnectDatabase = async () => {
  await mongoose.disconnect();
};

export { connectDatabase, disconnectDatabase };
