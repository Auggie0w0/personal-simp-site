// Reset Ratings Script
// This script clears all ratings data from localStorage

// Remove all ratings data
localStorage.removeItem('characterRatings');
localStorage.removeItem('userVotes');

// Log confirmation
console.log('All ratings have been reset!');
alert('All character ratings have been successfully reset!');

// Reload the page to reflect changes
setTimeout(() => {
  window.location.reload();
}, 1000); 