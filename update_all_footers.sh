#!/bin/bash
for file in axel.html hange.html huntrix.html ivan.html miyamura.html minho.html saja.html wolfgang.html yamada.html; do
  sed -i '' 's/<div class="footer-section">\s*<h4>Site<\/h4>.*<\/div>//' "$file"
done
