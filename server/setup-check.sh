#!/bin/bash

echo "🚀 PrimeTrade Backend Setup Verification"
echo "========================================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✓ Node.js $NODE_VERSION is installed"
else
    echo "✗ Node.js is not installed. Please install Node.js 20+"
    exit 1
fi

# Check npm
echo ""
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✓ npm $NPM_VERSION is installed"
else
    echo "✗ npm is not installed"
    exit 1
fi

# Check Docker
echo ""
echo "🐳 Checking Docker..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo "✓ $DOCKER_VERSION is installed"
else
    echo "⚠ Docker is not installed. Docker is optional but recommended."
fi

# Check Docker Compose
echo ""
echo "🐳 Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_VERSION=$(docker-compose --version)
    echo "✓ $DOCKER_COMPOSE_VERSION is installed"
else
    echo "⚠ Docker Compose is not installed. Docker Compose is optional but recommended."
fi

echo ""
echo "📁 Project Structure Check..."
REQUIRED_FILES=(
    "package.json"
    "Dockerfile"
    "docker-compose.yml"
    "nginx.conf"
    ".env.example"
    "src/server.js"
    "src/app.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file is missing"
    fi
done

echo ""
echo "✅ Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Copy .env.example to .env: cp .env.example .env"
echo "3. Start development server: npm run dev"
echo "   OR"
echo "3. Start with Docker: npm run docker:up"
echo ""
echo "For more information, see README.md"
