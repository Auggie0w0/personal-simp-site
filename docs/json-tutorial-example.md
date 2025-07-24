# Practical JSON Example: Mackenyu Character

This document provides a real-world example of how the JSON character system works using the Mackenyu character profile.

## The Workflow in Action

Let's walk through the complete process of how the Mackenyu character page is created and maintained:

### 1. JSON Data (Input)

The character data is stored in `characters/mackenyu.json`:

```json
{
    "id": "mackenyu",
    "name": "Mackenyu",
    "series": "Actor & Martial Artist",
    "mainImage": "https://images.lifestyleasia.com/wp-content/uploads/sites/2/2023/09/11143622/mackenyu-facts-to-know.jpg",
    "description": "Mackenyu Arata is a Japanese actor and martial artist known for his roles in live-action adaptations of popular anime and manga. He gained international recognition for his portrayal of Roronoa Zoro in Netflix's 'One Piece' live action series. Son of legendary martial artist and actor Sonny Chiba, Mackenyu has established himself as a talented performer with impressive physical abilities and screen presence.",
    "age": "27",
    "birthday": "November 16, 1996",
    "role": "Actor & Martial Artist",
    "personality": "Dedicated & Disciplined",
    "analysis": "Mackenyu has built an impressive career bridging Japanese and international entertainment. His martial arts background, inherited from his father Sonny Chiba, gives him a unique physical presence on screen. His performance as Roronoa Zoro in Netflix's One Piece showcases his ability to bring animated characters to life with authenticity and respect for the source material. Beyond his action roles, Mackenyu has demonstrated emotional depth and versatility across various genres, establishing himself as one of Japan's most promising international stars.",
    "funFacts": [
        "Son of legendary martial artist and actor Sonny Chiba",
        "Born in Los Angeles but moved to Japan to pursue acting",
        "Fluent in both English and Japanese",
        "Trained in various martial arts from a young age",
        "Won the Newcomer of the Year award at the 40th Japan Academy Film Prize for his role in 'Chihayafuru'",
        "Portrayed Enishi Yukishiro in the live-action adaptation of 'Rurouni Kenshin: The Final'",
        "Starred as Seiya in 'Knights of the Zodiac', another major anime adaptation",
        "Known for performing many of his own stunts",
        "Extensively trained in swordsmanship for his role as Zoro in 'One Piece'",
        "Has a strong international fanbase across Asia, Europe, and the Americas"
    ],
    "gallery": [
        {
            "url": "https://images.lifestyleasia.com/wp-content/uploads/sites/2/2023/09/11143622/mackenyu-facts-to-know.jpg",
            "alt": "Mackenyu portrait"
        },
        {
            "url": "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/09/one-piece-live-action-zoro.jpg",
            "alt": "Mackenyu as Roronoa Zoro"
        },
        // Additional gallery images omitted for brevity
    ]
}
```

### 2. HTML Template (Structure)

The character template (`character-template.html`) contains placeholders that will be replaced with the JSON data:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>{{CHARACTER_NAME}} - Simp Archive Gallery</title>
</head>
<body>
    <header>
        <!-- Navigation -->
        <nav class="navbar">
            <!-- Navigation content -->
        </nav>
    </header>
   
    <main class="main-content">
        <div class="character-profile">
            <div class="character-header">
                <div class="character-image">
                    <img src="{{MAIN_IMAGE_URL}}" alt="{{CHARACTER_NAME}}">
                </div>
                <div class="character-info">
                    <h1 class="character-name">{{CHARACTER_NAME}}</h1>
                    <p class="character-series">From {{SERIES_NAME}}</p>
                    <div class="character-stats">
                        <ul>
                            <li class="stat"><span class="stat-label">Age:</span> <span class="stat-value">{{CHARACTER_AGE}}</span></li>
                            <li class="stat"><span class="stat-label">Birthday:</span> <span class="stat-value">{{CHARACTER_BIRTHDAY}}</span></li>
                            <li class="stat"><span class="stat-label">Role:</span> <span class="stat-value">{{CHARACTER_ROLE}}</span></li>
                            <li class="stat"><span class="stat-label">Personality:</span> <span class="stat-value">{{CHARACTER_PERSONALITY}}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="character-content">
                <div class="character-section">
                    <h2>Description</h2>
                    <p class="character-description">{{CHARACTER_DESCRIPTION}}</p>
                </div>
                
                <div class="character-section">
                    <h2>Analysis</h2>
                    <p class="character-analysis">{{CHARACTER_ANALYSIS}}</p>
                </div>
                
                <div class="character-section">
                    <h2>Fun Facts</h2>
                    <ul class="fun-facts">
                        {{CHARACTER_FUN_FACTS}}
                    </ul>
                </div>
            </div>
            
            <div class="character-gallery-section">
                <h2>Gallery</h2>
                <div class="gallery-container" id="galleryContainer">
                    {{GALLERY_IMAGES}}
                </div>
                <button class="add-photo-btn" onclick="openAddPhotoModal()">Add Photo</button>
            </div>
        </div>
    </main>

    <!-- Footer and scripts -->
