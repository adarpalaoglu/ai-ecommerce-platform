#!/bin/bash

# This script automates the startup of the development environment for the e-commerce application.
# It handles stopping old processes, starting the backend and frontend servers, and opening the application.

# --- Configuration ---
FRONTEND_PORT=3000
BACKEND_PORT=8000
STARTUP_WAIT_TIME=15 # Seconds to wait for servers to initialize

# --- Script Body ---
echo "Starting the e-commerce development environment..."

# Stop any processes that may be running on the required ports to avoid conflicts.
# This prevents the "Address already in use" errors.
echo "--> Checking for and stopping processes on ports $FRONTEND_PORT and $BACKEND_PORT..."
lsof -ti:$FRONTEND_PORT | xargs kill -9 2>/dev/null
lsof -ti:$BACKEND_PORT | xargs kill -9 2>/dev/null
echo "--> Port cleanup complete."

# Start the backend API server (Uvicorn) in the background.
echo "--> Starting backend API server on port $BACKEND_PORT..."
uvicorn apps.api.src.main:app --reload --host 0.0.0.0 --port $BACKEND_PORT &

# Start the frontend development server (React) in the background.
echo "--> Starting frontend development server on port $FRONTEND_PORT..."
npm start --prefix apps/web &

# Wait for the servers to initialize before opening the browser.
echo "--> Waiting $STARTUP_WAIT_TIME seconds for servers to come online..."
sleep $STARTUP_WAIT_TIME

# Open the application in the default web browser (works on macOS).
echo "--> Opening application in browser at http://localhost:$FRONTEND_PORT"
open http://localhost:$FRONTEND_PORT

echo ""
echo "✅ Development environment is up and running."
echo "   - Frontend should be available at http://localhost:$FRONTEND_PORT"
echo "   - Backend API is running on http://localhost:$BACKEND_PORT"
