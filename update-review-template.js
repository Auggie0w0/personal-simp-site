/**
 * Update Review Template
 * This script updates the review card layout in reviews.html
 */

const fs = require('fs');
const path = require('path');

// Path to the reviews file
const reviewsPath = path.join(__dirname, 'reviews.html');

/**
 * Update the review card layout in reviews.html
 */
function updateReviewCardLayout() {
    try {
        // Read the reviews file
        let content = fs.readFileSync(reviewsPath, 'utf8');
        
        // Regular expression to match review cards
        const reviewCardRegex = /<div class="review-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
        
        // Find all review cards
        const reviewCards = content.match(reviewCardRegex);
        
        if (!reviewCards || reviewCards.length === 0) {
            console.error('No review cards found in the file');
            return;
        }
        
        console.log(`Found ${reviewCards.length} review cards`);
        
        // Process each review card
        const updatedContent = content.replace(reviewCardRegex, (card) => {
            // Extract the header content
            const headerRegex = /<div class="review-header">([\s\S]*?)<\/div>/;
            const headerMatch = card.match(headerRegex);
            
            if (!headerMatch) {
                console.warn('Could not find header in a review card, skipping...');
                return card;
            }
            
            // Extract title and rating
            const titleRegex = /<h3>(.*?)<\/h3>/;
            const titleMatch = headerMatch[1].match(titleRegex);
            
            const ratingRegex = /<div class="review-rating">([\s\S]*?)<\/div>/;
            const ratingMatch = headerMatch[1].match(ratingRegex);
            
            if (!titleMatch || !ratingMatch) {
                console.warn('Could not find title or rating in a review card, skipping...');
                return card;
            }
            
            const title = titleMatch[1];
            const rating = ratingMatch[1];
            
            // Create the new header with title on top and rating below
            const newHeader = `<div class="review-header">
                <h3>${title}</h3>
                <div class="review-rating">
                    ${rating.trim()}
                </div>
            </div>`;
            
            // Replace the old header with the new one
            return card.replace(headerRegex, newHeader);
        });
        
        // Write the updated content back to the file
        fs.writeFileSync(reviewsPath, updatedContent);
        console.log('Successfully updated review card layout');
        
    } catch (error) {
        console.error(`Error updating review card layout: ${error.message}`);
    }
}

// Run the update function if this script is executed directly
if (require.main === module) {
    updateReviewCardLayout();
}

module.exports = {
    updateReviewCardLayout
}; 