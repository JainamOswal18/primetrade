import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

// Destructure formatters
const { combine, timestamp, json, printf, colorize, errors, splat } = winston.format;

// Custom format for local development (human readable)
const consoleFormat = printf(({ level, message, timestamp, stack,...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (stack) msg += `\n${stack}`;
    if (Object.keys(metadata).length > 0) msg += ` ${JSON.stringify(metadata)}`;
    return msg;
});

// Production format (machine readable JSON)
const productionFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Include stack trace in error logs
    splat(),
    json()
);

// Rotation Strategy: Rotate logs daily to prevent disk saturation
const transportFileRotate = new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Compress old logs to save space
    maxSize: '20m',      // Rotate if file exceeds 20MB
    maxFiles: '14d',     // Keep logs for 14 days
    level: 'info'
});

const transportErrorRotate = new winston.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error' // Separate file for errors
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: productionFormat,
    defaultMeta: { service: 'backend-api' },
    transports: [transportFileRotate, transportErrorRotate],
    // Handle uncaught exceptions and promise rejections
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log' })
    ]
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(),
            consoleFormat
        )
    }));
}

export default logger;
