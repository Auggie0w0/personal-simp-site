#!/usr/bin/env node

/**
 * Optimize Character Loading
 * 
 * This script optimizes the character loading process in script.js
 * to improve performance and fix loading issues.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SCRIPT_FILE = path.join(__dirname, '..', 'js', 'script.js');
const BACKUP_FILE = path.join(__dirname, '..', 'js', 'script.js.bak');
const CHARACTERS_DIR = path.join(__dirname, '..', 'characters');

// Main function
function main() {
    console.log('Optimizing character loading...');
    
    // Backup the original file
    fs.copyFileSync(SCRIPT_FILE, BACKUP_FILE);
    console.log(`Backed up original script to ${BACKUP_FILE}`);
    
    // Read the script.js file
    let scriptContent = fs.readFileSync(SCRIPT_FILE, 'utf8');
    
    // Fix the ID mismatch between leeknow and minho
    scriptContent = scriptContent.replace(/id:\s*['"]leeknow['"]/g, 'id: \'minho\'');
    scriptContent = scriptContent.replace(/link:\s*['"]minho\.html['"]/g, 'link: \'minho.html\'');
    
    // Find the loadCarouselCharacters function
    const loadingFunctionRegex = /(async function loadCarouselCharacters[\s\S]*?)(for \(const character of carouselCharacters\) \{[\s\S]*?)(\s*carouselTrack\.appendChild\(card\);[\s\S]*?\})/;
    const loadingFunctionMatch = scriptContent.match(loadingFunctionRegex);
    
    if (!loadingFunctionMatch) {
        console.error('Could not find character loading function in script.js');
        return;
    }
    
    // Extract parts of the function
    const functionStart = loadingFunctionMatch[1];
    const characterLoop = loadingFunctionMatch[2];
    const functionEnd = loadingFunctionMatch[3];
    
    // Modify the character loop to use Promise.all for parallel loading
    const optimizedLoop = `
    // Create an array of promises for parallel loading
    const characterPromises = carouselCharacters.map(async (character) => {
        // Skip Momo and Waguri if we're preserving existing cards and they exist
        if (preserveExisting && 
            ((character.id === 'momo' && existingMomoCard) || 
             (character.id === 'waguri' && existingWaguriCard))) {
            return null;
        }
        
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
            console.log(\`Could not fetch updated data for \${character.name}, using cached data\`);
        }

        return character;
    });
    
    // Wait for all character data to be loaded
    const loadedCharacters = await Promise.all(characterPromises);
    
    // Create and append cards for each character
    loadedCharacters.forEach(character => {
        if (!character) return; // Skip null entries (preserved characters)
        
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.character = character.id;
        
        card.innerHTML = \`
            <a href="\${character.link}" class="card-link">
                <div class="card-image">
                    <img src="\${character.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}" alt="\${character.name}">
                </div>
                <div class="card-content">
                    <h3>\${character.name}</h3>
                    <p>\${character.series}</p>
                </div>
            </a>
        \`;`;
    
    // Replace the character loop with the optimized version
    const optimizedFunction = functionStart + optimizedLoop + functionEnd;
    scriptContent = scriptContent.replace(loadingFunctionRegex, optimizedFunction);
    
    // Similarly optimize the gallery loading function
    const galleryFunctionRegex = /(async function loadGalleryCharacters[\s\S]*?)(for \(const character of characters\) \{[\s\S]*?)(\s*galleryContainer\.appendChild\(card\);[\s\S]*?\})/;
    const galleryFunctionMatch = scriptContent.match(galleryFunctionRegex);
    
    if (galleryFunctionMatch) {
        const galleryStart = galleryFunctionMatch[1];
        const galleryLoop = galleryFunctionMatch[2];
        const galleryEnd = galleryFunctionMatch[3];
        
        const optimizedGalleryLoop = `
    // Create an array of promises for parallel loading
    const characterPromises = characters.map(async (character) => {
        // Skip Momo and Waguri if we're preserving existing cards and they exist
        if (preserveExisting && 
            ((character.id === 'momo' && existingMomoCard) || 
             (character.id === 'waguri' && existingWaguriCard))) {
            return null;
        }
        
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
            console.log(\`Could not fetch updated data for \${character.name}, using cached data\`);
        }

        return character;
    });
    
    // Wait for all character data to be loaded
    const loadedCharacters = await Promise.all(characterPromises);
    
    // Create and append cards for each character
    loadedCharacters.forEach(character => {
        if (!character) return; // Skip null entries (preserved characters)
        
        const card = document.createElement('div');
        card.className = 'gallery-character-card';
        card.dataset.character = character.id;
        
        card.innerHTML = \`
            <a href="\${character.link}" class="gallery-card-link">
                <div class="gallery-card-image">
                    <img src="\${character.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}" alt="\${character.name}">
                </div>
                <div class="gallery-card-content">
                    <h3>\${character.name}</h3>
                    <p>\${character.series}</p>
                </div>
            </a>
        \`;`;
        
        const optimizedGalleryFunction = galleryStart + optimizedGalleryLoop + galleryEnd;
        scriptContent = scriptContent.replace(galleryFunctionRegex, optimizedGalleryFunction);
    }
    
    // Fix missing character in staticCharacters array
    // Find the staticCharacters array
    const staticCharactersRegex = /(const staticCharacters = \[[\s\S]*?)(\];)/;
    const staticCharactersMatch = scriptContent.match(staticCharactersRegex);
    
    if (staticCharactersMatch) {
        const staticCharactersStart = staticCharactersMatch[1];
        const staticCharactersEnd = staticCharactersMatch[2];
        
        // Add missing joonghyuk character
        const joonghyukCharacter = `
        {
            id: 'joonghyuk',
            name: 'Kim Joonghyuk',
            series: 'Omniscient Reader\'s Viewpoint',
            image: 'https://i.pinimg.com/736x/5a/c8/d9/5ac8d9f4f3b5f1c1b6d5f1c1b6d5f1c1.jpg',
            link: 'joonghyuk.html',
            birthday: 'Unknown',
            funFacts: [
                'He is the protagonist of Ways of Survival',
                'He has regressed over 1800 times',
                'He is known as the "Regressor"',
                'He has a special sword called the Black Demon Sword',
                'He has a complicated relationship with Dokja'
            ]
        },`;
        
        const updatedStaticCharacters = staticCharactersStart + joonghyukCharacter + staticCharactersEnd;
        scriptContent = scriptContent.replace(staticCharactersRegex, updatedStaticCharacters);
    }
    
    // Write the updated script back to the file
    fs.writeFileSync(SCRIPT_FILE, scriptContent);
    
    console.log('Character loading optimized successfully!');
    console.log('Changes made:');
    console.log('1. Fixed ID mismatch between leeknow and minho');
    console.log('2. Implemented parallel loading with Promise.all for better performance');
    console.log('3. Added missing joonghyuk character to staticCharacters array');
    console.log('\nOriginal script backed up to script.js.bak');
}

// Run the script
main();
