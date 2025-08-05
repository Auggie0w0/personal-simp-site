// shared-gallery.js - Replaces localStorage gallery with server-based solution

// Configuration object for gallery settings
const GALLERY_CONFIG = {
  // API base URL - change this to your server URL when deployed
  // Default: Local development server
  // Production: Update this when deploying
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  
  // Enable debug mode for additional console logging
  DEBUG: false
};

// Use API_BASE_URL from config for backward compatibility
const API_BASE_URL = GALLERY_CONFIG.API_BASE_URL;

// Function to load images from server for a character
async function loadImagesFromServer(characterId) {
  if (!characterId) return;
  
  if (GALLERY_CONFIG.DEBUG) console.log('Loading images from server for character:', characterId);
  
  try {
    const response = await fetch(`${API_BASE_URL}/images/${characterId}`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const images = await response.json();
    
    if (!images || images.length === 0) {
      console.log('No gallery images found for this character');
      return;
    }
    
    if (GALLERY_CONFIG.DEBUG) console.log(`Found ${images.length} images for character ${characterId}`);
    
    // Find the gallery container
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageGallery = document.querySelector('.image-gallery');
    const targetContainer = galleryGrid || imageGallery;
    
    if (!targetContainer) {
      console.error('No gallery container found');
      return;
    }
    
    // Find the add-photo-card
    const addPhotoCard = targetContainer.querySelector('.add-photo-card');
    
    if (!addPhotoCard) {
      console.error('Add photo card not found');
      return;
    }
    
    // Add saved images to the gallery AFTER the add-photo-card
    images.forEach(imageData => {
      // Skip if image is already in the gallery (check by src)
      const existingImages = targetContainer.querySelectorAll('img');
      const alreadyExists = Array.from(existingImages).some(img => img.src === imageData.src);
      
      if (alreadyExists) {
        if (GALLERY_CONFIG.DEBUG) console.log('Image already exists in gallery, skipping:', imageData.src.substring(0, 50) + '...');
        return;
      }
      
      if (GALLERY_CONFIG.DEBUG) console.log('Adding image to gallery:', imageData.src.substring(0, 50) + '...');
      
      const galleryItem = document.createElement('div');
      galleryItem.className = galleryGrid ? 'gallery-item' : 'gallery-image';
      galleryItem.innerHTML = `
        <img src="${imageData.src}" alt="${imageData.alt || 'Gallery Image'}" ${galleryGrid ? 'onclick="openGalleryModal(this.src, this.alt)"' : ''}>
      `;
      
      // Insert AFTER the add-photo-card
      if (addPhotoCard.nextSibling) {
        targetContainer.insertBefore(galleryItem, addPhotoCard.nextSibling);
      } else {
        targetContainer.appendChild(galleryItem);
      }
    });
    
    // Re-initialize gallery modals for the loaded images
    if (typeof initGalleryModals === 'function') {
      setTimeout(initGalleryModals, 100);
    }
    
  } catch (error) {
    console.error('Error loading images from server:', error);
  }
}

// Function to upload an image URL to the server
async function uploadImageUrlToServer(characterId, imageUrl, altText) {
  if (!characterId || !imageUrl) return null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/images/${characterId}/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src: imageUrl,
        alt: altText || `${characterId} Gallery Image`
      })
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading image URL to server:', error);
    return null;
  }
}

