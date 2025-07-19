// Character Ratings System
// This file handles storing and retrieving character ratings

// Get ratings from localStorage
function getRatings() {
    return JSON.parse(localStorage.getItem('characterRatings') || '{}');
}

// Save ratings to localStorage
function saveRatings(ratings) {
    localStorage.setItem('characterRatings', JSON.stringify(ratings));
}

// Rate a character
function rateCharacter(characterId, rating) {
    // Get current ratings
    const ratings = getRatings();
    
    // Get or initialize this character's rating data
    const characterRating = ratings[characterId] || { total: 0, count: 0, average: 0 };
    
    // Update rating
    characterRating.total = (characterRating.total || 0) + rating;
    characterRating.count = (characterRating.count || 0) + 1;
    characterRating.average = Math.round((characterRating.total / characterRating.count) * 10) / 10; // Round to 1 decimal
    
    // Save back to ratings object
    ratings[characterId] = characterRating;
    
    // Save to localStorage
    saveRatings(ratings);
    
    // Update rating display
    updateRatingDisplay(characterId, characterRating.average, characterRating.count);
    
    // Show confirmation
    alert(`Thank you for rating! Current average: ${characterRating.average.toFixed(1)}/5 (${characterRating.count} votes)`);
    
    return characterRating;
}

// Update the rating display in the DOM
function updateRatingDisplay(characterId, rating, count) {
    const ratingElement = document.getElementById(`rating-${characterId}`);
    if (ratingElement) {
        const ratingDisplay = ratingElement.querySelector('.rating-display');
        if (ratingDisplay) {
            ratingDisplay.innerHTML = `
                <span class="stars">${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}</span>
                <span class="rating-text">${rating.toFixed(1)}/5 (${count} votes)</span>
            `;
        }
    }
}

// Initialize ratings on page load
function initializeRatings() {
    const ratings = getRatings();
    
    // Find all rating containers
    const ratingContainers = document.querySelectorAll('[id^="rating-"]');
    
    ratingContainers.forEach(container => {
        // Extract character ID from container ID
        const characterId = container.id.replace('rating-', '');
        
        // Get rating data for this character
        const ratingData = ratings[characterId];
        
        if (ratingData) {
            // Update display with saved rating
            const ratingDisplay = container.querySelector('.rating-display');
            if (ratingDisplay) {
                ratingDisplay.innerHTML = `
                    <span class="stars">${'★'.repeat(Math.floor(ratingData.average))}${'☆'.repeat(5 - Math.floor(ratingData.average))}</span>
                    <span class="rating-text">${ratingData.average.toFixed(1)}/5 (${ratingData.count} votes)</span>
                `;
            }
        }
    });
}

// Initialize ratings when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeRatings); 