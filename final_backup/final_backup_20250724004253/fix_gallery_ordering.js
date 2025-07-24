// Fix Gallery Ordering
// This script ensures that newly added images appear after the Add Photo block

// Function to fix gallery ordering on page load
function fixGalleryOrdering() {
    console.log('Fixing gallery ordering...');
    
    // Find the gallery container
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageGallery = document.querySelector('.image-gallery');
    const targetContainer = galleryGrid || imageGallery;
    
    if (!targetContainer) {
        console.log('No gallery container found');
        return;
    }
    
    // Find the add-photo-card
    const addPhotoCard = targetContainer.querySelector('.add-photo-card');
    
    if (!addPhotoCard) {
        console.log('No add-photo-card found');
        return;
    }
    
    // Move the add-photo-card to the beginning of the gallery
    targetContainer.insertBefore(addPhotoCard, targetContainer.firstChild);
    
    console.log('Gallery ordering fixed - Add Photo card moved to the beginning');
}

// Override the addPhotosToGallery function to ensure new images are added after the Add Photo card
const originalAddPhotosToGallery = window.addPhotosToGallery;

window.addPhotosToGallery = function() {
    // First make sure the Add Photo card is at the beginning
    fixGalleryOrdering();
    
    // Call the original function (which has been modified in fix-gallery-persistence.js)
    if (typeof originalAddPhotosToGallery === 'function') {
        return originalAddPhotosToGallery.apply(this, arguments);
    }
};

// Run the fix when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('fix_gallery_ordering.js loaded');
    
    // Fix the ordering immediately
    fixGalleryOrdering();
    
    // Also fix after a short delay to ensure all content is loaded
    setTimeout(fixGalleryOrdering, 500);
}); 