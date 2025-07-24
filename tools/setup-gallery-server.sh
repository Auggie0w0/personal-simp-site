#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Gallery Server for Simp Archive Gallery${NC}"
echo "This script will create a new directory for the server and set up the required files."

# Create server directory
echo -e "\n${YELLOW}Creating server directory...${NC}"
mkdir -p gallery-server
cd gallery-server

# Initialize npm project
echo -e "\n${YELLOW}Initializing npm project...${NC}"
npm init -y

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install express mongoose multer cors dotenv

# Create .env file
echo -e "\n${YELLOW}Creating .env file...${NC}"
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/simp-archive-gallery
PORT=3000
EOF

# Create server.js file
echo -e "\n${YELLOW}Creating server.js file...${NC}"
cat > server.js << 'EOF'
// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/simp-archive-gallery')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create image schema
const imageSchema = new mongoose.Schema({
  characterId: String,
  src: String,
  alt: String,
  uploadDate: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('Created uploads directory');
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `uploads/${req.params.characterId}`;
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// API routes
app.get('/api/images/:characterId', async (req, res) => {
  try {
    const images = await Image.find({ characterId: req.params.characterId });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle URL-based image uploads
app.post('/api/images/:characterId/url', async (req, res) => {
  try {
    const { src, alt } = req.body;
    
    if (!src) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
    
    const newImage = new Image({
      characterId: req.params.characterId,
      src: src,
      alt: alt || `${req.params.characterId} Gallery Image`
    });
    
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle file uploads
app.post('/api/images/:characterId/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.params.characterId}/${req.file.filename}`;
    
    const newImage = new Image({
      characterId: req.params.characterId,
      src: imageUrl,
      alt: req.body.alt || `${req.params.characterId} Gallery Image`
    });
    
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('Gallery Server is running. API is available at /api/images/:characterId');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
EOF

# Create README.md
echo -e "\n${YELLOW}Creating README.md...${NC}"
cat > README.md << 'EOF'
# Gallery Server for Simp Archive Gallery

This server handles image uploads and storage for the Simp Archive Gallery, allowing all users to see images added by any user.

## Setup

1. Install MongoDB if you haven't already:
   - macOS: `brew install mongodb-community`
   - Windows: Download from [MongoDB website](https://www.mongodb.com/try/download/community)

2. Install dependencies:
   ```
   npm install
   ```

3. Start MongoDB:
   - macOS/Linux: `mongod --dbpath=/data/db`
   - Windows: Start MongoDB service

4. Start the server:
   ```
   npm start
   ```

5. The server will run on http://localhost:3000

## API Endpoints

- `GET /api/images/:characterId` - Get all images for a character
- `POST /api/images/:characterId/url` - Add an image URL for a character
- `POST /api/images/:characterId/upload` - Upload an image file for a character

## Deployment

### Heroku

1. Create a Heroku account
2. Install Heroku CLI
3. Login to Heroku: `heroku login`
4. Create a new app: `heroku create simp-archive-gallery-api`
5. Add MongoDB addon: `heroku addons:create mongolab`
6. Deploy: `git push heroku main`

### Vercel

1. Create a vercel.json file:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "server.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "server.js" }
     ]
   }
   ```
2. Deploy using Vercel CLI: `vercel`
EOF

# Update package.json to add start script
echo -e "\n${YELLOW}Updating package.json...${NC}"
sed -i '' 's/"scripts": {/"scripts": {\n    "start": "node server.js",/g' package.json

# Create vercel.json for Vercel deployment
echo -e "\n${YELLOW}Creating vercel.json...${NC}"
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
EOF

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "To start the server:"
echo -e "  1. Make sure MongoDB is running"
echo -e "  2. cd gallery-server"
echo -e "  3. npm start"
echo -e "\nThe server will run on http://localhost:3000"
echo -e "Remember to update the API_BASE_URL in shared-gallery.js to match your server URL." 