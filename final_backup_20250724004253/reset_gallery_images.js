// Reset Gallery Images Script
// This script clears all user-added gallery images from localStorage

// Remove all gallery images data
localStorage.removeItem('characterGalleryImages');

// Log confirmation
console.log('All gallery images have been reset!');
alert('All gallery images have been successfully reset! The pages will now show only the original images.');

// Reload the page to reflect changes
setTimeout(() => {
  window.location.reload();
}, 1000); 