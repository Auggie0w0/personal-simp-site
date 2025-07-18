// Security Patch for August's Simp Gallery
// This file implements comprehensive security measures to prevent attacks

// Security Configuration
const SECURITY_CONFIG = {
    // Rate limiting
    RATE_LIMIT: {
        COMMENTS_PER_MINUTE: 3,
        REVIEWS_PER_MINUTE: 2,
        REQUESTS_PER_MINUTE: 30
    },
    
    // Input validation
    VALIDATION: {
        MAX_NAME_LENGTH: 50,
        MAX_COMMENT_LENGTH: 1000,
        MAX_REVIEW_TITLE_LENGTH: 100,
        MAX_REVIEW_SUMMARY_LENGTH: 500,
        MAX_REVIEW_TEXT_LENGTH: 2000,
        ALLOWED_HTML_TAGS: [], // No HTML allowed
        ALLOWED_CHARACTERS: /^[a-zA-Z0-9\s\-_.,!?@#$%^&*()+=:;"'()[\]{}|\\/<>~`]+$/
    },
    
    // Content Security Policy
    CSP: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", "data:", "https:", "http:"],
        'font-src': ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
        'connect-src': ["'self'", "https://*.supabase.co"],
        'frame-src': ["'self'", "https://docs.google.com"]
    }
};

// Rate Limiting Implementation
class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Clean up every minute
    }
    
    isAllowed(key, limit) {
        const now = Date.now();
        const minuteAgo = now - 60000;
        
        if (!this.requests.has(key)) {
            this.requests.set(key, []);
        }
        
        const requests = this.requests.get(key);
        
        // Remove old requests
        const recentRequests = requests.filter(time => time > minuteAgo);
        this.requests.set(key, recentRequests);
        
        if (recentRequests.length >= limit) {
            return false;
        }
        
        recentRequests.push(now);
        return true;
    }
    
    cleanup() {
        const now = Date.now();
        const minuteAgo = now - 60000;
        
        for (const [key, requests] of this.requests.entries()) {
            const recentRequests = requests.filter(time => time > minuteAgo);
            if (recentRequests.length === 0) {
                this.requests.delete(key);
            } else {
                this.requests.set(key, recentRequests);
            }
        }
    }
}

const rateLimiter = new RateLimiter();

// Input Sanitization and Validation
class SecurityValidator {
    static sanitizeInput(input, maxLength = 1000) {
        if (typeof input !== 'string') {
            return '';
        }
        
        // Remove null bytes and control characters
        let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        
        // Trim whitespace
        sanitized = sanitized.trim();
        
        // Limit length
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        
        // Remove any HTML tags
        sanitized = sanitized.replace(/<[^>]*>/g, '');
        
        // Remove script tags and event handlers
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=/gi, '');
        
        return sanitized;
    }
    
    static validateName(name) {
        const sanitized = this.sanitizeInput(name, SECURITY_CONFIG.VALIDATION.MAX_NAME_LENGTH);
        
        if (sanitized.length < 2) {
            return { valid: false, error: 'Name must be at least 2 characters long' };
        }
        
        if (sanitized.length > SECURITY_CONFIG.VALIDATION.MAX_NAME_LENGTH) {
            return { valid: false, error: `Name must be no more than ${SECURITY_CONFIG.VALIDATION.MAX_NAME_LENGTH} characters` };
        }
        
        // Check for allowed characters
        if (!SECURITY_CONFIG.VALIDATION.ALLOWED_CHARACTERS.test(sanitized)) {
            return { valid: false, error: 'Name contains invalid characters' };
        }
        
        return { valid: true, value: sanitized };
    }
    
    static validateComment(text) {
        const sanitized = this.sanitizeInput(text, SECURITY_CONFIG.VALIDATION.MAX_COMMENT_LENGTH);
        
        if (sanitized.length < 10) {
            return { valid: false, error: 'Comment must be at least 10 characters long' };
        }
        
        if (sanitized.length > SECURITY_CONFIG.VALIDATION.MAX_COMMENT_LENGTH) {
            return { valid: false, error: `Comment must be no more than ${SECURITY_CONFIG.VALIDATION.MAX_COMMENT_LENGTH} characters` };
        }
        
        return { valid: true, value: sanitized };
    }
    
    static validateReviewTitle(title) {
        const sanitized = this.sanitizeInput(title, SECURITY_CONFIG.VALIDATION.MAX_REVIEW_TITLE_LENGTH);
        
        if (sanitized.length < 1) {
            return { valid: false, error: 'Review title is required' };
        }
        
        return { valid: true, value: sanitized };
    }
    
    static validateReviewSummary(summary) {
        const sanitized = this.sanitizeInput(summary, SECURITY_CONFIG.VALIDATION.MAX_REVIEW_SUMMARY_LENGTH);
        
        if (sanitized.length < 10) {
            return { valid: false, error: 'Review summary must be at least 10 characters long' };
        }
        
        return { valid: true, value: sanitized };
    }
    
    static validateReviewText(text) {
        const sanitized = this.sanitizeInput(text, SECURITY_CONFIG.VALIDATION.MAX_REVIEW_TEXT_LENGTH);
        return { valid: true, value: sanitized };
    }
    
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    static generateCSRFToken() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    
    static validateCSRFToken(token) {
        const storedToken = sessionStorage.getItem('csrf_token');
        return token === storedToken;
    }
}

