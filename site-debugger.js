/**
 * Site Debugger and Optimizer
 * This script checks for common issues and optimizes the site
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    characterPages: [],
    characterJsonFiles: [],
    reviewsFile: 'reviews.html',
    characterListFile: 'character-list.html',
    indexFile: 'index.html',
    scriptFile: 'script.js',
    issuesFound: 0
};

// Main function
async function debugAndOptimize() {
    console.log('🔍 Starting site debug and optimization...');
    
    // Find all character HTML files
    const files = fs.readdirSync('.');
    config.characterPages = files.filter(file => 
        file.endsWith('.html') && 
        !file.startsWith('_') && 
        !file.includes('test-') &&
        !file.includes('reset-') &&
        !file.includes('clear-') &&
        !file.includes('template') &&
        !['index.html', 'reviews.html', 'character-list.html', 'abouts.html', 'admin.html', 'character-template.html', 'footer_disclaimer_template.html'].includes(file)
    );
    
    console.log(`Found ${config.characterPages.length} character pages`);
    
    // Find all character JSON files
    if (fs.existsSync('characters')) {
        const jsonFiles = fs.readdirSync('characters');
        config.characterJsonFiles = jsonFiles.filter(file => file.endsWith('.json'));
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

// Check character consistency between HTML and JSON files
async function checkCharacterConsistency() {
    console.log('\n🔄 Checking character consistency...');
    
    // Check for HTML pages without JSON
    const jsonIds = config.characterJsonFiles.map(file => path.basename(file, '.json'));
    const htmlIds = config.characterPages.map(file => path.basename(file, '.html'));
    
    const htmlWithoutJson = htmlIds.filter(id => !jsonIds.includes(id));
    if (htmlWithoutJson.length > 0) {
        config.issuesFound += htmlWithoutJson.length;
        console.log(`⚠️ Found ${htmlWithoutJson.length} character pages without JSON files:`);
        htmlWithoutJson.forEach(id => {
            console.log(`   - ${id}.html (consider creating ${id}.json)`);
        });
    }
    
    // Check for JSON without HTML
    const jsonWithoutHtml = jsonIds.filter(id => !htmlIds.includes(id));
    if (jsonWithoutHtml.length > 0) {
        config.issuesFound += jsonWithoutHtml.length;
        console.log(`⚠️ Found ${jsonWithoutHtml.length} JSON files without character pages:`);
        jsonWithoutHtml.forEach(id => {
            console.log(`   - ${id}.json (run generator to create ${id}.html)`);
        });
    }
}

// Check for broken links in HTML files
async function checkBrokenLinks() {
    console.log('\n🔗 Checking for broken links...');
    
    const allHtmlFiles = [
        'index.html', 
        'character-list.html', 
        'reviews.html', 
        'abouts.html',
        ...config.characterPages
    ];
    
    let brokenLinks = 0;
    
    for (const file of allHtmlFiles) {
        if (!fs.existsSync(file)) continue;
        
        const content = fs.readFileSync(file, 'utf8');
        const hrefMatches = content.match(/href="([^"]+)"/g) || [];
        
        for (const hrefMatch of hrefMatches) {
            const href = hrefMatch.replace(/href="([^"]+)"/, '$1');
            
            // Skip external links and anchors
            if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
                continue;
            }
            
            // Check if the linked file exists
            if (!fs.existsSync(href)) {
                brokenLinks++;
                console.log(`⚠️ Broken link in ${file}: ${href}`);
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
                console.log(`⚠️ Suspicious image URL in ${file}: ${src}`);
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
    if (!fs.existsSync('assets')) {
        fs.mkdirSync('assets');
        console.log('✅ Created assets directory for future local image storage.');
    }
    
    // Create characters directory if it doesn't exist
    if (!fs.existsSync('characters')) {
        fs.mkdirSync('characters');
        console.log('✅ Created characters directory for JSON configuration files.');
    }
}

// Run the debug and optimization
debugAndOptimize().catch(err => {
    console.error('Error during debug and optimization:', err);
    process.exit(1);
}); 