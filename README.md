# Simp Archive Gallery - version 1.2

A personal character gallery website for showcasing favorite characters from anime, K-pop, actors, and more. This project allows you to create and maintain a collection of character profiles with customizable galleries.

## About This Project

This site was created purely for fun and enjoyment - a personal collection of characters I've liked, enjoyed, or connected with throughout the ages. It's designed to be visually appealing and easy to browse through images and character information.

**Important Note:** All images featured on this site belong to their respective artists, photographers, studios, and the actors themselves. This project does not claim ownership of any visual content and is intended for personal appreciation only.

## Features

- **Character Profiles**: Detailed character pages with information, facts, and image galleries
- **Persistent Image Galleries**: Add images to character galleries that persist across page reloads
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between dark and light modes
- **Character List**: Browse all characters in a grid layout
- **Image Carousel**: Showcase featured characters on the home page
- **Shared Gallery System**: Option to use a server-based gallery system where all users can see images added by anyone
- **Character Generator System**: Create and update character pages from JSON configurations
- **Site Optimization Tools**: Debug and optimize the site structure automatically

## Getting Started

### Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- A web server or hosting service (like GitHub Pages, Vercel, Netlify, etc.)
- For shared gallery: Node.js, MongoDB (optional)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/personal-simp-site.git
   ```

2. Navigate to the project directory:
   ```
   cd personal-simp-site
   ```

3. Open `index.html` in your browser or deploy to your hosting service.

## Streamlined Site Management

The site has been streamlined with three main consolidated files that replace multiple redundant files:

### 1. Site Maintenance Script (`site-maintenance.sh`)

A comprehensive maintenance script that handles all site management tasks:

```bash
./site-maintenance.sh [command]
```

Available commands:
- `optimize` - Run site optimization tools
- `generate` - Generate character pages from JSON
- `convert` - Convert HTML pages to JSON
- `debug` - Run site debugger
- `clean` - Clean up temporary files
- `reset` - Reset galleries, ratings, or both
- `comments` - Add fact check comments to character pages
- `help` - Show help message

Examples:
```bash
# Generate all character pages
./site-maintenance.sh generate

# Generate a specific character page
./site-maintenance.sh generate mackenyu

# Reset gallery data
./site-maintenance.sh reset galleries
```

### 2. Site Utilities (`site-utils.js`)

A consolidated JavaScript utility file that combines multiple utility functions:

- Gallery management (ordering, persistence, reset)
- Rating management
- Debugging utilities

This file can be included in HTML pages:
```html
<script src="site-utils.js"></script>
```

And used in JavaScript:
```javascript
// Fix gallery ordering
siteUtils.galleryUtils.fixGalleryOrdering();

// Reset ratings
siteUtils.ratingUtils.resetRatings();