// Content Security Policy Implementation
class CSPManager {
    static setCSP() {
        const csp = Object.entries(SECURITY_CONFIG.CSP)
            .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
            .join('; ');
        
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = csp;
        document.head.appendChild(meta);
    }
    
    static addSecurityHeaders() {
        // Add security headers via meta tags
        const headers = [
            { name: 'X-Content-Type-Options', value: 'nosniff' },
            { name: 'X-Frame-Options', value: 'DENY' },
            { name: 'X-XSS-Protection', value: '1; mode=block' },
            { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ];
        
        headers.forEach(header => {
            const meta = document.createElement('meta');
            meta.httpEquiv = header.name;
            meta.content = header.value;
            document.head.appendChild(meta);
        });
    }
}

// Secure Comment System Override
class SecureCommentSystem {
    constructor() {
        this.initializeSecurity();
        this.overrideCommentFunctions();
    }
    
    initializeSecurity() {
        // Set CSP and security headers
        CSPManager.setCSP();
        CSPManager.addSecurityHeaders();
        
        // Generate CSRF token
        const csrfToken = SecurityValidator.generateCSRFToken();
        sessionStorage.setItem('csrf_token', csrfToken);
        
        // Add CSRF token to all forms
        this.addCSRFTokenToForms();
    }
    
    addCSRFTokenToForms() {
        const forms = document.querySelectorAll('form');
        const csrfToken = sessionStorage.getItem('csrf_token');
        
        forms.forEach(form => {
            if (!form.querySelector('input[name="csrf_token"]')) {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrf_token';
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
            }
        });
    }
    
    overrideCommentFunctions() {
        // Override the original submitComment function
        window.submitComment = this.secureSubmitComment.bind(this);
        
        // Override the original displayComments function
        window.displayComments = this.secureDisplayComments.bind(this);
    }
    
    async secureSubmitComment() {
        const nameInput = document.getElementById('commentName');
        const textInput = document.getElementById('commentText');
        
        if (!nameInput || !textInput) {
            this.showSecureNotification('Comment form not found. Please refresh the page.', 'error');
            return;
        }
        
        // Rate limiting
        const userIP = this.getUserIdentifier();
        if (!rateLimiter.isAllowed(`comment_${userIP}`, SECURITY_CONFIG.RATE_LIMIT.COMMENTS_PER_MINUTE)) {
            this.showSecureNotification('Too many comments. Please wait a minute before posting again.', 'error');
            return;
        }
        
        // Input validation
        const nameValidation = SecurityValidator.validateName(nameInput.value);
        if (!nameValidation.valid) {
            this.showSecureNotification(nameValidation.error, 'error');
            return;
        }
        
        const commentValidation = SecurityValidator.validateComment(textInput.value);
        if (!commentValidation.valid) {
            this.showSecureNotification(commentValidation.error, 'error');
            return;
        }
        
        const characterId = this.getCurrentCharacterId();
        if (characterId === 'unknown') {
            this.showSecureNotification('Unable to determine character page. Please refresh and try again.', 'error');
            return;
        }
        
        const commentData = {
            characterId: characterId,
            author: nameValidation.value,
            text: commentValidation.value,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 100), // Limited for privacy
            ipHash: this.hashString(userIP) // Store hashed IP for rate limiting
        };
        
        try {
            if (window.supabase) {
                // Use Supabase for persistent storage
                const { data, error } = await window.supabase
                    .from('comments')
                    .insert([commentData]);
                
                if (error) throw error;
            } else {
                // Fallback to localStorage
                this.saveCommentToLocalStorage(commentData);
            }
            
            // Clear form
            nameInput.value = '';
            textInput.value = '';
            
            // Reload comments
            this.loadComments(characterId);
            
            // Show success message
            this.showSecureNotification('Comment posted successfully!', 'success');
            
        } catch (error) {
            console.error('Error posting comment:', error);
            this.showSecureNotification('Failed to post comment. Please try again.', 'error');
        }
    }
    
    secureDisplayComments(comments) {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to share your thoughts!</div>';
            return;
        }
        
