/**
 * Character Comments Generator
 * 
 * This script adds comments with character facts and details at the bottom of each character HTML file
 * for fact checking purposes. The comments are only visible in the code, not on the website.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Configuration
const charactersDir = path.join(__dirname, 'characters');
const htmlDir = __dirname;

// Function to extract character data from JSON file
function getCharacterDataFromJson(characterId) {
    try {
        const jsonPath = path.join(charactersDir, `${characterId}.json`);
        if (fs.existsSync(jsonPath)) {
            const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            return jsonData;
        }
        return null;
    } catch (error) {
        console.error(`Error reading JSON for ${characterId}:`, error.message);
        return null;
    }
}

// Function to extract character data from HTML file
function getCharacterDataFromHtml(htmlPath) {
    try {
        const html = fs.readFileSync(htmlPath, 'utf8');
        const $ = cheerio.load(html);
        
        const characterData = {
            name: $('.character-name').text().trim(),
            series: $('.character-series').text().trim(),
            mainImage: $('.character-image img').attr('src'),
            description: $('.character-description').text().trim(),
            stats: {}
        };
        
        // Extract stats
        $('.character-stats li').each(function() {
            const text = $(this).text().trim();
            const [key, value] = text.split(':').map(part => part.trim());
            if (key && value) {
                characterData.stats[key.toLowerCase()] = value;
            }
        });
        
        // Extract fun facts
        characterData.funFacts = [];
        $('.fun-facts li').each(function() {
            characterData.funFacts.push($(this).text().trim());
        });
        
        // Extract analysis
        characterData.analysis = $('.character-analysis').text().trim();
        
        return characterData;
    } catch (error) {
        console.error(`Error extracting data from HTML:`, error.message);
        return null;
    }
}

// Function to generate comment block with character information
function generateCommentBlock(characterData) {
    if (!characterData) return '';
    
    let comment = `\n<!--\n`;
    comment += `CHARACTER FACT CHECK INFORMATION\n`;
    comment += `============================\n\n`;
    
    comment += `Name: ${characterData.name || 'N/A'}\n`;
    comment += `Series: ${characterData.series || 'N/A'}\n`;
    
    if (characterData.stats) {
        comment += `\nSTATS:\n`;
        if (characterData.stats.age) comment += `Age: ${characterData.stats.age}\n`;
        if (characterData.stats.birthday) comment += `Birthday: ${characterData.stats.birthday}\n`;
        if (characterData.stats.role) comment += `Role: ${characterData.stats.role}\n`;
        if (characterData.stats.personality) comment += `Personality: ${characterData.stats.personality}\n`;
    }
    
    if (characterData.description) {
        comment += `\nDESCRIPTION:\n${characterData.description}\n`;
    }
    
    if (characterData.analysis) {
        comment += `\nANALYSIS:\n${characterData.analysis}\n`;
    }
    
    if (characterData.funFacts && characterData.funFacts.length > 0) {
        comment += `\nFUN FACTS:\n`;
        characterData.funFacts.forEach((fact, index) => {
            comment += `${index + 1}. ${fact}\n`;
        });
    }
    
    if (characterData.gallery && characterData.gallery.length > 0) {
        comment += `\nGALLERY IMAGES (${characterData.gallery.length}):\n`;
        characterData.gallery.forEach((image, index) => {
            if (typeof image === 'string') {
                comment += `${index + 1}. ${image}\n`;
            } else if (image.url) {
                comment += `${index + 1}. ${image.url}\n`;
            }
        });
    }
    
    comment += `\nLast Updated: ${new Date().toISOString()}\n`;
    comment += `This comment is for fact checking only and is not visible on the website.\n`;
    comment += `-->\n`;
    
    return comment;
}

// Function to add comment to HTML file
function addCommentToHtmlFile(htmlPath, comment) {
    try {
        let html = fs.readFileSync(htmlPath, 'utf8');
        
        // Remove existing fact check comment if present
        html = html.replace(/\n<!--\nCHARACTER FACT CHECK INFORMATION\n[\s\S]*?-->\n/g, '');
        
        // Add new comment before closing body tag
        html = html.replace('</body>', `${comment}</body>`);
        
        fs.writeFileSync(htmlPath, html);
        return true;
    } catch (error) {
        console.error(`Error adding comment to ${htmlPath}:`, error.message);
        return false;
    }
}

// Function to process a character
function processCharacter(characterId) {
    console.log(`Processing ${characterId}...`);
    
    const htmlPath = path.join(htmlDir, `${characterId}.html`);
    
    // Check if HTML file exists
    if (!fs.existsSync(htmlPath)) {
        console.error(`HTML file not found: ${htmlPath}`);
        return false;
    }
    
    // Get character data (prefer JSON if available)
    let characterData = getCharacterDataFromJson(characterId);
    
    // If no JSON data, extract from HTML
    if (!characterData) {
        characterData = getCharacterDataFromHtml(htmlPath);
    }
    
    if (!characterData) {
        console.error(`Could not extract character data for ${characterId}`);
        return false;
    }
    
    // Generate comment block
    const comment = generateCommentBlock(characterData);
    
    // Add comment to HTML file
    const success = addCommentToHtmlFile(htmlPath, comment);
    
    if (success) {
        console.log(`✅ Added fact check comment to ${characterId}.html`);
    } else {
        console.error(`❌ Failed to add comment to ${characterId}.html`);
    }
    
    return success;
}

// Main function
function main() {
    console.log('Character Comments Generator');
    console.log('============================');
    
    // Check if cheerio is installed
    try {
        require.resolve('cheerio');
    } catch (error) {
        console.error('❌ Cheerio is required but not installed.');
        console.log('Please install it using: npm install cheerio');
        process.exit(1);
    }
    
    // Get character files
    const htmlFiles = fs.readdirSync(htmlDir)
        .filter(file => file.endsWith('.html'))
        .filter(file => !file.startsWith('index.') && 
                        !file.startsWith('character-list.') && 
                        !file.startsWith('reviews.') && 
                        !file.startsWith('abouts.') && 
                        !file.startsWith('admin.') && 
                        !file.startsWith('test-') && 
                        !file.startsWith('reset-') && 
                        !file.startsWith('clear-'));
    
    console.log(`Found ${htmlFiles.length} character HTML files`);
    
    // Process each character
    let successCount = 0;
    
    htmlFiles.forEach(file => {
        const characterId = file.replace('.html', '');
        const success = processCharacter(characterId);
        if (success) successCount++;
    });
    
    console.log(`\nSummary: Added comments to ${successCount}/${htmlFiles.length} character files`);
}

// Run the script
main(); 