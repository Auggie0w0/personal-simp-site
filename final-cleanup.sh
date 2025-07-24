#!/bin/bash

# Final Cleanup Script
# This script removes unnecessary files after migrating to the JSON-based character system

echo "🧹 Starting final cleanup process..."

# Backup directory
BACKUP_DIR="final_backup_$(date +%Y%m%d%H%M%S)"

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Function to backup and remove files
backup_and_remove() {
    if [ -f "$1" ]; then
        echo "Backing up and removing: $1"
        cp "$1" "$BACKUP_DIR/"
        rm "$1"
    fi
}

# Function to backup and remove directories
backup_and_remove_dir() {
    if [ -d "$1" ]; then
        echo "Backing up and removing directory: $1"
        cp -r "$1" "$BACKUP_DIR/"
        rm -rf "$1"
    fi
}

# Verify JSON and HTML files
echo -e "\n🔍 Verifying character files..."
JSON_COUNT=$(ls -1 characters/*.json 2>/dev/null | wc -l | tr -d ' ')
HTML_COUNT=$(ls -1 *.html | grep -v "index.html\|character-list.html\|reviews.html\|abouts.html\|admin.html\|character-template.html\|footer_disclaimer_template.html\|test-\|reset-\|clear-\|_disabled" | wc -l | tr -d ' ')

echo "Found $JSON_COUNT JSON character files and $HTML_COUNT HTML character files"

if [ "$JSON_COUNT" -ne "$HTML_COUNT" ]; then
    echo "⚠️  Warning: The number of JSON files doesn't match the number of HTML files."
    echo "This might indicate that some HTML files haven't been generated from JSON yet."
    echo "Consider running './site-maintenance.sh generate' before cleanup."
    
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cleanup aborted."
        exit 1
    fi
fi

echo -e "\n📋 Important Note About HTML Files:"
echo "The character HTML files (like mackenyu.html, axel.html, etc.) are still needed"
echo "because they're what the browser displays. However, they are now generated from"
echo "the JSON files in the characters/ directory. You should not edit these HTML files"
echo "directly anymore. Instead, edit the JSON files and regenerate the HTML."
echo

read -p "Continue with cleanup? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup aborted."
    exit 1
fi

# Backup character-generator-README.md (now replaced by the new tutorials)
backup_and_remove "character-generator-README.md"

# Remove old bash scripts (now consolidated into site-maintenance.sh)
echo -e "\n📁 Removing old bash scripts..."
backup_and_remove "cleanup_scripts.sh"
backup_and_remove "add_gallery_ordering_fix.sh"
backup_and_remove "update_ratings_system.sh"
backup_and_remove "update-to-shared-gallery.sh"
backup_and_remove "optimize-site.sh"
backup_and_remove "setup-character-generator.sh"

# Remove old JavaScript utility files (now consolidated into site-utils.js)
echo -e "\n📁 Removing old JavaScript utility files..."
backup_and_remove "reset_gallery_images.js"
backup_and_remove "reset_ratings.js"
backup_and_remove "fix_gallery_ordering.js"
backup_and_remove "gallery-debug.js"
backup_and_remove "fix-gallery-persistence.js"

# Remove test files
echo -e "\n📁 Removing test files..."
backup_and_remove "test-character.html"
backup_and_remove "test-gallery.html"
backup_and_remove "test-ratings.html"
backup_and_remove "test-comments.js"

# Remove reset and clear HTML files (now consolidated into admin.html)
echo -e "\n📁 Removing reset and clear HTML files..."
backup_and_remove "reset-all.html"
backup_and_remove "reset-all-galleries.html"
backup_and_remove "reset-all-ratings.html"
backup_and_remove "clear-gallery-data.html"
backup_and_remove "clear-reviews-data.html"
backup_and_remove "clear-admin-data.html"

# Remove disabled files
echo -e "\n📁 Removing disabled files..."
backup_and_remove "_disabled_add-character.html"

# Remove cleanup script (as it's now part of site-maintenance.sh)
backup_and_remove "cleanup-project.sh"

# Update README to mention the cleanup
echo -e "\n📝 Updating README.md..."
if [ -f "README.md" ]; then
    echo -e "\n## Cleanup Note\n\nThe project has been cleaned up to remove redundant files after migrating to the JSON-based character system. All removed files have been backed up to $BACKUP_DIR.\n\nImportant: The character HTML files are still needed as they're what the browser displays. However, they should not be edited directly anymore. Instead, edit the JSON files in the characters/ directory and regenerate the HTML using \`./site-maintenance.sh generate\`.\n" >> README.md
    echo "Updated README.md"
fi

# Run the site debugger to verify everything is still working
echo -e "\n🔍 Running site debugger to verify everything is working..."
./site-maintenance.sh debug

echo -e "\n✅ Cleanup complete! All removed files are backed up in: $BACKUP_DIR"
echo "The site now uses a streamlined JSON-based character system."
echo "To manage character pages:"
echo "1. Edit JSON files in the characters/ directory"
echo "2. Run './site-maintenance.sh generate' to update HTML files"
echo "3. Use './site-maintenance.sh debug' to check for issues" 