# Comment System Setup Guide

## Overview
Your website now has a fully functional comment system that allows users to leave comments on character pages. The system supports both persistent storage (Supabase) and local storage fallback.

## Features
- ✅ **Name Required**: Users must provide their name to comment
- ✅ **Persistent Storage**: Comments are saved and shared across all users
- ✅ **Real-time Updates**: Comments appear instantly
- ✅ **Character-specific**: Each character has their own comment section
- ✅ **Validation**: Name (2+ chars) and comment (10+ chars) requirements
- ✅ **Beautiful UI**: Styled to match your site's theme
- ✅ **Notifications**: Success/error messages for user feedback

## Setup Options

### Option 1: Supabase (Recommended - Persistent Storage)

#### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

#### Step 2: Create Database Table
1. Go to your Supabase dashboard
2. Navigate to "SQL Editor"
3. Run this SQL command:

```sql
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  characterId TEXT NOT NULL,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON comments
  FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" ON comments
  FOR INSERT WITH CHECK (true);
```

#### Step 3: Get Your Credentials
1. Go to "Settings" → "API"
2. Copy your "Project URL" and "anon public" key

#### Step 4: Update Configuration
1. Open `comment-system.js`
2. Replace these lines:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```
3. With your actual credentials:
```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Option 2: Local Storage (Fallback)
If you don't set up Supabase, the system will automatically use localStorage as a fallback. Comments will be stored in the user's browser but won't be shared across users.

## How It Works

### For Users:
1. **Visit any character page** (Lee Know, Saja, Huntrix, etc.)
2. **Scroll down** to see the "Comments" section
3. **Enter your name** (required, minimum 2 characters)
4. **Write your comment** (required, minimum 10 characters)
5. **Click "Post Comment"** to submit
6. **See your comment** appear instantly with a success notification

### For You (Site Owner):
- **Comments are stored permanently** in the database
- **All users can see all comments** on each character page
- **Comments are sorted by newest first**
- **No moderation required** - the system is self-contained

## Database Schema

The comments table stores:
- `id`: Unique identifier for each comment
- `characterId`: Which character the comment is for (leeknow, saja, huntrix, etc.)
- `author`: The name provided by the commenter
- `text`: The comment content
- `timestamp`: When the comment was posted

## Security Features

- **Input Validation**: Prevents empty or too-short comments
- **HTML Escaping**: Prevents XSS attacks
- **Rate Limiting**: Built into Supabase (if using that option)
- **No Personal Data**: Only stores name and comment text

## Customization

### Styling
The comment system uses your existing CSS variables and theme. To customize:
1. Edit the CSS in `comment-system.js`
2. The styles are added dynamically to match your site's theme

### Validation Rules
To change validation rules, edit these lines in `comment-system.js`:
```javascript
if (name.length < 2) { // Minimum name length
if (text.length < 10) { // Minimum comment length
```

### Character Mapping
To add comments to new characters, update the `characterMap` in the `getCurrentCharacterId()` function.

## Troubleshooting

### Comments Not Appearing
1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Ensure the database table was created properly

### Supabase Setup Issues
1. Make sure you're using the correct project URL and anon key
2. Verify the SQL table creation was successful
3. Check that Row Level Security policies are set correctly

### Local Storage Issues
1. Clear browser cache and try again
2. Check if localStorage is enabled in your browser
3. Try in an incognito/private window

## Cost
- **Supabase Free Tier**: 50,000 monthly active users, 500MB database
- **Local Storage**: Completely free (but not shared across users)

## Next Steps
1. Set up Supabase for persistent storage
2. Test the comment system on your character pages
3. Consider adding moderation features if needed
4. Monitor comment activity through Supabase dashboard

The comment system is now ready to use! Users can start leaving comments on any character page immediately. 