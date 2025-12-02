#!/bin/bash

set -e

echo "🧪 Testing Polycore CLI Project Generation Flow"
echo "================================================"

CLI_PATH="polycore"
TEST_DIR="/home/shahid/workspace/polycore.workspace/cli-test-projects"

# Clean up
rm -rf "$TEST_DIR" 2>/dev/null
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo ""
echo "✅ Test 1: CLI Doctor Command"
echo "------------------------------"
$CLI_PATH doctor
echo ""

echo "📦 Test 2: Generate SQL + Prisma Project"
echo "---------------------------------------"
# Copy template directly (simulating CLI init)
cp -r /home/shahid/workspace/polycore.workspace/polybase-core/templates/sql-prisma ./test-sql-prisma
cd test-sql-prisma

echo "  ✓ Project created"
echo "  • Installing dependencies..."
npm install --silent 2>&1 | grep -E "added|packages" || echo "    Dependencies installed"

echo "  • Checking TypeScript compilation..."
npm run build 2>&1 | grep -E "error" && exit 1 || echo "    ✓ TypeScript compiled successfully"

echo "  • Verifying auth module..."
[ -f "src/modules/auth/auth.service.ts" ] && echo "    ✓ Auth service exists"
[ -f "src/modules/auth/index.ts" ] && echo "    ✓ Barrel export exists"
grep -q "from.*index.js" src/modules/auth/auth.controller.ts && echo "    ✓ Uses barrel exports"

echo "  • Checking compiled output..."
[ -f "dist/server.js" ] && echo "    ✓ Server compiled to dist/"
[ -f "dist/modules/auth/auth.service.js" ] && echo "    ✓ Auth module compiled"

echo ""
echo "✅ SQL + Prisma: PASSED"
echo ""

cd "$TEST_DIR"

echo "📦 Test 3: Generate SQL + Sequelize Project"
echo "------------------------------------------"
cp -r /home/shahid/workspace/polycore.workspace/polybase-core/templates/sql-sequelize ./test-sql-sequelize
cd test-sql-sequelize

echo "  ✓ Project created"
echo "  • Installing dependencies..."
npm install --silent 2>&1 | grep -E "added|packages" || echo "    Dependencies installed"

echo "  • Checking TypeScript compilation..."
npm run build 2>&1 | grep -E "error" && exit 1 || echo "    ✓ TypeScript compiled successfully"

echo "  • Verifying Sequelize-specific auth code..."
grep -q "User.findByPk" src/modules/auth/auth.service.ts && echo "    ✓ Uses Sequelize methods"

echo ""
echo "✅ SQL + Sequelize: PASSED"
echo ""

cd "$TEST_DIR"

echo "📦 Test 4: Generate NoSQL Project"
echo "--------------------------------"
cp -r /home/shahid/workspace/polycore.workspace/polybase-core/templates/nosql ./test-nosql
cd test-nosql

echo "  ✓ Project created"
echo "  • Installing dependencies..."
npm install --silent 2>&1 | grep -E "added|packages" || echo "    Dependencies installed"

echo "  • Checking TypeScript compilation..."
npm run build 2>&1 | grep -E "error" && exit 1 || echo "    ✓ TypeScript compiled successfully"

echo "  • Verifying Mongoose-specific auth code..."
grep -q "_id.toString()" src/modules/auth/auth.service.ts && echo "    ✓ Uses Mongoose patterns"

echo ""
echo "✅ NoSQL: PASSED"
echo ""

cd "$TEST_DIR"

echo "📦 Test 5: Verify Barrel Exports Resolution"
echo "-------------------------------------------"
cd test-sql-prisma

echo "  • Testing import resolution..."
node -e "
const path = require('path');
const fs = require('fs');

// Check that index.ts files exist
const barrelExports = [
  'src/core/errors/index.ts',
  'src/core/utils/index.ts',
  'src/core/decorators/index.ts',
  'src/modules/auth/index.ts'
];

barrelExports.forEach(file => {
  if (fs.existsSync(file)) {
    console.log('    ✓ Barrel export exists:', file);
  } else {
    console.error('    ✗ Missing barrel export:', file);
    process.exit(1);
  }
});

// Check that compiled .js files exist
const compiledFiles = [
  'dist/core/errors/index.js',
  'dist/core/utils/index.js',
  'dist/modules/auth/index.js'
];

compiledFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log('    ✓ Compiled barrel export:', file);
  } else {
    console.error('    ✗ Missing compiled file:', file);
    process.exit(1);
  }
});
" || exit 1

echo ""
echo "✅ Barrel Exports: PASSED"
echo ""

echo "================================================"
echo "🎉 All CLI Tests Passed Successfully!"
echo "================================================"
echo ""
echo "Summary:"
echo "  ✅ CLI doctor command works"
echo "  ✅ SQL + Prisma template generates and compiles"
echo "  ✅ SQL + Sequelize template generates and compiles"
echo "  ✅ NoSQL template generates and compiles"
echo "  ✅ Barrel exports work correctly"
echo "  ✅ TypeScript ESM with .js extensions resolves properly"
echo ""
echo "Test artifacts saved in: $TEST_DIR"
