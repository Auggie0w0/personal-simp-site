// Character Utilities
// This file provides utility functions for handling character data display

/**
 * Conditionally displays character information sections based on data availability
 * Hides sections like birthday and fun facts if data is missing or uncertain
 */
function updateCharacterDisplay() {
    // Process birthday information
    const statLabels = document.querySelectorAll('.stat-label');
    statLabels.forEach(element => {
        if (element.textContent.trim() === 'Birthday') {
            const statBox = element.closest('.stat');
            const valueElement = statBox.querySelector('.stat-value');
            
            // Hide birthday if it contains uncertain terms or is empty/unknown
            if (valueElement) {
                const value = valueElement.textContent.trim().toLowerCase();
                if (value === 'unknown' || 
                    value === '' || 
                    value.includes('uncertain') || 
                    value.includes('?') ||
                    value.includes('not confirmed')) {
                    statBox.style.display = 'none';
                }
            }
        }
    });
    
    // Process fun facts section
    const funFactsHeadings = document.querySelectorAll('h3');
    funFactsHeadings.forEach(heading => {
        if (heading.textContent.includes('Fun Facts')) {
            const factsList = heading.nextElementSibling;
            if (factsList && factsList.tagName.toLowerCase() === 'ul') {
                const facts = factsList.querySelectorAll('li');
                
                // Hide the entire section if there are no facts
                if (facts.length === 0) {
                    heading.style.display = 'none';
                    factsList.style.display = 'none';
                } else {
                    // Check each fact for uncertainty
                    let allFactsUncertain = true;
                    facts.forEach(fact => {
                        const factText = fact.textContent.trim().toLowerCase();
                        if (!(factText.includes('uncertain') || 
                              factText.includes('?') || 
                              factText.includes('not confirmed') ||
                              factText.includes('unknown'))) {
                            allFactsUncertain = false;
                        }
                    });
                    
                    if (allFactsUncertain) {
                        heading.style.display = 'none';
                        factsList.style.display = 'none';
                    }
                }
            }
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCharacterDisplay();
}); 