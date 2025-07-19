// Gallery Debug Script
// This script helps diagnose issues with gallery persistence

console.log('Gallery Debug Script loaded');

// Check if localStorage is available
function checkLocalStorage() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        console.log('✅ localStorage is available');
        return true;
    } catch (e) {
        console.error('❌ localStorage is NOT available:', e);
        return false;
    }
}

// Check localStorage size
function checkLocalStorageSize() {
    try {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += (localStorage[key].length + key.length) * 2; // UTF-16 uses 2 bytes per character
            }
        }
        console.log(`📊 localStorage usage: ${(totalSize / 1024).toFixed(2)} KB / 5120 KB (5MB limit)`);
        return totalSize;
    } catch (e) {
        console.error('Error checking localStorage size:', e);
        return -1;
    }
}

// Check if gallery images are stored in localStorage
function checkGalleryImages() {
    try {
        const galleryImages = JSON.parse(localStorage.getItem('characterGalleryImages') || '{}');
        const characterCount = Object.keys(galleryImages).length;
        console.log(`📷 Gallery images found for ${characterCount} character(s)`);
        
        if (characterCount > 0) {
            console.log('Characters with saved images:');
            for (const characterId in galleryImages) {
                console.log(`- ${characterId}: ${galleryImages[characterId].length} image(s)`);
            }
        } else {
            console.warn('⚠️ No gallery images found in localStorage');
        }
        
        return galleryImages;
    } catch (e) {
        console.error('❌ Error checking gallery images:', e);
        return {};
    }
}

// Check current character ID
function checkCurrentCharacterId() {
    // Get character ID from the current page
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (!filename || !filename.endsWith('.html')) {
        console.warn('⚠️ Not on a character page');
        return null;
    }
    
    const characterId = filename.replace('.html', '');
    console.log(`👤 Current character ID: ${characterId}`);
    
    // Check if this character has images in localStorage
    try {
        const galleryImages = JSON.parse(localStorage.getItem('characterGalleryImages') || '{}');
        const characterImages = galleryImages[characterId] || [];
        
        if (characterImages.length > 0) {
            console.log(`✅ Found ${characterImages.length} saved image(s) for ${characterId}`);
        } else {
            console.warn(`⚠️ No saved images found for ${characterId}`);
        }
        
        return characterId;
    } catch (e) {
        console.error('Error checking current character images:', e);
        return characterId;
    }
}

// Check if the gallery container exists
function checkGalleryContainer() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageGallery = document.querySelector('.image-gallery');
    const targetContainer = galleryGrid || imageGallery;
    
    if (targetContainer) {
        console.log(`✅ Gallery container found: ${galleryGrid ? '.gallery-grid' : '.image-gallery'}`);
        const addPhotoCard = targetContainer.querySelector('.add-photo-card');
        if (addPhotoCard) {
            console.log('✅ Add photo card found');
            
            // Check the position of the add photo card
            const children = Array.from(targetContainer.children);
            const addPhotoIndex = children.indexOf(addPhotoCard);
            console.log(`📌 Add photo card position: ${addPhotoIndex + 1} of ${children.length}`);
            
            if (addPhotoIndex === 0) {
                console.log('✅ Add photo card is correctly positioned at the beginning');
            } else {
                console.warn('⚠️ Add photo card is NOT at the beginning of the gallery');
            }
            
            // Check if images are after the add photo card
            const imagesAfterAddPhoto = children.slice(addPhotoIndex + 1).filter(el => 
                el.classList.contains('gallery-item') || el.classList.contains('gallery-image')
            );
            
            console.log(`📊 Images after add photo card: ${imagesAfterAddPhoto.length}`);
            
        } else {
            console.warn('⚠️ Add photo card not found');
        }
        return true;
    } else {
        console.error('❌ Gallery container not found');
        return false;
    }
}

// Check if fix-gallery-persistence.js is properly loaded
function checkFixGalleryPersistence() {
    if (typeof loadImagesFromLocalStorage === 'function') {
        console.log('✅ fix-gallery-persistence.js is properly loaded');
        return true;
    } else {
        console.error('❌ fix-gallery-persistence.js is NOT properly loaded');
        return false;
    }
}

// Check if the original addPhotosToGallery function is properly overridden
function checkAddPhotosToGalleryOverride() {
    if (window.addPhotosToGallery.toString().includes('saveImagesToLocalStorage')) {
        console.log('✅ addPhotosToGallery is properly overridden');
        return true;
    } else {
        console.error('❌ addPhotosToGallery is NOT properly overridden');
        console.log('Current implementation:', window.addPhotosToGallery.toString().substring(0, 100) + '...');
        return false;
    }
}

