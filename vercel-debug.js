// Vercel deployment debug script
console.log('Vercel debug script loaded');

// Check if the page is loading properly
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Log basic page information
    console.log('Page URL:', window.location.href);
    console.log('Page title:', document.title);
    console.log('HTML elements loaded:', document.getElementsByTagName('*').length);
    
    // Check if critical elements exist
    const bodyContent = document.body.innerHTML.trim();
    if (!bodyContent) {
        console.error('Body is empty!');
    }
    
    // Check if main content containers exist
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (!mainContent) {
        console.warn('Main content container not found');
    }
    
    // Check if critical scripts are loaded
    const scripts = Array.from(document.scripts).map(s => s.src || 'inline script');
    console.log('Loaded scripts:', scripts);
    
    // Add visible indicator that the debug script is running
    const debugElement = document.createElement('div');
    debugElement.style.position = 'fixed';
    debugElement.style.top = '0';
    debugElement.style.left = '0';
    debugElement.style.padding = '10px';
    debugElement.style.backgroundColor = 'red';
    debugElement.style.color = 'white';
    debugElement.style.zIndex = '9999';
    debugElement.textContent = 'Vercel Debug Active';
    document.body.appendChild(debugElement);
    
    // Force show body if it's hidden
    document.body.style.display = 'block';
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
});

// Log any errors that occur
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.message, 'at', e.filename, ':', e.lineno);
}); 