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