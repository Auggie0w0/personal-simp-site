#!/bin/bash

# This script adds the character-utils.js script to all character HTML files

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

# Add character-utils.js to each character file
for file in "${CHARACTER_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Check if character-utils.js is already included
    if grep -q "character-utils\.js" "$file"; then
      echo "  character-utils.js already included in $file, skipping."
    else
      # Add character-utils.js after gallery.js or ratings.js or script.js
      if grep -q "gallery\.js" "$file"; then
        sed -i '' 's/<script src="gallery.js"><\/script>/<script src="gallery.js"><\/script>\n    <script src="character-utils.js"><\/script>/g' "$file"
        echo "  Added character-utils.js after gallery.js"
      elif grep -q "ratings\.js" "$file"; then
        sed -i '' 's/<script src="ratings.js"><\/script>/<script src="ratings.js"><\/script>\n    <script src="character-utils.js"><\/script>/g' "$file"
        echo "  Added character-utils.js after ratings.js"
      elif grep -q "script\.js" "$file"; then
        sed -i '' 's/<script src="script.js[^"]*"><\/script>/<script src="script.js?v=3"><\/script>\n    <script src="character-utils.js"><\/script>/g' "$file"
        echo "  Added character-utils.js after script.js"
      else
        echo "  WARNING: Could not find a suitable place to add character-utils.js in $file"
      fi
    fi
  else
    echo "WARNING: File $file not found, skipping."
  fi
done

echo "Done updating character files!" 