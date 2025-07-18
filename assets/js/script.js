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
            link: 'pages/characters/minho.html'
        },
        {
            id: 'saja',
            name: 'Saja',
            series: 'K-pop Demon Hunters',
            image: 'https://i.pinimg.com/736x/de/6b/b4/de6bb44a43104f4011b6041fc7e9bc61.jpg',
            link: 'pages/characters/saja.html'
        },
        {
            id: 'huntrix',
            name: 'Huntrix',
            series: 'K-pop Demon Hunters',
            image: 'https://i.pinimg.com/1200x/55/29/5c/55295c15acd0598ac4be54d1c554bdeb.jpg',
            link: 'pages/characters/huntrix.html'
        },
        {
            id: 'axel',
            name: 'Axel Gilberto',
            series: 'Lazarus',
            image: 'https://i.pinimg.com/736x/2e/4f/55/2e4f55c57d6c96a0f9e24cff88d39b4f.jpg',
            link: 'pages/characters/axel.html'
        },
        {
            id: 'ivan',
            name: 'Ivan',
            series: 'Lazarus',
            image: 'https://i.pinimg.com/736x/12/2b/93/122b9343a59c96c4a82d1b402171bfd2.jpg',
            link: 'pages/characters/ivan.html'
        },
        {
            id: 'yamada',
            name: 'Yamada',
            series: 'Horimiya',
            image: 'https://i.pinimg.com/736x/86/4c/8c/864c8cab53cfe8bca9ac09afc22b72ad.jpg',
            link: 'pages/characters/yamada.html'
        },
        {
            id: 'dazai',
            name: 'Dazai',
            series: 'Bungou Stray Dogs',
            image: 'https://i.pinimg.com/736x/fb/7d/7c/fb7d7cc16047c088c583d793d9a0c550.jpg',
            link: 'pages/characters/dazai.html'
        },
        {
            id: 'miyamura',
            name: 'Miyamura',
            series: 'Horimiya',
            image: 'https://i.pinimg.com/736x/60/60/82/6060828cd9508dbec57df2f1902fee4c.jpg',
            link: 'pages/characters/miyamura.html'
        },
        {
            id: 'hange',
            name: 'Hange Zoe',
            series: 'Attack on Titan',
            image: 'https://i.pinimg.com/736x/90/47/0c/90470c5fce28d1f43a5698dcd38d6801.jpg',
            link: 'pages/characters/hange.html'
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
        ratingCount: 0,
        comments: []
    };
    
    characters.push(newCharacter);
    saveCharacters();
    
    // Create character page
    createCharacterPage(newCharacter);
    
    // Add to static characters array for carousel and gallery
    const staticCharacter = {
        id: newCharacter.id,
        name: newCharacter.name,
        series: newCharacter.series,
        image: newCharacter.image,
        link: `${newCharacter.id}.html`,
        createdAt: newCharacter.createdAt
    };
    
    // Add to staticCharacters array (this will be used by carousel and gallery)
    if (typeof staticCharacters !== 'undefined') {
        staticCharacters.push(staticCharacter);
    }
    
    // Refresh displays if on relevant pages
    refreshCharacterDisplays();
    
    return newCharacter;
}

// Function to refresh character displays on all pages
function refreshCharacterDisplays() {
    // Refresh character list if on character list page
    if (typeof loadDynamicCharacters === 'function') {
        loadDynamicCharacters();
    }
    
    // Refresh carousel if on home page
    if (typeof loadCarouselCharacters === 'function') {
        loadCarouselCharacters();
    }
    
    // Refresh gallery if on home page
    if (typeof loadGalleryCharacters === 'function') {
        loadGalleryCharacters();
    }
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

// Comment system
function addComment(characterId, commentText, author = 'Anonymous') {
    const character = characters.find(char => char.id === characterId);
    if (character && commentText.trim()) {
        if (!character.comments) {
            character.comments = [];
        }
        
        const newComment = {
            id: Date.now().toString(),
            author: author,
            text: commentText.trim(),
            date: new Date().toISOString()
        };
        
        character.comments.push(newComment);
        saveCharacters();
        
        // Refresh comments display
        loadComments(characterId);
        
        // Clear comment form
        const commentForm = document.getElementById(`comment-form-${characterId}`);
        if (commentForm) {
            commentForm.reset();
        }
        
        alert('Comment added successfully!');
    }
}

function loadComments(characterId) {
    const character = characters.find(char => char.id === characterId);
    const commentsContainer = document.getElementById(`comments-${characterId}`);
    
    if (commentsContainer && character) {
        const comments = character.comments || [];
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
        } else {
            commentsContainer.innerHTML = comments.map(comment => `
                <div class="comment">
                    <div class="comment-header">
                        <strong>${comment.author}</strong>
                        <small>${new Date(comment.date).toLocaleDateString()}</small>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                </div>
            `).join('');
        }
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
    <title>${character.name} - August's Simp Gallery</title>
</head>
<body>
    <header>
        <nav class="navbar">
            <a href="index.html" class="logo">August's Simp Gallery</a>
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
        <div class="character-hero">
            <div class="character-image">
                <img src="${character.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}" alt="${character.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='">
            </div>
            <div class="character-info">
                <h1>${character.name}</h1>
                <p class="character-series">From ${character.series}</p>
                <p class="character-description">
                    ${character.description || 'A wonderful character with unique qualities and personality.'}
                </p>
                <div class="character-stats">
                    <div class="stat">
                        <span class="stat-label">Age</span>
                        <span class="stat-value">${character.age || 'Unknown'}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Role</span>
                        <span class="stat-value">${character.role || 'Unknown'}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Personality</span>
                        <span class="stat-value">${character.personality || 'Unknown'}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="character-details">
            ${character.analysis ? `
            <h2>Character Analysis</h2>
            <p>${character.analysis}</p>
            ` : ''}
            
            ${character.reasons ? `
            <h3>Why I Love This Character</h3>
            <ul class="character-reasons">
                ${character.reasons.split('\\n').filter(reason => reason.trim()).map(reason => `<li>${reason.trim()}</li>`).join('')}
            </ul>
            ` : ''}
        </div>

        <div class="rating-section">
            <h2>Rating</h2>
            <div id="rating-${character.id}" class="rating-container">
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

        <div class="gallery-section">
            <h2>${character.name} Gallery</h2>
            <div class="gallery-container">
                <div class="image-gallery">
                    <div class="gallery-image">
                        <img src="${character.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}" alt="${character.name}">
                    </div>
                    ${character.galleryImages ? character.galleryImages.map(img => `
                        <div class="gallery-image">
                            <img src="${img}" alt="${character.name}">
                        </div>
                    `).join('') : ''}
                </div>
            </div>
        </div>
    </main>

    <script src="script.js"></script>
    <script src="comment-system.js"></script>
    <script src="security-patch.js"></script>
    <script>
        // Load comments on page load
        document.addEventListener('DOMContentLoaded', () => {
            loadComments('${character.id}');
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

