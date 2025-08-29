#!/usr/bin/env node

/**
 * Update Fact Check Comments
 * 
 * This script updates the fact check comments in all character HTML files
 * with more accurate information provided by the user.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Configuration
const HTML_DIR = path.join(__dirname, '..');
const CHARACTERS_DIR = path.join(__dirname, '..', 'characters');

// Character fact check data
const characterFactChecks = {
  'miyamura': {
    name: 'Izumi Miyamura',
    series: 'Horimiya',
    description: 'Male lead of Horimiya; a quiet classmate who secretly has multiple piercings and a back tattoo, gradually opening up through his relationship with Kyouko Hori.'
  },
  'ivan': {
    name: 'Ivan',
    series: 'ALIEN STAGE',
    description: 'Contestant in the Korean multimedia project ALIEN STAGE; closely tied to Till. Featured songs include "Black Sorrow" and "Cure" (official uploads).'
  },
  'dazai': {
    name: 'Osamu Dazai',
    series: 'Bungo Stray Dogs',
    description: 'Member of the Armed Detective Agency; former Port Mafia executive. Ability "No Longer Human" nullifies other abilities; age listed as 22 in-series.'
  },
  'cheongmyeong': {
    name: 'Cheongmyeong',
    series: 'Return of the Mount Hua Sect (a.k.a. Return of the Blossoming Blade)',
    description: 'Legendary Mount Hua swordsman reincarnated ~100 years after death; drives the sect\'s revival. Official EN serialization exists on WEBTOON.'
  },
  'waguri': {
    name: 'Kaoruko Waguri',
    series: 'The Fragrant Flower Blooms with Dignity',
    description: 'Student at elite Kikyō Private Academy who bonds with Rintaro Tsumugi from neighboring Chidori High; central heroine of the series. (Official K MANGA page lists cast/setting.)'
  },
  'hange': {
    name: 'Hange Zoë',
    series: 'Attack on Titan',
    description: 'Titan researcher who later becomes the 14th Commander of the Survey Corps. Kodansha\'s English materials treat Hange with gender-neutral language.'
  },
  'minho': {
    name: 'Lee Know (Lee Minho)',
    series: 'Stray Kids',
    description: 'Member of JYP\'s Stray Kids; officially profiled on JYPE site (DOB 1998-10-25; dancer/vocalist/rapper).'
  },
  'huntrix': {
    name: 'HUNTR/X ("Huntrix")',
    series: 'K-Pop Demon Hunters (2025 film)',
    description: 'The girl-group protagonists of Netflix\'s original animated film K-Pop Demon Hunters; stylized HUNTR/X (pronounced "Huntrix").'
  },
  'sunghyunjae': {
    name: 'Sung Hyunjae',
    series: 'The S-Classes That I Raised / My S-Class Hunters',
    description: 'Charismatic, dangerous S-rank hunter and leader of Seseong Guild; a pivotal foil to MC Han Yoojin. (Series/character wiki.)'
  },
  'marin': {
    name: 'Marin Kitagawa',
    series: 'My Dress-Up Darling',
    description: 'Popular high-school gyaru who loves cosplay; teams with Wakana Gojo to craft costumes. (Official anime & Square Enix manga pages.)'
  },
  'saja': {
    name: 'SAJA (Saja Boys)',
    series: 'K-Pop Demon Hunters',
    description: 'Antagonistic boy band in the film\'s world ("Saja Boys") set against HUNTR/X.'
  },
  'yamada': {
    name: 'Akito Yamada',
    series: 'My Love Story with Yamada-kun at Lv999',
    description: 'Stoic, skilled gamer who meets Akane via MMO; one of the leads in the 2023 TV anime. (Official site/Aniplex page.)'
  },
  'joonghyuk': {
    name: 'Yoo Joonghyuk',
    series: 'Omniscient Reader\'s Viewpoint',
    description: 'A regressor who has cleared the world countless times; taciturn and hyper-competent deuteragonist. (Series/character pages.)'
  },
  'momo': {
    name: 'Maomao',
    series: 'The Apothecary Diaries',
    description: 'Former apothecary from the red-light district forced to serve in the imperial palace; solves medical mysteries with sharp pharmacology. (Square Enix official & series overview.)'
  },
  'mackenyu': {
    name: 'Mackenyu (Arata Mackenyu)',
    series: 'Actor',
    description: 'Japanese actor and martial artist; plays Roronoa Zoro in Netflix\'s live-action One Piece; son of the late Sonny Chiba.'
  },
  'gojo': {
    name: 'Satoru Gojo',
    series: 'Jujutsu Kaisen',
    description: 'Special-grade sorcerer/teacher at Tokyo Jujutsu High; possesses Six Eyes and Limitless. Birthday Dec 7 (official materials).'
  },
  'suho': {
    name: 'Suho Kim / Lloyd Frontera',
    series: 'The Greatest Estate Developer',
    description: 'Korean civil-engineering student Suho inhabits the body of Lloyd Frontera and rebuilds a debt-ridden estate using modern know-how. (Official WEBTOON + series wiki.)'
  },
  'axel': {
    name: 'Axel Gilberto',
    series: 'Lazarus (2025 series)',
    description: 'Protagonist of Shinichirō Watanabe\'s MAPPA series LAZARUS; a brilliant agent hunting the villain Dr. Skinner in a 2052 setting. (Name/role confirmed in press & guides.)'
  },
  'wolfgang': {
    name: 'Wolfgang Goldenleonard',
    series: 'King\'s Maker / King\'s Maker: Triple Crown',
    description: 'Fourth prince who becomes King of Goldenleonard; central figure in the BL manhwa (officially published on Lezhin).'
  }
};

// Get all character HTML files
function getCharacterHtmlFiles() {
  const excludedFiles = ['index.html', 'character-list.html', 'admin.html', 
                        'reviews.html', 'abouts.html'];
  
  const htmlFiles = [];
  const files = fs.readdirSync(HTML_DIR);
  
  for (const file of files) {
    if (file.endsWith('.html') && !excludedFiles.includes(file)) {
      htmlFiles.push(file);
    }
  }
  
  return htmlFiles;
}

// Update fact check comment in HTML file
function updateFactCheckComment(htmlFile) {
  const characterId = path.basename(htmlFile, '.html');
  const factCheck = characterFactChecks[characterId];
  
  if (!factCheck) {
    console.log(`No fact check data found for ${characterId}, skipping...`);
    return false;
  }
  
  const filePath = path.join(HTML_DIR, htmlFile);
  let htmlContent = fs.readFileSync(filePath, 'utf8');
  
  // Check if there's an existing fact check comment
  const factCheckRegex = /<!--\s*CHARACTER FACT CHECK INFORMATION[\s\S]*?-->/;
  const hasFactCheck = factCheckRegex.test(htmlContent);
  
  // Create new fact check comment
  const currentDate = new Date().toISOString();
  const newFactCheck = `<!--
CHARACTER FACT CHECK INFORMATION
============================

Name: ${factCheck.name}
Series: ${factCheck.series}

DESCRIPTION:
${factCheck.description}

Last Updated: ${currentDate}
This comment is for fact checking only and is not visible on the website.
-->`;
  
  if (hasFactCheck) {
    // Replace existing fact check comment
    htmlContent = htmlContent.replace(factCheckRegex, newFactCheck);
  } else {
    // Add new fact check comment at the end of the file
    htmlContent = htmlContent.replace('</html>', `${newFactCheck}\n</html>`);
  }
  
  // Write updated content back to file
  fs.writeFileSync(filePath, htmlContent);
  
  return true;
}

// Main function
function main() {
  console.log('Updating character fact check comments...');
  
  const htmlFiles = getCharacterHtmlFiles();
  console.log(`Found ${htmlFiles.length} character HTML files`);
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const htmlFile of htmlFiles) {
    const characterId = path.basename(htmlFile, '.html');
    console.log(`Processing ${characterId}...`);
    
    if (updateFactCheckComment(htmlFile)) {
      console.log(`Updated fact check for ${characterId}`);
      updatedCount++;
    } else {
      console.log(`Skipped ${characterId}`);
      skippedCount++;
    }
  }
  
  console.log('\nFact check update complete!');
  console.log(`Updated ${updatedCount} characters`);
  console.log(`Skipped ${skippedCount} characters`);
}

// Run the script
main();
