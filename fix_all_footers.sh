#!/bin/bash
for file in *.html; do
  # Replace the entire footer structure with the correct one
  sed -i '' '/<footer class="footer">/,/<\/footer>/c\
    <!-- Footer -->\
    <footer class="footer">\
        <div class="footer-content">\
            <div class="footer-section">\
                <h4>Contact</h4>\
                <p>📧 <a href="mailto:auggieldoggie@gmail.com">auggieldoggie@gmail.com</a></p>\
                <p>🐙 <a href="https://github.com/Auggie0w0" target="_blank">GitHub: Auggie0w0</a></p>\
            </div>\
            <div class="footer-section">\
                <h4>Social</h4>\
                <p>📸 Instagram: @bunnie.0w0</p>\
            </div>\
        </div>\
        <div class="footer-bottom">\
            <p>\&copy; 2025 Stillframe Archive. All rights reserved.</p>\
        </div>\
    </footer>' "$file"
done
