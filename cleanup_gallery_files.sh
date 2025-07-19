#!/bin/bash

# This script removes unnecessary gallery-related files that are no longer needed

echo "Cleaning up unnecessary gallery files..."

# List of files to remove
FILES_TO_REMOVE=(
  "update_gallery_order.sh"  # Replaced by fix_gallery_ordering.js
)

# Remove each file
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo "Removing $file..."
    rm "$file"
  else
    echo "File $file not found, skipping."
  fi
done

echo "Done cleaning up unnecessary files!" 