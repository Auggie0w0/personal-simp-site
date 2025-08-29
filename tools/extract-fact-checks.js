#!/usr/bin/env node

/**
 * Extract Fact Check Comments
 * 
 * This script extracts the fact check comments from all character HTML files
 * and saves them to a single text file for easy review.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Configuration
const OUTPUT_FILE = 'character-fact-checks.txt';
const HTML_DIR = path.join(__dirname, '..');

// Get all HTML files in the root directory
function getCharacterHtmlFiles() {
    const files = fs.readdirSync(HTML_DIR);
    return files.filter(file => 
        file.endsWith('.html') && 
        !['index.html', 'character-list.html', 'admin.html', 'reviews.html', 'abouts.html'].includes(file)
    );
}

// Extract fact check comments from an HTML file
function extractFactCheckComments(htmlFile) {
    const filePath = path.join(HTML_DIR, htmlFile);
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Use regex to find the fact check comment block
    const commentRegex = /<!--\s*CHARACTER FACT CHECK INFORMATION[\s\S]*?-->/g;
    const matches = html.match(commentRegex);
    
    if (matches && matches.length > 0) {
        return {
            characterId: path.basename(htmlFile, '.html'),
            factCheck: matches[0]
        };
    }
    
    return null;
}

// Main function
function main() {
    console.log('Extracting fact check comments...');
    
    const htmlFiles = getCharacterHtmlFiles();
    console.log(`Found ${htmlFiles.length} character HTML files`);
    
    let outputContent = '# Character Fact Check Information\n';
    outputContent += `# Generated on ${new Date().toLocaleString()}\n\n`;
    
    let extractedCount = 0;
    
    htmlFiles.forEach(htmlFile => {
        const result = extractFactCheckComments(htmlFile);
        
        if (result) {
            outputContent += `## ${result.characterId}\n\n`;
            
            // Clean up the comment format for better readability
            let cleanedComment = result.factCheck
                .replace('<!--', '')
                .replace('-->', '')
                .trim();
            
            outputContent += `${cleanedComment}\n\n`;
            outputContent += '---\n\n';
            
            extractedCount++;
        }
    });
    
    // Add summary
    outputContent += `# Summary\n`;
    outputContent += `- Total character files: ${htmlFiles.length}\n`;
    outputContent += `- Characters with fact check comments: ${extractedCount}\n`;
    outputContent += `- Characters missing fact check comments: ${htmlFiles.length - extractedCount}\n`;
    
    // Write to output file
    fs.writeFileSync(path.join(HTML_DIR, OUTPUT_FILE), outputContent);
    
    console.log(`Extracted ${extractedCount} fact check comments`);
    console.log(`Saved to ${OUTPUT_FILE}`);
}

// Run the script
main();
