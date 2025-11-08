#!/bin/bash

echo "🔍 Verifying Railway Deployment Readiness..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Check required files
echo "📁 Checking required files..."

files=(
    "supervisord.conf"
    "nixpacks.toml"
    "railway.json"
    "Procfile"
    "Dockerfile"
    ".dockerignore"
    "backend/requirements.txt"
    "backend/server.py"
    "frontend/package.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        ((errors++))
    fi
done

echo ""

# Check supervisord.conf syntax
echo "🔧 Checking supervisord.conf..."
if grep -q "\[supervisord\]" supervisord.conf && \
   grep -q "\[program:backend\]" supervisord.conf && \
   grep -q "\[program:frontend-serve\]" supervisord.conf; then
    echo -e "${GREEN}✓${NC} supervisord.conf is valid"
else
    echo -e "${RED}✗${NC} supervisord.conf has issues"
    ((errors++))
fi

echo ""

# Check nixpacks.toml
echo "📦 Checking nixpacks.toml..."
if grep -q "python311" nixpacks.toml && \
   grep -q "nodejs" nixpacks.toml && \
   grep -q "yarn" nixpacks.toml; then
    echo -e "${GREEN}✓${NC} nixpacks.toml is valid"
else
    echo -e "${RED}✗${NC} nixpacks.toml has issues"
    ((errors++))
fi

echo ""

# Check backend dependencies
echo "🐍 Checking backend dependencies..."
if [ -f "backend/requirements.txt" ]; then
    deps=("fastapi" "uvicorn" "motor" "boto3" "requests")
    for dep in "${deps[@]}"; do
        if grep -q "$dep" backend/requirements.txt; then
            echo -e "${GREEN}✓${NC} $dep found"
        else
            echo -e "${RED}✗${NC} $dep missing"
            ((errors++))
        fi
    done
fi

echo ""

# Check frontend dependencies
echo "⚛️  Checking frontend dependencies..."
if [ -f "frontend/package.json" ]; then
    if grep -q "react" frontend/package.json && \
       grep -q "axios" frontend/package.json; then
        echo -e "${GREEN}✓${NC} Core dependencies found"
    else
        echo -e "${RED}✗${NC} Missing core dependencies"
        ((errors++))
    fi
    
    # Check if serve is installed
    if grep -q "serve" frontend/package.json; then
        echo -e "${GREEN}✓${NC} serve package found"
    else
        echo -e "${YELLOW}⚠${NC} serve package not found (needed for Railway)"
        ((warnings++))
    fi
fi

echo ""

# Check environment example
echo "🔐 Checking environment setup..."
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example exists"
else
    echo -e "${YELLOW}⚠${NC} .env.example not found"
    ((warnings++))
fi

echo ""

# Check documentation
echo "📚 Checking documentation..."
docs=("README.md" "DEPLOYMENT.md" "RAILWAY_DEPLOY.md" "METHODOLOGY.md")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} $doc exists"
    else
        echo -e "${YELLOW}⚠${NC} $doc not found"
        ((warnings++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for Railway deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Commit and push to GitHub"
    echo "2. Follow RAILWAY_DEPLOY.md for deployment"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ $warnings warning(s) found, but deployment should work.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review warnings above (optional)"
    echo "2. Commit and push to GitHub"
    echo "3. Follow RAILWAY_DEPLOY.md for deployment"
    exit 0
else
    echo -e "${RED}✗ $errors error(s) found. Fix before deploying.${NC}"
    exit 1
fi
