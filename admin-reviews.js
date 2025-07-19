// Admin Reviews System
// Secure system for admin-only reviews with password protection

// Constants
const ADMIN_PASSWORD_HASH = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"; // SHA-256 hash of "password"
const SALT = "stillframe_archive_salt_2025"; // Salt for additional security
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

// State variables
let loginAttempts = 0;
let lastFailedAttempt = 0;
let isAuthenticated = false;

/**
 * Securely hash a string using SHA-256
 * @param {string} str - The string to hash
 * @returns {Promise<string>} - The hashed string
 */
async function hashString(str) {
    // Add salt to the string for additional security
    const saltedStr = str + SALT;
    
    // Convert the string to an ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(saltedStr);
    
    // Hash the data using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert the hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

/**
 * Verify the admin password
 * @param {string} password - The password to verify
 * @returns {Promise<boolean>} - True if the password is correct
 */
async function verifyPassword(password) {
    // Check for lockout
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        const currentTime = Date.now();
        const timeSinceLastAttempt = currentTime - lastFailedAttempt;
        
        if (timeSinceLastAttempt < LOCKOUT_TIME) {
            const minutesLeft = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000);
            showMessage(`Too many failed attempts. Please try again in ${minutesLeft} minutes.`, 'error');
            return false;
        } else {
            // Reset attempts after lockout period
            loginAttempts = 0;
        }
    }
    
    // Hash the password and compare with stored hash
    const hashedPassword = await hashString(password);
    const isValid = hashedPassword === ADMIN_PASSWORD_HASH;
    
    if (!isValid) {
        loginAttempts++;
        lastFailedAttempt = Date.now();
        
        const attemptsLeft = MAX_LOGIN_ATTEMPTS - loginAttempts;
        if (attemptsLeft > 0) {
            showMessage(`Incorrect password. ${attemptsLeft} attempts remaining.`, 'error');
        } else {
            showMessage('Too many failed attempts. Account locked for 30 minutes.', 'error');
        }
    } else {
        // Reset attempts on successful login
        loginAttempts = 0;
        isAuthenticated = true;
    }
    
    return isValid;
}

/**
 * Show a message to the user
 * @param {string} message - The message to show
 * @param {string} type - The type of message (success, error, info)
 */
function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('admin-message');
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.className = `admin-message ${type}`;
        messageContainer.style.display = 'block';
        
        // Hide the message after 5 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

/**
 * Handle the login form submission
 * @param {Event} event - The form submission event
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const passwordInput = document.getElementById('admin-password');
    const password = passwordInput.value;
    
    // Basic input validation
    if (!password || password.trim() === '') {
        showMessage('Please enter a password.', 'error');
        return;
    }
    
    // Sanitize input (remove potentially harmful characters)
    const sanitizedPassword = password.replace(/[<>&"']/g, '');
    
    // Verify the password
    const isValid = await verifyPassword(sanitizedPassword);
    
    if (isValid) {
        showMessage('Login successful!', 'success');
        showAdminPanel();
        
        // Clear the password field
        passwordInput.value = '';
        
        // Save authentication state (session only, not persistent)
        sessionStorage.setItem('adminAuthenticated', 'true');
    }
}

/**
 * Show the admin panel
 */
function showAdminPanel() {
    const loginForm = document.getElementById('admin-login-form');
    const adminPanel = document.getElementById('admin-panel');
    
    if (loginForm) loginForm.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    
    // Load existing reviews
    loadAdminReviews();
}

/**
 * Load admin reviews from localStorage
 */
function loadAdminReviews() {
    const reviewsList = document.getElementById('admin-reviews-list');
    if (!reviewsList) return;
    
    // Clear the list
    reviewsList.innerHTML = '';
    
    // Get reviews from localStorage
    const reviews = JSON.parse(localStorage.getItem('adminReviews') || '[]');
    
    if (reviews.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No reviews yet. Add your first review below.';
        reviewsList.appendChild(emptyMessage);
    } else {
        // Add each review to the list
        reviews.forEach((review, index) => {
            const reviewItem = document.createElement('li');
            reviewItem.className = 'admin-review-item';
            reviewItem.innerHTML = `
                <div class="review-header">
                    <h4>${review.title}</h4>
                    <div class="review-actions">
                        <button class="edit-btn" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </div>
                </div>
                <div class="review-content">
                    <p class="review-date">${new Date(review.date).toLocaleDateString()}</p>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                        <span class="rating-value">${review.rating}/5</span>
                    </div>
                    <p class="review-text">${review.content}</p>
                </div>
            `;
            reviewsList.appendChild(reviewItem);
            
            // Add event listeners for edit and delete buttons
            reviewItem.querySelector('.edit-btn').addEventListener('click', () => editReview(index));
            reviewItem.querySelector('.delete-btn').addEventListener('click', () => deleteReview(index));
        });
    }
}

/**
 * Add a new admin review
 * @param {Event} event - The form submission event
 */
