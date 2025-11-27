import { PrismaClient } from '@prisma/client';
import { logger } from '../core/utils/logger.util.js';

class Database {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return Database.instance;
  }

  static async connect(): Promise<void> {
    try {
      const prisma = this.getInstance();
      await prisma.$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed', error);
      process.exit(1);
    }
  }

  static async disconnect(): Promise<void> {
    try {
      const prisma = this.getInstance();
      await prisma.$disconnect();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Database disconnection failed', error);
    }
  }
}

export const prisma = Database.getInstance();
export default Database;
