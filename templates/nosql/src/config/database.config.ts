import mongoose from 'mongoose';
import { logger } from '../core/utils/logger.util.js';

class Database {
  static async connect(): Promise<void> {
    try {
      await mongoose.connect(process.env.DATABASE_URL || '');
      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.error('MongoDB connection failed', error);
      process.exit(1);
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error('MongoDB disconnection failed', error);
    }
  }
}

export default Database;
