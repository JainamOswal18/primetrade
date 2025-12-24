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
