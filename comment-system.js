// Comment System with Supabase Integration
// This provides persistent comment storage across all users
// SECURITY: This system is protected by security-patch.js

// Supabase configuration (you'll need to set up a free account)
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase anon key

// Initialize Supabase client
let supabase;

// Initialize Supabase if credentials are provided
if (SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    // Load Supabase client dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = function() {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        initializeCommentSystem();
    };
    document.head.appendChild(script);
} else {
    // Fallback to localStorage if no Supabase credentials
    console.log('Supabase not configured, using localStorage fallback');
    initializeCommentSystem();
}

// Comment system functions
function initializeCommentSystem() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addCommentSections();
            loadAllComments();
        });
    } else {
        addCommentSections();
        loadAllComments();
    }
}

function addCommentSections() {
    // Find all character pages - including dynamically created ones
    const characterPages = [
        'minho.html', 'saja.html', 'huntrix.html', 'axel.html', 
        'ivan.html', 'hange.html', 'yamada.html', 'dazai.html', 'miyamura.html'
    ];
    
    // Check if we're on a character page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Check if it's a known character page or a dynamically created one
    if (characterPages.includes(currentPage) || 
        (currentPage && currentPage.endsWith('.html') && currentPage !== 'index.html' && 
         currentPage !== 'character-list.html' && currentPage !== 'reviews.html' && 
         currentPage !== 'abouts.html')) {
        addCommentSectionToPage();
    }
}

function addCommentSectionToPage() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.log('Main content not found, comment section not added');
        return;
    }
    
    // Check if comment section already exists
    if (document.querySelector('.comments-section')) {
        console.log('Comment section already exists');
        return;
    }
    
    // Create comment section
    const commentSection = document.createElement('div');
    commentSection.className = 'comments-section';
    commentSection.innerHTML = `
        <h2>Comments</h2>
        <div class="comment-form">
            <div class="form-group">
                <label for="commentName">Your Name *</label>
                <input type="text" id="commentName" class="form-input" required placeholder="Enter your name">
            </div>
            <div class="form-group">
                <label for="commentText">Comment *</label>
                <textarea id="commentText" class="form-textarea" required placeholder="Share your thoughts about this character..."></textarea>
            </div>
            <button type="button" class="btn btn-primary" onclick="submitComment()">Post Comment</button>
        </div>
        <div class="comments-list" id="commentsList">
            <div class="loading">Loading comments...</div>
        </div>
    `;
    
    mainContent.appendChild(commentSection);
    console.log('Comment section added successfully');
}

async function submitComment() {
    const nameInput = document.getElementById('commentName');
    const textInput = document.getElementById('commentText');
    
    if (!nameInput || !textInput) {
        console.error('Comment form elements not found');
        showNotification('Comment form not found. Please refresh the page.', 'error');
        return;
    }
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    
    if (!name || !text) {
        showNotification('Please enter both your name and comment!', 'error');
        return;
    }
    
    if (name.length < 2) {
        showNotification('Name must be at least 2 characters long!', 'error');
        return;
    }
    
    if (text.length < 10) {
        showNotification('Comment must be at least 10 characters long!', 'error');
        return;
    }
    
    const characterId = getCurrentCharacterId();
    if (characterId === 'unknown') {
        showNotification('Unable to determine character page. Please refresh and try again.', 'error');
        return;
    }
    
    const commentData = {
        characterId: characterId,
        author: name,
        text: text,
        timestamp: new Date().toISOString()
    };
    
    try {
        if (supabase) {
            // Use Supabase for persistent storage
            const { data, error } = await supabase
                .from('comments')
                .insert([commentData]);
            
            if (error) throw error;
        } else {
            // Fallback to localStorage
            saveCommentToLocalStorage(commentData);
        }
        
        // Clear form
        nameInput.value = '';
        textInput.value = '';
        
        // Reload comments
        loadComments(characterId);
        
        // Show success message
        showNotification('Comment posted successfully!', 'success');
        
    } catch (error) {
        console.error('Error posting comment:', error);
        showNotification('Failed to post comment. Please try again.', 'error');
    }
}

function getCurrentCharacterId() {
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
    
    // Check if it's a known character page
    if (characterMap[filename]) {
        return characterMap[filename];
    }
    
    // Check if it's a dynamically created character page
    if (filename && filename.endsWith('.html') && filename !== 'index.html' && 
        filename !== 'character-list.html' && filename !== 'reviews.html' && 
        filename !== 'abouts.html') {
        // Extract character ID from filename (remove .html extension)
        const characterId = filename.replace('.html', '');
        return characterId;
    }
    
    return 'unknown';
}

async function loadComments(characterId) {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) {
        console.error('Comments list element not found');
        return;
    }
    
    try {
        let comments = [];
        
        if (supabase) {
            // Load from Supabase
            console.log('Loading comments from Supabase for character:', characterId);
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('characterId', characterId)
                .order('timestamp', { ascending: false });
            
            if (error) throw error;
            comments = data || [];
            console.log('Loaded', comments.length, 'comments from Supabase');
        } else {
            // Load from localStorage
            console.log('Loading comments from localStorage for character:', characterId);
            comments = loadCommentsFromLocalStorage(characterId);
            console.log('Loaded', comments.length, 'comments from localStorage');
        }
        
        displayComments(comments);
        
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML = '<div class="error">Failed to load comments. Please refresh the page.</div>';
    }
}

