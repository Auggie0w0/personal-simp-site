# Character Creation Workflow

This document outlines the streamlined process for creating and adding new characters to the Simp Archive Gallery.

## Overview

The character creation workflow has been optimized to minimize manual steps and ensure consistency across the site. The process now automatically updates the homepage carousel, gallery, and character list page.

## Character Creation Process

### Step 1: Create the JSON Configuration File

1. Create a new JSON file in the `characters/` directory named `[character-id].json` (e.g., `minho.json`)
2. Fill in the character details following the template below:

```json
{
    "id": "character-id",
    "name": "Character Name",
    "series": "Series Name",
    "mainImage": "https://example.com/image.jpg",
    "description": "Character description...",
    "age": "Age",
    "birthday": "Birthday",
    "role": "Role in Series",
    "personality": "Personality Traits",
    "analysis": "Longer character analysis...",
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

### Step 2: Generate the Character Page

Run the character generation script:

```bash
./site-maintenance.sh generate character-id
```

Or directly:

```bash
node tools/generate-character.js characters/character-id.json
```

### Step 3: Verify the Results

The script automatically:

1. Creates the character HTML page in the root directory
2. Adds the character to the homepage carousel
3. Adds the character to the homepage gallery
4. Adds the character to the character list page

Verify that all these updates were successful by checking:

- The new HTML file exists in the root directory
- The character appears in the homepage carousel
- The character appears in the homepage gallery
- The character appears in the character list page

## Converting Existing HTML Pages to JSON

If you have existing HTML character pages that you want to convert to the JSON-based system:

```bash
./site-maintenance.sh convert
```

This will:
1. Extract character data from HTML files
2. Create corresponding JSON files in the `characters/` directory
3. Allow you to use the JSON-based workflow for future updates

## Updating Existing Characters

To update an existing character:

1. Edit the JSON file in the `characters/` directory
2. Run the generation script again:
   ```bash
   ./site-maintenance.sh generate character-id
   ```
3. The script will update all references to the character across the site

## Troubleshooting

If you encounter issues during character creation:

1. Check the console output for error messages
2. Verify that your JSON file is valid (no syntax errors)
3. Make sure all required fields are present in the JSON file
4. Ensure image URLs are accessible and valid
5. Run the site maintenance debug tool to check for issues:
   ```bash
   ./site-maintenance.sh debug
   ```

## Additional Resources

- [JSON Character System Tutorial](json-character-tutorial.md)
- [Character Generation Guide](character-generation.md)
- [JSON Tutorial Example](json-tutorial-example.md)