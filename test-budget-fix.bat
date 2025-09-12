@echo off
echo 🧪 Testing Budget Persistence Fix...
echo ===================================
echo Budget Persistence Test Suite
echo ===================================

echo.
echo 📡 Backend Services:
echo Checking Backend API on port 5000...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Backend API Running
) else (
    echo ✗ Backend API Not Running
)

echo.
echo 🖥️  Frontend Services:
echo Checking Frontend Dev Server on port 5173...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Frontend Dev Server Running
) else (
    echo ✗ Frontend Dev Server Not Running
)

echo.
echo 🔍 API Endpoint Tests:

echo Testing Health Check...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Health Check API responding
) else (
    echo ✗ Health Check API not responding
)

echo Testing Budget API...
curl -s http://localhost:5000/api/budgets >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Budget API responding
) else (
    echo ✗ Budget API not responding
)

echo.
echo 📋 Pre-Flight Checklist:

echo Checking MongoDB Connection...
curl -s http://localhost:5000/api/test-db >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ MongoDB Available
) else (
    echo ✗ MongoDB Not Available
)

echo Checking Backend Environment...
if exist "backend\.env" (
    echo ✓ .env file found
) else (
    echo ⚠ .env file missing
)

echo.
echo 🎯 Test Instructions:
echo 1. Open http://localhost:5173
echo 2. Log in to the application
echo 3. Navigate to Budget page
echo 4. Create a new budget
echo 5. Refresh the page
echo 6. Verify budget persists
echo.
echo ✅ If all services are running, the budget persistence fix should work correctly!
echo 📄 See BUDGET_PERSISTENCE_FIX.md for detailed troubleshooting

pause