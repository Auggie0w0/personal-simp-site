# Character Generator System

This system allows you to easily create and update character profile pages for the Simp Archive Gallery website.

## Overview

The character generator system consists of:

1. A template file (`character-template.html`) that defines the structure of character pages
2. JSON configuration files for each character in the `characters/` directory
3. A generator script (`generate-character.js`) that creates HTML pages from the template and JSON configs
4. A setup script (`setup-character-generator.sh`) that helps run the generator

## How to Use

### Creating a New Character

1. Create a new JSON file in the `characters/` directory, e.g., `characters/luffy.json`
2. Fill in the character details following the structure in the example below
3. Run the generator: `./setup-character-generator.sh luffy`

### Updating Multiple Characters

1. Edit the JSON files for the characters you want to update
2. Run the generator for all characters: `./setup-character-generator.sh`

### Example Character JSON Structure

```json
{
    "id": "character-id",
    "name": "Character Name",
    "series": "Series Name",
    "mainImage": "https://example.com/image.jpg",
    "description": "Character description goes here...",
    "age": "25",
    "birthday": "January 1",
    "role": "Main Character",
    "personality": "Brave & Determined",
    "analysis": "Character analysis text goes here...",
    "funFacts": [
        "Fun fact 1",
        "Fun fact 2",
        "Fun fact 3"
    ],
    "gallery": [
        {
            "url": "https://example.com/image1.jpg",
            "alt": "Character Name"
        },
        {
            "url": "https://example.com/image2.jpg",
            "alt": "Character Name"
        }
    ]
}
```

## Review Layout Updates

To update the layout of review cards in `reviews.html`:

1. Edit the CSS in `style.css` to adjust the review card styling
2. Run the review template updater: `node update-review-template.js`

This will automatically update all review cards to have the title on top and rating below.

## Requirements

- Node.js (for running the generator script)
- Bash shell (for running the setup script)

## Tips for Efficient Updates

1. **Batch Similar Changes**: When making similar changes to multiple characters, edit the template file first, then regenerate all pages.

2. **Use JSON for Data**: Keep all character data in the JSON files, making it easy to update information without touching HTML.

3. **Consistent Image Structure**: Use a consistent structure for gallery images to make it easier to add new characters.

4. **Version Control**: Commit your JSON files to version control to track changes over time.

5. **Backup Original Files**: Before running the generator on existing pages, make a backup to ensure you don't lose any custom modifications.

## Customizing the Template

If you need to make structural changes to all character pages:

1. Edit the `character-template.html` file
2. Run the generator for all characters: `./setup-character-generator.sh`

This will update all character pages with the new structure while preserving their individual content. 