#!/bin/bash

# This script adds the gallery.js script to all character HTML files

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

# Add gallery.js to each character file
for file in "${CHARACTER_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Check if gallery.js is already included
    if grep -q "gallery\.js" "$file"; then
      echo "  gallery.js already included in $file, skipping."
    else
      # Add gallery.js after ratings.js
      if grep -q "ratings\.js" "$file"; then
        sed -i '' 's/<script src="ratings.js"><\/script>/<script src="ratings.js"><\/script>\n    <script src="gallery.js"><\/script>/g' "$file"
        echo "  Added gallery.js after ratings.js"
      # Or add gallery.js after script.js if ratings.js doesn't exist
      elif grep -q "script\.js" "$file"; then
        sed -i '' 's/<script src="script.js[^"]*"><\/script>/<script src="script.js?v=3"><\/script>\n    <script src="gallery.js"><\/script>/g' "$file"
        echo "  Added gallery.js after script.js"
      else
        echo "  WARNING: Could not find a suitable place to add gallery.js in $file"
      fi
    fi
  else
    echo "WARNING: File $file not found, skipping."
  fi
done

echo "Done updating character files!" 