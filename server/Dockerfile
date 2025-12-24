FROM node:20-alpine

WORKDIR /app

# Install dependencies first (caching layer)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Create data directory for SQLite
RUN mkdir -p data logs

EXPOSE 3000

CMD ["node", "src/server.js"]
