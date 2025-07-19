#!/bin/bash

# This script updates the footer in all HTML files with the template that includes the disclaimer

echo "Updating footer in all HTML files..."

# Read the footer template
FOOTER_TEMPLATE=$(cat footer_disclaimer_template.html)

# Process each HTML file
for file in *.html; do
    echo "Processing $file..."
    
    # Create a temporary file
    temp_file="${file}.tmp"
    
    # Replace the footer in the file
    awk -v footer="$FOOTER_TEMPLATE" '
    BEGIN { found = 0; }
    {
        if ($0 ~ /<!-- Footer -->/ && !found) {
            print "<!-- Footer -->";
            print footer;
            found = 1;
            # Skip lines until we find the end of the original footer
            while (getline) {
                if ($0 ~ /<\/footer>/) {
                    break;
                }
            }
        } else if ($0 ~ /<!-- Footer --><!-- Footer -->/ && !found) {
            print "<!-- Footer -->";
            print footer;
            found = 1;
            # Skip lines until we find the end of the original footer
            while (getline) {
                if ($0 ~ /<\/footer>/) {
                    break;
                }
            }
        } else if (!found) {
            print $0;
        } else {
            print $0;
        }
    }
    ' "$file" > "$temp_file"
    
    # Replace the original file with the temporary file
    mv "$temp_file" "$file"
    echo "  Updated footer in $file"
done

echo "Done updating footers!" 