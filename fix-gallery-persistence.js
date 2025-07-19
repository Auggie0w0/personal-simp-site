// Fix Gallery Persistence
// This script ensures that gallery images persist after page reload

// Store the original addPhotosToGallery function from script.js
let originalAddPhotosToGallery = window.addPhotosToGallery;

// Override with our enhanced version that saves to localStorage
window.addPhotosToGallery = function() {
    if (!currentCharacterId || selectedImages.length === 0) return;
    
    console.log('Enhanced addPhotosToGallery called for character:', currentCharacterId);
    console.log('Saving images:', selectedImages.length);
    
    // Get the gallery container (works for both old and new structure)
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageGallery = document.querySelector('.image-gallery');
    const targetContainer = galleryGrid || imageGallery;
    
    if (!targetContainer) return;
    
    // Add images to the DOM
    selectedImages.forEach(imageData => {
        const galleryItem = document.createElement('div');
        galleryItem.className = galleryGrid ? 'gallery-item' : 'gallery-image';
        galleryItem.innerHTML = `
            <img src="${imageData.src}" alt="Added Image" ${galleryGrid ? 'onclick="openGalleryModal(this.src, this.alt)"' : ''}>
        `;
        
        // Insert before the add-photo-card
        const addPhotoCard = targetContainer.querySelector('.add-photo-card');
        if (addPhotoCard) {
            targetContainer.insertBefore(galleryItem, addPhotoCard);
        } else {
            targetContainer.appendChild(galleryItem);
        }
    });
    
    // Save images to localStorage
    saveImagesToLocalStorage(currentCharacterId, selectedImages);
    
    // Re-initialize gallery modals for new images
    if (typeof initGalleryModals === 'function') {
        initGalleryModals();
    }
    
    // Close modal and show success message
    if (typeof closeAddPhotoModal === 'function') {
        closeAddPhotoModal();
    }
    
    alert(`Successfully added ${selectedImages.length} image(s) to the gallery! Images will persist after page reload.`);
};

// Function to save images to localStorage
function saveImagesToLocalStorage(characterId, images) {
    if (!characterId || !images || images.length === 0) return;
    
    // Get current gallery images
    const galleryImages = JSON.parse(localStorage.getItem('characterGalleryImages') || '{}');
    
    // Initialize character's gallery if it doesn't exist
    if (!galleryImages[characterId]) {
        galleryImages[characterId] = [];
    }
    
    // Add new images
    galleryImages[characterId] = [...galleryImages[characterId], ...images];
    
    // Save to localStorage
    localStorage.setItem('characterGalleryImages', JSON.stringify(galleryImages));
    
    console.log(`Saved ${images.length} images for character ${characterId}`);
    console.log('Current localStorage size:', new Blob([JSON.stringify(localStorage)]).size / 1024, 'KB');
}

// Function to load images from localStorage
function loadImagesFromLocalStorage() {
    // Get character ID from the current page
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (!filename || !filename.endsWith('.html')) return;
    
    const characterId = filename.replace('.html', '');
    console.log('Loading images for character:', characterId);
    
    // Get saved images
    const galleryImages = JSON.parse(localStorage.getItem('characterGalleryImages') || '{}');
    const characterImages = galleryImages[characterId] || [];
    
    if (characterImages.length === 0) {
        console.log('No saved images found for this character');
        return;
    }
    
    console.log(`Found ${characterImages.length} saved images for character ${characterId}`);
    
    // Find the gallery container
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageGallery = document.querySelector('.image-gallery');
    const targetContainer = galleryGrid || imageGallery;
    
    if (!targetContainer) {
        console.log('No gallery container found');
        return;
    }
    
    // Find the add-photo-card to insert images before it
    const addPhotoCard = targetContainer.querySelector('.add-photo-card');
    
    // Add saved images to the gallery
    characterImages.forEach(imageData => {
        // Skip if image is already in the gallery (check by src)
        const existingImages = targetContainer.querySelectorAll('img');
        const alreadyExists = Array.from(existingImages).some(img => img.src === imageData.src);
        
        if (alreadyExists) {
            console.log('Image already exists in gallery, skipping:', imageData.src.substring(0, 50) + '...');
            return;
        }
        
        console.log('Adding image to gallery:', imageData.src.substring(0, 50) + '...');
        
        const galleryItem = document.createElement('div');
        galleryItem.className = galleryGrid ? 'gallery-item' : 'gallery-image';
        galleryItem.innerHTML = `
            <img src="${imageData.src}" alt="Gallery Image" ${galleryGrid ? 'onclick="openGalleryModal(this.src, this.alt)"' : ''}>
        `;
        
        // Insert before the add-photo-card or append to container
        if (addPhotoCard) {
            targetContainer.insertBefore(galleryItem, addPhotoCard);
        } else {
            targetContainer.appendChild(galleryItem);
        }
    });
    
    // Re-initialize gallery modals for the loaded images
    if (typeof initGalleryModals === 'function') {
        setTimeout(initGalleryModals, 100);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('fix-gallery-persistence.js loaded');
    loadImagesFromLocalStorage();
}); 