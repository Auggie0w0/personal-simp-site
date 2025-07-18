// Carousel functionality
const track = document.getElementById("image-track");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
const cardWidth = 250 + 32; // card width + gap
const maxIndex = 2; // 3 cards total (0, 1, 2)

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
    prevBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
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

// Handle card clicks while preserving carousel drag functionality
document.querySelectorAll('.card-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Only navigate if it's a direct click, not a drag
        if (!isMouseDown) {
            // Allow normal navigation
            return;
        } else {
            // Prevent navigation during drag
            e.preventDefault();
        }
    });
});

// Initialize carousel on load
document.addEventListener('DOMContentLoaded', () => {
    // Load characters from character list for carousel
    loadCarouselCharacters();
    updateCarousel();
    
    // Add loading animation
    document.querySelectorAll('.character-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Load characters for carousel from character list
function loadCarouselCharacters() {
    const carouselTrack = document.getElementById('image-track');
    if (!carouselTrack) return;

    // Get all characters (static + dynamic)
    const characters = JSON.parse(localStorage.getItem('characters') || '[]');
    const staticCharacters = [
        {
            id: 'miyamura',
            name: 'Izumi Miyamura',
            series: 'Horimiya',
            image: 'https://i.pinimg.com/originals/08/38/c0/0838c09105f683d3d6f68fe101f0a69f.png',
            link: 'miyamura.html'
        },
        {
            id: 'yamada',
            name: 'Yamada',
            series: 'Yamada-kun and the Seven Witches',
            image: 'https://i.pinimg.com/564x/89/8f/0e/898f0e6fc27ec350f17866c321db45e8.jpg',
            link: 'yamada.html'
        },
        {
            id: 'minho',
            name: 'Minho',
            series: 'The Maze Runner',
            image: 'https://i.pinimg.com/564x/08/be/67/08be672b231f39853b4203368049746b.jpg',
            link: 'minho.html'
        }
    ];

    // Combine and sort by creation date (newest first)
    const allCharacters = [...staticCharacters, ...characters];
    const sortedCharacters = allCharacters.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    });

    // Take the top 3 characters for carousel
    const carouselCharacters = sortedCharacters.slice(0, 3);

    // Clear existing content
    carouselTrack.innerHTML = '';

    // Add character cards to carousel
    carouselCharacters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.character = character.id;
        
        card.innerHTML = `
            <a href="${character.link}" class="card-link">
                <div class="card-content">
                    <img src="${character.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}" alt="${character.name}" class="image">
                    <div class="card-info">
                        <h3>${character.name}</h3>
                        <p>${character.series}</p>
                    </div>
                </div>
            </a>
        `;
        
        carouselTrack.appendChild(card);
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
                
                <div class="content-section">
                    <h2>Comments</h2>
                    <div id="comments-${character.id}" class="comments-section">
                        <!-- Comments will be loaded here -->
                    </div>
                    <form id="comment-form-${character.id}" class="comment-form" onsubmit="event.preventDefault(); addComment('${character.id}', document.getElementById('comment-text-${character.id}').value, document.getElementById('comment-author-${character.id}').value);">
                        <input type="text" id="comment-author-${character.id}" placeholder="Your name (optional)" class="comment-author">
                        <textarea id="comment-text-${character.id}" placeholder="Write a comment..." class="comment-text" required></textarea>
                        <button type="submit" class="comment-submit">Add Comment</button>
                    </form>
                </div>
            </div>
        </div>
    </main>



    <script src="script.js"></script>
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

