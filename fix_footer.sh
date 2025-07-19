#!/bin/bash
for file in *.html; do
  sed -i '' 's/<div class="footer-section">\s*<\/div>//g' "$file"
  sed -i '' 's/<div class="footer-section">\n        <\/div>//g' "$file"
done
