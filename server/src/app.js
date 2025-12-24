import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { limiter } from './middlewares/security.middleware.js';
import logger from './config/logger.js';

import authRoutes from './modules/auth/auth.routes.js';
import taskRoutes from './modules/tasks/task.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & Optimization
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(limiter); // Global Rate Limit

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Logging HTTP requests to Winston
app.use(morgan('combined', { stream: { write: message => logger.http(message.trim()) } }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK', pid: process.pid }));

// Global Error Handling
app.use(errorHandler);

export default app;
