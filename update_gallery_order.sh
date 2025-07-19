#!/bin/bash

# This script ensures that the Add Photo card is at the beginning of the gallery in all character HTML files

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

# Function to check if file exists and is not empty
check_file() {
  if [ ! -f "$1" ] || [ ! -s "$1" ]; then
    echo "File $1 does not exist or is empty, skipping."
    return 1
  fi
  return 0
}

# Process each character file
for file in "${CHARACTER_FILES[@]}"; do
  # Check if file exists and is not empty
  check_file "$file" || continue
  
  echo "Processing $file..."
  
  # Create a temporary file
  temp_file="${file}.tmp"
  
  # Use awk to reorder the gallery content
  awk '
  BEGIN {
    in_gallery = 0;
    add_photo_card = "";
    gallery_start = "";
    gallery_end = "";
    gallery_images = "";
  }
  
  # Detect the start of the gallery section
  /<div class="image-gallery">/ {
    in_gallery = 1;
    gallery_start = $0;
    next;
  }
  
  # Detect the end of the gallery section
  in_gallery && /<\/div>/ && $0 !~ /<div/ {
    in_gallery = 0;
    gallery_end = $0;
    
    # Output the gallery with the add-photo-card at the beginning
    print gallery_start;
    print add_photo_card;
    print gallery_images;
    print gallery_end;
    next;
  }
  
  # Capture the add-photo-card
  in_gallery && /<div class="add-photo-card"/ {
    add_photo_card = "";
    while ($0 !~ /<\/div>\s*<\/div>/) {
      add_photo_card = add_photo_card $0 "\n";
      if (getline <= 0) break;
    }
    add_photo_card = add_photo_card $0 "\n";
    next;
  }
  
  # Capture gallery images
  in_gallery && /<div class="gallery-image">/ {
    gallery_images = gallery_images $0 "\n";
    next;
  }
  
  # Output all other lines as they are
  !in_gallery {
    print;
  }
  ' "$file" > "$temp_file"
  
  # Check if the temporary file is not empty
  if [ -s "$temp_file" ]; then
    # Replace the original file with the temporary file
    mv "$temp_file" "$file"
    echo "  Updated gallery order in $file"
  else
    echo "  Error: Generated empty file for $file, skipping."
    rm "$temp_file"
  fi
done

echo "Done updating gallery order in character files!" 