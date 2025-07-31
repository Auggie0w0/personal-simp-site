// Debug script to identify and fix gallery modal issues
console.log('Debug script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking for issues...');
    
    // Check if gallery modal exists
    const galleryModal = document.querySelector('.gallery-modal');
    console.log('Gallery modal found:', !!galleryModal);
    
    if (galleryModal) {
        console.log('Gallery modal structure:', galleryModal.innerHTML);
    } else {
        console.error('Gallery modal not found! Creating one...');
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="gallery-modal-close">&times;</div>
            <img src="" alt="Full size image">
        `;
        document.body.appendChild(modal);
        console.log('Gallery modal created');
    }
    
    // Check gallery images
    const galleryImages = document.querySelectorAll('.gallery-image img');
    console.log('Gallery images found:', galleryImages.length);
    
    // Define handleImageClick function
    function handleImageClick(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Image clicked:', this.src);
        openGalleryModal(this.src, this.alt);
    }
    
    // Add click listeners to gallery images
    galleryImages.forEach((img, index) => {
        console.log(`Image ${index + 1}:`, img.src);
        
        // Remove any existing listeners
        img.removeEventListener('click', handleImageClick);
        
        // Add new listener
        img.addEventListener('click', handleImageClick);
        
        console.log(`Added click listener to image ${index + 1}`);
    });
    
    // Define openGalleryModal function if it doesn't exist
    if (typeof window.openGalleryModal !== 'function') {
        window.openGalleryModal = function(src, alt) {
            console.log('Opening modal with:', src);
            const modal = document.querySelector('.gallery-modal');
            const modalImg = modal.querySelector('img');
            
            if (!modal || !modalImg) {
                console.error('Modal or modal image not found!');
                return;
            }
            
            modalImg.src = src;
            modalImg.alt = alt;
            
            // Show modal immediately
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            
            // Reset and animate image
            modalImg.style.transform = 'scale(0.1)';
            modalImg.style.opacity = '0';
            
            modal.classList.add('active');
            console.log('Modal active class added');
            
            // Trigger animation after a small delay
            setTimeout(() => {
                modalImg.style.transform = 'scale(1)';
                modalImg.style.opacity = '1';
                console.log('Modal animation triggered');
            }, 50);
            
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        };
        console.log('openGalleryModal function defined');
    }
    
    // Define closeGalleryModal function if it doesn't exist
    if (typeof window.closeGalleryModal !== 'function') {
        window.closeGalleryModal = function() {
            console.log('Closing modal');
            const modal = document.querySelector('.gallery-modal');
            const modalImg = modal.querySelector('img');
            
            if (!modal || !modalImg) {
                console.error('Modal or modal image not found for closing!');
                return;
            }
            
            // Animate closing
            modalImg.style.transform = 'scale(0.1)';
            modalImg.style.opacity = '0';
            
            // Remove active class and hide modal after animation
            setTimeout(() => {
                modal.classList.remove('active');
                modal.style.display = 'none';
                modal.style.opacity = '0';
                // Restore body scroll
                document.body.style.overflow = '';
                console.log('Modal closed');
            }, 400);
        };
        console.log('closeGalleryModal function defined');
    }
    
    // Set up modal event listeners
    const modal = document.querySelector('.gallery-modal');
    const closeBtn = document.querySelector('.gallery-modal-close');
    
    if (modal && closeBtn) {
        // Define handleModalClick function
        function handleModalClick(e) {
            if (e.target === e.currentTarget) {
                console.log('Modal background clicked');
                closeGalleryModal();
            }
        }
        
        // Remove existing listeners
        modal.removeEventListener('click', handleModalClick);
        closeBtn.removeEventListener('click', closeGalleryModal);
        
        // Add new listeners
        modal.addEventListener('click', handleModalClick);
        closeBtn.addEventListener('click', closeGalleryModal);
        console.log('Modal event listeners set up');
    }
    
    // Define handleEscapeKey function
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            console.log('Escape key pressed');
            closeGalleryModal();
        }
    }
    
    // Close modal with Escape key
    document.removeEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleEscapeKey);
    
    console.log('Debug initialization complete');
});

// Function to check for broken images
function checkBrokenImages() {
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

// Check for broken images after a delay
setTimeout(checkBrokenImages, 3000);