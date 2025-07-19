#!/bin/bash
for file in *.html; do
  if grep -q '<div class="footer-section">\s*</div>' "$file"; then
    echo "Found empty footer section in $file"
  fi
done
