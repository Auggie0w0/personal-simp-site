// Carousel functionality
const track = document.getElementById("image-track");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
const cardWidth = 320 + 32; // card width (320px) + gap (32px)
let maxIndex = 2; // Will be updated dynamically based on number of characters

// Only initialize carousel if elements exist (home page)
if (track && prevBtn && nextBtn) {
    // Initialize carousel position
    track.dataset.percentage = "0";

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

// Update carousel position
function updateCarousel() {
    const percentage = -currentIndex * (cardWidth / track.offsetWidth) * 100;
    track.dataset.percentage = percentage;
    
    track.style.transform = `translateX(${percentage}%)`;
    
    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;
    
    // Update button styles
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
    
    // Update button cursor
    prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
    nextBtn.style.cursor = currentIndex === maxIndex ? 'not-allowed' : 'pointer';
}

// Mouse drag functionality
let isMouseDown = false;
let startX = 0;
let startPercentage = 0;

track.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.clientX;
    startPercentage = parseFloat(track.dataset.percentage) || 0;
    track.style.cursor = 'grabbing';
});

track.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    
    const deltaX = e.clientX - startX;
    const deltaPercentage = (deltaX / track.offsetWidth) * 100;
    const newPercentage = startPercentage + deltaPercentage;
    
    // Limit the movement
    const limitedPercentage = Math.max(-100, Math.min(0, newPercentage));
    
    track.style.transform = `translateX(${limitedPercentage}%)`;
});

track.addEventListener('mouseup', () => {
    if (!isMouseDown) return;
    
    isMouseDown = false;
    track.style.cursor = 'grab';
    
    // Snap to nearest card
    const currentPercentage = parseFloat(track.dataset.percentage) || 0;
    const cardPercentage = (cardWidth / track.offsetWidth) * 100;
    const nearestIndex = Math.round(Math.abs(currentPercentage) / cardPercentage);
    
    currentIndex = Math.max(0, Math.min(maxIndex, nearestIndex));
    updateCarousel();
});

track.addEventListener('mouseleave', () => {
    if (isMouseDown) {
        isMouseDown = false;
        track.style.cursor = 'grab';
        updateCarousel();
    }
});

// Touch support for mobile
track.addEventListener('touchstart', (e) => {
    isMouseDown = true;
    startX = e.touches[0].clientX;
    startPercentage = parseFloat(track.dataset.percentage) || 0;
});

track.addEventListener('touchmove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    
    const deltaX = e.touches[0].clientX - startX;
    const deltaPercentage = (deltaX / track.offsetWidth) * 100;
    const newPercentage = startPercentage + deltaPercentage;
    
    const limitedPercentage = Math.max(-100, Math.min(0, newPercentage));
    track.style.transform = `translateX(${limitedPercentage}%)`;
});

track.addEventListener('touchend', () => {
    if (!isMouseDown) return;
    
    isMouseDown = false;
    
    const currentPercentage = parseFloat(track.dataset.percentage) || 0;
    const cardPercentage = (cardWidth / track.offsetWidth) * 100;
    const nearestIndex = Math.round(Math.abs(currentPercentage) / cardPercentage);
    
    currentIndex = Math.max(0, Math.min(maxIndex, nearestIndex));
    updateCarousel();
});

// Mobile menu functionality
const menulogo = document.querySelector(".menulogo");
const navLinks = document.querySelector(".nav-links");

menulogo.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-menu');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-menu');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effects to character cards
document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Card link click handlers are now added dynamically in loadCarouselCharacters()

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (track && prevBtn && nextBtn) { // Only run on pages with carousel
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        }
    }
});

} // Close the initial if statement for carousel elements

