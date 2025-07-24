#!/bin/bash

# Cleanup Project Script
# This script removes redundant files from the project

echo "🧹 Cleaning up redundant files..."

# Backup directory
BACKUP_DIR="backup_$(date +%Y%m%d%H%M%S)"

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

# Backup and remove redundant bash scripts
echo -e "\n📁 Removing redundant bash scripts..."
backup_and_remove "cleanup_scripts.sh"
backup_and_remove "add_gallery_ordering_fix.sh"
backup_and_remove "update_ratings_system.sh"
backup_and_remove "update-to-shared-gallery.sh"
backup_and_remove "optimize-site.sh"
backup_and_remove "setup-character-generator.sh"

# Backup and remove redundant JavaScript files
echo -e "\n📁 Removing redundant JavaScript files..."
backup_and_remove "reset_gallery_images.js"
backup_and_remove "reset_ratings.js"
backup_and_remove "fix_gallery_ordering.js"
backup_and_remove "gallery-debug.js"
backup_and_remove "fix-gallery-persistence.js"

# Backup and remove redundant HTML files
echo -e "\n📁 Removing redundant HTML files..."
backup_and_remove "test-character.html"
backup_and_remove "test-gallery.html"
backup_and_remove "test-ratings.html"
backup_and_remove "reset-all.html"
backup_and_remove "reset-all-galleries.html"
backup_and_remove "reset-all-ratings.html"
backup_and_remove "clear-gallery-data.html"
backup_and_remove "clear-reviews-data.html"
backup_and_remove "clear-admin-data.html"

# Backup and remove redundant README files
echo -e "\n📁 Removing redundant README files..."
backup_and_remove "character-generator-README.md"

# Update README.md to mention the consolidated files
echo -e "\n📝 Updating README.md..."
if [ -f "README.md" ]; then
    echo -e "\n## Recent Updates\n\nThe project has been streamlined with consolidated utilities:\n\n- **site-maintenance.sh**: Consolidated maintenance script\n- **site-utils.js**: Consolidated JavaScript utilities\n- **admin.html**: Consolidated admin panel\n\nRedundant files have been removed and backed up to $BACKUP_DIR.\n" >> README.md
    echo "Updated README.md"
fi

echo -e "\n✅ Cleanup complete! All removed files are backed up in: $BACKUP_DIR"
echo "You can now use the following consolidated files:"
echo "  - site-maintenance.sh: For all maintenance tasks"
echo "  - site-utils.js: For all JavaScript utilities"
echo "  - admin.html: For all admin functions" 