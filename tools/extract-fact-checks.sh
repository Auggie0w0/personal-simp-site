#!/bin/bash

# Extract Fact Check Comments
# This script extracts the fact check comments from all character HTML files
# and saves them to a single text file for easy review.

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SITE_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
OUTPUT_FILE="$SITE_ROOT/character-fact-checks.txt"

# Create the output file header
echo "# Character Fact Check Information" > "$OUTPUT_FILE"
echo "# Generated on $(date '+%Y-%m-%d %H:%M:%S')" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Find all character HTML files (excluding index, character-list, admin, reviews, and abouts)
echo "Finding character HTML files..."
HTML_FILES=$(find "$SITE_ROOT" -maxdepth 1 -name "*.html" | grep -v -E "index.html|character-list.html|admin.html|reviews.html|abouts.html")

# Initialize counters
TOTAL_FILES=0
EXTRACTED_COUNT=0

# Process each HTML file
for HTML_FILE in $HTML_FILES; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    FILENAME=$(basename "$HTML_FILE")
    CHARACTER_ID="${FILENAME%.html}"
    
    echo "Processing $FILENAME..."
    
    # Extract the fact check comment using grep
    FACT_CHECK=$(grep -A 100 "CHARACTER FACT CHECK INFORMATION" "$HTML_FILE" | grep -B 100 -m 1 "-->")
    
    if [ -n "$FACT_CHECK" ]; then
        # Add to the output file
        echo "## $CHARACTER_ID" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        # Clean up the comment format
        echo "$FACT_CHECK" | sed 's/<!--//g' | sed 's/-->//g' >> "$OUTPUT_FILE"
        
        echo "" >> "$OUTPUT_FILE"
        echo "---" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        EXTRACTED_COUNT=$((EXTRACTED_COUNT + 1))
    else
        echo "No fact check comment found in $FILENAME"
    fi
done

# Add summary
MISSING_COUNT=$((TOTAL_FILES - EXTRACTED_COUNT))
echo "# Summary" >> "$OUTPUT_FILE"
echo "- Total character files: $TOTAL_FILES" >> "$OUTPUT_FILE"
echo "- Characters with fact check comments: $EXTRACTED_COUNT" >> "$OUTPUT_FILE"
echo "- Characters missing fact check comments: $MISSING_COUNT" >> "$OUTPUT_FILE"

echo ""
echo "Extracted $EXTRACTED_COUNT fact check comments"
echo "Saved to $OUTPUT_FILE"
