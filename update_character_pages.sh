#!/bin/bash

# This script adds the fix-gallery-persistence.js script to all character HTML files

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

# Add fix-gallery-persistence.js to each character file
for file in "${CHARACTER_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Check if fix-gallery-persistence.js is already included
    if grep -q "fix-gallery-persistence\.js" "$file"; then
      echo "  fix-gallery-persistence.js already included in $file, skipping."
    else
      # Add fix-gallery-persistence.js after character-utils.js
      if grep -q "character-utils\.js" "$file"; then
        sed -i '' 's/<script src="character-utils.js"><\/script>/<script src="character-utils.js"><\/script>\n    <script src="fix-gallery-persistence.js"><\/script>/g' "$file"
        echo "  Added fix-gallery-persistence.js after character-utils.js"
      # Or add fix-gallery-persistence.js after gallery.js if character-utils.js doesn't exist
      elif grep -q "gallery\.js" "$file"; then
        sed -i '' 's/<script src="gallery.js"><\/script>/<script src="gallery.js"><\/script>\n    <script src="fix-gallery-persistence.js"><\/script>/g' "$file"
        echo "  Added fix-gallery-persistence.js after gallery.js"
      # Or add fix-gallery-persistence.js after script.js if neither exists
      elif grep -q "script\.js" "$file"; then
        sed -i '' 's/<script src="script.js[^"]*"><\/script>/<script src="script.js?v=3"><\/script>\n    <script src="fix-gallery-persistence.js"><\/script>/g' "$file"
        echo "  Added fix-gallery-persistence.js after script.js"
      else
        echo "  WARNING: Could not find a suitable place to add fix-gallery-persistence.js in $file"
      fi
    fi
  else
    echo "WARNING: File $file not found, skipping."
  fi
done

echo "Done updating character files!" 