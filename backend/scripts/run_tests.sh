#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup database
cleanup_db() {
    echo "Cleaning up database..."
    mongosh --quiet --eval "db.getSiblingDB('delivery_app').users.deleteMany({})"
    mongosh --quiet --eval "db.getSiblingDB('delivery_app').restaurants.deleteMany({})"
    mongosh --quiet --eval "db.getSiblingDB('delivery_app').menuitems.deleteMany({})"
    mongosh --quiet --eval "db.getSiblingDB('delivery_app').orders.deleteMany({})"
    mongosh --quiet --eval "db.getSiblingDB('delivery_app').otps.deleteMany({})"
}

# Function to check if MongoDB is running
check_mongodb() {
    if ! mongosh --quiet --eval "db.runCommand({ ping: 1 })" >/dev/null 2>&1; then
        echo -e "${RED}MongoDB is not running. Please start MongoDB first.${NC}"
        exit 1
    fi
}

# Function to check required tools
check_requirements() {
    if ! command -v jq >/dev/null 2>&1; then
        echo -e "${RED}jq is not installed. Please install it with: brew install jq${NC}"
        exit 1
    fi
    if ! command -v mongosh >/dev/null 2>&1; then
        echo -e "${RED}mongosh is not installed. Please install it with: brew install mongosh${NC}"
        exit 1
    fi
}

# Function to kill the server and all its child processes
kill_server() {
    if [ -n "$SERVER_PID" ]; then
        echo "Killing server process tree..."
        pkill -P $SERVER_PID
        kill -9 $SERVER_PID
        # Kill any remaining node processes started by this script
        pkill -f "node.*backend/dist/index.js"
    fi
}

# Function to cleanup on script exit
cleanup() {
    echo "Cleaning up..."
    kill_server
    cleanup_db
    exit
}

# Check requirements first
check_requirements

# Check if MongoDB is running
check_mongodb

# Clean up database before starting
cleanup_db

# Set up cleanup trap for different signals
trap cleanup EXIT INT TERM

# Start backend server
echo "Starting backend server..."
cd backend
NODE_ENV=test npm run dev &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Run integration tests
echo -e "${YELLOW}Starting integration tests...${NC}"
./backend/scripts/integration_test.sh

# Store test result
TEST_RESULT=$?

# Cleanup and exit with test result
cleanup
exit $TEST_RESULT
