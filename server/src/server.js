import 'dotenv/config';
import app from './app.js';
import logger from './config/logger.js';
import { sequelize, configureSQLite } from './config/database.js';
import redisClient from './config/redis.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // 1. Connect to Database
        await sequelize.authenticate();
        logger.info('Database connected.');
        
        // 2. Configure WAL Mode and Pragmas
        await configureSQLite();
        
        // 3. Sync Models (Ideally use Migrations in production)
        await sequelize.sync(); 

        // 4. Start Server
        const server = app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT} | Worker PID: ${process.pid}`);
        });

        // Graceful Shutdown
        const shutdown = async () => {
            logger.info('Shutting down server...');
            server.close(async () => {
                await sequelize.close();
                if (redisClient) {
                    await redisClient.quit();
                }
                logger.info('Resources released. Bye.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (error) {
        logger.error('Startup failed:', error);
        process.exit(1);
    }
};

startServer();