</body>
</html>
```

### 3. Generator Script (Processing)

The `generate-character.js` script reads the JSON data and the template, then replaces placeholders with actual content:

```javascript
// Simplified version of the generator script logic
function generateCharacterPage(jsonPath) {
    // Read JSON data
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Read template
    const template = fs.readFileSync('character-template.html', 'utf8');
    
    // Replace basic placeholders
    let html = template
        .replace(/{{CHARACTER_NAME}}/g, jsonData.name)
        .replace(/{{SERIES_NAME}}/g, jsonData.series)
        .replace(/{{MAIN_IMAGE_URL}}/g, jsonData.mainImage)
        .replace(/{{CHARACTER_DESCRIPTION}}/g, jsonData.description)
        .replace(/{{CHARACTER_AGE}}/g, jsonData.age || 'Unknown')
        .replace(/{{CHARACTER_BIRTHDAY}}/g, jsonData.birthday || 'Unknown')
        .replace(/{{CHARACTER_ROLE}}/g, jsonData.role || 'Unknown')
        .replace(/{{CHARACTER_PERSONALITY}}/g, jsonData.personality || 'Unknown')
        .replace(/{{CHARACTER_ANALYSIS}}/g, jsonData.analysis || '');
    
    // Generate fun facts list items
    const funFactsHtml = jsonData.funFacts
        ? jsonData.funFacts.map(fact => `<li>${fact}</li>`).join('\n')
        : '<li>No fun facts available</li>';
    html = html.replace(/{{CHARACTER_FUN_FACTS}}/g, funFactsHtml);
    
    // Generate gallery images
    const galleryHtml = jsonData.gallery
        ? jsonData.gallery.map(img => 
            `<div class="gallery-item">
                <img src="${img.url}" alt="${img.alt || jsonData.name}" loading="lazy">
            </div>`).join('\n')
        : '<p>No gallery images available</p>';
    html = html.replace(/{{GALLERY_IMAGES}}/g, galleryHtml);
    
    // Add character ID for localStorage
    html = html.replace(/{{CHARACTER_ID}}/g, jsonData.id);
    
    // Write the generated HTML to a file
    fs.writeFileSync(`${jsonData.id}.html`, html);
    console.log(`Generated character page: ${jsonData.id}.html`);
}
```

### 4. Generated HTML (Output)

The resulting `mackenyu.html` file contains the fully rendered character page with all the JSON data inserted into the appropriate places.

## Making Changes: The Streamlined Workflow

Let's say you want to update Mackenyu's information with a new role and add a new fun fact:

### 1. Edit the JSON File

Open `characters/mackenyu.json` and make these changes:

```json
{
    "id": "mackenyu",
    "name": "Mackenyu",
    "series": "Actor & Martial Artist",
    "mainImage": "https://images.lifestyleasia.com/wp-content/uploads/sites/2/2023/09/11143622/mackenyu-facts-to-know.jpg",
    "description": "Mackenyu Arata is a Japanese actor and martial artist known for his roles in live-action adaptations of popular anime and manga. He gained international recognition for his portrayal of Roronoa Zoro in Netflix's 'One Piece' live action series. Son of legendary martial artist and actor Sonny Chiba, Mackenyu has established himself as a talented performer with impressive physical abilities and screen presence.",
    "age": "27",
    "birthday": "November 16, 1996",
    "role": "Actor, Martial Artist & International Star", // Updated role
    "personality": "Dedicated & Disciplined",
    "analysis": "Mackenyu has built an impressive career bridging Japanese and international entertainment. His martial arts background, inherited from his father Sonny Chiba, gives him a unique physical presence on screen. His performance as Roronoa Zoro in Netflix's One Piece showcases his ability to bring animated characters to life with authenticity and respect for the source material. Beyond his action roles, Mackenyu has demonstrated emotional depth and versatility across various genres, establishing himself as one of Japan's most promising international stars.",
    "funFacts": [
        "Son of legendary martial artist and actor Sonny Chiba",
        "Born in Los Angeles but moved to Japan to pursue acting",
        "Fluent in both English and Japanese",
        "Trained in various martial arts from a young age",
        "Won the Newcomer of the Year award at the 40th Japan Academy Film Prize for his role in 'Chihayafuru'",
        "Portrayed Enishi Yukishiro in the live-action adaptation of 'Rurouni Kenshin: The Final'",
        "Starred as Seiya in 'Knights of the Zodiac', another major anime adaptation",
        "Known for performing many of his own stunts",
        "Extensively trained in swordsmanship for his role as Zoro in 'One Piece'",
        "Has a strong international fanbase across Asia, Europe, and the Americas",
        "Confirmed to return for One Piece Season 2 in 2025" // New fun fact
    ],
    // Gallery section remains unchanged
}
```

### 2. Regenerate the HTML

Run the generator script to update the HTML page:

```bash
./site-maintenance.sh generate mackenyu
```

### 3. Add Fact Check Comments

To add hidden comments with the updated character information for fact checking:

```bash
./site-maintenance.sh comments
```

## Benefits of This Approach

1. **Single Source of Truth**: The JSON file is the only place you need to update
2. **Consistency**: All character pages follow the same structure and style
3. **Efficiency**: Make changes quickly without having to edit HTML directly
4. **Error Prevention**: The generator ensures all required elements are included
5. **Maintainability**: Easier to make site-wide changes by updating the template

## Common Tasks and Commands

### Creating a New Character

```bash
# 1. Create the JSON file
touch characters/new-character.json
# 2. Edit the JSON file with your favorite editor
# 3. Generate the HTML page
./site-maintenance.sh generate new-character
```

### Updating a Character

```bash
# 1. Edit the JSON file
# 2. Regenerate the HTML page
./site-maintenance.sh generate character-id
```

### Converting an Existing HTML Page to JSON

```bash
# Convert all HTML pages to JSON
./site-maintenance.sh convert
```

### Running the Site Debugger

```bash
# Check for issues across the site
./site-maintenance.sh debug
```

## Conclusion

The JSON-based character system provides a streamlined, maintainable approach to managing character profiles. By separating content (JSON) from presentation (HTML template), it becomes much easier to maintain consistency across the site while making updates efficient and error-free. 