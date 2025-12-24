# High-Performance Node.js & SQLite Enterprise API

A production-grade REST API featuring SQLite with WAL mode for high concurrency, Redis caching, Docker containerization, and Nginx load balancing.

## 🏗️ Architecture

- **Backend Framework**: Express.js (Node 20+ with ESM)
- **Database**: SQLite with WAL (Write-Ahead Logging) mode
- **Caching**: Redis for response caching
- **Load Balancer**: Nginx (Round-robin distribution)
- **Containerization**: Docker with horizontal scaling support
- **Authentication**: JWT with role-based access control
- **API Documentation**: Swagger/OpenAPI 3.0

## 📁 Project Structure

```
backend-api/
├── .env.example              # Environment variables template
├── .gitignore
├── docker-compose.yml        # Orchestration for API, Redis, Nginx
├── Dockerfile                # Container build configuration
├── nginx.conf                # Nginx Load Balancer Config
├── package.json
├── public/
│   └── index.html           # Frontend testing dashboard
├── src/
│   ├── app.js               # Express App setup
│   ├── server.js            # Entry Point & Graceful Shutdown
│   ├── config/
│   │   ├── database.js      # SQLite Connection & WAL Config
│   │   ├── logger.js        # Winston Logger with rotation
│   │   ├── redis.js         # Redis Client
│   │   └── swagger.js       # API Documentation Config
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT Verification & RBAC
│   │   ├── cache.middleware.js     # Redis Caching
│   │   ├── error.middleware.js     # Global Error Handler
│   │   ├── security.middleware.js  # Rate Limiting
│   │   └── validate.middleware.js  # Joi Validator
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.schema.js
│   │   ├── tasks/
│   │   │   ├── task.controller.js
│   │   │   ├── task.model.js
│   │   │   ├── task.routes.js
│   │   │   └── task.schema.js
│   │   └── users/
│   │       └── user.model.js
│   └── utils/
│       └── apiResponse.js   # Standardized response helper
└── logs/                    # Auto-generated log files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for containerized deployment)

### Local Development

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Run Development Server**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Docker Deployment (Recommended)

**Start with 2 API instances + Redis + Nginx:**
```bash
npm run docker:up
```

This command:
- Builds the Docker image
- Scales the API to 2 instances
- Starts Redis cache
- Configures Nginx load balancer on port 80

**Access the application:**
- API: `http://localhost/api/v1`
- Dashboard: `http://localhost/`
- Swagger Docs: `http://localhost/api-docs`
- Health Check: `http://localhost/health`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Tasks (Protected)
- `GET /api/v1/tasks` - Get all tasks (cached for 60s)
- `POST /api/v1/tasks` - Create task (Admin only)
- `DELETE /api/v1/tasks/:id` - Delete task (Admin only)

### System
- `GET /health` - Health check
- `GET /api-docs` - Interactive API documentation

## 🔐 Authentication

All protected routes require a Bearer token:

```bash
Authorization: Bearer <your-jwt-token>
```

**User Roles:**
- `user` - Can view tasks
- `admin` - Full CRUD access

## 🎯 Key Features

### 1. High Concurrency SQLite
- **WAL Mode**: Allows concurrent reads during writes
- **Busy Timeout**: 5-second lock wait time
- **Optimized Cache**: 2MB in-memory cache
- **Auto-retry**: Up to 5 retries on SQLITE_BUSY errors

### 2. Redis Caching
- Named key-based caching strategy
- Configurable TTL per endpoint
- Automatic cache invalidation on mutations
- Graceful fallback if Redis fails

### 3. Security
- Helmet.js for security headers
- Rate limiting (100 req/15min per IP)
- JWT authentication with expiry
- Role-based access control (RBAC)
- Input validation with Joi

### 4. Logging
- Winston with daily log rotation
- Separate files for errors and application logs
- 14-day retention for app logs
- 30-day retention for error logs
- HTTP request logging via Morgan

### 5. Load Balancing
- Nginx reverse proxy
- Round-robin distribution
- Support for horizontal scaling
- Real IP forwarding for rate limiting

## 🧪 Testing the API

### Using the Dashboard
Open `http://localhost/` in your browser to access the interactive dashboard where you can:
- Register and login users
- Create, view, and delete tasks
- See real-time API responses

### Using cURL

**Register:**
```bash
curl -X POST http://localhost/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"secret123","role":"admin"}'
```

**Login:**
```bash
curl -X POST http://localhost/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```

**Get Tasks:**
```bash
curl http://localhost/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Task (Admin only):**
```bash
curl -X POST http://localhost/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task"}'
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT signing key | (required) |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |
| `LOG_LEVEL` | Logging level | info |

### Docker Scaling

Scale to more instances:
```bash
docker-compose up -d --scale api=4
```

Check running containers:
```bash
docker-compose ps
```

View logs:
```bash
docker-compose logs -f api
```

## 📊 Performance Optimizations

1. **SQLite WAL Mode**: Enables concurrent reads during writes
2. **Redis Caching**: Reduces database load for frequent queries
3. **Compression**: Gzip compression for responses
4. **Connection Pooling**: Optimized for SQLite single-writer limitation
5. **Graceful Shutdown**: Clean resource cleanup on termination

## 🛡️ Production Considerations

- [ ] Use environment-specific `.env` files
- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Enable HTTPS with SSL certificates
- [ ] Implement database migrations instead of `sequelize.sync()`
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy for SQLite database
- [ ] Review and adjust rate limits based on usage
- [ ] Implement request timeouts
- [ ] Add comprehensive error tracking (e.g., Sentry)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
