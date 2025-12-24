# Installation & Deployment Guide

## Quick Installation

### Option 1: Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Start development server
npm run dev
```

Your API will be running at `http://localhost:3000`

### Option 2: Docker Deployment (Recommended for Production)

```bash
# Single command deployment with 2 API instances + Redis + Nginx
npm run docker:up
```

Your load-balanced API will be running at `http://localhost` (port 80)

## What Gets Installed

### npm install creates:
- `node_modules/` - All project dependencies
- `package-lock.json` - Dependency lock file

### First run creates:
- `data/` - SQLite database directory
  - `database.sqlite` - Main database file
  - `database.sqlite-wal` - Write-Ahead Log
  - `database.sqlite-shm` - Shared memory file
- `logs/` - Application logs
  - `app-YYYY-MM-DD.log` - Daily application logs
  - `error-YYYY-MM-DD.log` - Daily error logs
  - `exceptions.log` - Uncaught exceptions
  - `rejections.log` - Unhandled promise rejections

## Directory Structure After Installation

```
backend-api/
├── node_modules/          # Dependencies (created by npm install)
├── data/                  # Database files (auto-created)
│   ├── database.sqlite
│   ├── database.sqlite-wal
│   └── database.sqlite-shm
├── logs/                  # Log files (auto-created)
│   ├── app-2025-12-24.log
│   ├── error-2025-12-24.log
│   ├── exceptions.log
│   └── rejections.log
├── public/                # Static files
│   └── index.html        # Test dashboard
├── src/                   # Source code
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   └── utils/
├── .env                   # Your environment config (you create this)
├── .env.example           # Environment template
├── package.json
└── README.md
```

## Environment Configuration

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_PATH=./data/database.sqlite

# Redis
REDIS_URL=redis://localhost:6379

# JWT - CHANGE THIS IN PRODUCTION!
JWT_SECRET=super_secret_jwt_key_change_me

# Logging
LOG_LEVEL=info
```

## Testing the Installation

### 1. Run the setup check script
```bash
./setup-check.sh
```

### 2. Start the server
```bash
npm run dev
```

### 3. Test the health endpoint
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "pid": 12345
}
```

### 4. Access the Dashboard
Open your browser and navigate to:
- **Local Development**: `http://localhost:3000/`
- **Docker Deployment**: `http://localhost/`

### 5. View API Documentation
- **Local Development**: `http://localhost:3000/api-docs`
- **Docker Deployment**: `http://localhost/api-docs`

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Redis Connection Error
If you see "Redis Client Error", make sure Redis is running:
```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Install Redis (macOS)
brew install redis

# Start Redis
redis-server
```

For development, you can also use Docker Redis:
```bash
docker run -d -p 6379:6379 redis:alpine
```

### SQLite Database Locked
If you see "SQLITE_BUSY" errors:
- Check if another process is using the database
- The app will auto-retry up to 5 times
- WAL mode should prevent most locking issues

### Docker Issues
```bash
# Check Docker logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Rebuild from scratch
docker-compose down
docker-compose up -d --build --scale api=2
```

## Production Deployment Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production` in .env
- [ ] Configure proper Redis instance (not localhost)
- [ ] Set up SSL/TLS certificates for HTTPS
- [ ] Configure firewall rules
- [ ] Set up database backup strategy
- [ ] Configure log rotation and monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Review and adjust rate limits
- [ ] Enable Docker restart policies
- [ ] Set up health check monitoring

## Stopping the Application

### Local Development
Press `Ctrl+C` in the terminal

### Docker
```bash
# Stop containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop, remove, and clean volumes
docker-compose down -v
```

## Next Steps

1. Read the [README.md](README.md) for API usage examples
2. Test the API using the web dashboard
3. Explore the [Swagger documentation](http://localhost/api-docs)
4. Review the code structure in `src/`
5. Customize and extend for your needs

## Support

For issues or questions:
1. Check the logs in `logs/` directory
2. Review error messages in the console
3. Consult the README.md documentation
4. Check the Swagger API docs for endpoint details
