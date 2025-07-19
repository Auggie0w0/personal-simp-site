#!/bin/bash
for file in *.html; do
  sed -i '' '/<div class="footer-section">/,/<\/div>/{ /<h4>Site<\/h4>/,/<\/div>/d; }' "$file"
done
