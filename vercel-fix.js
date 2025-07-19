// Vercel deployment fix script
console.log('Vercel deployment fix script loaded');

// Function to safely load character data without causing blank pages
function safeLoadCharacters() {
    try {
        // Check if we're on the home page
        const track = document.getElementById("image-track");
        const galleryContainer = document.getElementById("character-gallery");
        
        if (!track && !galleryContainer) {
            console.log('Not on home page, skipping character loading');
            return;
        }
        
        console.log('Loading characters safely for Vercel deployment');
        
        // Static character data that doesn't require fetching
        const staticCharacters = [
            {
                id: 'leeknow',
                name: 'Lee Know',
                series: 'Stray Kids',
                image: 'https://i.pinimg.com/736x/c7/e8/e0/c7e8e0ec5ebd4f9b5540a66bc3fc8db3.jpg',
                link: 'minho.html'
            },
            {
                id: 'wolfgang',
                name: 'Wolfgang Goldenleonard',
                series: 'King\'s Maker: Triple Crown',
                image: 'https://i.pinimg.com/736x/91/ff/ca/91ffcaf02269e4db693ca02a77e790ad.jpg',
                link: 'wolfgang.html'
            },
            {
                id: 'huntrix',
                name: 'Huntrix',
                series: 'K-pop Demon Hunters',
                image: 'https://i.pinimg.com/1200x/55/29/5c/55295c15acd0598ac4be54d1c554bdeb.jpg',
                link: 'huntrix.html'
            },
            {
                id: 'axel',
                name: 'Axel Gilberto',
                series: 'Lazarus',
                image: 'https://i.pinimg.com/736x/a2/8f/c3/a28fc3bbd7eeff3350ff3a1816ba2345.jpg',
                link: 'axel.html'
            },
            {
                id: 'ivan',
                name: 'Ivan',
                series: 'Alien Stage',
                image: 'https://i.pinimg.com/736x/1b/ef/e1/1befe1790551b1b34361b1268cf51c08.jpg',
                link: 'ivan.html'
            },
            {
                id: 'hange',
                name: 'Hange Zoe',
                series: 'Attack on Titan',
                image: 'https://i.pinimg.com/736x/38/4c/6a/384c6a0e795b24a497b07a0829d94b76.jpg',
                link: 'hange.html'
            },
            {
                id: 'yamada',
                name: 'Akito Yamada',
                series: 'My Love Story with Yamada-kun at Lv999',
                image: 'https://i.pinimg.com/564x/89/8f/0e/898f0e6fc27ec350f17866c321db45e8.jpg',
                link: 'yamada.html'
            },
            {
                id: 'dazai',
                name: 'Osamu Dazai',
                series: 'Bungou Stray Dogs',
                image: 'https://i.pinimg.com/736x/1e/32/76/1e3276d446f3de6ef84f3149f1cdf8c0.jpg',
                link: 'dazai.html'
            },
            {
                id: 'miyamura',
                name: 'Izumi Miyamura',
                series: 'Horimiya',
                image: 'https://i.pinimg.com/originals/08/38/c0/0838c09105f683d3d6f68fe101f0a69f.png',
                link: 'miyamura.html'
            },
            {
                id: 'saja',
                name: 'Saja',
                series: 'K-pop Demon Hunters',
                image: 'https://i.pinimg.com/736x/de/6b/b4/de6bb44a43104f4011b6041fc7e9bc61.jpg',
                link: 'saja.html'
            }
        ];
        
        // Load carousel if it exists
        if (track) {
            console.log('Loading carousel characters');
            loadCarouselCharactersSafely(staticCharacters, track);
        }
        
        // Load gallery if it exists
        if (galleryContainer) {
            console.log('Loading gallery characters');
            loadGalleryCharactersSafely(staticCharacters, galleryContainer);
        }
        
    } catch (error) {
        console.error('Error in safeLoadCharacters:', error);
        // Show error message on page
        const errorMsg = document.createElement('div');
        errorMsg.style.color = 'red';
        errorMsg.style.padding = '20px';
        errorMsg.style.margin = '20px';
        errorMsg.style.border = '1px solid red';
        errorMsg.innerHTML = `<h2>Error loading page</h2><p>${error.message}</p>`;
        document.body.prepend(errorMsg);
    }
}

// Load carousel characters without fetching
function loadCarouselCharactersSafely(characters, track) {
    try {
        // Clear existing content
        track.innerHTML = '';
        
        // Add character cards to carousel
        for (const character of characters) {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.dataset.character = character.id;
            
            card.innerHTML = `
                <a href="${character.link}" class="card-link">
                    <div class="card-image">
                        <img src="${character.image}" alt="${character.name}">
                    </div>
                    <div class="card-content">
                        <h3>${character.name}</h3>
                        <p>${character.series}</p>
                    </div>
                </a>
            `;
            
            track.appendChild(card);
        }
        
        // Set up carousel navigation
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        
        if (prevBtn && nextBtn) {
            let currentIndex = 0;
            const maxIndex = Math.max(0, characters.length - 1);
            
            // Update carousel position
            function updateCarousel() {
                const cardWidth = 320 + 32; // card width (320px) + gap (32px)
                const percentage = -currentIndex * (cardWidth / track.offsetWidth) * 100;
                track.dataset.percentage = percentage;
                
                track.style.transform = `translateX(${percentage}%)`;
                
                // Update button states
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex === maxIndex;
                prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
                nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
            }
            
            // Initialize carousel
            updateCarousel();
            
            // Navigation buttons
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
            
            nextBtn.addEventListener('click', () => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }
        
    } catch (error) {
        console.error('Error loading carousel characters:', error);
    }
}

// Load gallery characters without fetching
function loadGalleryCharactersSafely(characters, container) {
    try {
        // Clear existing content
        container.innerHTML = '';
        
        // Add character cards to gallery
        for (const character of characters) {
            const card = document.createElement('div');
            card.className = 'gallery-character-card';
            card.dataset.character = character.id;
            
            card.innerHTML = `
                <a href="${character.link}" class="gallery-card-link">
                    <div class="gallery-card-image">
                        <img src="${character.image}" alt="${character.name}">
                    </div>
                    <div class="gallery-card-content">
                        <h3>${character.name}</h3>
                        <p>${character.series}</p>
                    </div>
                </a>
            `;
            
            container.appendChild(card);
        }
        
    } catch (error) {
        console.error('Error loading gallery characters:', error);
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vercel fix script initialized');
    setTimeout(safeLoadCharacters, 500);
}); 