// Initialize carousel on load
document.addEventListener('DOMContentLoaded', async () => {
    // Only run carousel initialization if elements exist (home page)
    if (track && prevBtn && nextBtn) {
        // Load characters from character list for carousel
        await loadCarouselCharacters();
        
        // Reset current index and update carousel
        currentIndex = 0;
        updateCarousel();
        
        // Add loading animation
        document.querySelectorAll('.character-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Add focus management for accessibility
        prevBtn.setAttribute('aria-label', 'Previous character');
        nextBtn.setAttribute('aria-label', 'Next character');
    }
});

// Load characters for carousel from character list
async function loadCarouselCharacters() {
    const carouselTrack = document.getElementById('image-track');
    if (!carouselTrack) return;

    // Get all characters (static + dynamic)
    const characters = JSON.parse(localStorage.getItem('characters') || '[]');
    const staticCharacters = [
        {
            id: 'leeknow',
            name: 'Lee Know',
            series: 'Stray Kids',
            image: 'https://i.pinimg.com/736x/c7/e8/e0/c7e8e0ec5ebd4f9b5540a66bc3fc8db3.jpg',
            link: 'minho.html'
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
        },
        {
            id: 'wolfgang',
            name: 'Wolfgang Goldenleonard',
            series: 'King\'s Maker: Triple Crown',
            image: 'https://i.pinimg.com/736x/91/ff/ca/91ffcaf02269e4db693ca02a77e790ad.jpg',
            link: 'wolfgang.html'
        }
    ];

    // Combine characters and sort with custom order
    const allCharacters = [...staticCharacters, ...characters];
    
    // Custom sorting for carousel: Lee Know first, then new characters, then others
    const carouselCharacters = allCharacters.sort((a, b) => {
        // Lee Know always comes first
        if (a.id === 'leeknow') return -1;
        if (b.id === 'leeknow') return 1;
        
        // New characters (with createdAt) come after Lee Know but before others
        if (a.createdAt && !b.createdAt) return -1;
        if (!a.createdAt && b.createdAt) return 1;
        
        // Among new characters, sort by creation date (newest first)
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        
        // Among static characters, maintain their order in the array
        return 0;
    });

    // Custom sorting for gallery: Lee Know first, then others in original order
    const galleryCharacters = allCharacters.sort((a, b) => {
        // Lee Know always comes first
        if (a.id === 'leeknow') return -1;
        if (b.id === 'leeknow') return 1;
        
        // For others, maintain the original order from staticCharacters array
        const aIndex = staticCharacters.findIndex(char => char.id === a.id);
        const bIndex = staticCharacters.findIndex(char => char.id === b.id);
        
        // If both are static characters, maintain their order
        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        }
        
        // If only one is static, static comes first
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        // If both are dynamic, sort by creation date (newest first)
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        
        return 0;
    });

    // Update maxIndex based on number of characters
    maxIndex = Math.max(0, carouselCharacters.length - 1);

    // Clear existing content
    carouselTrack.innerHTML = '';

    // Add character cards to carousel with dynamic data loading
    for (const character of carouselCharacters) {
        try {
            // Try to fetch updated data from the character page
            const response = await fetch(character.link);
            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Extract updated information from the character page
                const updatedName = doc.querySelector('.character-info h1')?.textContent || character.name;
                const updatedSeries = doc.querySelector('.character-series')?.textContent || character.series;
                const updatedImage = doc.querySelector('.character-image img')?.src || character.image;
                
                // Update character data
                character.name = updatedName;
                character.series = updatedSeries;
                character.image = updatedImage;
            }
        } catch (error) {
            console.log(`Could not fetch updated data for ${character.name}, using cached data`);
        }

        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.character = character.id;
        
        card.innerHTML = `
            <a href="${character.link}" class="card-link">
                <div class="card-image">
                    <img src="${character.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}" alt="${character.name}">
                </div>
                <div class="card-content">
                    <h3>${character.name}</h3>
                    <p>${character.series}</p>
                </div>
            </a>
        `;
        
        carouselTrack.appendChild(card);
    }
    
    // Add click handlers to the newly created card links
    document.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent navigation during drag operations
            if (isMouseDown) {
                e.preventDefault();
                return;
            }
            // Allow normal navigation for all other clicks
            console.log('Navigating to:', link.href);
        });
    });

    // Load gallery characters if on home page
    const galleryContainer = document.getElementById('character-gallery');
    if (galleryContainer) {
        loadGalleryCharacters(galleryCharacters);
    }
}

// Load gallery characters
async function loadGalleryCharacters(characters) {
    const galleryContainer = document.getElementById('character-gallery');
    if (!galleryContainer) return;

    // Clear existing content
    galleryContainer.innerHTML = '';

    // Add character cards to gallery
    for (const character of characters) {
        try {
            // Try to fetch updated data from the character page
            const response = await fetch(character.link);
            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Extract updated information from the character page
                const updatedName = doc.querySelector('.character-info h1')?.textContent || character.name;
                const updatedSeries = doc.querySelector('.character-series')?.textContent || character.series;
                const updatedImage = doc.querySelector('.character-image img')?.src || character.image;
                
                // Update character data
                character.name = updatedName;
                character.series = updatedSeries;
                character.image = updatedImage;
            }
        } catch (error) {
            console.log(`Could not fetch updated data for ${character.name}, using cached data`);
        }

        const card = document.createElement('div');
        card.className = 'gallery-character-card';
        card.dataset.character = character.id;
        
        card.innerHTML = `
            <a href="${character.link}" class="gallery-card-link">
                <div class="gallery-card-image">
                    <img src="${character.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}" alt="${character.name}">
                </div>
                <div class="gallery-card-content">
                    <h3>${character.name}</h3>
                    <p>${character.series}</p>
                </div>
            </a>
        `;
        
        galleryContainer.appendChild(card);
    }
    
    // Add click handlers to the newly created gallery card links
    document.querySelectorAll('.gallery-card-link').forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Navigating to:', link.href);
        });
    });
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('dark');
    }
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateThemeIcon('dark');
    }
    
    // Add theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

