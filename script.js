// Carousel functionality
const track = document.getElementById("image-track");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
const cardWidth = 350 + 32; // card width + gap
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
    nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
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
    updateCarousel();
    
    // Add loading animation
    document.querySelectorAll('.character-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    } else if (e.key === 'ArrowRight' && currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
    }
});

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Check for saved theme preference or default to light theme
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.textContent = '🌙';
    } else {
        themeIcon.textContent = '☀️';
    }
}

// Modal functionality for adding characters
const addNewCharacter = document.getElementById('addNewCharacter');
const addCharacterModal = document.getElementById('addCharacterModal');
const closeModal = document.getElementById('closeModal');
const cancelAdd = document.getElementById('cancelAdd');
const addCharacterForm = document.getElementById('addCharacterForm');

// Open modal
if (addNewCharacter) {
    addNewCharacter.addEventListener('click', () => {
        addCharacterModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close modal functions
function closeModalFunction() {
    addCharacterModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    addCharacterForm.reset();
}

if (closeModal) {
    closeModal.addEventListener('click', closeModalFunction);
}

if (cancelAdd) {
    cancelAdd.addEventListener('click', closeModalFunction);
}

// Close modal when clicking outside
if (addCharacterModal) {
    addCharacterModal.addEventListener('click', (e) => {
        if (e.target === addCharacterModal) {
            closeModalFunction();
        }
    });
}

// Handle form submission
if (addCharacterForm) {
    addCharacterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!isAdmin) {
            authenticateAdmin();
            return;
        }
        
        const formData = {
            name: document.getElementById('characterName').value,
            series: document.getElementById('characterSeries').value,
            age: document.getElementById('characterAge').value,
            role: document.getElementById('characterRole').value,
            personality: document.getElementById('characterPersonality').value,
            gender: document.getElementById('characterGender').value,
            image: document.getElementById('characterImage').value,
            description: document.getElementById('characterDescription').value,
            analysis: document.getElementById('characterAnalysis').value,
            reasons: document.getElementById('characterReasons').value
        };
        
        const newCharacter = addCharacter(formData);
        alert(`Character "${newCharacter.name}" from "${newCharacter.series}" has been added to your collection!\n\nA character page has been downloaded. Upload it to your Vercel project to make it live.`);
        
        closeModalFunction();
    });
}

// Access Control System - Enhanced Security
const ADMIN_PASSWORD_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; // SHA-256 hash of 'password'
let isAdmin = false;
let loginAttempts = 0;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

// Check if user is admin on page load
function checkAdminStatus() {
    const savedAdminStatus = localStorage.getItem('isAdmin');
    if (savedAdminStatus === 'true') {
        isAdmin = true;
        showAdminFeatures();
    } else {
        hideAdminFeatures();
    }
}

