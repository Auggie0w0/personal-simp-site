#!/bin/bash

# This script removes the "Add Your Review" section from reviews.html

echo "Removing 'Add Your Review' section from reviews.html..."

# 1. Remove the "Add Your Own Review" section
sed -i '' '/<div class="reviews-section">\s*<h2>Add Your Own Review<\/h2>/,/<\/div>\s*<\/div>/d' reviews.html

# 2. Remove the Add Review Modal
sed -i '' '/<\!-- Add Review Modal -->/,/<\/div>\s*<\/div>/d' reviews.html

# 3. Remove the JavaScript for the review modal functionality
sed -i '' '/<script>\s*\/\/ Reviews data/,/<\/script>/d' reviews.html

# 4. Make a direct edit to remove the specific "Add Your Own Review" section
sed -i '' '/<div class="reviews-section">\s*<h2>Add Your Own Review<\/h2>/,/<\/div>\s*<\/div>/d' reviews.html

# 5. Directly remove the button section if it still exists
sed -i '' '/<div class="add-review-section">/,/<\/div>/d' reviews.html

echo "Done removing 'Add Your Review' section from reviews.html." 