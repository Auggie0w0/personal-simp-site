#!/bin/bash

# Site Maintenance Script
# This script provides various maintenance functions for the site

# Display help information
function show_help {
    echo "Site Maintenance Script"
    echo "Usage: ./site-maintenance.sh [command]"
    echo ""
    echo "Commands:"
    echo "  optimize     - Run site optimization tools"
    echo "  generate     - Generate character pages from JSON"
    echo "  convert      - Convert HTML pages to JSON"
    echo "  debug        - Run site debugger"
    echo "  clean        - Clean up temporary files"
    echo "  reset        - Reset galleries, ratings, or both"
    echo "  comments     - Add fact check comments to character pages"
    echo "  help         - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./site-maintenance.sh optimize"
    echo "  ./site-maintenance.sh generate mackenyu"
    echo "  ./site-maintenance.sh reset galleries"
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
    
    # Run site debugger
    echo -e "\n🔍 Running site debugger..."
    node site-debugger.js
    
    # Update review templates
    echo -e "\n📋 Updating review templates..."
    node update-review-template.js
    
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
                node generate-character.js "characters/$character_id.json"
            fi
        done
    else
        # Generate specific character page
        echo "Generating page for $1..."
        if [ -f "characters/$1.json" ]; then
            node generate-character.js "characters/$1.json"
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
    
    node convert-to-json.js
    
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
        node reset_gallery_images.js
    fi
    
    if [ "$1" == "ratings" ] || [ "$1" == "all" ]; then
        echo "Resetting ratings..."
        node reset_ratings.js
    fi
    
    if [ -z "$1" ]; then
        echo "Please specify what to reset: galleries, ratings, or all"
        echo "Example: ./site-maintenance.sh reset galleries"
    fi
    
    echo "✅ Reset complete!"
}

# Main function
if [ -z "$1" ]; then
    show_help
    exit 0
fi

# Add fact check comments to character pages
function add_character_comments {
    echo "📝 Adding fact check comments to character pages..."
    
    check_node
    check_dependencies
    
    node add-character-comments.js
    
    echo "✅ Fact check comments added!"
}

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
    debug)
        check_node
        node site-debugger.js
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