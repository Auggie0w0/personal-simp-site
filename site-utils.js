/**
 * Site Utilities
 * This file consolidates functionality from multiple utility scripts
 */

// Gallery utilities
const galleryUtils = {
    // Fix gallery ordering
    fixGalleryOrdering: function() {
        console.log('Fixing gallery ordering...');
        
        // Get all character galleries from localStorage
        const galleries = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('gallery_')) {
                const characterId = key.replace('gallery_', '');
                try {
                    const galleryData = JSON.parse(localStorage.getItem(key));
                    if (Array.isArray(galleryData)) {
                        galleries[characterId] = galleryData;
                    }
                } catch (e) {
                    console.error(`Error parsing gallery data for ${characterId}:`, e);
                }
            }
        }
        
        // Fix ordering for each gallery
        for (const characterId in galleries) {
            const gallery = galleries[characterId];
            
            // Ensure each item has an order property
            gallery.forEach((item, index) => {
                if (!item.order) {
                    item.order = index;
                }
            });
            
            // Sort by order
            gallery.sort((a, b) => a.order - b.order);
            
            // Save back to localStorage
            localStorage.setItem(`gallery_${characterId}`, JSON.stringify(gallery));
            console.log(`Fixed ordering for ${characterId} gallery (${gallery.length} items)`);
        }
        
        console.log('Gallery ordering fixed!');
        return galleries;
    },
    
    // Reset gallery images
    resetGalleryImages: function() {
        console.log('Resetting gallery images...');
        
        // Find all gallery keys in localStorage
        const galleryKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('gallery_')) {
                galleryKeys.push(key);
            }
        }
        
        // Remove all gallery data
        galleryKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`Removed ${key}`);
        });
        
        console.log(`Reset ${galleryKeys.length} galleries`);
        return galleryKeys.length;
    },
    
    // Fix gallery persistence
    fixGalleryPersistence: function() {
        console.log('Fixing gallery persistence...');
        
        // Check for old format galleries
        const oldFormatGalleries = {};
        const newFormatGalleries = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('gallery_')) {
                const characterId = key.replace('gallery_', '');
                try {
                    const galleryData = JSON.parse(localStorage.getItem(key));
                    
                    // Check if it's the old format (array of strings) or new format (array of objects)
                    if (Array.isArray(galleryData)) {
                        if (galleryData.length > 0) {
                            if (typeof galleryData[0] === 'string') {
                                oldFormatGalleries[characterId] = galleryData;
                            } else {
                                newFormatGalleries[characterId] = galleryData;
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Error parsing gallery data for ${characterId}:`, e);
                }
            }
        }
        
        // Convert old format galleries to new format
        for (const characterId in oldFormatGalleries) {
            const oldGallery = oldFormatGalleries[characterId];
            const newGallery = oldGallery.map((url, index) => ({
                url,
                alt: `${characterId} image ${index + 1}`,
                order: index
            }));
            
            localStorage.setItem(`gallery_${characterId}`, JSON.stringify(newGallery));
            console.log(`Converted gallery for ${characterId} (${oldGallery.length} items)`);
        }
        
        console.log(`Fixed ${Object.keys(oldFormatGalleries).length} galleries`);
        return {
            fixed: Object.keys(oldFormatGalleries).length,
            alreadyFixed: Object.keys(newFormatGalleries).length
        };
    }
};

// Rating utilities
const ratingUtils = {
    // Reset ratings
    resetRatings: function() {
        console.log('Resetting ratings...');
        
        // Find all rating keys in localStorage
        const ratingKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('rating_')) {
                ratingKeys.push(key);
            }
        }
        
        // Remove all rating data
        ratingKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`Removed ${key}`);
        });
        
        console.log(`Reset ${ratingKeys.length} ratings`);
        return ratingKeys.length;
    }
};

// Debug utilities
const debugUtils = {
    // Check for broken links
    checkBrokenLinks: function() {
        console.log('Checking for broken links...');
        
        // This is a client-side function, so we can't actually check if files exist
        // This would need to be implemented server-side or using the Fetch API
        
        console.log('Link checking would need to be implemented server-side');
        return [];
    },
    
    // Check for broken images
    checkBrokenImages: function() {
        console.log('Checking for broken images...');
        
        const brokenImages = [];
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.complete || img.naturalWidth === 0) {
                brokenImages.push(img.src);
                console.log(`Broken image: ${img.src}`);
            }
        });
        
        console.log(`Found ${brokenImages.length} broken images`);
        return brokenImages;
    }
};

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        galleryUtils,
        ratingUtils,
        debugUtils
    };
}

// Make utilities available in browser
if (typeof window !== 'undefined') {
    window.siteUtils = {
        galleryUtils,
        ratingUtils,
        debugUtils
    };
    
    // Initialize when the DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Site utilities loaded');
    });
} 