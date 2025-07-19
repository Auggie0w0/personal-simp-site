#!/bin/bash

# This script adds a disclaimer to the footer of all HTML files

DISCLAIMER='<div class="footer-section disclaimer-section">
                <h4>Disclaimer</h4>
                <p>I do not own any of the art which most are official others are fanart. Please take credit if any of them belongs to you.</p>
                <p>Feel free to fork on GitHub to give recs to the layout and how the website should look or DM/email me for character recommendations!</p>
                <p>Feel free to add images you think are super cool for the character!</p>
            </div>'

echo "Adding disclaimer to all HTML files..."

# Process each HTML file
for file in *.html; do
    # Skip files we've already manually updated
    if [[ "$file" == "reviews.html" || "$file" == "abouts.html" ]]; then
        echo "Skipping $file (already updated manually)"
        continue
    fi
    
    echo "Processing $file..."
    
    # Check if the disclaimer is already in the file
    if grep -q "Disclaimer" "$file"; then
        echo "  Disclaimer already exists in $file, skipping."
        continue
    fi
    
    # Create a temporary file
    temp_file="${file}.tmp"
    
    # Add the disclaimer before the footer-bottom div
    awk -v disclaimer="$DISCLAIMER" '
    {
        if ($0 ~ /<div class="footer-bottom">/) {
            print disclaimer
            print $0
        } else {
            print $0
        }
    }
    ' "$file" > "$temp_file"
    
    # Replace the original file with the temporary file
    mv "$temp_file" "$file"
    echo "  Added disclaimer to $file"
done

echo "Done adding disclaimers!" 