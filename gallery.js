// Gallery System
// This file handles storing and retrieving character gallery images

// Get gallery images from localStorage
function getGalleryImages() {
    return JSON.parse(localStorage.getItem('characterGalleryImages') || '{}');
}

// Save gallery images to localStorage
function saveGalleryImages(galleryImages) {
    localStorage.setItem('characterGalleryImages', JSON.stringify(galleryImages));
}

// Add images to a character's gallery
function addImagesToGallery(characterId, images) {
    if (!characterId || !images || images.length === 0) return;
    
    // Get current gallery images
    const galleryImages = getGalleryImages();
    
    // Initialize character's gallery if it doesn't exist
    if (!galleryImages[characterId]) {
        galleryImages[characterId] = [];
    }
    
    // Add new images
    galleryImages[characterId] = [...galleryImages[characterId], ...images];
    
    // Save to localStorage
    saveGalleryImages(galleryImages);
    
    return galleryImages[characterId];
}

// Load gallery images for a character
function loadGalleryImages(characterId) {
    if (!characterId) return [];
    
    const galleryImages = getGalleryImages();
    return galleryImages[characterId] || [];
}

// Initialize gallery when page loads
function initializeGallery() {
    // Get character ID from the current page
    const characterId = getCurrentCharacterId();
    if (!characterId) return;
    
    // Load saved images for this character
    const savedImages = loadGalleryImages(characterId);
    if (savedImages.length === 0) return;
    
    // Find the gallery container
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageGallery = document.querySelector('.image-gallery');
    const targetContainer = galleryGrid || imageGallery;
    
    if (!targetContainer) return;
    
    // Find the add-photo-card to insert images before it
    const addPhotoCard = targetContainer.querySelector('.add-photo-card');
    
    // Add saved images to the gallery
    savedImages.forEach(imageData => {
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
        initGalleryModals();
    }
}

// Get the current character ID from the page
function getCurrentCharacterId() {
    // Try to get from URL first (e.g., wolfgang.html -> wolfgang)
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename && filename.endsWith('.html')) {
        const characterId = filename.replace('.html', '');
        return characterId;
    }
    
    // If not found in URL, try to get from the page content
    // This is a fallback method that looks for character-specific elements
    const characterElements = [
        { selector: '[id^="rating-"]', idExtractor: el => el.id.replace('rating-', '') },
        { selector: '.character-name', idExtractor: el => el.textContent.toLowerCase().replace(/\s+/g, '') }
    ];
    
    for (const { selector, idExtractor } of characterElements) {
        const element = document.querySelector(selector);
        if (element) {
            return idExtractor(element);
        }
    }
    
    return null;
}

// Override the original addPhotosToGallery function to save images
function addPhotosToGallery() {
    if (!currentCharacterId || selectedImages.length === 0) return;
    
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
    addImagesToGallery(currentCharacterId, selectedImages);
    
    // Re-initialize gallery modals for new images
    if (typeof initGalleryModals === 'function') {
        initGalleryModals();
    }
    
    // Close modal and show success message
    if (typeof closeAddPhotoModal === 'function') {
        closeAddPhotoModal();
    }
    
    alert(`Successfully added ${selectedImages.length} image(s) to the gallery!`);
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the gallery with saved images
    initializeGallery();
}); 