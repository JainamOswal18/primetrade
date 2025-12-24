import { createClient } from 'redis';
import logger from './logger.js';

let redisClient = null;

try {
    redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
            connectTimeout: 5000,
            reconnectStrategy: false // Don't retry if fails initially
        }
    });

    redisClient.on('error', (err) => {
        if (err.code !== 'ECONNREFUSED') {
            logger.error('Redis Client Error', err);
        }
    });
    
    redisClient.on('connect', () => logger.info('✓ Redis Connected'));

    // Try to connect, but don't fail if Redis is unavailable
    await redisClient.connect();
    
} catch (error) {
    logger.warn('⚠ Redis unavailable - Running without cache (this is fine for development)');
    redisClient = null;
}

export default redisClient;
