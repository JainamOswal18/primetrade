import morgan from 'morgan';
import logger from '../config/logger.js';

// Stream interface to pipe Morgan output to Winston
const stream = {
    write: (message) => logger.http(message.trim()),
};

// Skip logging for health checks to reduce noise
const skip = (req, res) => {
    return req.url === '/health';
};

// Morgan configuration
const httpLogger = morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms',
    { stream, skip }
);

export default httpLogger;