// SHA-256 hash function for password security
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Admin authentication with enhanced security
async function authenticateAdmin() {
    // Check for lockout
    const lockoutTime = localStorage.getItem('adminLockoutTime');
    if (lockoutTime && Date.now() < parseInt(lockoutTime)) {
        const remainingTime = Math.ceil((parseInt(lockoutTime) - Date.now()) / 1000 / 60);
        alert(`Account is locked. Please try again in ${remainingTime} minutes.`);
        return;
    }

    // Reset lockout if time has passed
    if (lockoutTime && Date.now() >= parseInt(lockoutTime)) {
        localStorage.removeItem('adminLockoutTime');
        loginAttempts = 0;
    }

    const password = prompt('Enter admin password to access character management:');
    if (password === null) return; // User cancelled

    try {
        // Sanitize input to prevent injection attacks
        const sanitizedPassword = password.trim().replace(/[<>\"'&]/g, '');
        
        if (sanitizedPassword.length === 0) {
            alert('Password cannot be empty.');
            return;
        }

        const hashedPassword = await sha256(sanitizedPassword);
        
        if (hashedPassword === ADMIN_PASSWORD_HASH) {
            isAdmin = true;
            localStorage.setItem('isAdmin', 'true');
            loginAttempts = 0;
            localStorage.removeItem('adminLockoutTime');
            showAdminFeatures();
            alert('Admin access granted! You can now add and edit characters.');
        } else {
            loginAttempts++;
            const remainingAttempts = MAX_LOGIN_ATTEMPTS - loginAttempts;
            
            if (remainingAttempts > 0) {
                alert(`Incorrect password. ${remainingAttempts} attempts remaining.`);
            } else {
                // Lock account
                const lockoutEndTime = Date.now() + LOCKOUT_TIME;
                localStorage.setItem('adminLockoutTime', lockoutEndTime.toString());
                alert('Too many failed attempts. Account locked for 15 minutes.');
            }
        }
    } catch (error) {
        console.error('Authentication error:', error);
        alert('Authentication error. Please try again.');
    }
}

// Show/hide admin features
function showAdminFeatures() {
    const addNewCharacter = document.getElementById('addNewCharacter');
    const editButtons = document.querySelectorAll('.edit-character-btn');
    const adminIndicator = document.getElementById('adminIndicator');
    
    // Always show the add new character box
    if (addNewCharacter) {
        addNewCharacter.style.display = 'flex';
    }
    
    editButtons.forEach(btn => {
        btn.style.display = 'inline-block';
    });
    
    if (adminIndicator) {
        adminIndicator.style.display = 'inline-block';
    }
}

function hideAdminFeatures() {
    const addNewCharacter = document.getElementById('addNewCharacter');
    const editButtons = document.querySelectorAll('.edit-character-btn');
    const adminIndicator = document.getElementById('adminIndicator');
    
    // Always show the add new character box, but hide edit buttons
    if (addNewCharacter) {
        addNewCharacter.style.display = 'flex';
    }
    
    editButtons.forEach(btn => {
        btn.style.display = 'none';
    });
    
    if (adminIndicator) {
        adminIndicator.style.display = 'none';
    }
}

// Logout function
function logoutAdmin() {
    isAdmin = false;
    localStorage.removeItem('isAdmin');
    hideAdminFeatures();
    alert('Logged out of admin mode.');
}

// Character data storage (in localStorage for demo)
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
        createdAt: new Date().toISOString()
    };
    
    characters.push(newCharacter);
    saveCharacters();
    
    // Create character page
    createCharacterPage(newCharacter);
    
    return newCharacter;
}

