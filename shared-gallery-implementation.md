# Shared Gallery Implementation Guide

## Overview

This guide outlines how to implement a server-side solution for the Simp Archive Gallery that allows all users to see images added by any user. Currently, the gallery uses localStorage, which means images are only visible to the user who added them.

## Implementation Plan

### Step 1: Set Up Backend Server

#### Option: Node.js + Express + MongoDB

1. **Create a new directory for the server:**
```bash
mkdir gallery-server
cd gallery-server
npm init -y
```

2. **Install required dependencies:**
```bash
npm install express mongoose multer cors dotenv
```

3. **Create server.js file:**
```javascript
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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/simp-archive-gallery');

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

4. **Create .env file:**
```
MONGODB_URI=mongodb://localhost:27017/simp-archive-gallery
PORT=3000
```

### Step 2: Modify Client-Side Code

Create a new JavaScript file called `shared-gallery.js` that will replace the current gallery functionality:

```javascript
// shared-gallery.js - Replaces localStorage gallery with server-based solution

// API base URL - change this to your server URL when deployed
const API_BASE_URL = 'http://localhost:3000/api';

// Function to load images from server for a character
async function loadImagesFromServer(characterId) {
  if (!characterId) return;
  
  console.log('Loading images from server for character:', characterId);
  
  try {
    const response = await fetch(`${API_BASE_URL}/images/${characterId}`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const images = await response.json();
    
    if (!images || images.length === 0) {
      console.log('No gallery images found for this character');
      return;
    }
    
    console.log(`Found ${images.length} images for character ${characterId}`);
    
    // Find the gallery container
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageGallery = document.querySelector('.image-gallery');
    const targetContainer = galleryGrid || imageGallery;
    
    if (!targetContainer) {
      console.log('No gallery container found');
      return;
    }
    
    // Find the add-photo-card
    const addPhotoCard = targetContainer.querySelector('.add-photo-card');
    
    if (!addPhotoCard) {
      console.log('Add photo card not found');
      return;
    }
    
    // Add saved images to the gallery AFTER the add-photo-card
    images.forEach(imageData => {
      // Skip if image is already in the gallery (check by src)
      const existingImages = targetContainer.querySelectorAll('img');
      const alreadyExists = Array.from(existingImages).some(img => img.src === imageData.src);
      
      if (alreadyExists) {
        console.log('Image already exists in gallery, skipping:', imageData.src.substring(0, 50) + '...');
        return;
      }
      
      console.log('Adding image to gallery:', imageData.src.substring(0, 50) + '...');
      
      const galleryItem = document.createElement('div');
      galleryItem.className = galleryGrid ? 'gallery-item' : 'gallery-image';
      galleryItem.innerHTML = `
        <img src="${imageData.src}" alt="${imageData.alt || 'Gallery Image'}" ${galleryGrid ? 'onclick="openGalleryModal(this.src, this.alt)"' : ''}>
      `;
      
      // Insert AFTER the add-photo-card
      if (addPhotoCard.nextSibling) {
        targetContainer.insertBefore(galleryItem, addPhotoCard.nextSibling);
      } else {
        targetContainer.appendChild(galleryItem);
      }
    });
    
    // Re-initialize gallery modals for the loaded images
    if (typeof initGalleryModals === 'function') {
      setTimeout(initGalleryModals, 100);
    }
    
  } catch (error) {
    console.error('Error loading images from server:', error);
  }
}

// Function to upload an image URL to the server
async function uploadImageUrlToServer(characterId, imageUrl, altText) {
  if (!characterId || !imageUrl) return null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/images/${characterId}/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src: imageUrl,
        alt: altText || `${characterId} Gallery Image`
      })
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading image URL to server:', error);
    return null;
  }
}

// Function to upload an image file to the server
async function uploadImageFileToServer(characterId, imageFile, altText) {
  if (!characterId || !imageFile) return null;
  
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    if (altText) {
      formData.append('alt', altText);
    }
    
    const response = await fetch(`${API_BASE_URL}/images/${characterId}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading image file to server:', error);
    return null;
  }
}

// Override the original addPhotosToGallery function
window.addPhotosToGallery = async function() {
  if (!currentCharacterId || selectedImages.length === 0) return;
  
  console.log('Enhanced addPhotosToGallery called for character:', currentCharacterId);
  
  try {
    // Show loading indicator
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading-message';
    loadingMessage.textContent = 'Uploading images...';
    document.body.appendChild(loadingMessage);
    
    // Upload each image to the server
    for (const imageData of selectedImages) {
      // If the image is a File object (from file upload), upload it as a file
      if (imageData.file) {
        await uploadImageFileToServer(
          currentCharacterId, 
          imageData.file, 
          `${currentCharacterId} Gallery Image`
        );
      } 
      // If the image is a URL (from paste or drag-and-drop), save it as a URL
      else if (imageData.src) {
        await uploadImageUrlToServer(
          currentCharacterId, 
          imageData.src, 
          `${currentCharacterId} Gallery Image`
        );
      }
    }
    
    // Remove loading indicator
    document.body.removeChild(loadingMessage);
    
    // Reload images from server to ensure we have the latest
    await loadImagesFromServer(currentCharacterId);
    
    // Close modal and show success message
    if (typeof closeAddPhotoModal === 'function') {
      closeAddPhotoModal();
    }
    
    alert(`Successfully added ${selectedImages.length} image(s) to the gallery! Images will be visible to all users.`);
  } catch (error) {
    console.error('Error adding photos to gallery:', error);
    alert('There was an error adding photos to the gallery. Please try again.');
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('shared-gallery.js loaded');
  
  // Get character ID from the current page
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  
  if (filename && filename.endsWith('.html')) {
    const characterId = filename.replace('.html', '');
    
    // Load images from server
    loadImagesFromServer(characterId);
  }
});
```

### Step 3: Update HTML Files

Update all character HTML files to include the new shared-gallery.js script instead of the localStorage-based scripts:

1. Remove these scripts from character pages:
   - fix-gallery-persistence.js
   - gallery.js

2. Add the new shared-gallery.js script:
```html
<script src="shared-gallery.js"></script>
```

### Step 4: Deployment

#### Deploy Backend Server

1. **Heroku Deployment:**
   - Create a Heroku account
   - Install Heroku CLI
   - In your server directory:
   ```bash
   heroku create simp-archive-gallery-api
   heroku addons:create mongolab
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku master
   ```

2. **Vercel Deployment:**
   - Create a vercel.json file in your server directory:
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
   - Deploy using Vercel CLI:
   ```bash
   vercel
   ```

#### Update Client Configuration

After deploying the backend, update the API_BASE_URL in shared-gallery.js:

```javascript
const API_BASE_URL = 'https://your-deployed-api-url.com/api';
```

## Additional Considerations

1. **Authentication**: Consider adding user authentication to prevent abuse
2. **Rate Limiting**: Add rate limiting to prevent excessive uploads
3. **Image Validation**: Validate image files to ensure they're safe and appropriate
4. **Moderation**: Add a moderation system for inappropriate content
5. **Backup**: Regularly backup your database and uploaded files
6. **Optimization**: Implement image resizing and compression
7. **Costs**: Be aware of hosting and storage costs as your site grows

## Migration Strategy

To migrate existing localStorage images to the server:

1. Create a migration script that:
   - Reads all images from localStorage
   - Uploads them to the server
   - Clears localStorage after successful migration

2. Add a migration button to each character page that users can click to migrate their images 