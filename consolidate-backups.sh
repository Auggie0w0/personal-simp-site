#!/bin/bash

# Consolidate Backups Script
# This script consolidates all backup directories into one final backup

echo "🗂️ Consolidating backup directories..."

# Create a new final backup directory
FINAL_BACKUP_DIR="final_backup"

# Check if the final backup directory already exists
if [ -d "$FINAL_BACKUP_DIR" ]; then
    echo "Final backup directory already exists. Removing old one..."
    rm -rf "$FINAL_BACKUP_DIR"
fi

# Create the final backup directory
mkdir -p "$FINAL_BACKUP_DIR"
echo "Created final backup directory: $FINAL_BACKUP_DIR"

# Find all backup directories
BACKUP_DIRS=$(find . -maxdepth 1 -type d -name "final_backup_*" -o -name "backup_*")

# Copy all files from backup directories to the final backup directory
for dir in $BACKUP_DIRS; do
    echo "Processing backup directory: $dir"
    
    # Create a subdirectory in the final backup to avoid filename conflicts
    subdir=$(basename "$dir")
    mkdir -p "$FINAL_BACKUP_DIR/$subdir"
    
    # Copy all files from the backup directory to the subdirectory
    cp -r "$dir"/* "$FINAL_BACKUP_DIR/$subdir"/ 2>/dev/null || true
    
    # Remove the original backup directory
    echo "Removing original backup directory: $dir"
    rm -rf "$dir"
done

# Also include ratings_backup in the final backup
if [ -d "ratings_backup_20250718232108" ]; then
    echo "Processing ratings backup directory"
    mkdir -p "$FINAL_BACKUP_DIR/ratings_backup"
    cp -r ratings_backup_20250718232108/* "$FINAL_BACKUP_DIR/ratings_backup"/ 2>/dev/null || true
    rm -rf ratings_backup_20250718232108
fi

echo "✅ Backup consolidation complete!"
echo "All backups have been consolidated into the $FINAL_BACKUP_DIR directory."
echo "You can safely delete this script after running it." 