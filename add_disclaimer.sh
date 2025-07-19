#!/bin/bash

# This script adds a disclaimer to the footer of all HTML files and to the about page

DISCLAIMER="<div class=\"footer-section disclaimer-section\">
                <h4>Disclaimer</h4>
                <p>I do not own any of the art which most are official others are fanart. Please take credit if any of them belongs to you.</p>
                <p>Feel free to fork on GitHub to give recs to the layout and how the website should look or DM/email me for character recommendations!</p>
                <p>Feel free to add images you think are super cool for the character!</p>
            </div>"

ABOUT_DISCLAIMER="<div class=\"about-section\">
                <h2>Disclaimer</h2>
                <p>I do not own any of the art which most are official others are fanart. Please take credit if any of them belongs to you.</p>
                <p>Feel free to fork on GitHub to give recs to the layout and how the website should look or DM/email me for character recommendations!</p>
                <p>Feel free to add images you think are super cool for the character!</p>
            </div>"

echo "Adding disclaimer to all HTML files..."

# Add disclaimer to the footer of all HTML files
for file in *.html; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        
        # Check if the disclaimer is already in the footer
        if grep -q "Disclaimer" "$file"; then
            echo "  Disclaimer already exists in $file, skipping."
        else
            # Add disclaimer to the footer
            sed -i '' 's/<div class="footer-content">/<div class="footer-content">\n            '"$DISCLAIMER"'/g' "$file"
            echo "  Added disclaimer to footer in $file"
        fi
    fi
done

# Add disclaimer to the about page
if [ -f "abouts.html" ]; then
    echo "Adding disclaimer to about page..."
    
    # Check if the disclaimer is already in the about page
    if grep -q "<h2>Disclaimer<\/h2>" "abouts.html"; then
        echo "  Disclaimer already exists in about page, skipping."
    else
        # Add disclaimer to the about page before the closing div of about-content
        sed -i '' 's/<\/div>  <\/main>/'"$ABOUT_DISCLAIMER"'\n        <\/div>  <\/main>/g' "abouts.html"
        echo "  Added disclaimer to about page"
    fi
fi

echo "Done adding disclaimers!" 