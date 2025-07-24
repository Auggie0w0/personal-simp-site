#!/bin/bash

# Optimize Site Script
# This script runs all the necessary tools to optimize the site

echo "🚀 Starting site optimization..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is required but not installed."
    echo "Please install Node.js and try again."
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if ! npm list cheerio &> /dev/null; then
    echo "Installing cheerio package..."
    npm install cheerio
fi

# Run site debugger
echo -e "\n🔍 Running site debugger..."
node site-debugger.js

# Convert character pages to JSON
echo -e "\n📄 Converting character pages to JSON..."
node convert-to-json.js

# Update review templates
echo -e "\n📋 Updating review templates..."
node update-review-template.js

# Regenerate character pages
echo -e "\n🔄 Regenerating character pages..."
./setup-character-generator.sh

echo -e "\n✅ Site optimization complete!"
echo "You may want to check the following:"
echo "  1. Verify all character pages are correctly displayed"
echo "  2. Check for any broken links or images"
echo "  3. Make sure all character pages are listed in character-list.html"
echo "  4. Ensure all reviews have consistent formatting" 