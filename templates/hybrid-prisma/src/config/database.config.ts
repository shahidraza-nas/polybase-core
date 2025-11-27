import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { logger } from '../core/utils/logger.util.js';

class Database {
  private static prismaInstance: PrismaClient;

  // SQL Database (Prisma)
  static getPrismaInstance(): PrismaClient {
    if (!Database.prismaInstance) {
      Database.prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        datasources: {
          db: {
            url: process.env.SQL_DATABASE_URL
          }
        }
      });
    }
    return Database.prismaInstance;
  }

  static async connectPrisma(): Promise<void> {
    try {
      const prisma = this.getPrismaInstance();
      await prisma.$connect();
      logger.info('SQL Database (Prisma) connected successfully');
    } catch (error) {
      logger.error('SQL Database connection failed', error);
      throw error;
    }
  }

  // NoSQL Database (MongoDB)
  static async connectMongo(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGO_DATABASE_URL || '');
      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.error('MongoDB connection failed', error);
      throw error;
    }
  }

  // Connect both databases
  static async connect(): Promise<void> {
    await Promise.all([
      this.connectPrisma(),
      this.connectMongo()
    ]);
  }

  // Disconnect both databases
  static async disconnect(): Promise<void> {
    try {
      const prisma = this.getPrismaInstance();
      await Promise.all([
        prisma.$disconnect(),
        mongoose.disconnect()
      ]);
      logger.info('All databases disconnected successfully');
    } catch (error) {
      logger.error('Database disconnection failed', error);
    }
  }
}

export const prisma = Database.getPrismaInstance();
export default Database;
