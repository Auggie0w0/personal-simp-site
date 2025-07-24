/**
 * Site Debugger
 * This script checks for issues in the site structure and optimizes it
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    rootDir: path.join(__dirname, '..'),
    charactersDir: path.join(__dirname, '..', 'characters'),
    assetsDir: path.join(__dirname, '..', 'assets'),
    reviewsFile: path.join(__dirname, '..', 'reviews.html'),
    characterListFile: path.join(__dirname, '..', 'character-list.html'),
    indexFile: path.join(__dirname, '..', 'index.html'),
    scriptFile: path.join(__dirname, '..', 'js', 'script.js'),
    characterPages: [],
    characterJsonFiles: [],
    issuesFound: 0
};

// Main function
async function debugAndOptimize() {
    console.log('🔍 Starting site debug and optimization...');
    
    // Find all character HTML files
    const htmlFiles = fs.readdirSync(config.rootDir)
        .filter(file => 
            file.endsWith('.html') && 
            !file.startsWith('_') && 
            !file.includes('test-') &&
            !file.includes('reset-') &&
            !file.includes('clear-') &&
            !file.includes('template') &&
            !['index.html', 'reviews.html', 'character-list.html', 'abouts.html', 'admin.html'].includes(file)
        )
        .map(file => path.join(config.rootDir, file));
    
    config.characterPages = htmlFiles;
    console.log(`Found ${config.characterPages.length} character pages`);
    
    // Find all character JSON files
    if (fs.existsSync(config.charactersDir)) {
        const jsonFiles = fs.readdirSync(config.charactersDir)
            .filter(file => file.endsWith('.json'))
            .map(file => path.join(config.charactersDir, file));
        
        config.characterJsonFiles = jsonFiles;
        console.log(`Found ${config.characterJsonFiles.length} character JSON files`);
    }
    
    // Run checks
    await checkCharacterConsistency();
    await checkBrokenLinks();
    await checkImageLinks();
    await checkReviewsConsistency();
    await optimizeSite();
    
    // Summary
    if (config.issuesFound === 0) {
        console.log('✅ No issues found! The site is well-structured and optimized.');
    } else {
        console.log(`⚠️ Found ${config.issuesFound} issues that need attention.`);
    }
}

// Check for consistency between HTML and JSON files
async function checkCharacterConsistency() {
    console.log('\n🔄 Checking character consistency...');
    
    // Check for HTML files without JSON
    for (const htmlFile of config.characterPages) {
        const basename = path.basename(htmlFile, '.html');
        const jsonFile = path.join(config.charactersDir, `${basename}.json`);
        
        if (!fs.existsSync(jsonFile)) {
            console.log(`⚠️ Found character page without JSON file: ${basename}.html (consider creating ${basename}.json)`);
            config.issuesFound++;
        }
    }
    
    // Check for JSON files without HTML
    for (const jsonFile of config.characterJsonFiles) {
        const basename = path.basename(jsonFile, '.json');
        const htmlFile = path.join(config.rootDir, `${basename}.html`);
        
        if (!fs.existsSync(htmlFile)) {
            console.log(`⚠️ Found JSON file without character page: ${basename}.json (consider generating ${basename}.html)`);
            config.issuesFound++;
        }
    }
}

// Check for broken links
async function checkBrokenLinks() {
    console.log('\n🔗 Checking for broken links...');
    
    let brokenLinks = 0;
    
    for (const file of config.characterPages) {
        if (!fs.existsSync(file)) continue;
        
        const content = fs.readFileSync(file, 'utf8');
        const hrefMatches = content.match(/href="([^"]+\.html)"/g) || [];
        
        for (const hrefMatch of hrefMatches) {
            const href = hrefMatch.replace(/href="([^"]+)"/, '$1');
            
            // Skip external links
            if (href.startsWith('http')) continue;
            
            // Skip dynamic links
            if (href.includes('${')) continue;
            
            // Check if the file exists
            const targetFile = path.join(config.rootDir, href);
            if (!fs.existsSync(targetFile)) {
                brokenLinks++;
                console.log(`⚠️ Broken link in ${path.basename(file)}: ${href}`);
            }
        }
    }
    
    if (brokenLinks === 0) {
        console.log('✅ No broken internal links found.');
    } else {
        config.issuesFound += brokenLinks;
    }
}

// Check for broken image links
async function checkImageLinks() {
    console.log('\n🖼️ Checking image links in character pages...');
    
    // This is a simplified check since we can't actually fetch external images
    // We'll just check for common issues in image URLs
    
    let suspiciousImageUrls = 0;
    
    for (const file of config.characterPages) {
        if (!fs.existsSync(file)) continue;
        
        const content = fs.readFileSync(file, 'utf8');
        const imgMatches = content.match(/src="([^"]+)"/g) || [];
        
        for (const imgMatch of imgMatches) {
            const src = imgMatch.replace(/src="([^"]+)"/, '$1');
            
            // Skip local images
            if (!src.startsWith('http')) continue;
            
            // Check for potential issues in URLs
            if (
                src.includes('@') || 
                src.includes('?') || 
                src.includes('revision') ||
                src.includes('2025') || // Future dates
                src.endsWith('.webp') // WebP might not be supported everywhere
            ) {
                suspiciousImageUrls++;
                console.log(`⚠️ Suspicious image URL in ${path.basename(file)}: ${src}`);
            }
        }
    }
    
    if (suspiciousImageUrls === 0) {
        console.log('✅ No suspicious image URLs found.');
    } else {
        config.issuesFound += suspiciousImageUrls;
    }
}

// Check reviews consistency
async function checkReviewsConsistency() {
    console.log('\n📋 Checking reviews consistency...');
    
    if (!fs.existsSync(config.reviewsFile)) {
        console.log('⚠️ Reviews file not found.');
        config.issuesFound++;
        return;
    }
    
    const content = fs.readFileSync(config.reviewsFile, 'utf8');
    
    // Check for review cards
    const reviewCards = (content.match(/<div class="review-card">/g) || []).length;
    console.log(`Found ${reviewCards} review cards.`);
    
    // Check for proper header structure
    const reviewHeaders = (content.match(/<div class="review-header">/g) || []).length;
    if (reviewHeaders !== reviewCards) {
        console.log(`⚠️ Mismatch: ${reviewCards} review cards but ${reviewHeaders} review headers.`);
        config.issuesFound++;
    }
    
    // Check for proper rating structure
    const reviewRatings = (content.match(/<div class="review-rating">/g) || []).length;
    if (reviewRatings !== reviewCards) {
        console.log(`⚠️ Mismatch: ${reviewCards} review cards but ${reviewRatings} review ratings.`);
        config.issuesFound++;
    }
}

// Optimize the site
async function optimizeSite() {
    console.log('\n⚡ Optimizing site...');
    
    // Check for duplicate character entries in script.js
    if (fs.existsSync(config.scriptFile)) {
        const scriptContent = fs.readFileSync(config.scriptFile, 'utf8');
        const characterIds = [];
        const idMatches = scriptContent.match(/id: '([^']+)'/g) || [];
        
        for (const idMatch of idMatches) {
            const id = idMatch.replace(/id: '([^']+)'/, '$1');
            if (characterIds.includes(id)) {
                console.log(`⚠️ Duplicate character ID in script.js: ${id}`);
                config.issuesFound++;
            } else {
                characterIds.push(id);
            }
        }
        
        console.log(`Found ${characterIds.length} unique character IDs in script.js`);
    }
    
    // Check for missing character IDs in character-list.html
    if (fs.existsSync(config.characterListFile)) {
        const listContent = fs.readFileSync(config.characterListFile, 'utf8');
        
        for (const jsonFile of config.characterJsonFiles) {
            const id = path.basename(jsonFile, '.json');
            const htmlFile = `${id}.html`;
            
            if (!listContent.includes(`href="${htmlFile}"`)) {
                console.log(`⚠️ Character ${id} is missing from character-list.html`);
                config.issuesFound++;
            }
        }
    }
    
    // Create assets directory if it doesn't exist
    if (!fs.existsSync(config.assetsDir)) {
        fs.mkdirSync(config.assetsDir);
        console.log('✅ Created assets directory for future local image storage.');
    }
    
    // Create characters directory if it doesn't exist
    if (!fs.existsSync(config.charactersDir)) {
        fs.mkdirSync(config.charactersDir);
        console.log('✅ Created characters directory for JSON configuration files.');
    }
}

// Run the debug and optimization
debugAndOptimize().catch(err => {
    console.error('Error during debug and optimization:', err);
    process.exit(1);
});