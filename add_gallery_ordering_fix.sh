#!/bin/bash

# This script adds the fix_gallery_ordering.js script to all character HTML files

# List of character HTML files
CHARACTER_FILES=(
  "wolfgang.html"
  "minho.html"
  "huntrix.html"
  "axel.html"
  "ivan.html"
  "hange.html"
  "yamada.html"
  "dazai.html"
  "miyamura.html"
  "saja.html"
)

# Add fix_gallery_ordering.js to each character file
for file in "${CHARACTER_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Check if fix_gallery_ordering.js is already included
    if grep -q "fix_gallery_ordering\.js" "$file"; then
      echo "  fix_gallery_ordering.js already included in $file, skipping."
    else
      # Add fix_gallery_ordering.js after fix-gallery-persistence.js
      if grep -q "fix-gallery-persistence\.js" "$file"; then
        sed -i '' 's/<script src="fix-gallery-persistence.js"><\/script>/<script src="fix-gallery-persistence.js"><\/script>\n    <script src="fix_gallery_ordering.js"><\/script>/g' "$file"
        echo "  Added fix_gallery_ordering.js after fix-gallery-persistence.js"
      # Or add fix_gallery_ordering.js after gallery.js if fix-gallery-persistence.js doesn't exist
      elif grep -q "gallery\.js" "$file"; then
        sed -i '' 's/<script src="gallery.js"><\/script>/<script src="gallery.js"><\/script>\n    <script src="fix_gallery_ordering.js"><\/script>/g' "$file"
        echo "  Added fix_gallery_ordering.js after gallery.js"
      # Or add fix_gallery_ordering.js after script.js if neither exists
      elif grep -q "script\.js" "$file"; then
        sed -i '' 's/<script src="script.js[^"]*"><\/script>/<script src="script.js"><\/script>\n    <script src="fix_gallery_ordering.js"><\/script>/g' "$file"
        echo "  Added fix_gallery_ordering.js after script.js"
      else
        echo "  WARNING: Could not find a suitable place to add fix_gallery_ordering.js in $file"
      fi
    fi
  else
    echo "WARNING: File $file not found, skipping."
  fi
done

echo "Done updating character files!" 