function displayComments(comments) {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to share your thoughts!</div>';
        return;
    }
    
    const commentsHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <strong>${escapeHtml(comment.author)}</strong>
                <small>${formatDate(comment.timestamp)}</small>
            </div>
            <div class="comment-text">${escapeHtml(comment.text)}</div>
        </div>
    `).join('');
    
    commentsList.innerHTML = commentsHTML;
}

// LocalStorage fallback functions
function saveCommentToLocalStorage(commentData) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.push(commentData);
    localStorage.setItem('comments', JSON.stringify(comments));
}

function loadCommentsFromLocalStorage(characterId) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    return comments.filter(comment => comment.characterId === characterId);
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
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

function loadAllComments() {
    const characterId = getCurrentCharacterId();
    console.log('Current character ID:', characterId);
    if (characterId !== 'unknown') {
        loadComments(characterId);
    } else {
        console.log('Not on a character page, skipping comment loading');
    }
}

// Debug function to test the comment system
function testCommentSystem() {
    console.log('=== Comment System Debug Info ===');
    console.log('Current page:', window.location.pathname);
    console.log('Character ID:', getCurrentCharacterId());
    console.log('Main content exists:', !!document.querySelector('.main-content'));
    console.log('Comment section exists:', !!document.querySelector('.comments-section'));
    console.log('Supabase configured:', !!supabase);
    console.log('LocalStorage available:', typeof localStorage !== 'undefined');
    
    if (typeof localStorage !== 'undefined') {
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        console.log('Total comments in localStorage:', comments.length);
        console.log('Comments by character:', comments.reduce((acc, comment) => {
            acc[comment.characterId] = (acc[comment.characterId] || 0) + 1;
            return acc;
        }, {}));
    }
    console.log('================================');
}

// Expose test function globally
window.testCommentSystem = testCommentSystem;

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .comments-section {
        margin-top: 3rem;
        padding: 2rem;
        background: var(--card-bg);
        border: 2px solid var(--highlight);
        border-radius: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        width: 70%;
        margin-left: auto;
        margin-right: auto;
    }
    
    .comments-section h2 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
        font-family: "Barriecito", system-ui;
    }
    
    .comment-form {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--highlight);
    }
    
    .comment-form .form-group {
        margin-bottom: 1rem;
    }
    
    .comment-form label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .comment-form .form-input,
    .comment-form .form-textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--highlight);
        border-radius: 8px;
        background: var(--card-bg);
        color: var(--text-primary);
        font-size: 1rem;
        transition: border-color 0.2s ease;
    }
    
    .comment-form .form-input:focus,
    .comment-form .form-textarea:focus {
        outline: none;
        border-color: var(--highlight);
        box-shadow: 0 0 0 3px rgba(255, 190, 71, 0.1);
    }
    
    .comment-form .form-textarea {
        min-height: 100px;
        resize: vertical;
    }
    
    .comments-list {
        max-height: 500px;
        overflow-y: auto;
    }
    
    .comment {
        padding: 1rem;
        margin-bottom: 1rem;
        background: var(--card-bg);
        border: 1px solid var(--highlight);
        border-radius: 10px;
    }
    
    .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    
    .comment-header strong {
        color: var(--highlight);
        font-size: 1.1rem;
    }
    
    .comment-header small {
        color: var(--text-primary);
        opacity: 0.7;
        font-size: 0.9rem;
    }
    
    .comment-text {
        color: var(--text-primary);
        line-height: 1.5;
    }
    
    .no-comments {
        text-align: center;
        color: var(--text-primary);
        opacity: 0.7;
        font-style: italic;
        padding: 2rem;
    }
    
    .loading {
        text-align: center;
        color: var(--text-primary);
        opacity: 0.7;
        padding: 2rem;
    }
    
    .error {
        text-align: center;
        color: #ef4444;
        padding: 2rem;
    }
    
    /* Button styles to match your site */
    .comment-form .btn {
        background: var(--highlight);
        color: var(--text-primary);
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .comment-form .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 190, 71, 0.3);
    }
    
    .comment-form .btn:active {
        transform: translateY(0);
    }
    
    /* Rating System Styles */
    .rating-section {
        margin-top: 3rem;
        padding: 2rem;
        background: var(--card-bg);
        border: 2px solid var(--highlight);
        border-radius: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        width: 70%;
        margin-left: auto;
        margin-right: auto;
    }
    
    .rating-section h2 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
        font-family: "Barriecito", system-ui;
    }
    
    .rating-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .rating-display {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 1.2rem;
    }
    
    .rating-display .stars {
        color: var(--highlight);
        font-size: 1.5rem;
        letter-spacing: 2px;
    }
    
    .rating-display .rating-text {
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .rating-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .star-btn {
        background: var(--highlight);
        color: var(--text-primary);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .star-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 190, 71, 0.3);
    }
    
    .star-btn:active {
        transform: translateY(0);
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .comments-section,
        .rating-section {
            width: 90%;
        }
        
        .rating-buttons {
            gap: 0.25rem;
        }
        
        .star-btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
        }
    }
`;
document.head.appendChild(style); 