// Check image ordering in the gallery
function checkGalleryImageOrdering() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageGallery = document.querySelector('.image-gallery');
    const targetContainer = galleryGrid || imageGallery;
    
    if (!targetContainer) {
        console.error('❌ Gallery container not found');
        return false;
    }
    
    const addPhotoCard = targetContainer.querySelector('.add-photo-card');
    if (!addPhotoCard) {
        console.warn('⚠️ Add photo card not found');
        return false;
    }
    
    const children = Array.from(targetContainer.children);
    const addPhotoIndex = children.indexOf(addPhotoCard);
    
    // Check if there are any gallery items before the add photo card
    const itemsBeforeAddPhoto = children.slice(0, addPhotoIndex).filter(el => 
        el.classList.contains('gallery-item') || el.classList.contains('gallery-image')
    );
    
    if (itemsBeforeAddPhoto.length > 0) {
        console.warn(`⚠️ Found ${itemsBeforeAddPhoto.length} gallery items BEFORE the add photo card`);
        return false;
    } else {
        console.log('✅ No gallery items found before the add photo card');
        return true;
    }
}

// Run all checks
function runAllChecks() {
    console.log('🔍 Running gallery persistence diagnostics...');
    
    const lsAvailable = checkLocalStorage();
    if (!lsAvailable) {
        console.error('❌ Cannot continue checks - localStorage is not available');
        return;
    }
    
    checkLocalStorageSize();
    checkGalleryImages();
    checkCurrentCharacterId();
    checkGalleryContainer();
    checkFixGalleryPersistence();
    checkAddPhotosToGalleryOverride();
    checkGalleryImageOrdering();
    
    console.log('🔍 Diagnostics complete');
}

// Fix gallery image ordering if needed
function fixGalleryImageOrdering() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageGallery = document.querySelector('.image-gallery');
    const targetContainer = galleryGrid || imageGallery;
    
    if (!targetContainer) {
        console.error('❌ Cannot fix ordering - gallery container not found');
        return false;
    }
    
    const addPhotoCard = targetContainer.querySelector('.add-photo-card');
    if (!addPhotoCard) {
        console.warn('⚠️ Cannot fix ordering - add photo card not found');
        return false;
    }
    
    console.log('🔄 Fixing gallery image ordering...');
    
    // Move the add photo card to the beginning of the container
    targetContainer.insertBefore(addPhotoCard, targetContainer.firstChild);
    
    console.log('✅ Add photo card moved to the beginning of the gallery');
    return true;
}

// Add a button to manually trigger image loading
function addDebugButton() {
    const debugButton = document.createElement('button');
    debugButton.textContent = 'Debug Gallery';
    debugButton.style.position = 'fixed';
    debugButton.style.bottom = '10px';
    debugButton.style.right = '10px';
    debugButton.style.zIndex = '9999';
    debugButton.style.padding = '10px';
    debugButton.style.backgroundColor = '#ff5722';
    debugButton.style.color = 'white';
    debugButton.style.border = 'none';
    debugButton.style.borderRadius = '4px';
    debugButton.style.cursor = 'pointer';
    
    debugButton.addEventListener('click', function() {
        runAllChecks();
        
        // Try to manually load images
        if (typeof loadImagesFromLocalStorage === 'function') {
            console.log('🔄 Manually triggering image loading...');
            loadImagesFromLocalStorage();
        } else {
            console.error('❌ Cannot manually load images - function not found');
        }
    });
    
    document.body.appendChild(debugButton);
    
    // Add fix ordering button
    const fixOrderButton = document.createElement('button');
    fixOrderButton.textContent = 'Fix Image Order';
    fixOrderButton.style.position = 'fixed';
    fixOrderButton.style.bottom = '10px';
    fixOrderButton.style.right = '130px';
    fixOrderButton.style.zIndex = '9999';
    fixOrderButton.style.padding = '10px';
    fixOrderButton.style.backgroundColor = '#2196F3';
    fixOrderButton.style.color = 'white';
    fixOrderButton.style.border = 'none';
    fixOrderButton.style.borderRadius = '4px';
    fixOrderButton.style.cursor = 'pointer';
    
    fixOrderButton.addEventListener('click', function() {
        fixGalleryImageOrdering();
        setTimeout(runAllChecks, 500);
    });
    
    document.body.appendChild(fixOrderButton);
}

// Run diagnostics when the script loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Gallery debug script initialized');
    setTimeout(function() {
        runAllChecks();
        addDebugButton();
    }, 1000); // Wait a second to make sure everything else is loaded
}); 