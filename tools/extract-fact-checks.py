#!/usr/bin/env python3

"""
Extract Fact Check Comments

This script extracts the fact check comments from all character HTML files
and saves them to a single text file for easy review.
"""

import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path

# Try to import BeautifulSoup if available (not required but helpful)
try:
    from bs4 import BeautifulSoup
    USE_BS4 = True
except ImportError:
    USE_BS4 = False
    print("BeautifulSoup not found. Using regex-based extraction instead.")

# Configuration
OUTPUT_FILE = "character-fact-checks.txt"
HTML_DIR = Path(__file__).parent.parent  # Parent directory of the script

def get_character_html_files():
    """Get all character HTML files in the root directory"""
    excluded_files = ['index.html', 'character-list.html', 'admin.html', 
                      'reviews.html', 'abouts.html', 'templates/character-template.html', 
                      'templates/footer_disclaimer_template.html']
    
    html_files = []
    for file in os.listdir(HTML_DIR):
        if file.endswith('.html') and file not in excluded_files:
            html_files.append(file)
    
    # Also check the characters directory for any HTML files
    characters_dir = HTML_DIR / 'characters'
    if characters_dir.exists() and characters_dir.is_dir():
        for file in os.listdir(characters_dir):
            if file.endswith('.html'):
                html_files.append(f"characters/{file}")
    
    return html_files

def get_character_json_files():
    """Get all character JSON files to verify character count"""
    json_files = []
    characters_dir = HTML_DIR / 'characters'
    if characters_dir.exists() and characters_dir.is_dir():
        for file in os.listdir(characters_dir):
            if file.endswith('.json'):
                json_files.append(file)
    
    return json_files

def extract_fact_check_comments_bs4(html_file):
    """Extract fact check comments using BeautifulSoup"""
    file_path = HTML_DIR / html_file
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        comments = soup.find_all(string=lambda text: isinstance(text, str) and 
                                'CHARACTER FACT CHECK INFORMATION' in text)
        
        if comments:
            return {
                'character_id': Path(html_file).stem,
                'fact_check': comments[0]
            }
    except Exception as e:
        print(f"Error processing {html_file}: {e}")
    
    return None

def extract_fact_check_comments_regex(html_file):
    """Extract fact check comments using regex"""
    file_path = HTML_DIR / html_file
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Try different regex patterns to catch all possible formats
        patterns = [
            r'<!--\s*CHARACTER FACT CHECK INFORMATION[\s\S]*?-->',
            r'<!--[\s\S]*?CHARACTER FACT CHECK INFORMATION[\s\S]*?-->',
            r'<!--[\s\S]*?FACT CHECK[\s\S]*?-->'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, content)
            if matches:
                return {
                    'character_id': Path(html_file).stem,
                    'fact_check': matches[0]
                }
    except Exception as e:
        print(f"Error processing {html_file}: {e}")
    
    return None

def extract_character_info_from_html(html_file):
    """Extract basic character info from HTML file if no fact check comment exists"""
    file_path = HTML_DIR / html_file
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract character name
        name_match = re.search(r'<h1[^>]*>(.*?)</h1>', content)
        name = name_match.group(1) if name_match else "Unknown"
        
        # Extract series
        series_match = re.search(r'<p class="character-series">(.*?)</p>', content)
        series = series_match.group(1) if series_match else "Unknown"
        
        # Create a basic fact check comment
        fact_check = f"""CHARACTER FACT CHECK INFORMATION
============================

Name: {name}
Series: {series}

NOTE: No detailed fact check information found for this character.
This is an auto-generated placeholder.
"""
        
        return {
            'character_id': Path(html_file).stem,
            'fact_check': fact_check,
            'is_placeholder': True
        }
    except Exception as e:
        print(f"Error extracting basic info from {html_file}: {e}")
    
    return None