// Update existing character
function updateCharacter(characterId, updatedData) {
    // Check if it's an existing static character
    const existingCharacters = ['miyamura', 'yamada', 'minho', 'axel-gilberto', 'huntrix', 'saja'];
    
    if (existingCharacters.includes(characterId)) {
        // For static characters, we'll show an alert and suggest manual editing
        alert(`Character "${updatedData.name}" has been updated!\n\nNote: Since this is a static character page, you'll need to manually update the HTML file to see the changes. The form data has been saved for reference.`);
        
        // Save the updated data to localStorage for reference
        const characterUpdates = JSON.parse(localStorage.getItem('characterUpdates') || '{}');
        characterUpdates[characterId] = {
            ...updatedData,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem('characterUpdates', JSON.stringify(characterUpdates));
        
        return { id: characterId, ...updatedData };
    } else {
        // It's a dynamically created character
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
    }
    return null;
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
                    <li><a href="miyamura.html">Miyamura</a></li>
                    <li><a href="yamada.html">Yamada</a></li>
                    <li><a href="minho.html">Minho</a></li>
                    <li><a href="character-list.html">Character List</a></li>
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
                    <button class="edit-character-btn" onclick="editCharacter('${character.id}')" style="display: none;">Edit Character</button>
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
            </div>
        </div>
    </main>

    <!-- Edit Character Modal -->
    <div class="modal-overlay" id="editCharacterModal">
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">Edit Character</h2>
                <button class="modal-close" id="closeEditModal">&times;</button>
            </div>
            <form id="editCharacterForm">
                <input type="hidden" id="editCharacterId">
                <div class="form-group">
                    <label class="form-label" for="editCharacterName">Character Name *</label>
                    <input type="text" id="editCharacterName" class="form-input" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="editCharacterSeries">Series/Source *</label>
                        <input type="text" id="editCharacterSeries" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="editCharacterAge">Age</label>
                        <input type="text" id="editCharacterAge" class="form-input">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="editCharacterRole">Role</label>
                        <input type="text" id="editCharacterRole" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="editCharacterPersonality">Personality</label>
                        <input type="text" id="editCharacterPersonality" class="form-input">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="editCharacterImage">Image URL</label>
                    <input type="url" id="editCharacterImage" class="form-input" placeholder="https://example.com/image.jpg">
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="editCharacterDescription">Description *</label>
                    <textarea id="editCharacterDescription" class="form-textarea" required placeholder="Tell us about this character..."></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="editCharacterAnalysis">Character Analysis</label>
                    <textarea id="editCharacterAnalysis" class="form-textarea" placeholder="Your personal analysis of the character..."></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="editCharacterReasons">Why You Love This Character</label>
                    <textarea id="editCharacterReasons" class="form-textarea" placeholder="List the reasons you love this character (one per line)..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" id="deleteCharacter">Delete Character</button>
                    <button type="button" class="btn btn-secondary" id="cancelEdit">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Character</button>
                </div>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>`;
    
    // Create a blob and download the file (for demo purposes)
    const blob = new Blob([characterHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
}

// Update character page (would need server-side implementation for real use)
function updateCharacterPage(character) {
    // For demo purposes, we'll just show an alert
    alert(`Character "${character.name}" has been updated!`);
}

// Edit character function
function editCharacter(characterId) {
    if (!isAdmin) {
        authenticateAdmin();
        return;
    }
    
    // Check if it's an existing static character page
    const existingCharacters = {
        'miyamura': {
            name: 'Izumi Miyamura',
            series: 'Horimiya',
            age: '17',
            role: 'Male Protagonist',
            personality: 'Sweet & Caring',
            image: 'https://i.pinimg.com/originals/08/38/c0/0838c09105f683d3d6f68fe101f0a69f.png',
            description: 'Izumi Miyamura is the male protagonist of "Horimiya", a beautiful romance anime and manga series. He\'s a quiet, mysterious student who hides his true self behind glasses and long hair. His relationship with Kyoko Hori reveals his sweet, caring personality and helps him open up to others.',
            analysis: 'Miyamura\'s character is defined by his dual nature - the quiet, mysterious student at school versus his true self with piercings and tattoos. His journey focuses on self-acceptance and learning to be comfortable with who he really is. His relationship with Hori helps him break out of his shell and form meaningful connections.',
            reasons: 'Complex character development\nSweet and caring personality\nBeautiful romance story\nRelatable struggles with self-identity\nAmazing character growth arc'
        },
        'yamada': {
            name: 'Yamada',
            series: 'Yamada-kun and the Seven Witches',
            age: '17',
            role: 'Male Protagonist',
            personality: 'Lazy but Caring',
            image: 'https://example.com/yamada.jpg',
            description: 'Yamada is the main character of "Yamada-kun and the Seven Witches". He\'s a lazy student who gets involved in supernatural events.',
            analysis: 'Yamada starts as a lazy student but grows through his experiences.',
            reasons: 'Character growth\nRelatable personality\nInteresting story'
        },
        'minho': {
            name: 'Minho',
            series: 'The Maze Runner',
            age: '17',
            role: 'Keeper of the Runners',
            personality: 'Brave & Loyal',
            image: 'https://example.com/minho.jpg',
            description: 'Minho is a key character in "The Maze Runner" series, known for his bravery and loyalty.',
            analysis: 'Minho represents loyalty and courage in the face of danger.',
            reasons: 'Brave character\nLoyal friend\nStrong leadership'
        },
        'axel-gilberto': {
            name: 'Axel Gilberto',
            series: 'Lazarus',
            age: 'Unknown',
            role: 'Main Character',
            personality: 'Complex & Mysterious',
            image: 'https://example.com/axel-gilberto.jpg',
            description: 'Axel Gilberto is the main character from "Lazarus", a complex and mysterious figure.',
            analysis: 'Axel Gilberto represents the complexity of human nature and survival.',
            reasons: 'Complex character\nMysterious personality\nCompelling story'
        },
        'huntrix': {
            name: 'Huntrix',
            series: 'K-pop Demon Hunters',
            age: 'Unknown',
            role: 'Demon Hunter',
            personality: 'Fierce & Determined',
            image: 'https://example.com/huntrix.jpg',
            description: 'Huntrix is a powerful demon hunter from the K-pop Demon Hunters series.',
            analysis: 'Huntrix embodies strength and determination in the face of supernatural threats.',
            reasons: 'Strong character\nFierce personality\nPowerful abilities'
        },
        'saja': {
            name: 'Saja',
            series: 'K-pop Demon Hunters',
            age: 'Unknown',
            role: 'Demon Hunter',
            personality: 'Skilled & Strategic',
            image: 'https://example.com/saja.jpg',
            description: 'Saja is a skilled demon hunter from the K-pop Demon Hunters series.',
            analysis: 'Saja represents strategic thinking and skill in demon hunting.',
            reasons: 'Skilled character\nStrategic mind\nCool abilities'
        }
    };
    
    let character;
    
    if (existingCharacters[characterId]) {
        // It's an existing static character
        character = { id: characterId, ...existingCharacters[characterId] };
    } else {
        // It's a dynamically created character
        character = characters.find(char => char.id === characterId);
        if (!character) {
            alert('Character not found!');
            return;
        }
    }
    
    // Populate edit form
    document.getElementById('editCharacterId').value = character.id;
    document.getElementById('editCharacterName').value = character.name;
    document.getElementById('editCharacterSeries').value = character.series;
    document.getElementById('editCharacterAge').value = character.age || '';
    document.getElementById('editCharacterRole').value = character.role || '';
    document.getElementById('editCharacterPersonality').value = character.personality || '';
    document.getElementById('editCharacterImage').value = character.image || '';
    document.getElementById('editCharacterDescription').value = character.description;
    document.getElementById('editCharacterAnalysis').value = character.analysis || '';
    document.getElementById('editCharacterReasons').value = character.reasons || '';
    
    // Show edit modal
    document.getElementById('editCharacterModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Delete character function
function deleteCharacter(characterId) {
    if (confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
        characters = characters.filter(char => char.id !== characterId);
        saveCharacters();
        alert('Character deleted successfully!');
        closeEditModal();
        // Redirect to character list
        window.location.href = 'character-list.html';
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editCharacterModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('editCharacterForm').reset();
}

// Initialize admin features
document.addEventListener('DOMContentLoaded', () => {
    checkAdminStatus();
    
    // Ensure add new character box is always visible
    const addNewCharacter = document.getElementById('addNewCharacter');
    if (addNewCharacter) {
        addNewCharacter.style.display = 'flex';
    }
    
    // Add admin login button to character list page
    if (window.location.pathname.includes('character-list.html')) {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && !document.getElementById('adminControls')) {
            const adminControls = document.createElement('div');
            adminControls.id = 'adminControls';
            adminControls.className = 'admin-controls';
            adminControls.innerHTML = `
                <div class="admin-buttons">
                    <button class="btn btn-primary" onclick="authenticateAdmin()" id="loginBtn">Admin Login</button>
                    <button class="btn btn-secondary" onclick="logoutAdmin()" id="logoutBtn" style="display: none;">Logout</button>
                    <span id="adminIndicator" style="display: none; color: var(--highlight); font-weight: bold;">🔐 Admin Mode</span>
                </div>
            `;
            heroSection.appendChild(adminControls);
        }
    }
    
    // Edit modal functionality
    const editCharacterModal = document.getElementById('editCharacterModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const editCharacterForm = document.getElementById('editCharacterForm');
    const deleteCharacterBtn = document.getElementById('deleteCharacter');
    
    if (closeEditModal) {
        closeEditModal.addEventListener('click', closeEditModal);
    }
    
    if (cancelEdit) {
        cancelEdit.addEventListener('click', closeEditModal);
    }
    
    if (editCharacterModal) {
        editCharacterModal.addEventListener('click', (e) => {
            if (e.target === editCharacterModal) {
                closeEditModal();
            }
        });
    }
    
    if (deleteCharacterBtn) {
        deleteCharacterBtn.addEventListener('click', () => {
            const characterId = document.getElementById('editCharacterId').value;
            deleteCharacter(characterId);
        });
    }
    
    if (editCharacterForm) {
        editCharacterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const characterId = document.getElementById('editCharacterId').value;
            const updatedData = {
                name: document.getElementById('editCharacterName').value,
                series: document.getElementById('editCharacterSeries').value,
                age: document.getElementById('editCharacterAge').value,
                role: document.getElementById('editCharacterRole').value,
                personality: document.getElementById('editCharacterPersonality').value,
                gender: document.getElementById('editCharacterGender') ? document.getElementById('editCharacterGender').value : 'male',
                image: document.getElementById('editCharacterImage').value,
                description: document.getElementById('editCharacterDescription').value,
                analysis: document.getElementById('editCharacterAnalysis').value,
                reasons: document.getElementById('editCharacterReasons').value
            };
            
            const updatedCharacter = updateCharacter(characterId, updatedData);
            if (updatedCharacter) {
                alert(`Character "${updatedCharacter.name}" has been updated successfully!`);
                closeEditModal();
                // Reload the page to show updated content
                window.location.reload();
            }
        });
    }
});