// Character data storage
let characters = JSON.parse(localStorage.getItem('characters') || '[]');

// Save characters to localStorage
function saveCharacters() {
    localStorage.setItem('characters', JSON.stringify(characters));
}

// Add new character
function addCharacter(characterData) {
    const newCharacter = {
        id: Date.now().toString(),
        ...characterData,
        createdAt: new Date().toISOString(),
        rating: 0,
        ratingCount: 0
    };
    
    characters.push(newCharacter);
    saveCharacters();
    
    // Create character page
    createCharacterPage(newCharacter);
    
    // Refresh character list if on character list page
    if (typeof loadDynamicCharacters === 'function') {
        loadDynamicCharacters();
    }
    
    return newCharacter;
}

// Update existing character
function updateCharacter(characterId, updatedData) {
    const characterIndex = characters.findIndex(char => char.id === characterId);
    if (characterIndex !== -1) {
        characters[characterIndex] = {
            ...characters[characterIndex],
            ...updatedData,
            updatedAt: new Date().toISOString()
        };
        saveCharacters();
        
        // Update character page
        updateCharacterPage(characters[characterIndex]);
        
        return characters[characterIndex];
    }
    return null;
}

// Delete character
function deleteCharacter(characterId) {
    if (confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
        characters = characters.filter(char => char.id !== characterId);
        saveCharacters();
        alert('Character deleted successfully!');
        
        // Refresh character list if on character list page
        if (typeof loadDynamicCharacters === 'function') {
            loadDynamicCharacters();
        }
    }
}

// Rating system
function rateCharacter(characterId, rating) {
    const character = characters.find(char => char.id === characterId);
    if (character) {
        const currentRating = character.rating || 0;
        const currentCount = character.ratingCount || 0;
        
        // Add new rating
        const newTotal = (currentRating * currentCount) + rating;
        const newCount = currentCount + 1;
        const newRating = newTotal / newCount;
        
        character.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal
        character.ratingCount = newCount;
        
        saveCharacters();
        
        // Update rating display
        updateRatingDisplay(characterId, newRating, newCount);
        
        alert(`Thank you for rating! Current average: ${newRating.toFixed(1)}/5 (${newCount} votes)`);
    }
}

function updateRatingDisplay(characterId, rating, count) {
    const ratingElement = document.getElementById(`rating-${characterId}`);
    if (ratingElement) {
        ratingElement.innerHTML = `
            <div class="rating-display">
                <span class="stars">${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}</span>
                <span class="rating-text">${rating.toFixed(1)}/5 (${count} votes)</span>
            </div>
        `;
    }
}



