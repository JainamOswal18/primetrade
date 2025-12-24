#!/bin/bash

# PrimeTrade Setup Script
# This script sets up the entire application with dummy environment values

set -e  # Exit on error

echo "🚀 PrimeTrade Setup Script"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo -e "${YELLOW}⚠️  Bun is not installed. Installing Bun...${NC}"
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
fi

echo -e "${BLUE}📦 Step 1: Creating environment files${NC}"

# Create server .env file
cat > server/.env << 'EOF'
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# Redis Configuration (Optional - will fallback gracefully if not available)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
EOF

echo -e "${GREEN}✅ Created server/.env${NC}"

# Create client .env file (if needed)
cat > client/.env << 'EOF'
# Vite automatically prefixes VITE_ variables
VITE_API_URL=http://localhost:3000/api/v1
EOF

echo -e "${GREEN}✅ Created client/.env${NC}"

echo ""
echo -e "${BLUE}📦 Step 2: Installing server dependencies${NC}"
cd server
bun install
echo -e "${GREEN}✅ Server dependencies installed${NC}"

echo ""
echo -e "${BLUE}📦 Step 3: Installing client dependencies${NC}"
cd ../client
bun install
echo -e "${GREEN}✅ Client dependencies installed${NC}"

cd ..

echo ""
echo -e "${BLUE}🗄️  Step 4: Setting up database${NC}"
echo -e "${YELLOW}SQLite database will be created automatically on first run${NC}"
echo -e "${GREEN}✅ Database setup ready${NC}"

echo ""
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo ""

# Ask if user wants to start servers
read -p "$(echo -e ${BLUE}Start development servers now? [Y/n]: ${NC})" -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
    echo ""
    echo -e "${BLUE}🚀 Step 5: Starting development servers${NC}"
    echo ""
    
    # Create a PID file directory
    mkdir -p .pids
    
    # Start backend server
    echo -e "${YELLOW}Starting backend server on port 3000...${NC}"
    cd server
    bun run dev > ../server.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > ../.pids/server.pid
    cd ..
    echo -e "${GREEN}✅ Backend server started (PID: $SERVER_PID)${NC}"
    
    # Wait a moment for server to initialize
    sleep 2
    
    # Start frontend
    echo -e "${YELLOW}Starting frontend on port 5173...${NC}"
    cd client
    bun run dev > ../client.log 2>&1 &
    CLIENT_PID=$!
    echo $CLIENT_PID > ../.pids/client.pid
    cd ..
    echo -e "${GREEN}✅ Frontend started (PID: $CLIENT_PID)${NC}"
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${GREEN}🎉 Application is running!${NC}"
    echo ""
    echo -e "${BLUE}Access Points:${NC}"
    echo -e "  Frontend: ${YELLOW}http://localhost:5173${NC}"
    echo -e "  Backend:  ${YELLOW}http://localhost:3000${NC}"
    echo -e "  API Docs: ${YELLOW}http://localhost:3000/api-docs${NC}"
    echo ""
    echo -e "${BLUE}Logs:${NC}"
    echo -e "  Backend:  ${YELLOW}tail -f server.log${NC}"
    echo -e "  Frontend: ${YELLOW}tail -f client.log${NC}"
    echo ""
    echo -e "${BLUE}Stop Servers:${NC}"
    echo -e "  ${YELLOW}./stop.sh${NC} or ${YELLOW}kill $SERVER_PID $CLIENT_PID${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Create stop script
    cat > stop.sh << 'STOPEOF'
#!/bin/bash
echo "🛑 Stopping PrimeTrade servers..."

if [ -f .pids/server.pid ]; then
    SERVER_PID=$(cat .pids/server.pid)
    if kill -0 $SERVER_PID 2>/dev/null; then
        kill $SERVER_PID
        echo "✅ Backend server stopped (PID: $SERVER_PID)"
    fi
    rm .pids/server.pid
fi

if [ -f .pids/client.pid ]; then
    CLIENT_PID=$(cat .pids/client.pid)
    if kill -0 $CLIENT_PID 2>/dev/null; then
        kill $CLIENT_PID
        echo "✅ Frontend stopped (PID: $CLIENT_PID)"
    fi
    rm .pids/client.pid
fi

echo "✨ All servers stopped"
STOPEOF
    
    chmod +x stop.sh
    
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${BLUE}📝 Manual Start:${NC}"
    echo ""
    echo "1. Start the backend server:"
    echo -e "   ${YELLOW}cd server && bun run dev${NC}"
    echo ""
    echo "2. In a new terminal, start the frontend:"
    echo -e "   ${YELLOW}cd client && bun run dev${NC}"
    echo ""
    echo "3. Access the application:"
    echo -e "   Frontend: ${YELLOW}http://localhost:5173${NC}"
    echo -e "   Backend:  ${YELLOW}http://localhost:3000${NC}"
    echo -e "   API Docs: ${YELLOW}http://localhost:3000/api-docs${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

echo ""
echo -e "${BLUE}🔐 Default Test Accounts:${NC}"
echo "After starting the server, you can register:"
echo -e "  - Admin user: Select 'Admin' role during signup"
echo -e "  - Regular user: Select 'User' role during signup"
echo ""
echo -e "${YELLOW}⚠️  Remember to change JWT_SECRET in production!${NC}"
echo ""
