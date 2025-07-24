/**
 * Character Page Generator
 * This script generates character pages from a template and JSON configuration
 */

const fs = require('fs');
const path = require('path');

// Read the template file
const templatePath = path.join(__dirname, 'character-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

/**
 * Generate a character page from a JSON configuration
 * @param {Object} characterData - The character data
 * @returns {string} - The generated HTML content
 */
function generateCharacterPage(characterData) {
    let content = template;
    
    // Replace basic placeholders
    content = content.replace(/{{CHARACTER_NAME}}/g, characterData.name);
    content = content.replace(/{{CHARACTER_ID}}/g, characterData.id);
    content = content.replace(/{{SERIES_NAME}}/g, characterData.series);
    content = content.replace(/{{MAIN_IMAGE_URL}}/g, characterData.mainImage);
    content = content.replace(/{{CHARACTER_DESCRIPTION}}/g, characterData.description);
    content = content.replace(/{{CHARACTER_AGE}}/g, characterData.age || 'Unknown');
    content = content.replace(/{{CHARACTER_BIRTHDAY}}/g, characterData.birthday || 'Unknown');
    content = content.replace(/{{CHARACTER_ROLE}}/g, characterData.role || 'Unknown');
    content = content.replace(/{{CHARACTER_PERSONALITY}}/g, characterData.personality || 'Unknown');
    content = content.replace(/{{CHARACTER_ANALYSIS}}/g, characterData.analysis || '');
    
    // Generate fun facts list
    let funFactsHtml = '';
    if (characterData.funFacts && Array.isArray(characterData.funFacts)) {
        characterData.funFacts.forEach(fact => {
            funFactsHtml += `                <li>${fact}</li>\n`;
        });
    }
    content = content.replace(/{{CHARACTER_FUN_FACTS}}/g, funFactsHtml);
    
    // Generate gallery images
    let galleryHtml = '';
    if (characterData.gallery && Array.isArray(characterData.gallery)) {
        characterData.gallery.forEach(image => {
            galleryHtml += `                    <div class="gallery-image">\n`;
            galleryHtml += `                        <img src="${image.url}" alt="${characterData.name}">\n`;
            galleryHtml += `                    </div>\n`;
        });
    }
    content = content.replace(/{{GALLERY_IMAGES}}/g, galleryHtml);
    
    return content;
}

/**
 * Save a character page to a file
 * @param {string} characterId - The character ID (filename without extension)
 * @param {string} content - The HTML content
 */
function saveCharacterPage(characterId, content) {
    const outputPath = path.join(__dirname, `${characterId}.html`);
    fs.writeFileSync(outputPath, content);
    console.log(`Generated character page: ${outputPath}`);
}

/**
 * Process a character configuration file and generate a page
 * @param {string} configPath - Path to the character JSON configuration
 */
function processCharacterConfig(configPath) {
    try {
        const configData = fs.readFileSync(configPath, 'utf8');
        const characterData = JSON.parse(configData);
        
        if (!characterData.id || !characterData.name) {
            console.error(`Error: Character config must include id and name: ${configPath}`);
            return;
        }
        
        const pageContent = generateCharacterPage(characterData);
        saveCharacterPage(characterData.id, pageContent);
    } catch (error) {
        console.error(`Error processing ${configPath}: ${error.message}`);
    }
}

/**
 * Process all character configurations in a directory
 * @param {string} configDir - Directory containing character JSON configurations
 */
function processAllCharacters(configDir) {
    try {
        const files = fs.readdirSync(configDir);
        let count = 0;
        
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const configPath = path.join(configDir, file);
                processCharacterConfig(configPath);
                count++;
            }
        });
        
        console.log(`Processed ${count} character configurations`);
    } catch (error) {
        console.error(`Error processing character configs: ${error.message}`);
    }
}

// If called directly from command line
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage:');
        console.log('  node generate-character.js characters/');
        console.log('  node generate-character.js characters/zoro.json');
        process.exit(1);
    }
    
    const inputPath = args[0];
    
    if (fs.existsSync(inputPath)) {
        const stats = fs.statSync(inputPath);
        
        if (stats.isDirectory()) {
            // Process all JSON files in directory
            processAllCharacters(inputPath);
        } else if (stats.isFile() && inputPath.endsWith('.json')) {
            // Process single JSON file
            processCharacterConfig(inputPath);
        } else {
            console.error('Input must be a JSON file or a directory containing JSON files');
        }
    } else {
        console.error(`File or directory not found: ${inputPath}`);
    }
}

module.exports = {
    generateCharacterPage,
    saveCharacterPage,
    processCharacterConfig,
    processAllCharacters
}; 