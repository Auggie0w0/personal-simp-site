# Simp Archive Gallery - version 1

Currently creating a backend so that images saved by any users can be seen by all other users as well... also reviews needs fixing still AHHHT T_T_T_T__T 

---

A personal character gallery website for showcasing favorite characters from anime, K-pop, and more. This project allows you to create and maintain a collection of character profiles with customizable galleries.

## Features

- **Character Profiles**: Detailed character pages with information, facts, and image galleries
- **Persistent Image Galleries**: Add images to character galleries that persist across page reloads
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between dark and light modes
- **Character List**: Browse all characters in a grid layout
- **Image Carousel**: Showcase featured characters on the home page
- **Shared Gallery System**: Option to use a server-based gallery system where all users can see images added by anyone

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

4. (Optional) Set up the shared gallery server:
   ```
   ./setup-gallery-server.sh
   ```

## Creating Your Own Character Page

To add a new character to the gallery:

1. **Create a new HTML file** named after your character (e.g., `character-name.html`).

2. **Copy the template** from an existing character page like `minho.html` or `dazai.html`.

3. **Update the character information**:
   - Character name
   - Series/group
   - Profile image
   - Birthday
   - Fun facts
   - Gallery images (optional, users can add these later)

4. **Add the character to the static list** in `script.js` to make them appear in the carousel and gallery:

```javascript
const staticCharacters = [
    // Existing characters...
    {
        id: 'character-id', // Used for localStorage (use lowercase, no spaces)
        name: 'Character Name',
        series: 'Series Name',
        image: 'https://link-to-image.jpg',
        link: 'character-name.html',
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

5. **Update the character list page** by adding your character to `character-list.html`.

## Gallery System

The gallery system allows users to add images to character profiles. There are two options available:

### 1. LocalStorage Gallery (Default)

Images are stored in the browser's localStorage and persist across page reloads, but are only visible to the user who added them.

#### Key Files
- `fix-gallery-persistence.js`: Handles saving and loading images from localStorage
- `gallery.js`: Core gallery functionality
- `fix_gallery_ordering.js`: Ensures proper ordering of gallery items

### 2. Shared Gallery System (Optional)

Images are stored on a server and are visible to all users. This requires setting up a backend server.

#### Key Files
- `shared-gallery.js`: Client-side code for the shared gallery system
- `setup-gallery-server.sh`: Script to set up the backend server

#### Setting Up the Shared Gallery Server

1. Run the setup script:
   ```
   ./setup-gallery-server.sh
   ```

2. Start MongoDB (if using locally):
   ```
   mongod --dbpath=/data/db
   ```

3. Start the server:
   ```
   cd gallery-server
   npm start
   ```

4. Update character HTML files to use the shared gallery system:
   - Remove references to `fix-gallery-persistence.js` and `gallery.js`
   - Add `<script src="shared-gallery.js"></script>`

5. If deploying to a hosting service, update the API_BASE_URL in `shared-gallery.js`:
   ```javascript
   const API_BASE_URL = 'https://your-deployed-api-url.com/api';
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

This site does not claim ownership of any character artwork. Most images are official artwork, while others are fan creations. If you recognize your work, please accept credit. Feel free to contribute to this project or contact for character recommendations.

## Acknowledgments

- All original artists and creators of the characters and artwork
- Contributors to the project 
