import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import { logger } from '../core/utils/logger.util.js';

class Database {
  private static sqlInstance: Sequelize;

  // SQL Database
  static getSqlInstance(): Sequelize {
    if (!Database.sqlInstance) {
      Database.sqlInstance = new Sequelize(process.env.DATABASE_URL || '', {
        logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      });
    }
    return Database.sqlInstance;
  }

  static async connectSql(): Promise<void> {
    try {
      const sequelize = this.getSqlInstance();
      await sequelize.authenticate();
      logger.info('SQL Database (Sequelize) connected successfully');
    } catch (error) {
      logger.error('SQL Database connection failed', error);
      throw error;
    }
  }

  static async syncSql(): Promise<void> {
    try {
      const sequelize = this.getSqlInstance();
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      logger.info('SQL Database synchronized successfully');
    } catch (error) {
      logger.error('SQL Database synchronization failed', error);
    }
  }

  // NoSQL Database
  static async connectMongo(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGODB_URI || '');
      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.error('MongoDB connection failed', error);
      throw error;
    }
  }

  // Connect both databases
  static async connect(): Promise<void> {
    await Promise.all([
      this.connectSql(),
      this.connectMongo()
    ]);
    await this.syncSql();
  }

  // Disconnect both databases
  static async disconnect(): Promise<void> {
    try {
      const sequelize = this.getSqlInstance();
      await Promise.all([
        sequelize.close(),
        mongoose.disconnect()
      ]);
      logger.info('All databases disconnected successfully');
    } catch (error) {
      logger.error('Database disconnection failed', error);
    }
  }
}

// Export a getter function instead of instantiating immediately
export const getSequelize = () => Database.getSqlInstance();
export default Database;
