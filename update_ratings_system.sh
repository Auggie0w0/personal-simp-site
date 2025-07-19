#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Updating Character Pages to Include Ratings System${NC}"
echo "This script will ensure all character HTML files include the ratings.js script."

# Check if ratings.js exists
if [ ! -f "ratings.js" ]; then
  echo -e "${RED}Error: ratings.js not found.${NC}"
  echo "Please make sure the ratings.js file exists."
  exit 1
fi

# Get list of character HTML files
character_files=$(find . -maxdepth 1 -name "*.html" -not -name "index.html" -not -name "character-list.html" -not -name "reviews.html" -not -name "abouts.html" -not -name "add-character.html" -not -name "test-*.html" -not -name "clear-*.html")

# Count files
file_count=$(echo "$character_files" | wc -l)
echo -e "${YELLOW}Found ${file_count} character files to update.${NC}"

# Ask for confirmation
read -p "Do you want to update all character files? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Operation cancelled.${NC}"
  exit 0
fi

# Create backup directory
backup_dir="ratings_backup_$(date +%Y%m%d%H%M%S)"
mkdir -p "$backup_dir"
echo -e "${YELLOW}Creating backups in $backup_dir...${NC}"

# Update each file
for file in $character_files; do
  filename=$(basename "$file")
  echo -e "${YELLOW}Processing $filename...${NC}"
  
  # Create backup
  cp "$file" "$backup_dir/$filename"
  
  # Check if ratings.js is already included
  if grep -q '<script src="ratings.js">' "$file"; then
    echo -e "${GREEN}$filename already includes ratings.js${NC}"
  else
    # Add ratings.js before the closing body tag
    sed -i '' 's|</body>|<script src="ratings.js"></script>\n</body>|' "$file"
    echo -e "${GREEN}Added ratings.js to $filename${NC}"
  fi
done

echo -e "\n${GREEN}All files updated successfully!${NC}"
echo -e "Backups saved in $backup_dir"
echo -e "\nThe ratings system now allows only one vote per character and is centered on the page." 