def extract_description_from_fact_check(fact_check):
    """Extract description from fact check comment"""
    description = ""
    
    # Try to extract description section
    description_match = re.search(r'DESCRIPTION:\s*(.+?)(?:\n\n|\n[A-Z]+:|\nLast Updated:)', fact_check, re.DOTALL)
    if description_match:
        description = description_match.group(1).strip()
    
    return description

def format_fact_check_for_output(fact_check_data):
    """Format fact check data for output"""
    character_id = fact_check_data['character_id']
    fact_check = fact_check_data['fact_check']
    
    # Clean up the comment format
    cleaned_comment = fact_check.replace('<!--', '', 1).replace('-->', '', 1).strip()
    
    # Extract name and series
    name_match = re.search(r'Name:\s*(.+?)(?:\n|$)', cleaned_comment)
    series_match = re.search(r'Series:\s*(.+?)(?:\n|$)', cleaned_comment)
    
    name = name_match.group(1).strip() if name_match else character_id
    series = series_match.group(1).strip() if series_match else "Unknown"
    
    # Extract description
    description = extract_description_from_fact_check(cleaned_comment)
    
    # Format the output
    output = f"## {character_id}\n\n"
    output += f"**{name}** — {series}\n\n"
    
    if description:
        output += f"{description}\n\n"
    else:
        output += "No detailed description available.\n\n"
    
    output += "---\n\n"
    
    return output

def main():
    """Main function"""
    print("Extracting fact check comments...")
    
    # Get all HTML and JSON files
    html_files = get_character_html_files()
    json_files = get_character_json_files()
    
    print(f"Found {len(html_files)} character HTML files")
    print(f"Found {len(json_files)} character JSON files")
    
    output_content = "# Character Fact Check Information\n"
    output_content += f"# Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    
    extracted_count = 0
    placeholder_count = 0
    missing_count = 0
    processed_characters = set()
    
    # First pass: try to extract fact check comments
    for html_file in html_files:
        character_id = Path(html_file).stem
        
        # Skip if we've already processed this character
        if character_id in processed_characters:
            continue
        
        # Try to extract fact check comments
        result = None
        if USE_BS4:
            result = extract_fact_check_comments_bs4(html_file)
        else:
            result = extract_fact_check_comments_regex(html_file)
        
        if result:
            output_content += format_fact_check_for_output(result)
            
            extracted_count += 1
            processed_characters.add(character_id)
        else:
            # If no fact check comment found, try to extract basic info
            basic_info = extract_character_info_from_html(html_file)
            if basic_info:
                output_content += format_fact_check_for_output(basic_info)
                
                placeholder_count += 1
                processed_characters.add(character_id)
            else:
                missing_count += 1
    
    # Second pass: check for characters in JSON files that weren't processed
    for json_file in json_files:
        character_id = Path(json_file).stem
        
        if character_id not in processed_characters:
            output_content += f"## {character_id}\n\n"
            output_content += f"**{character_id}** — Unknown Series\n\n"
            output_content += "This character has a JSON file but no HTML file or fact check information.\n\n"
            output_content += "---\n\n"
            
            placeholder_count += 1
            processed_characters.add(character_id)
    
    # Add summary
    output_content += "# Summary\n"
    output_content += f"- Total character HTML files: {len(html_files)}\n"
    output_content += f"- Total character JSON files: {len(json_files)}\n"
    output_content += f"- Total unique characters processed: {len(processed_characters)}\n"
    output_content += f"- Characters with fact check comments: {extracted_count}\n"
    output_content += f"- Characters with placeholder info: {placeholder_count}\n"
    output_content += f"- Characters missing fact check comments: {missing_count}\n"
    
    # Write to output file
    output_path = HTML_DIR / OUTPUT_FILE
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output_content)
    
    print(f"Processed {len(processed_characters)} unique characters:")
    print(f"- {extracted_count} with fact check comments")
    print(f"- {placeholder_count} with placeholder information")
    print(f"- {missing_count} missing information")
    print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    start_time = time.time()
    main()
    print(f"Execution time: {time.time() - start_time:.2f} seconds")