// Function to upload an image file to the server
async function uploadImageFileToServer(characterId, imageFile, altText) {
  if (!characterId || !imageFile) return null;
  
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    if (altText) {
      formData.append('alt', altText);
    }
    
    const response = await fetch(`${API_BASE_URL}/images/${characterId}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading image file to server:', error);
    return null;
  }
}

// Override the original addPhotosToGallery function
window.addPhotosToGallery = async function() {
  if (!currentCharacterId || selectedImages.length === 0) return;
  
  if (GALLERY_CONFIG.DEBUG) console.log('Enhanced addPhotosToGallery called for character:', currentCharacterId);
  
  try {
    // Show loading indicator
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading-message';
    loadingMessage.textContent = 'Uploading images...';
    document.body.appendChild(loadingMessage);
    
    // Upload each image to the server
    for (const imageData of selectedImages) {
      // If the image is a File object (from file upload), upload it as a file
      if (imageData.file) {
        await uploadImageFileToServer(
          currentCharacterId, 
          imageData.file, 
          `${currentCharacterId} Gallery Image`
        );
      } 
      // If the image is a URL (from paste or drag-and-drop), save it as a URL
      else if (imageData.src) {
        await uploadImageUrlToServer(
          currentCharacterId, 
          imageData.src, 
          `${currentCharacterId} Gallery Image`
        );
      }
    }
    
    // Remove loading indicator
    document.body.removeChild(loadingMessage);
    
    // Reload images from server to ensure we have the latest
    await loadImagesFromServer(currentCharacterId);
    
    // Close modal and show success message
    if (typeof closeAddPhotoModal === 'function') {
      closeAddPhotoModal();
    }
    
    alert(`Successfully added ${selectedImages.length} image(s) to the gallery! Images will be visible to all users.`);
  } catch (error) {
    console.error('Error adding photos to gallery:', error);
    alert('There was an error adding photos to the gallery. Please try again.');
  }
};

// Function to migrate localStorage images to the server
async function migrateLocalStorageImagesToServer() {
  // Get all images from localStorage
  const galleryImages = JSON.parse(localStorage.getItem('characterGalleryImages') || '{}');
  
  if (Object.keys(galleryImages).length === 0) {
    alert('No images found in localStorage to migrate.');
    return;
  }
  
  // Show loading indicator
  const loadingMessage = document.createElement('div');
  loadingMessage.className = 'loading-message';
  loadingMessage.textContent = 'Migrating images from localStorage to server...';
  loadingMessage.style.position = 'fixed';
  loadingMessage.style.top = '50%';
  loadingMessage.style.left = '50%';
  loadingMessage.style.transform = 'translate(-50%, -50%)';
  loadingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  loadingMessage.style.color = 'white';
  loadingMessage.style.padding = '20px';
  loadingMessage.style.borderRadius = '5px';
  loadingMessage.style.zIndex = '9999';
  document.body.appendChild(loadingMessage);
  
  try {
    let totalImages = 0;
    let migratedImages = 0;
    
    // Count total images
    for (const characterId in galleryImages) {
      totalImages += galleryImages[characterId].length;
    }
    
    // Migrate images for each character
    for (const characterId in galleryImages) {
      const images = galleryImages[characterId];
      
      for (const imageData of images) {
        // Update loading message
        loadingMessage.textContent = `Migrating images: ${migratedImages}/${totalImages}`;
        
        // Upload image to server
        if (imageData.src) {
          await uploadImageUrlToServer(
            characterId,
            imageData.src,
            imageData.alt || `${characterId} Gallery Image`
          );
          
          migratedImages++;
        }
      }
    }
    
    // Clear localStorage after successful migration
    localStorage.removeItem('characterGalleryImages');
    
    // Remove loading indicator
    document.body.removeChild(loadingMessage);
    
    alert(`Successfully migrated ${migratedImages} images to the server. All users will now be able to see these images.`);
    
    // Reload the current page to show the migrated images
    window.location.reload();
    
  } catch (error) {
    console.error('Error migrating images:', error);
    
    // Remove loading indicator
    document.body.removeChild(loadingMessage);
    
    alert('There was an error migrating images to the server. Please try again.');
  }
}

// Add migration button to the page
function addMigrationButton() {
  // Only add the button if there are images in localStorage
  const galleryImages = JSON.parse(localStorage.getItem('characterGalleryImages') || '{}');
  const currentCharacterId = getCurrentCharacterId();
  
  if (currentCharacterId && galleryImages[currentCharacterId] && galleryImages[currentCharacterId].length > 0) {
    // Find the gallery container
    const gallerySection = document.querySelector('.gallery-section');
    
    if (gallerySection) {
      // Create migration button
      const migrationButton = document.createElement('button');
      migrationButton.className = 'btn migration-btn';
      migrationButton.textContent = 'Migrate My Images to Server';
      migrationButton.style.marginTop = '10px';
      migrationButton.style.marginBottom = '20px';
      migrationButton.style.display = 'block';
      migrationButton.onclick = migrateLocalStorageImagesToServer;
      
      // Add migration notice
      const migrationNotice = document.createElement('div');
      migrationNotice.className = 'migration-notice';
      migrationNotice.innerHTML = `
        <p>You have ${galleryImages[currentCharacterId].length} images stored locally. 
        Click the button below to migrate them to the server so all users can see them.</p>
      `;
      migrationNotice.style.marginTop = '10px';
      migrationNotice.style.padding = '10px';
      migrationNotice.style.backgroundColor = '#f8f9fa';
      migrationNotice.style.borderRadius = '5px';
      
      // Create container for migration elements
      const migrationContainer = document.createElement('div');
      migrationContainer.className = 'migration-container';
      migrationContainer.appendChild(migrationNotice);
      migrationContainer.appendChild(migrationButton);
      
      // Insert after gallery heading
      const galleryHeading = gallerySection.querySelector('h2');
      if (galleryHeading && galleryHeading.nextSibling) {
        gallerySection.insertBefore(migrationContainer, galleryHeading.nextSibling);
      } else {
        gallerySection.appendChild(migrationContainer);
      }
    }
  }
}

// Helper function to get current character ID
function getCurrentCharacterId() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  
  if (filename && filename.endsWith('.html')) {
    return filename.replace('.html', '');
  }
  
  return null;
}

// Add CSS for loading message
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
  .loading-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 5px;
    z-index: 9999;
  }
`;
document.head.appendChild(loadingStyle);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (GALLERY_CONFIG.DEBUG) console.log('shared-gallery.js loaded');
  
  // Get character ID from the current page
  const characterId = getCurrentCharacterId();
  
  if (characterId) {
    // Load images from server
    loadImagesFromServer(characterId);
    
    // Add migration button if needed
    addMigrationButton();
  }
}); 