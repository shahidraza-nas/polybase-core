#!/bin/bash

# Test script to verify all templates generate correctly

set -e

echo "🧪 Testing Polycore CLI Template Generation"
echo "==========================================="

# Clean up test directories
cd /home/shahid/workspace/polycore.workspace
rm -rf test-sql-prisma test-sql-sequelize test-nosql test-hybrid-prisma test-hybrid-sequelize 2>/dev/null
echo "✓ Cleaned up old test directories"

# Test 1: SQL Prisma Template
echo ""
echo "📦 Test 1: Generating sql-prisma template..."
mkdir -p test-sql-prisma
cd polybase-core
cp -r templates/sql-prisma/* ../test-sql-prisma/
cd ../test-sql-prisma
echo "✓ SQL Prisma template files copied"

# Check auth files exist
if [ -f "src/modules/auth/auth.service.ts" ] && \
   [ -f "src/modules/auth/auth.controller.ts" ] && \
   [ -f "src/modules/auth/auth.routes.ts" ] && \
   [ -f "src/modules/auth/auth.dto.ts" ] && \
   [ -f "src/middlewares/auth.middleware.ts" ]; then
    echo "✓ Auth module files present"
else
    echo "✗ Auth module files missing"
    exit 1
fi

# Check package.json has required dependencies
if grep -q "jsonwebtoken" package.json && grep -q "express-rate-limit" package.json; then
    echo "✓ Required auth dependencies present"
else
    echo "✗ Required auth dependencies missing"
    exit 1
fi

# Check routes.ts has auth routes
if grep -q "authRoutes" src/routes.ts && grep -q "/auth" src/routes.ts; then
    echo "✓ Auth routes registered"
else
    echo "✗ Auth routes not registered"
    exit 1
fi

# Check app.ts has rate limiting
if grep -q "express-rate-limit" app.ts; then
    echo "✓ Rate limiting configured"
else
    echo "✗ Rate limiting missing"
    exit 1
fi

echo "✅ SQL Prisma template: PASSED"

# Test 2: SQL Sequelize Template
echo ""
echo "📦 Test 2: Generating sql-sequelize template..."
cd /home/shahid/workspace/polycore.workspace
mkdir -p test-sql-sequelize
cd polybase-core
cp -r templates/sql-sequelize/* ../test-sql-sequelize/
cd ../test-sql-sequelize

if [ -f "src/modules/auth/auth.service.ts" ] && \
   [ -f "src/middlewares/auth.middleware.ts" ] && \
   grep -q "jsonwebtoken" package.json && \
   grep -q "authRoutes" src/routes.ts && \
   grep -q "express-rate-limit" app.ts; then
    echo "✅ SQL Sequelize template: PASSED"
else
    echo "✗ SQL Sequelize template: FAILED"
    exit 1
fi

# Test 3: NoSQL Template
echo ""
echo "📦 Test 3: Generating nosql template..."
cd /home/shahid/workspace/polycore.workspace
mkdir -p test-nosql
cd polybase-core
cp -r templates/nosql/* ../test-nosql/
cd ../test-nosql

if [ -f "src/modules/auth/auth.service.ts" ] && \
   [ -f "src/middlewares/auth.middleware.ts" ] && \
   grep -q "jsonwebtoken" package.json && \
   grep -q "authRoutes" src/routes.ts && \
   grep -q "express-rate-limit" app.ts; then
    echo "✅ NoSQL template: PASSED"
else
    echo "✗ NoSQL template: FAILED"
    exit 1
fi

# Test 4: Hybrid Prisma Template
echo ""
echo "📦 Test 4: Generating hybrid-prisma template..."
cd /home/shahid/workspace/polycore.workspace
mkdir -p test-hybrid-prisma
cd polybase-core
cp -r templates/hybrid-prisma/* ../test-hybrid-prisma/
cd ../test-hybrid-prisma

if [ -f "src/modules/auth/auth.service.ts" ] && \
   [ -f "src/middlewares/auth.middleware.ts" ] && \
   grep -q "jsonwebtoken" package.json && \
   grep -q "authRoutes" src/routes.ts && \
   grep -q "express-rate-limit" app.ts; then
    echo "✅ Hybrid Prisma template: PASSED"
else
    echo "✗ Hybrid Prisma template: FAILED"
    exit 1
fi

# Test 5: Hybrid Sequelize Template
echo ""
echo "📦 Test 5: Generating hybrid-sequelize template..."
cd /home/shahid/workspace/polycore.workspace
mkdir -p test-hybrid-sequelize
cd polybase-core
cp -r templates/hybrid-sequelize/* ../test-hybrid-sequelize/
cd ../test-hybrid-sequelize

if [ -f "src/modules/auth/auth.service.ts" ] && \
   [ -f "src/middlewares/auth.middleware.ts" ] && \
   grep -q "jsonwebtoken" package.json && \
   grep -q "authRoutes" src/routes.ts && \
   grep -q "express-rate-limit" app.ts; then
    echo "✅ Hybrid Sequelize template: PASSED"
else
    echo "✗ Hybrid Sequelize template: FAILED"
    exit 1
fi

echo ""
echo "=========================================="
echo "🎉 All 5 templates verified successfully!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  ✅ sql-prisma - Auth module, JWT, rate limiting"
echo "  ✅ sql-sequelize - Auth module, JWT, rate limiting"
echo "  ✅ nosql - Auth module, JWT, rate limiting"
echo "  ✅ hybrid-prisma - Auth module, JWT, rate limiting"
echo "  ✅ hybrid-sequelize - Auth module, JWT, rate limiting"