// Check for broken images
siteUtils.debugUtils.checkBrokenImages();
```

### 3. Admin Panel (`admin.html`)

A consolidated admin panel that provides a user-friendly interface for:

- Gallery management
- Rating management
- Site maintenance tasks

Simply open `admin.html` in your browser to access all administrative functions.

## Character Management Workflow

The site now uses a JSON-based character management system. This approach separates content from presentation, making it easier to maintain and update character information.

### Character Workflow Overview

1. **Create/Edit JSON**: Define character data in JSON format in the `characters/` directory
2. **Generate HTML**: Use the generator to create HTML pages from JSON data
3. **View/Test**: Open the generated HTML pages in a browser to view the result
4. **Update**: Make changes to the JSON file and regenerate as needed

### Creating a New Character

To add a new character:

1. **Create a JSON file** in the `characters` directory (e.g., `characters/character-id.json`).

2. **Define the character data** in JSON format:
   ```json
   {
       "id": "character-id",
       "name": "Character Name",
       "series": "Series Name",
       "mainImage": "https://link-to-image.jpg",
       "description": "Character description...",
       "age": "25",
       "birthday": "Month Day, Year",
       "role": "Role in Series",
       "personality": "Character Traits",
       "analysis": "Deeper analysis of the character...",
       "funFacts": [
           "Fact 1",
           "Fact 2",
           "Fact 3"
       ],
       "gallery": [
           {
               "url": "https://image1.jpg",
               "alt": "Character Name"
           },
           {
               "url": "https://image2.jpg",
               "alt": "Character Name"
           }
       ]
   }
   ```

3. **Generate the HTML page**:
   ```bash
   ./site-maintenance.sh generate character-id
   ```

4. **Add the character to the static list** in `script.js` to make them appear in the carousel and gallery:
   ```javascript
   const staticCharacters = [
       // Existing characters...
       {
           id: 'character-id', // Used for localStorage (use lowercase, no spaces)
           name: 'Character Name',
           series: 'Series Name',
           image: 'https://link-to-image.jpg',
           link: 'character-id.html',
           birthday: 'Month Day, Year',
           funFacts: [
               'Fact 1',
               'Fact 2',
               'Fact 3',
               'Fact 4',
               'Fact 5'
           ]
       },
       // More characters...
   ];
   ```

### Converting Existing HTML to JSON

If you have existing HTML character pages, you can convert them to JSON format:

```bash
./site-maintenance.sh convert
```

This will:
1. Extract character data from HTML files
2. Create corresponding JSON files in the `characters/` directory
3. Allow you to use the JSON-based workflow for future updates

## Gallery System

The gallery system allows users to add images to character profiles. There are two options available:

### 1. LocalStorage Gallery (Default)

Images are stored in the browser's localStorage and persist across page reloads, but are only visible to the user who added them.

### 2. Shared Gallery System (Optional)

Images are stored on a server and are visible to all users. This requires setting up a backend server.

To set up the shared gallery server:
```bash
./setup-gallery-server.sh
```

## Troubleshooting

### Images Not Persisting

If gallery images aren't persisting:

1. Check that localStorage is available in your browser.
2. Ensure the character ID in the HTML matches the ID used in localStorage.
3. Look for console errors related to storage limits.

### Shared Gallery Issues

1. Make sure MongoDB is running if using the shared gallery system.
2. Check the server console for any error messages.
3. Verify that the API_BASE_URL in `shared-gallery.js` is correct.
4. Check browser console for CORS or network errors.

### Image Display Problems

If images aren't displaying correctly:

1. Check for problematic URLs (query parameters, special characters, future dates)
2. Ensure the image host allows hotlinking
3. Use the site debugger to identify suspicious image URLs:
   ```bash
   ./site-maintenance.sh debug
   ```

## Project Structure

### Key Directories

- `characters/`: Contains JSON files for each character
- `js/`: Contains JavaScript files
- `css/`: Contains CSS files
- `templates/`: Contains HTML templates
- `docs/`: Contains documentation
- `tools/`: Contains utility scripts
- `node_modules/`: Contains Node.js dependencies (automatically generated)

### What is `node_modules`?

The `node_modules` directory contains all the external JavaScript libraries and dependencies that the project uses. It's automatically created when you run `npm install` and is populated with packages listed in `package.json`.

Key things to know about `node_modules`:
- It should **never** be edited directly
- It should **never** be committed to version control (it's already in `.gitignore`)
- If you delete it, you can recreate it by running `npm install`
- It contains the `cheerio` library which is used for HTML parsing in our scripts

## Customization

### Styling

The main styling is in `style.css`. You can modify:

- Color scheme
- Layout
- Typography
- Card styles
- Animation effects

### Adding Features

To add new features:

1. Modify the HTML structure as needed.
2. Update or add JavaScript functionality in `script.js`.
3. Add any necessary styles to `style.css`.

## Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests to improve the site.

## License

This project is open source. Feel free to use, modify, and distribute as you wish.

## Disclaimer

This site does not claim ownership of any character artwork, photographs, or images. All visual content belongs to their respective copyright holders, including but not limited to:
- Original artists and creators
- Studios and production companies
- Photographers and media outlets
- Actors and performers themselves

This site is created for personal enjoyment and appreciation only. If you are a copyright holder and would like your work removed, please contact me.

## Acknowledgments

- All original artists and creators of the characters and artwork
- Photographers who captured the amazing images
- Actors and performers featured in the profiles
- Contributors to the project

## Recent Updates

### Version 1.2
- Converted all character pages to JSON format
- Streamlined character management workflow
- Added character comments feature for fact checking
- Consolidated all backups into a single `final_backup` directory
- Added JSON tutorial documentation

### Version 1.1
- Consolidated utilities into streamlined tools:
  - **site-maintenance.sh**: Consolidated maintenance script
  - **site-utils.js**: Consolidated JavaScript utilities
  - **admin.html**: Consolidated admin panel
  - **add-character-comments.js**: Script to add fact check comments to character pages

### Fact Check Comments

A feature to help with fact checking character information:

```bash
# Add fact check comments to all character pages
./site-maintenance.sh comments
```

This adds hidden HTML comments at the bottom of each character page containing all the character's information for easy fact checking. These comments are only visible when viewing the page source code, not on the website itself.

Example comment format:
```html
<!--
CHARACTER FACT CHECK INFORMATION
============================

Name: Character Name
Series: Series Name

STATS:
Age: 25
Birthday: January 1, 2000
Role: Main Character

DESCRIPTION:
Character description...

ANALYSIS:
Character analysis...

FUN FACTS:
1. Fact 1
2. Fact 2
3. Fact 3

GALLERY IMAGES (5):
1. https://image1.jpg
2. https://image2.jpg
...
-->
```

## Important Note About HTML and JSON Files

The character HTML files (like mackenyu.html, axel.html, etc.) are still needed as they're what the browser displays to visitors. However, they should not be edited directly anymore.

Instead, follow this workflow:
1. Edit the JSON files in the `characters/` directory
2. Regenerate the HTML using `./site-maintenance.sh generate`
3. The generated HTML files will be automatically updated with your changes

## Final Notes

The site has been fully optimized and streamlined. Here's a quick checklist for maintaining it:

1. **Adding/Updating Characters**:
   - Edit JSON files in the `characters/` directory
   - Run `./site-maintenance.sh generate` to update HTML
   - Update `script.js` if needed for the carousel

2. **Checking for Issues**:
   - Run `./site-maintenance.sh debug` to check for problems
   - Fix any issues identified by the debugger

3. **Maintenance**:
   - Run regular site debugging with `./site-maintenance.sh debug`
   - Keep your JSON files organized in the `characters/` directory

4. **Documentation**:
   - Refer to `json-character-tutorial.md` for detailed instructions
   - See `json-tutorial-example.md` for a practical example


*added to https://roadmap.sh/projects/basic-html-website*
