#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Updating Character Pages to Use Shared Gallery System${NC}"
echo "This script will update character HTML files to use the shared gallery system."

# Check if shared-gallery.js exists
if [ ! -f "shared-gallery.js" ]; then
  echo -e "${RED}Error: shared-gallery.js not found.${NC}"
  echo "Please make sure you have created the shared-gallery.js file first."
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
backup_dir="gallery_backup_$(date +%Y%m%d%H%M%S)"
mkdir -p "$backup_dir"
echo -e "${YELLOW}Creating backups in $backup_dir...${NC}"

# Update each file
for file in $character_files; do
  filename=$(basename "$file")
  echo -e "${YELLOW}Processing $filename...${NC}"
  
  # Create backup
  cp "$file" "$backup_dir/$filename"
  
  # Remove references to old gallery scripts
  sed -i '' '/<script src="fix-gallery-persistence.js">/d' "$file"
  sed -i '' '/<script src="gallery.js">/d' "$file"
  
  # Add shared-gallery.js before the closing body tag if it doesn't exist
  if ! grep -q '<script src="shared-gallery.js">' "$file"; then
    sed -i '' 's|</body>|<script src="shared-gallery.js"></script>\n</body>|' "$file"
  fi
  
  echo -e "${GREEN}Updated $filename${NC}"
done

echo -e "\n${GREEN}All files updated successfully!${NC}"
echo -e "Backups saved in $backup_dir"
echo -e "\nRemember to set up and start the gallery server:"
echo -e "1. Run ./setup-gallery-server.sh (if not done already)"
echo -e "2. Start MongoDB"
echo -e "3. Start the server with: cd gallery-server && npm start"
echo -e "\nIf deploying to a hosting service, update API_BASE_URL in shared-gallery.js" 