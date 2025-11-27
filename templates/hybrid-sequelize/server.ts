import app from './app.js';
import Database, { config } from './src/config/index.js';
import { logger } from './src/core/index.js';

const startServer = async () => {
  try {
    // Connect to databases
    await Database.connect();

    // Start server
    app.listen(config.port, () => {
      logger.info(`Server is running on http://localhost:${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`SQL: Sequelize, NoSQL: MongoDB`);
      logger.info(`Health check: http://localhost:${config.port}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      await Database.disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      await Database.disconnect();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
