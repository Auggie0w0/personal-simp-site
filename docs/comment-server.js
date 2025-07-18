// Simple Comment Server for August's Simp Gallery
// This ensures comments are shared across all visitors

// For Vercel deployment, create a serverless function
// Create a file: api/comments.js

/*
// Vercel API Route (api/comments.js)
import fs from 'fs';
import path from 'path';

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'comments.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(COMMENTS_FILE))) {
    fs.mkdirSync(path.dirname(COMMENTS_FILE), { recursive: true });
}

// Initialize comments file if it doesn't exist
if (!fs.existsSync(COMMENTS_FILE)) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify([]));
}

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            // Get comments for a specific character
            const { characterId } = req.query;
            const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
            
            if (characterId) {
                const characterComments = comments.filter(comment => comment.characterId === characterId);
                res.status(200).json(characterComments);
            } else {
                res.status(200).json(comments);
            }
        } else if (req.method === 'POST') {
            // Add a new comment
            const newComment = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                ...req.body,
                timestamp: new Date().toISOString()
            };

            const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
            comments.push(newComment);
            fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));

            res.status(201).json(newComment);
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Comment server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
*/

// Alternative: Simple JSON file approach
// Create a file: data/comments.json

const COMMENTS_DATA = {
    "comments": [
        {
            "id": "example-comment-1",
            "characterId": "leeknow",
            "author": "August",
            "text": "Lee Know is absolutely amazing! His dancing skills are incredible.",
            "timestamp": "2024-01-01T12:00:00.000Z"
        },
        {
            "id": "example-comment-2", 
            "characterId": "saja",
            "author": "Fan",
            "text": "Saja is such a charismatic character! Love his personality.",
            "timestamp": "2024-01-01T13:00:00.000Z"
        }
    ]
};

// Instructions for deployment:
/*
1. For Vercel:
   - Create a folder called 'api' in your project root
   - Create a file 'api/comments.js' with the serverless function above
   - Deploy to Vercel

2. For GitHub Pages (static hosting):
   - Create a 'data' folder in your project root
   - Create 'data/comments.json' with the COMMENTS_DATA above
   - Update the comment system to fetch from this JSON file

3. For local development:
   - Use the localStorage fallback (already implemented)
   - Comments will persist in the browser
*/

// Enhanced comment system with server integration
const COMMENT_SERVER_URL = '/api/comments'; // For Vercel
const COMMENT_DATA_URL = '/data/comments.json'; // For static hosting

// Function to fetch comments from server
async function fetchCommentsFromServer(characterId) {
    try {
        // Try Vercel API first
        const response = await fetch(`${COMMENT_SERVER_URL}?characterId=${characterId}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log('Vercel API not available, trying static JSON');
    }

    try {
        // Fallback to static JSON file
        const response = await fetch(COMMENT_DATA_URL);
        if (response.ok) {
            const data = await response.json();
            return data.comments.filter(comment => comment.characterId === characterId);
        }
    } catch (error) {
        console.log('Static JSON not available, using localStorage');
    }

    return [];
}

// Function to post comment to server
async function postCommentToServer(commentData) {
    try {
        // Try Vercel API first
        const response = await fetch(COMMENT_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData)
        });
        
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log('Vercel API not available, using localStorage');
    }

    return null;
}

// Export functions for use in comment-system.js
window.fetchCommentsFromServer = fetchCommentsFromServer;
window.postCommentToServer = postCommentToServer; 