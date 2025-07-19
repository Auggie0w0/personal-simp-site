#!/bin/bash
for file in *.html; do
  # Fix duplicate footer comment
  sed -i '' 's/<!-- Footer -->\n    <!-- Footer -->/<!-- Footer -->/g' "$file"
  
  # Fix any HTML issues at the end of the file
  sed -i '' 's/<\/footer><\/body>/\n<\/footer>\n<\/body>/g' "$file"
done
