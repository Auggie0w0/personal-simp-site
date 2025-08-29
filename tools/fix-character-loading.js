#!/usr/bin/env node

/**
 * Fix Character Loading Issues
 * 
 * This script identifies and fixes issues with character loading order
 * and ensures all characters are properly loaded.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SCRIPT_FILE = path.join(__dirname, '..', 'js', 'script.js');
const CHARACTERS_DIR = path.join(__dirname, '..', 'characters');

// Main function
function main() {
    console.log('Analyzing character loading issues...');
    
    // Read the script.js file
    const scriptContent = fs.readFileSync(SCRIPT_FILE, 'utf8');
    
    // Extract the character loading code
    const loadingCodeRegex = /async function loadCarouselCharacters[\s\S]*?\}/;
    const loadingCode = scriptContent.match(loadingCodeRegex);
    
    if (!loadingCode) {
        console.error('Could not find character loading function in script.js');
        return;
    }
    
    console.log('Found character loading function');
    
    // Check for potential loading issues
    const issues = [];
    
    // Check for await fetch operations inside a loop
    if (loadingCode[0].includes('for (const character of') && 
        loadingCode[0].includes('await fetch(character.link)')) {
        issues.push('Sequential loading: Characters are loaded one by one with await in a loop');
    }
    
    // Check for preserveExisting logic
    if (loadingCode[0].includes('preserveExisting') && 
        loadingCode[0].includes('continue')) {
        issues.push('Preservation logic: Some characters might be preserved and not refreshed');
    }
    
    // Check character ordering logic
    if (loadingCode[0].includes('if (a.id === \'momo\') return -1') &&
        loadingCode[0].includes('if (a.id === \'waguri\') return -1')) {
        issues.push('Custom ordering: Momo and Waguri are prioritized in loading order');
    }
    
    // Get list of characters from JSON files
    const jsonFiles = fs.readdirSync(CHARACTERS_DIR)
        .filter(file => file.endsWith('.json'));
    
    console.log(`Found ${jsonFiles.length} character JSON files`);
    
    // Extract character IDs from script.js
    const characterIdRegex = /id:\s*['"]([^'"]+)['"]/g;
    const characterIds = [];
    let match;
    
    while ((match = characterIdRegex.exec(scriptContent)) !== null) {
        if (match[1] !== 'Date.now().toString()') {
            characterIds.push(match[1]);
        }
    }
    
    console.log(`Found ${characterIds.length} character IDs in script.js`);
    
    // Check for mismatches
    const jsonCharacterIds = jsonFiles.map(file => path.basename(file, '.json'));
    
    const missingInScript = jsonCharacterIds.filter(id => !characterIds.includes(id));
    const missingInJson = characterIds.filter(id => !jsonCharacterIds.includes(id) && id !== 'leeknow');
    
    if (missingInScript.length > 0) {
        issues.push(`Characters in JSON but missing in script.js: ${missingInScript.join(', ')}`);
    }
    
    if (missingInJson.length > 0) {
        issues.push(`Characters in script.js but missing JSON files: ${missingInJson.join(', ')}`);
    }
    
    // Special case for leeknow/minho
    if (characterIds.includes('leeknow') && jsonCharacterIds.includes('minho')) {
        issues.push('ID mismatch: "leeknow" in script.js but "minho" in JSON files');
    }
    
    // Print issues
    if (issues.length > 0) {
        console.log('\nIdentified issues:');
        issues.forEach((issue, index) => {
            console.log(`${index + 1}. ${issue}`);
        });
        
        // Generate fix recommendations
        console.log('\nRecommended fixes:');
        
        if (issues.some(issue => issue.includes('Sequential loading'))) {
            console.log('1. Modify loadCarouselCharacters to use Promise.all for parallel loading');
            console.log('   - Replace sequential await fetch with Promise.all to load all characters in parallel');
            console.log('   - This will significantly improve loading performance');
        }
        
        if (issues.some(issue => issue.includes('ID mismatch'))) {
            console.log('2. Fix ID mismatch between script.js and JSON files:');
            console.log('   - Either rename minho.json to leeknow.json');
            console.log('   - Or update script.js to use "minho" instead of "leeknow"');
        }
        
        if (issues.some(issue => issue.includes('missing in script.js'))) {
            console.log('3. Add missing characters to script.js staticCharacters array');
        }
    } else {
        console.log('No issues found with character loading');
    }
}

// Run the script
main();
