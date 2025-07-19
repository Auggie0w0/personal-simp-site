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

// Get user votes from localStorage
function getUserVotes() {
    return JSON.parse(localStorage.getItem('userVotes') || '{}');
}

// Save user votes to localStorage
function saveUserVotes(votes) {
    localStorage.setItem('userVotes', JSON.stringify(votes));
}

// Check if user has already voted for a character
function hasUserVoted(characterId) {
    const userVotes = getUserVotes();
    return userVotes.hasOwnProperty(characterId);
}

// Get user's vote for a character
function getUserVote(characterId) {
    const userVotes = getUserVotes();
    return userVotes[characterId] || null;
}

// Rate a character
function rateCharacter(characterId, rating) {
    // Check if user has already voted
    if (hasUserVoted(characterId)) {
        const previousVote = getUserVote(characterId);
        alert(`You've already rated this character with ${previousVote} stars! You can only vote once per character.`);
        return;
    }
    
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
    
    // Save user's vote
    const userVotes = getUserVotes();
    userVotes[characterId] = rating;
    saveUserVotes(userVotes);
    
    // Update rating display
    updateRatingDisplay(characterId, characterRating.average, characterRating.count);
    
    // Update button states
    updateRatingButtons(characterId, rating);
    
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

// Update rating buttons to show which one was selected
function updateRatingButtons(characterId, selectedRating) {
    const ratingElement = document.getElementById(`rating-${characterId}`);
    if (ratingElement) {
        const buttons = ratingElement.querySelectorAll('.star-btn');
        buttons.forEach((button, index) => {
            const buttonRating = index + 1;
            if (buttonRating === selectedRating) {
                button.classList.add('selected');
                button.disabled = true;
            } else {
                button.disabled = true;
                button.classList.add('disabled');
            }
        });
        
        // Add message about voting once
        const ratingButtons = ratingElement.querySelector('.rating-buttons');
        if (ratingButtons) {
            const voteMessage = document.createElement('div');
            voteMessage.className = 'vote-message';
            voteMessage.textContent = 'You can only vote once per character.';
            ratingButtons.appendChild(voteMessage);
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
        
        // Check if user has already voted for this character
        if (hasUserVoted(characterId)) {
            const userRating = getUserVote(characterId);
            updateRatingButtons(characterId, userRating);
        }
    });
}

// Initialize ratings when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeRatings); 