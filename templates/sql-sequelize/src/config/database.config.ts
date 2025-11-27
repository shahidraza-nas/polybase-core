import { Sequelize } from 'sequelize';
import { logger } from '../core/utils/logger.util.js';

class Database {
  private static instance: Sequelize;

  static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Sequelize(process.env.DATABASE_URL || '', {
        logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      });
    }
    return Database.instance;
  }

  static async connect(): Promise<void> {
    try {
      const sequelize = this.getInstance();
      await sequelize.authenticate();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed', error);
      process.exit(1);
    }
  }

  static async disconnect(): Promise<void> {
    try {
      const sequelize = this.getInstance();
      await sequelize.close();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Database disconnection failed', error);
    }
  }

  static async sync(): Promise<void> {
    try {
      const sequelize = this.getInstance();
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      logger.info('Database synchronized successfully');
    } catch (error) {
      logger.error('Database synchronization failed', error);
    }
  }
}

// Export a getter function instead of instantiating immediately
export const getSequelize = () => Database.getInstance();
export default Database;