        const commentsHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <strong>${SecurityValidator.escapeHtml(comment.author)}</strong>
                    <small>${this.formatDate(comment.timestamp)}</small>
                </div>
                <div class="comment-text">${SecurityValidator.escapeHtml(comment.text)}</div>
            </div>
        `).join('');
        
        commentsList.innerHTML = commentsHTML;
    }
    
    showSecureNotification(message, type = 'info') {
        // Sanitize message
        const sanitizedMessage = SecurityValidator.sanitizeInput(message, 200);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = sanitizedMessage;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    getUserIdentifier() {
        // Create a simple identifier for rate limiting
        // In production, this should be a proper user session ID
        return btoa(navigator.userAgent + window.screen.width + window.screen.height).substring(0, 16);
    }
    
    hashString(str) {
        // Simple hash function for privacy
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
    
    getCurrentCharacterId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        const characterMap = {
            'minho.html': 'leeknow',
            'saja.html': 'saja',
            'huntrix.html': 'huntrix',
            'axel.html': 'axel',
            'ivan.html': 'ivan',
            'hange.html': 'hange',
            'yamada.html': 'yamada',
            'dazai.html': 'dazai',
            'miyamura.html': 'miyamura'
        };
        
        return characterMap[filename] || 'unknown';
    }
    
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    
    saveCommentToLocalStorage(commentData) {
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        comments.push(commentData);
        localStorage.setItem('comments', JSON.stringify(comments));
    }
    
    loadComments(characterId) {
        // This will be called by the original comment system
        // The secure display function will handle the output
    }
}

// Secure Review System Override
class SecureReviewSystem {
    constructor() {
        this.overrideReviewFunctions();
    }
    
    overrideReviewFunctions() {
        // Override review form submission
        const addReviewForm = document.getElementById('addReviewForm');
        if (addReviewForm) {
            addReviewForm.addEventListener('submit', this.secureReviewSubmit.bind(this));
        }
    }
    
    secureReviewSubmit(e) {
        e.preventDefault();
        
        // Rate limiting
        const userIP = this.getUserIdentifier();
        if (!rateLimiter.isAllowed(`review_${userIP}`, SECURITY_CONFIG.RATE_LIMIT.REVIEWS_PER_MINUTE)) {
            this.showSecureNotification('Too many reviews. Please wait a minute before posting again.', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(e.target);
        const reviewData = {};
        
        for (const [key, value] of formData.entries()) {
            reviewData[key] = value;
        }
        
        // Validate CSRF token
        if (!SecurityValidator.validateCSRFToken(reviewData.csrf_token)) {
            this.showSecureNotification('Security validation failed. Please refresh the page.', 'error');
            return;
        }
        
        // Validate inputs
        const titleValidation = SecurityValidator.validateReviewTitle(reviewData.reviewTitle);
        if (!titleValidation.valid) {
            this.showSecureNotification(titleValidation.error, 'error');
            return;
        }
        
        const summaryValidation = SecurityValidator.validateReviewSummary(reviewData.reviewSummary);
        if (!summaryValidation.valid) {
            this.showSecureNotification(summaryValidation.error, 'error');
            return;
        }
        
        const reviewTextValidation = SecurityValidator.validateReviewText(reviewData.reviewReview || '');
        
        // Create secure review object
        const secureReview = {
            title: titleValidation.value,
            type: SecurityValidator.sanitizeInput(reviewData.reviewType),
            rating: SecurityValidator.sanitizeInput(reviewData.reviewRating),
            genre: SecurityValidator.sanitizeInput(reviewData.reviewGenre || ''),
            summary: summaryValidation.value,
            review: reviewTextValidation.value,
            status: SecurityValidator.sanitizeInput(reviewData.reviewStatus || ''),
            episodes: SecurityValidator.sanitizeInput(reviewData.reviewEpisodes || ''),
            timestamp: new Date().toISOString()
        };
        
        // Save review (this would integrate with your existing review system)
        this.saveSecureReview(secureReview);
        
        // Reset form
        e.target.reset();
        
        // Show success message
        this.showSecureNotification('Review posted successfully!', 'success');
    }
    
    saveSecureReview(review) {
        // This would integrate with your existing review storage system
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews.push(review);
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }
    
    getUserIdentifier() {
        return btoa(navigator.userAgent + window.screen.width + window.screen.height).substring(0, 16);
    }
    
    showSecureNotification(message, type = 'info') {
        const sanitizedMessage = SecurityValidator.sanitizeInput(message, 200);
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = sanitizedMessage;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize security systems
document.addEventListener('DOMContentLoaded', function() {
    // Initialize secure comment system
    window.secureCommentSystem = new SecureCommentSystem();
    
    // Initialize secure review system
    window.secureReviewSystem = new SecureReviewSystem();
    
    console.log('Security patch loaded successfully');
});

// Export for testing
window.SecurityValidator = SecurityValidator;
window.RateLimiter = RateLimiter;
window.SECURITY_CONFIG = SECURITY_CONFIG; 