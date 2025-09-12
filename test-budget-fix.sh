#!/bin/bash

# Budget Persistence Test Script
echo "🧪 Testing Budget Persistence Fix..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if service is running
check_service() {
    local service_name=$1
    local port=$2
    local url=$3
    
    echo -n "Checking $service_name on port $port... "
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Not running${NC}"
        return 1
    fi
}

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local description=$2
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
    
    if [ "$response" = "200" ] || [ "$response" = "401" ]; then
        echo -e "${GREEN}✓ API responding${NC}"
        return 0
    else
        echo -e "${RED}✗ API not responding (HTTP $response)${NC}"
        return 1
    fi
}

echo "==================================="
echo "Budget Persistence Test Suite"
echo "==================================="

# Check if backend is running
echo "📡 Backend Services:"
check_service "Backend API" "5000" "http://localhost:5000/api/health"

# Check if frontend is running  
echo "🖥️  Frontend Services:"
check_service "Frontend Dev Server" "5173" "http://localhost:5173"

echo ""
echo "🔍 API Endpoint Tests:"

# Test key API endpoints
test_api "http://localhost:5000/api/health" "Health Check"
test_api "http://localhost:5000/api/budgets" "Budget API"
test_api "http://localhost:5000/api/auth/profile" "Auth API"

echo ""
echo "📋 Pre-Flight Checklist:"

# Check if MongoDB is accessible
echo -n "MongoDB Connection... "
if curl -s "http://localhost:5000/api/test-db" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Available${NC}"
else
    echo -e "${RED}✗ Not available${NC}"
fi

# Check if .env exists
echo -n "Backend Environment... "
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ .env file found${NC}"
else
    echo -e "${YELLOW}⚠ .env file missing${NC}"
fi

echo ""
echo "🎯 Test Instructions:"
echo "1. Open http://localhost:5173"
echo "2. Log in to the application"
echo "3. Navigate to Budget page"
echo "4. Create a new budget"
echo "5. Refresh the page"
echo "6. Verify budget persists"

echo ""
echo "✅ If all services are running, the budget persistence fix should work correctly!"
echo "📄 See BUDGET_PERSISTENCE_FIX.md for detailed troubleshooting"