import redisClient from '../config/redis.js';
import logger from '../config/logger.js';

export const cache = (keyName, duration) => async (req, res, next) => {
    // Skip caching if Redis is not available
    if (!redisClient) {
        return next();
    }
    
    try {
        const data = await redisClient.get(keyName);
        if (data) {
            logger.debug(`Cache HIT: ${keyName}`);
            return res.status(200).json(JSON.parse(data));
        }
        
        // Hijack res.json to save cache
        const originalJson = res.json;
        res.json = (body) => {
            redisClient.set(keyName, JSON.stringify(body), { EX: duration });
            return originalJson.call(res, body);
        };
        next();
    } catch (err) {
        logger.error('Cache Error', err);
        next();
    }
};
