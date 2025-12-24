import logger from '../config/logger.js';

/**
 * Global Error Handler Middleware
 * Catches all errors passed via next(error) and formats them consistently
 */
export const errorHandler = (err, req, res, next) => {
    logger.error('Error caught by global handler:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};
