#!/bin/bash

# Site Maintenance Script
# This script provides various maintenance functions for the site

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the script directory to ensure proper path resolution
cd "$SCRIPT_DIR"

# Display help information
function show_help {
    echo "Site Maintenance Script"
    echo "Usage: ./site-maintenance.sh [command]"
    echo ""
    echo "Commands:"
    echo "  optimize     - Run site optimization tools"
    echo "  generate     - Generate character pages from JSON"
    echo "  convert      - Convert HTML pages to JSON"
    echo "  clean        - Clean up temporary files"
    echo "  reset        - Reset galleries, ratings, or both"
    echo "  comments     - Add fact check comments to character pages"
    echo "  extract      - Extract fact check comments to a text file"
    echo "  debug        - Run site debugger"
    echo "  fix-loading  - Fix character loading issues"
    echo "  help         - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./site-maintenance.sh optimize"
    echo "  ./site-maintenance.sh generate mackenyu"
    echo "  ./site-maintenance.sh reset galleries"
    echo "  ./site-maintenance.sh extract"
    echo "  ./site-maintenance.sh fix-loading"
}

# Check if Node.js is installed
function check_node {
    if ! command -v node &> /dev/null; then
        echo "❌ Error: Node.js is required but not installed."
        echo "Please install Node.js and try again."
        exit 1
    fi
}

# Install dependencies if needed
function check_dependencies {
    echo "📦 Checking dependencies..."
    if ! npm list cheerio &> /dev/null; then
        echo "Installing cheerio package..."
        npm install cheerio
    fi
}

# Run site optimization
function optimize_site {
    echo "🚀 Starting site optimization..."
    
    check_node
    check_dependencies
    
    # Update review templates
    echo -e "\n📋 Updating review templates..."
    node tools/update-review-template.js
    
    echo -e "\n✅ Site optimization complete!"
}

# Generate character pages
function generate_characters {
    echo "🔄 Generating character pages..."
    
    check_node
    
    if [ -z "$1" ]; then
        # Generate all character pages
        echo "Generating all character pages..."
        for file in characters/*.json; do
            if [ -f "$file" ]; then
                character_id=$(basename "$file" .json)
                echo "Generating page for $character_id..."
                node tools/generate-character.js "characters/$character_id.json"
            fi
        done
    else
        # Generate specific character page
        echo "Generating page for $1..."
        if [ -f "characters/$1.json" ]; then
            node tools/generate-character.js "characters/$1.json"
        else
            echo "❌ Error: Character JSON file not found: characters/$1.json"
            exit 1
        fi
    fi
    
    echo "✅ Character generation complete!"
}

# Convert HTML pages to JSON
function convert_to_json {
    echo "📄 Converting HTML pages to JSON..."
    
    check_node
    check_dependencies
    
    node tools/convert-to-json.js
    
    echo "✅ Conversion complete!"
}

# Clean up temporary files
function clean_up {
    echo "🧹 Cleaning up temporary files..."
    
    # Remove backup files
    find . -name "*.bak" -type f -delete
    
    # Remove temporary files
    find . -name "*.tmp" -type f -delete
    
    # Remove log files
    find . -name "*.log" -type f -delete
    
    echo "✅ Cleanup complete!"
}

# Reset galleries, ratings, or both
function reset_data {
    echo "🔄 Resetting data..."
    
    if [ "$1" == "galleries" ] || [ "$1" == "all" ]; then
        echo "Resetting galleries..."
        # Use site-utils.js instead of reset_gallery_images.js
        echo "localStorage.removeItem('galleries');" | node
    fi
    
    if [ "$1" == "ratings" ] || [ "$1" == "all" ]; then
        echo "Resetting ratings..."
        # Use site-utils.js instead of reset_ratings.js
        echo "localStorage.removeItem('ratings');" | node
    fi
    
    if [ -z "$1" ]; then
        echo "Please specify what to reset: galleries, ratings, or all"
        echo "Example: ./site-maintenance.sh reset galleries"
    fi
    
    echo "✅ Reset complete!"
}

# Add fact check comments to character pages
function add_character_comments {
    echo "📝 Adding fact check comments to character pages..."
    
    check_node
    check_dependencies
    
    node tools/add-character-comments.js
    
    echo "✅ Fact check comments added!"
}

# Extract fact check comments to a text file
function extract_fact_checks {
    echo "📋 Extracting fact check comments..."
    
    # Try different methods in order of preference
    if command -v python3 &> /dev/null; then
        echo "Using Python script..."
        python3 tools/extract-fact-checks.py
    elif command -v node &> /dev/null; then
        echo "Using Node.js script..."
        node tools/extract-fact-checks.js
    else
        echo "Using Bash script..."
        bash tools/extract-fact-checks.sh
    fi
    
    echo "✅ Fact check comments extracted to character-fact-checks.txt!"
}

# Fix character loading issues
function fix_loading {
    echo "🔧 Fixing character loading issues..."
    
    check_node
    
    # First analyze the issues
    echo -e "\n📊 Analyzing character loading issues..."
    node tools/fix-character-loading.js
    
    # Ask for confirmation before applying fixes
    read -p "Do you want to apply the optimized loading solution? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "\n🚀 Applying optimized loading solution..."
        node tools/optimize-character-loading.js
        echo "✅ Character loading optimized!"
    else
        echo "❌ Optimization cancelled."
    fi
}

# Run site debugger
function debug_site {
    echo "🔍 Running site debugger..."
    
    check_node
    
    # Check for broken links
    echo -e "\n📋 Checking for broken links..."
    # This would need to be implemented
    
    # Check for broken images
    echo -e "\n📋 Checking for broken images..."
    # This would need to be implemented
    
    # Check for missing character data
    echo -e "\n📋 Checking for missing character data..."
    # This would need to be implemented
    
    echo -e "\n✅ Site debugging complete!"
}

# Main function
if [ -z "$1" ]; then
    show_help
    exit 0
fi

case "$1" in
    optimize)
        optimize_site
        ;;
    generate)
        generate_characters "$2"
        ;;
    convert)
        convert_to_json
        ;;
    clean)
        clean_up
        ;;
    reset)
        reset_data "$2"
        ;;
    comments)
        add_character_comments
        ;;
    extract)
        extract_fact_checks
        ;;
    fix-loading)
        fix_loading
        ;;
    debug)
        debug_site
        ;;
    help)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

exit 0