// Create character page HTML
function createCharacterPage(character) {
    const characterHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>${character.name} - Simp Gallery</title>
</head>
<body>
    <header>
        <nav class="navbar">
            <a href="index.html" class="logo">Simp Gallery</a>
            <div class="nav-links">
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="character-list.html">Character List</a></li>
                    <li><a href="reviews.html">Reviews</a></li>
                    <li><a href="abouts.html">About</a></li>
                </ul>
            </div>
            <div class="nav-controls">
                <button class="theme-toggle" id="themeToggle">
                    <span class="theme-icon">☀️</span>
                </button>
                <img src="menulogo.png" alt="menu" class="menulogo">
            </div>
        </nav>
    </header>

    <main class="main-content">
        <div class="character-profile">
            <div class="character-header">
                <div class="character-image">
                    <img src="${character.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}" alt="${character.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='">
                </div>
                <div class="character-info">
                    <h1 class="character-name">${character.name}</h1>
                    <p class="character-series">${character.series}</p>
                    <div class="character-stats">
                        <div class="stat-box">
                            <span class="stat-label">Age</span>
                            <span class="stat-value">${character.age || 'Unknown'}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Role</span>
                            <span class="stat-value">${character.role || 'Unknown'}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Personality</span>
                            <span class="stat-value">${character.personality || 'Unknown'}</span>
                        </div>
                    </div>

                </div>
            </div>
            
            <div class="character-content">
                <div class="content-section">
                    <h2>Description</h2>
                    <p>${character.description}</p>
                </div>
                
                ${character.analysis ? `
                <div class="content-section">
                    <h2>Character Analysis</h2>
                    <p>${character.analysis}</p>
                </div>
                ` : ''}
                
                ${character.reasons ? `
                <div class="content-section">
                    <h2>Why I Love This Character</h2>
                    <ul class="reasons-list">
                        ${character.reasons.split('\n').filter(reason => reason.trim()).map(reason => `<li>${reason.trim()}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="content-section">
                    <h2>Rating</h2>
                    <div id="rating-${character.id}" class="rating-section">
                        <div class="rating-display">
                            <span class="stars">${'★'.repeat(Math.floor(character.rating || 0))}${'☆'.repeat(5 - Math.floor(character.rating || 0))}</span>
                            <span class="rating-text">${(character.rating || 0).toFixed(1)}/5 (${character.ratingCount || 0} votes)</span>
                        </div>
                        <div class="rating-buttons">
                            ${[1,2,3,4,5].map(star => `
                                <button onclick="rateCharacter('${character.id}', ${star})" class="star-btn">${star}★</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                

            </div>
        </div>
    </main>



    <script src="script.js"></script>
    <script>
        // Character page functionality
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize any character-specific features here
        });
    </script>
</body>
</html>`;
    
    // Create the file
    const blob = new Blob([characterHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Also save to localStorage for reference
    const characterPages = JSON.parse(localStorage.getItem('characterPages') || '{}');
    characterPages[character.id] = characterHtml;
    localStorage.setItem('characterPages', JSON.stringify(characterPages));
}

// Update character page
function updateCharacterPage(character) {
    // This would update the existing character page
    // For now, we'll just save the updated character data
    const characterPages = JSON.parse(localStorage.getItem('characterPages') || '{}');
    characterPages[character.id] = character;
    localStorage.setItem('characterPages', JSON.stringify(characterPages));
}

// Gallery Modal Functionality
function initGalleryModals() {
    console.log('Initializing gallery modals...');
    
    // Create modal element if it doesn't exist
    if (!document.querySelector('.gallery-modal')) {
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="gallery-modal-close">×</div>
            <img src="" alt="Full size image">
        `;
        document.body.appendChild(modal);
        console.log('Modal created');
    }

    // Add click event listeners to all gallery images
    const galleryImages = document.querySelectorAll('.gallery-image img');
    console.log('Found', galleryImages.length, 'gallery images');
    
    galleryImages.forEach((img, index) => {
        // Remove any existing listeners
        img.removeEventListener('click', handleImageClick);
        // Add new listener
        img.addEventListener('click', handleImageClick);
        console.log(`Added click listener to image ${index + 1}:`, img.src);
    });

    // Set up modal event listeners
    const modal = document.querySelector('.gallery-modal');
    const closeBtn = document.querySelector('.gallery-modal-close');
    
    // Remove existing listeners
    modal.removeEventListener('click', handleModalClick);
    closeBtn.removeEventListener('click', closeGalleryModal);
    
    // Add new listeners
    modal.addEventListener('click', handleModalClick);
    closeBtn.addEventListener('click', closeGalleryModal);
    
    // Close modal with Escape key
    document.removeEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleEscapeKey);
    
    console.log('Gallery modals initialized successfully');
}

function handleImageClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Image clicked:', this.src);
    openGalleryModal(this.src, this.alt);
}

function handleModalClick(e) {
    if (e.target === e.currentTarget) {
        console.log('Modal background clicked');
        closeGalleryModal();
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        console.log('Escape key pressed');
        closeGalleryModal();
    }
}

function openGalleryModal(src, alt) {
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
}

function closeGalleryModal() {
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
}

// Add Photo Modal Functions
let currentCharacterId = null;
let selectedImages = [];

function openAddPhotoModal(characterId) {
    currentCharacterId = characterId;
    selectedImages = [];
    
    const modal = document.getElementById('add-photo-modal');
    if (modal) {
        modal.style.display = 'block';
        setupUploadArea();
        setupPasteArea();
        resetModal();
    }
}

function closeAddPhotoModal() {
    const modal = document.getElementById('add-photo-modal');
    if (modal) {
        modal.style.display = 'none';
        resetModal();
    }
}

function resetModal() {
    selectedImages = [];
    document.getElementById('preview-area').style.display = 'none';
    document.getElementById('add-photos-btn').style.display = 'none';
    document.getElementById('preview-images').innerHTML = '';
    document.getElementById('paste-area').value = '';
    document.getElementById('file-input').value = '';
}

function setupUploadArea() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    if (uploadArea) {
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });
        
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleFiles(files);
        });
    }
}

function setupPasteArea() {
    const pasteArea = document.getElementById('paste-area');
    
    if (pasteArea) {
        pasteArea.addEventListener('paste', (e) => {
            e.preventDefault();
            const items = Array.from(e.clipboardData.items);
            
            items.forEach(item => {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    handleFiles([file]);
                }
            });
            
            // Also check for URLs
            const pastedText = e.clipboardData.getData('text');
            if (pastedText && isValidImageUrl(pastedText)) {
                handleImageUrl(pastedText);
            }
        });
        
        pasteArea.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value && isValidImageUrl(value)) {
                handleImageUrl(value);
            }
        });
    }
}

function handleFiles(files) {
    files.forEach(file => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    src: e.target.result,
                    name: file.name,
                    type: 'file'
                };
                addToPreview(imageData);
            };
            reader.readAsDataURL(file);
        }
    });
}

function handleImageUrl(url) {
    const imageData = {
        src: url,
        name: 'Pasted Image',
        type: 'url'
    };
    addToPreview(imageData);
}

function addToPreview(imageData) {
    selectedImages.push(imageData);
    
    const previewArea = document.getElementById('preview-area');
    const previewImages = document.getElementById('preview-images');
    const addButton = document.getElementById('add-photos-btn');
    
    previewArea.style.display = 'block';
    addButton.style.display = 'block';
    
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    previewItem.innerHTML = `
        <img src="${imageData.src}" alt="${imageData.name}">
        <span class="preview-name">${imageData.name}</span>
        <button class="remove-preview" onclick="removeFromPreview(${selectedImages.length - 1})">×</button>
    `;
    
    previewImages.appendChild(previewItem);
}

function removeFromPreview(index) {
    selectedImages.splice(index, 1);
    updatePreview();
}

function updatePreview() {
    const previewImages = document.getElementById('preview-images');
    const addButton = document.getElementById('add-photos-btn');
    
    previewImages.innerHTML = '';
    
    if (selectedImages.length === 0) {
        document.getElementById('preview-area').style.display = 'none';
        addButton.style.display = 'none';
        return;
    }
    
    selectedImages.forEach((imageData, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${imageData.src}" alt="${imageData.name}">
            <span class="preview-name">${imageData.name}</span>
            <button class="remove-preview" onclick="removeFromPreview(${index})">×</button>
        `;
        previewImages.appendChild(previewItem);
    });
}

function addPhotosToGallery() {
    if (!currentCharacterId || selectedImages.length === 0) return;
    
    // Get the gallery grid
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    selectedImages.forEach(imageData => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${imageData.src}" alt="Added Image" onclick="openGalleryModal(this.src, this.alt)">
        `;
        
        // Insert before the add-photo-card
        const addPhotoCard = galleryGrid.querySelector('.add-photo-card');
        if (addPhotoCard) {
            galleryGrid.insertBefore(galleryItem, addPhotoCard);
        } else {
            galleryGrid.appendChild(galleryItem);
        }
    });
    
    // Re-initialize gallery modals for new images
    initGalleryModals();
    
    // Close modal and show success message
    closeAddPhotoModal();
    alert(`Successfully added ${selectedImages.length} image(s) to the gallery!`);
}

function isValidImageUrl(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const urlLower = url.toLowerCase();
    return imageExtensions.some(ext => urlLower.includes(ext)) || 
           urlLower.startsWith('data:image/') ||
           urlLower.startsWith('http') && urlLower.includes('image');
}

// Initialize gallery modals when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing gallery modals...');
    initGalleryModals();
    
    // Also initialize after a short delay to ensure all content is loaded
    setTimeout(() => {
        console.log('Delayed initialization...');
        initGalleryModals();
    }, 1000);
    
    // Re-initialize when new content is loaded (for dynamic content)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if gallery images were added
                const hasGalleryImages = Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === 1 && (
                        node.classList?.contains('gallery-image') ||
                        node.querySelector?.('.gallery-image')
                    )
                );
                
                if (hasGalleryImages) {
                    console.log('New gallery images detected, re-initializing...');
                    setTimeout(initGalleryModals, 100);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

