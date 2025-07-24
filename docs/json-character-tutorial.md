# JSON Character System Tutorial

This tutorial explains how the JSON-based character management system works in the Simp Archive Gallery website and provides a step-by-step guide to creating and updating character profiles.

## Table of Contents

1. [Introduction to JSON](#introduction-to-json)
2. [How JSON Powers the Character System](#how-json-powers-the-character-system)
3. [JSON Character Structure](#json-character-structure)
4. [Step-by-Step: Creating a New Character](#step-by-step-creating-a-new-character)
5. [Step-by-Step: Updating an Existing Character](#step-by-step-updating-an-existing-character)
6. [Converting HTML to JSON](#converting-html-to-json)
7. [Advanced: Customizing the Character Template](#advanced-customizing-the-character-template)
8. [Troubleshooting](#troubleshooting)

## Introduction to JSON

JSON (JavaScript Object Notation) is a lightweight data format that's easy for humans to read and write and easy for machines to parse and generate. In our website, JSON serves as the data storage format for character information.

### Basic JSON Syntax

```json
{
    "name": "Value",
    "number": 42,
    "boolean": true,
    "array": ["item1", "item2", "item3"],
    "object": {
        "key1": "value1",
        "key2": "value2"
    }
}
```

Key JSON features:
- Data is in name/value pairs
- Data is separated by commas
- Curly braces `{}` hold objects
- Square brackets `[]` hold arrays
- Strings must use double quotes `""`

## How JSON Powers the Character System

Our website uses a separation of concerns approach:

1. **Data (JSON)**: Character information stored in JSON files in the `characters/` directory
2. **Template (HTML)**: A character template file with placeholders (`character-template.html`)
3. **Generator (JavaScript)**: A script that combines data and template (`generate-character.js`)

This approach offers several benefits:
- **Maintainability**: Update character data without touching HTML
- **Consistency**: All characters follow the same template
- **Efficiency**: Generate multiple pages from a single template
- **Validation**: Ensure all required fields are present

## JSON Character Structure

Each character is defined by a JSON file in the `characters/` directory. Here's the structure with explanations:

```json
{
    "id": "character-id",          // Unique identifier, used for file names and localStorage
    "name": "Character Name",      // Character's full name
    "series": "Series Name",       // Show, band, or source
    "mainImage": "https://...",    // URL to main profile image
    
    "description": "Text...",      // General character description
    
    "age": "25",                   // Character's age (as string)
    "birthday": "Month Day",       // Character's birthday
    "role": "Role in Series",      // Character's role
    "personality": "Traits...",    // Personality description
    
    "analysis": "Deeper text...",  // More detailed character analysis
    
    "funFacts": [                  // Array of fun facts (strings)
        "Fact 1",
        "Fact 2",
        "Fact 3"
    ],
    
    "gallery": [                   // Array of gallery images (objects)
        {
            "url": "https://...",
            "alt": "Image description"
        },
        {
            "url": "https://...",
            "alt": "Image description"
        }
    ]
}
```

## Step-by-Step: Creating a New Character

### 1. Create the JSON File

Create a new file in the `characters/` directory named `[character-id].json` (e.g., `minho.json`).

### 2. Add Basic Information

Start with the essential character information:

```json
{
    "id": "minho",
    "name": "Lee Minho",
    "series": "Stray Kids",
    "mainImage": "https://example.com/minho.jpg",
    "description": "Lee Minho (known as Lee Know) is a member of the K-pop group Stray Kids. He is known for his exceptional dancing skills and was formerly a backup dancer for BTS."
}
```

### 3. Add Character Stats

Add more detailed information about the character:

```json
{
    "id": "minho",
    "name": "Lee Minho",
    "series": "Stray Kids",
    "mainImage": "https://example.com/minho.jpg",
    "description": "Lee Minho (known as Lee Know) is a member of the K-pop group Stray Kids. He is known for his exceptional dancing skills and was formerly a backup dancer for BTS.",
    
    "age": "24",
    "birthday": "October 25, 1998",
    "role": "Main Dancer, Sub Vocalist, Sub Rapper",
    "personality": "Calm, witty, and caring with a unique sense of humor"
}
```

### 4. Add Analysis and Fun Facts

Expand with more in-depth content:

```json
{
    "id": "minho",
    "name": "Lee Minho",
    "series": "Stray Kids",
    "mainImage": "https://example.com/minho.jpg",
    "description": "Lee Minho (known as Lee Know) is a member of the K-pop group Stray Kids. He is known for his exceptional dancing skills and was formerly a backup dancer for BTS.",
    
    "age": "24",
    "birthday": "October 25, 1998",
    "role": "Main Dancer, Sub Vocalist, Sub Rapper",
    "personality": "Calm, witty, and caring with a unique sense of humor",
    
    "analysis": "Lee Minho brings a unique blend of technical precision and emotional expression to his performances. His background as a professional dancer before joining Stray Kids gives him exceptional body control and stage presence. While initially quiet, he's developed into one of the group's comedic centers, often delivering deadpan humor that contrasts with his serious dance performances.",
    
    "funFacts": [
        "He was a backup dancer for BTS before joining Stray Kids",
        "He loves cats and has three of his own named Soonie, Doongie, and Dori",
        "His nickname 'Lee Know' is a play on words meaning 'I Know'",
        "He's known for his 'savage' personality and witty comebacks",
        "He studied contemporary dance in high school"
    ]
}
```

### 5. Add Gallery Images

Complete the profile with gallery images:

```json
{
    "id": "minho",
    "name": "Lee Minho",
    "series": "Stray Kids",
    "mainImage": "https://example.com/minho.jpg",
    "description": "Lee Minho (known as Lee Know) is a member of the K-pop group Stray Kids. He is known for his exceptional dancing skills and was formerly a backup dancer for BTS.",
    
    "age": "24",
    "birthday": "October 25, 1998",
    "role": "Main Dancer, Sub Vocalist, Sub Rapper",
    "personality": "Calm, witty, and caring with a unique sense of humor",
    
    "analysis": "Lee Minho brings a unique blend of technical precision and emotional expression to his performances. His background as a professional dancer before joining Stray Kids gives him exceptional body control and stage presence. While initially quiet, he's developed into one of the group's comedic centers, often delivering deadpan humor that contrasts with his serious dance performances.",
    
    "funFacts": [
        "He was a backup dancer for BTS before joining Stray Kids",
        "He loves cats and has three of his own named Soonie, Doongie, and Dori",
        "His nickname 'Lee Know' is a play on words meaning 'I Know'",
        "He's known for his 'savage' personality and witty comebacks",
        "He studied contemporary dance in high school"
    ],
    
    "gallery": [
        {
            "url": "https://example.com/minho1.jpg",
            "alt": "Lee Minho performing on stage"
        },
        {
            "url": "https://example.com/minho2.jpg",
            "alt": "Lee Minho with his cats"
        },
        {
            "url": "https://example.com/minho3.jpg",
            "alt": "Lee Minho in the 'God's Menu' music video"
        }
    ]
}
```

### 6. Generate the HTML Page

Run the generator script to create the HTML page:

```bash
./site-maintenance.sh generate minho
```

This will create `minho.html` based on your JSON data and the character template.

### 7. Add to the Carousel (Optional)

To make the character appear in the homepage carousel, add them to the `staticCharacters` array in `script.js`:

```javascript
const staticCharacters = [
    // Existing characters...
    {
        id: 'minho',
        name: 'Lee Minho',
        series: 'Stray Kids',
        image: 'https://example.com/minho.jpg',
        link: 'minho.html',
        birthday: 'October 25, 1998',
        funFacts: [
            'He was a backup dancer for BTS before joining Stray Kids',
            'He loves cats and has three of his own named Soonie, Doongie, and Dori',
            'His nickname "Lee Know" is a play on words meaning "I Know"',
            'He\'s known for his "savage" personality and witty comebacks',
            'He studied contemporary dance in high school'
        ]
    },
    // More characters...
];
```

## Step-by-Step: Updating an Existing Character

### 1. Edit the JSON File

Open the character's JSON file (e.g., `characters/minho.json`) and make your changes:

```json
{
    "id": "minho",
    "name": "Lee Minho (Lee Know)",  // Updated name
    "series": "Stray Kids",
    "mainImage": "https://example.com/minho_new.jpg",  // Updated image
    // ... other fields ...
    "funFacts": [
        // ... existing facts ...
        "He ranked #1 in dance among 4th generation K-pop idols in a 2023 poll"  // New fact
    ],
    "gallery": [
        // ... existing images ...
        {
            "url": "https://example.com/minho_new_photo.jpg",  // New image
            "alt": "Lee Minho at MAMA Awards 2023"
        }
    ]
}
```

### 2. Regenerate the HTML Page

Run the generator script to update the HTML page:

```bash
./site-maintenance.sh generate minho
```

### 3. Add Fact Check Comments (Optional)

To add hidden comments with character information for fact checking:

```bash
./site-maintenance.sh comments
```

## Converting HTML to JSON

If you have existing HTML character pages, you can convert them to JSON format:

```bash
./site-maintenance.sh convert
```

This will:
1. Extract character data from HTML files
2. Create corresponding JSON files in the `characters/` directory
3. Allow you to use the JSON-based workflow for future updates

## Advanced: Customizing the Character Template

The character template (`character-template.html`) contains placeholders that get replaced with data from the JSON file. These placeholders are in the format `{{PLACEHOLDER_NAME}}`.

Common placeholders:
- `{{CHARACTER_NAME}}`
- `{{SERIES_NAME}}`
- `{{MAIN_IMAGE_URL}}`
- `{{CHARACTER_DESCRIPTION}}`
- `{{CHARACTER_AGE}}`
- `{{CHARACTER_BIRTHDAY}}`
- `{{CHARACTER_ROLE}}`
- `{{CHARACTER_PERSONALITY}}`
- `{{CHARACTER_ANALYSIS}}`
- `{{CHARACTER_FUN_FACTS}}` (automatically generates list items)
- `{{GALLERY_IMAGES}}` (automatically generates gallery items)
- `{{CHARACTER_ID}}`

If you want to add a new field to all character pages:

1. Add the field to your JSON files (e.g., `"favoriteFood": "Pizza"`)
2. Add a placeholder to the template (e.g., `{{CHARACTER_FAVORITE_FOOD}}`)
3. Update the generator script to handle the new field

## Troubleshooting

### JSON Syntax Errors

If the generator fails with a syntax error:

1. Check for missing commas between properties
2. Ensure all strings have double quotes
3. Make sure arrays and objects are properly closed
4. Validate your JSON using a tool like [JSONLint](https://jsonlint.com/)

### Missing Content in Generated HTML

If some content is missing from the generated HTML:

1. Check if the corresponding field exists in the JSON file
2. Verify the field name matches what the generator expects
3. Check the character template for the correct placeholder

### Images Not Displaying

If gallery images aren't displaying:

1. Check the URL format (should be a direct link to the image)
2. Ensure the host allows hotlinking
3. Avoid URLs with special characters or query parameters
4. Use the site debugger to identify suspicious URLs:
   ```bash
   ./site-maintenance.sh debug
   ```

### Running the Site Debugger

To check for issues across the site:

```bash
./site-maintenance.sh debug
```

This will:
- Check for character pages without JSON files
- Look for broken internal links
- Identify suspicious image URLs
- Verify consistency in review cards
- Check for duplicate character IDs

### Getting Help

If you encounter issues not covered in this tutorial:

1. Check the console output for error messages
2. Look at the generated HTML to see what might be wrong
3. Review the generator script to understand how data is processed
4. Consult the main README for additional information 