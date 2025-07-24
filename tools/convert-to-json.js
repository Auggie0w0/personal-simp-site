/**
 * Convert Character HTML Pages to JSON Format
 * This script extracts information from existing character HTML pages
 * and creates corresponding JSON files for use with the character generator
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio'); // You may need to install this: npm install cheerio

// Configuration
const config = {
    inputDir: '.',
    outputDir: 'characters',
    skipExisting: true,
    verbose: true
};

// Main function
async function convertCharactersToJson() {
    console.log('🔄 Converting character HTML pages to JSON format...');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir);
        console.log(`Created output directory: ${config.outputDir}`);
    }
    
    // Find all character HTML files
    const files = fs.readdirSync(config.inputDir);
    const characterFiles = files.filter(file => 
        file.endsWith('.html') && 
        !file.startsWith('_') && 
        !file.includes('test-') &&
        !file.includes('reset-') &&
        !file.includes('clear-') &&
        !file.includes('template') &&
        !['index.html', 'reviews.html', 'character-list.html', 'abouts.html'].includes(file)
    );
    
    console.log(`Found ${characterFiles.length} potential character pages`);
    
    // Process each file
    let convertedCount = 0;
    let skippedCount = 0;
    
    for (const file of characterFiles) {
        const characterId = path.basename(file, '.html');
        const outputFile = path.join(config.outputDir, `${characterId}.json`);
        
        // Skip if output file already exists and skipExisting is true
        if (config.skipExisting && fs.existsSync(outputFile)) {
            if (config.verbose) {
                console.log(`Skipping ${characterId} (JSON already exists)`);
            }
            skippedCount++;
            continue;
        }
        
        try {
            // Extract character data from HTML
            const characterData = await extractCharacterData(file, characterId);
            
            // Write to JSON file
            fs.writeFileSync(outputFile, JSON.stringify(characterData, null, 4));
            
            console.log(`✅ Converted ${file} to ${outputFile}`);
            convertedCount++;
        } catch (error) {
            console.error(`❌ Error processing ${file}: ${error.message}`);
        }
    }
    
    console.log(`\n🎉 Conversion complete!`);
    console.log(`   - Converted: ${convertedCount}`);
    console.log(`   - Skipped: ${skippedCount}`);
    console.log(`   - Total: ${characterFiles.length}`);
}

// Extract character data from HTML file
async function extractCharacterData(file, characterId) {
    const content = fs.readFileSync(path.join(config.inputDir, file), 'utf8');
    const $ = cheerio.load(content);
    
    // Basic character info
    const name = $('.character-info h1').text().trim() || $('title').text().split('-')[0].trim();
    const series = $('.character-series').text().replace('From', '').trim();
    const description = $('.character-description').text().trim();
    const mainImage = $('.character-image img').attr('src') || '';
    
    // Stats
    const stats = {};
    $('.stat').each((i, elem) => {
        const label = $(elem).find('.stat-label').text().trim().toLowerCase();
        const value = $(elem).find('.stat-value').text().trim();
        stats[label] = value;
    });
    
    // Fun facts
    const funFacts = [];
    $('.character-reasons li').each((i, elem) => {
        funFacts.push($(elem).text().trim());
    });
    
    // Analysis
    const analysis = $('.character-details > p').first().text().trim();
    
    // Gallery images
    const gallery = [];
    $('.gallery-image img').each((i, elem) => {
        const url = $(elem).attr('src');
        const alt = $(elem).attr('alt') || name;
        
        // Skip add photo card and avoid duplicates
        if (url && !url.includes('add-photo') && !gallery.some(img => img.url === url)) {
            gallery.push({ url, alt });
        }
    });
    
    // Create character data object
    return {
        id: characterId,
        name,
        series,
        mainImage,
        description,
        age: stats.age || 'Unknown',
        birthday: stats.birthday || 'Unknown',
        role: stats.role || 'Unknown',
        personality: stats.personality || 'Unknown',
        analysis,
        funFacts,
        gallery
    };
}

// Check if cheerio is installed
try {
    require.resolve('cheerio');
} catch (e) {
    console.error('Error: The cheerio package is required but not installed.');
    console.error('Please install it using: npm install cheerio');
    process.exit(1);
}

// Run the conversion
convertCharactersToJson().catch(err => {
    console.error('Error during conversion:', err);
    process.exit(1);
}); 