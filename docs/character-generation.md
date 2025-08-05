# Character Generation Guide

This document explains how to add new characters to the Simp Archive Gallery using the character generation script.

## Overview

The character generation script (`tools/generate-character.js`) creates HTML pages for characters based on JSON configuration files. It also automatically adds new characters to the main page carousel and gallery.

## Requirements

- Node.js installed
- Required npm packages: `jsdom`

## Adding a New Character

### Step 1: Create a JSON Configuration File

Create a new JSON file in the `characters/` directory with the following structure:

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

### Step 2: Run the Generation Script

Run the following command to generate the character page:

```bash
node tools/generate-character.js characters/character-id.json
```

### Step 3: Verify the Generated File

The script will generate an HTML file directly in the root directory. Verify that it was created correctly:

```bash
ls -la character-id.html
```

### Step 4: Verify Character List Updates

The script will automatically update the character-list.html file. Verify that the character was added correctly to the appropriate section (male or female characters).

## What the Script Does

1. Generates an HTML page for the character using the template
2. Adds the character to the main page carousel
3. Adds the character to the main page gallery
4. Adds the character to the character-list.html page
5. Saves all changes

## Troubleshooting

If you encounter any issues:

1. Make sure the JSON file is valid
2. Check that all required fields are present
3. Verify that the image URLs are accessible
4. Ensure the jsdom dependency is installed

For more complex issues, check the error messages in the console output.