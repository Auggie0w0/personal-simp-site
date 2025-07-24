#!/bin/bash

# Setup Character Generator
# This script sets up the character generator system and runs it

# Create characters directory if it doesn't exist
if [ ! -d "characters" ]; then
  echo "Creating characters directory..."
  mkdir -p characters
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is required but not installed."
  echo "Please install Node.js and try again."
  exit 1
fi

# Check if the template file exists
if [ ! -f "character-template.html" ]; then
  echo "Error: character-template.html not found."
  echo "Please create the template file first."
  exit 1
fi

# Check if the generator script exists
if [ ! -f "generate-character.js" ]; then
  echo "Error: generate-character.js not found."
  echo "Please create the generator script first."
  exit 1
fi

# Make sure the script is executable
chmod +x generate-character.js

# Run the generator
if [ "$1" == "" ]; then
  # No arguments, process all characters
  echo "Processing all character configurations..."
  node generate-character.js characters/
else
  # Process specific character
  echo "Processing character: $1..."
  node generate-character.js "characters/$1.json"
fi

echo "Done!" 