function addAdminReview(event) {
    event.preventDefault();
    
    // Get form values
    const titleInput = document.getElementById('review-title');
    const contentInput = document.getElementById('review-content');
    const ratingInput = document.getElementById('review-rating');
    
    // Validate inputs
    if (!titleInput.value || !contentInput.value || !ratingInput.value) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }
    
    // Sanitize inputs
    const title = sanitizeInput(titleInput.value);
    const content = sanitizeInput(contentInput.value);
    const rating = parseInt(ratingInput.value);
    
    // Create the review object
    const review = {
        title,
        content,
        rating,
        date: new Date().toISOString(),
        id: Date.now().toString()
    };
    
    // Get existing reviews
    const reviews = JSON.parse(localStorage.getItem('adminReviews') || '[]');
    
    // Add the new review
    reviews.push(review);
    
    // Save to localStorage
    localStorage.setItem('adminReviews', JSON.stringify(reviews));
    
    // Show success message
    showMessage('Review added successfully!', 'success');
    
    // Clear the form
    titleInput.value = '';
    contentInput.value = '';
    ratingInput.value = '5';
    
    // Reload reviews
    loadAdminReviews();
}

/**
 * Edit an existing review
 * @param {number} index - The index of the review to edit
 */
function editReview(index) {
    // Get the reviews
    const reviews = JSON.parse(localStorage.getItem('adminReviews') || '[]');
    const review = reviews[index];
    
    if (!review) return;
    
    // Fill the form with the review data
    const titleInput = document.getElementById('review-title');
    const contentInput = document.getElementById('review-content');
    const ratingInput = document.getElementById('review-rating');
    const submitButton = document.getElementById('review-submit');
    
    titleInput.value = review.title;
    contentInput.value = review.content;
    ratingInput.value = review.rating;
    
    // Change the submit button to an update button
    submitButton.textContent = 'Update Review';
    submitButton.dataset.mode = 'edit';
    submitButton.dataset.index = index;
    
    // Scroll to the form
    document.getElementById('add-review-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Update an existing review
 * @param {number} index - The index of the review to update
 */
function updateReview(index) {
    // Get form values
    const titleInput = document.getElementById('review-title');
    const contentInput = document.getElementById('review-content');
    const ratingInput = document.getElementById('review-rating');
    const submitButton = document.getElementById('review-submit');
    
    // Validate inputs
    if (!titleInput.value || !contentInput.value || !ratingInput.value) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }
    
    // Sanitize inputs
    const title = sanitizeInput(titleInput.value);
    const content = sanitizeInput(contentInput.value);
    const rating = parseInt(ratingInput.value);
    
    // Get existing reviews
    const reviews = JSON.parse(localStorage.getItem('adminReviews') || '[]');
    const review = reviews[index];
    
    if (!review) return;
    
    // Update the review
    review.title = title;
    review.content = content;
    review.rating = rating;
    review.updated = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem('adminReviews', JSON.stringify(reviews));
    
    // Show success message
    showMessage('Review updated successfully!', 'success');
    
    // Reset the form
    titleInput.value = '';
    contentInput.value = '';
    ratingInput.value = '5';
    submitButton.textContent = 'Add Review';
    submitButton.dataset.mode = 'add';
    delete submitButton.dataset.index;
    
    // Reload reviews
    loadAdminReviews();
}

/**
 * Delete a review
 * @param {number} index - The index of the review to delete
 */
function deleteReview(index) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    // Get existing reviews
    const reviews = JSON.parse(localStorage.getItem('adminReviews') || '[]');
    
    // Remove the review
    reviews.splice(index, 1);
    
    // Save to localStorage
    localStorage.setItem('adminReviews', JSON.stringify(reviews));
    
    // Show success message
    showMessage('Review deleted successfully!', 'success');
    
    // Reload reviews
    loadAdminReviews();
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The input to sanitize
 * @returns {string} - The sanitized input
 */
function sanitizeInput(input) {
    // Create a temporary div element
    const temp = document.createElement('div');
    
    // Set the input as text content (this escapes HTML)
    temp.textContent = input;
    
    // Return the sanitized content
    return temp.innerHTML;
}

/**
 * Handle form submission based on mode (add or edit)
 * @param {Event} event - The form submission event
 */
function handleReviewSubmit(event) {
    event.preventDefault();
    
    const submitButton = document.getElementById('review-submit');
    const mode = submitButton.dataset.mode || 'add';
    
    if (mode === 'edit') {
        const index = parseInt(submitButton.dataset.index);
        updateReview(index);
    } else {
        addAdminReview(event);
    }
}

/**
 * Log out the admin user
 */
function logoutAdmin() {
    isAuthenticated = false;
    sessionStorage.removeItem('adminAuthenticated');
    
    const loginForm = document.getElementById('admin-login-form');
    const adminPanel = document.getElementById('admin-panel');
    
    if (loginForm) loginForm.style.display = 'block';
    if (adminPanel) adminPanel.style.display = 'none';
    
    showMessage('Logged out successfully.', 'info');
}

/**
 * Initialize the admin reviews system
 */
function initAdminReviews() {
    // Check if already authenticated in this session
    if (sessionStorage.getItem('adminAuthenticated') === 'true') {
        isAuthenticated = true;
        showAdminPanel();
    }
    
    // Add event listeners
    const loginForm = document.getElementById('admin-login-form');
    const addReviewForm = document.getElementById('add-review-form');
    const logoutButton = document.getElementById('admin-logout');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (addReviewForm) {
        addReviewForm.addEventListener('submit', handleReviewSubmit);
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutAdmin);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdminReviews); 