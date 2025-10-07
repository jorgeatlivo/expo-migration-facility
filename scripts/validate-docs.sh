#!/bin/bash

# Validation script for documentation before deployment

echo "🔍 Validating documentation before deployment..."

# Change to the project root directory
cd "$(dirname "$0")/.."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ "$1" = "success" ]; then
        echo -e "${GREEN}✅ $2${NC}"
    elif [ "$1" = "error" ]; then
        echo -e "${RED}❌ $2${NC}"
    elif [ "$1" = "warning" ]; then
        echo -e "${YELLOW}⚠️  $2${NC}"
    else
        echo -e "$2"
    fi
}

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    print_status "error" "Node.js is not installed. Please install Node.js to validate documentation."
    exit 1
fi

print_status "success" "Node.js is available"

# Check if required scripts exist
if [ ! -f "scripts/generate-docs.mjs" ]; then
    print_status "error" "generate-docs.mjs script not found"
    exit 1
fi

if [ ! -f "scripts/generate-analytics-docs.mjs" ]; then
    print_status "error" "generate-analytics-docs.mjs script not found"
    exit 1
fi

print_status "success" "Required scripts are available"

# Check if README.md exists
if [ ! -f "README.md" ]; then
    print_status "error" "README.md not found - required for documentation generation"
    exit 1
fi

print_status "success" "README.md found"

# Check docs directory structure
if [ ! -d "docs" ]; then
    print_status "warning" "docs directory not found - will be created"
    mkdir -p docs
fi

if [ ! -f "docs/vercel.json" ]; then
    print_status "error" "vercel.json not found in docs directory"
    exit 1
fi

if [ ! -f "docs/package.json" ]; then
    print_status "error" "package.json not found in docs directory"
    exit 1
fi

print_status "success" "Docs directory structure is valid"

# Try to generate documentation
echo "🔨 Testing documentation generation..."

if ! ./scripts/generate-docs.sh; then
    print_status "error" "Documentation generation failed"
    exit 1
fi

print_status "success" "Documentation generation test passed"

# Check if generated files exist and are not empty
if [ ! -f "docs/index.html" ] || [ ! -s "docs/index.html" ]; then
    print_status "error" "index.html was not generated or is empty"
    exit 1
fi

if [ ! -f "docs/analytics-events.html" ] || [ ! -s "docs/analytics-events.html" ]; then
    print_status "error" "analytics-events.html was not generated or is empty"
    exit 1
fi

print_status "success" "Generated HTML files are valid"

# Check HTML validity (basic check)
if command -v tidy &> /dev/null; then
    echo "🔍 Checking HTML validity..."

    if tidy -q -e docs/index.html 2>/dev/null; then
        print_status "success" "index.html is valid HTML"
    else
        print_status "warning" "index.html has HTML issues (non-critical)"
    fi

    if tidy -q -e docs/analytics-events.html 2>/dev/null; then
        print_status "success" "analytics-events.html is valid HTML"
    else
        print_status "warning" "analytics-events.html has HTML issues (non-critical)"
    fi
else
    print_status "warning" "HTML Tidy not available - skipping HTML validation"
fi

# Check file sizes (should not be empty or too large)
index_size=$(stat -f%z "docs/index.html" 2>/dev/null || stat -c%s "docs/index.html" 2>/dev/null)
analytics_size=$(stat -f%z "docs/analytics-events.html" 2>/dev/null || stat -c%s "docs/analytics-events.html" 2>/dev/null)

if [ "$index_size" -lt 1000 ]; then
    print_status "warning" "index.html seems too small (${index_size} bytes)"
elif [ "$index_size" -gt 10000000 ]; then
    print_status "warning" "index.html seems too large (${index_size} bytes)"
else
    print_status "success" "index.html size is reasonable (${index_size} bytes)"
fi

if [ "$analytics_size" -lt 1000 ]; then
    print_status "warning" "analytics-events.html seems too small (${analytics_size} bytes)"
elif [ "$analytics_size" -gt 10000000 ]; then
    print_status "warning" "analytics-events.html seems too large (${analytics_size} bytes)"
else
    print_status "success" "analytics-events.html size is reasonable (${analytics_size} bytes)"
fi

print_status "success" "Documentation validation completed successfully!"
echo "📄 Files ready for deployment:"
echo "   - docs/index.html (${index_size} bytes)"
echo "   - docs/analytics-events.html (${analytics_size} bytes)"

exit 0
