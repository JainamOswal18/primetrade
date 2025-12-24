# PrimeTrade - High-Performance Task Management System

> **Production-grade RESTful API with Node.js, SQLite WAL mode, Redis caching, and Docker orchestration**

## 📖 Overview

PrimeTrade is a high-performance, horizontally scalable backend architecture that demonstrates advanced engineering patterns. This project showcases SQLite optimization through Write-Ahead Logging (WAL), distributed caching with Redis, stateless JWT authentication, and container orchestration—all following production-ready best practices.

**🎯 For detailed technical architecture, performance benchmarks, and design decisions, see [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)**

---

## ⚡ Quick Start

### Automated Setup (Recommended)

```bash
chmod +x setup.sh
./setup.sh
```

**What it does:**
1. ✅ Creates `.env` files with development values
2. ✅ Installs all dependencies (server + client)
3. ✅ Prompts to auto-start both servers
4. ✅ Creates `stop.sh` for easy shutdown

Press **Y** or **Enter** when prompted to start servers automatically!

### Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Docs:** http://localhost:3000/api-docs (Swagger UI)
- **Health Check:** http://localhost:3000/health

---

## 🔧 Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

### Server Setup

```bash
cd server
cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
EOF
bun install
bun run dev
```

### Client Setup

```bash
cd client
bun install
bun run dev
```

</details>

---

## 📚 API Endpoints

## 📡 API Overview

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Tasks (Protected)
- `GET /api/v1/tasks` - Get all tasks (cached 60s)
- `POST /api/v1/tasks` - Create task (Admin only)
- `PUT /api/v1/tasks/:id` - Update task (Admin only)
- `DELETE /api/v1/tasks/:id` - Delete task (Admin only)

**Full API documentation available at:** http://localhost:3000/api-docs

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js 20+, Express.js 4.19 |
| **Database** | SQLite 3 with WAL mode, Sequelize ORM |
| **Cache** | Redis 4.6 (optional, graceful fallback) |
| **Auth** | JWT, bcrypt (10 salt rounds) |
| **Frontend** | React 19.2, Vite 7.3, Tailwind CSS |
| **Validation** | Joi schemas |
| **Logging** | Winston with daily rotation |
| **Docs** | Swagger/OpenAPI 3.0 |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 📁 Project Structure

```
PrimeTrade/
├── setup.sh                    # Automated setup script
├── stop.sh                     # Stop all servers
├── README.md                   # This file (Quick start)
├── TECHNICAL_DOCUMENTATION.md  # Detailed technical guide
├── server/
│   ├── src/
│   │   ├── config/            # DB, Redis, Logger, Swagger
│   │   ├── middlewares/       # Auth, Cache, Validation, Security
│   │   ├── modules/           # Domain-driven modules
│   │   │   ├── auth/          # Authentication domain
│   │   │   ├── tasks/         # Task management domain
│   │   │   └── users/         # User management domain
│   │   ├── app.js             # Express configuration
│   │   └── server.js          # Entry point
│   ├── docker-compose.yml     # Container orchestration
│   └── package.json
└── client/
    ├── src/
    │   ├── App.jsx            # Main React component
    │   └── main.jsx
    └── package.json
```

---

## ⚠️ Important Notes

1. **JWT Secret:** Change `JWT_SECRET` in production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Redis:** Optional—app works without Redis (caching disabled)

3. **Database:** SQLite file auto-created on first run

4. **Production:** Use Docker for deployment:
   ```bash
   cd server && docker-compose up -d --build --scale api=2
   ```

---

## 💻 Development Commands

```bash
# Stop servers
./stop.sh

# View logs
tail -f server.log    # Backend logs
tail -f client.log    # Frontend logs

# Manual restart
cd server && bun run dev    # Terminal 1
cd client && bun run dev    # Terminal 2

# Docker deployment
cd server && docker-compose up -d --build --scale api=2
```

---

## 🏗️ Architecture Highlights

- **SQLite WAL Mode:** Enables concurrent readers + single writer (4,000 writes/sec)
- **Redis Caching:** Cache-aside pattern with 60s TTL (25x faster responses)
- **JWT + RBAC:** Stateless authentication with role-based authorization
- **Docker + Nginx:** Horizontal scaling with load balancing
- **Winston Logging:** Structured JSON logs with daily rotation
- **Swagger Docs:** Interactive API documentation

**📚 For in-depth technical details, see [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)**

---

## 🐛 Troubleshooting

```bash
# Port already in use
lsof -ti:3000 | xargs kill -9

# Clean install
rm -rf node_modules && bun install

# Reset database
rm server/database.sqlite && cd server && bun run dev
```

---

## 📚 Documentation

- **Quick Start:** This README
- **Technical Details:** [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)
  - Architecture deep dive
  - Performance benchmarks
  - Security implementation
  - Design patterns
  - Scalability roadmap
- **API Reference:** http://localhost:3000/api-docs (when running)

---

## 📄 License

MIT

---

**Built with ❤️ to demonstrate production-ready backend engineering**