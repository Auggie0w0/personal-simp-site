#!/usr/bin/env python3

"""
Extract Fact Check Comments

This script extracts the fact check comments from all character HTML files
and saves them to a single text file for easy review.
"""

import os
import re
import sys
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
                      'reviews.html', 'abouts.html']
    
    html_files = []
    for file in os.listdir(HTML_DIR):
        if file.endswith('.html') and file not in excluded_files:
            html_files.append(file)
    
    return html_files

def extract_fact_check_comments_bs4(html_file):
    """Extract fact check comments using BeautifulSoup"""
    file_path = HTML_DIR / html_file
    
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
    
    return None

def extract_fact_check_comments_regex(html_file):
    """Extract fact check comments using regex"""
    file_path = HTML_DIR / html_file
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    comment_regex = r'<!--\s*CHARACTER FACT CHECK INFORMATION[\s\S]*?-->'
    matches = re.findall(comment_regex, content)
    
    if matches:
        return {
            'character_id': Path(html_file).stem,
            'fact_check': matches[0]
        }
    
    return None

def main():
    """Main function"""
    print("Extracting fact check comments...")
    
    html_files = get_character_html_files()
    print(f"Found {len(html_files)} character HTML files")
    
    output_content = "# Character Fact Check Information\n"
    output_content += f"# Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    
    extracted_count = 0
    
    for html_file in html_files:
        if USE_BS4:
            result = extract_fact_check_comments_bs4(html_file)
        else:
            result = extract_fact_check_comments_regex(html_file)
        
        if result:
            output_content += f"## {result['character_id']}\n\n"
            
            # Clean up the comment format for better readability
            cleaned_comment = result['fact_check']
            cleaned_comment = cleaned_comment.replace('<!--', '', 1)
            cleaned_comment = cleaned_comment.replace('-->', '', 1)
            cleaned_comment = cleaned_comment.strip()
            
            output_content += f"{cleaned_comment}\n\n"
            output_content += "---\n\n"
            
            extracted_count += 1
    
    # Add summary
    output_content += "# Summary\n"
    output_content += f"- Total character files: {len(html_files)}\n"
    output_content += f"- Characters with fact check comments: {extracted_count}\n"
    output_content += f"- Characters missing fact check comments: {len(html_files) - extracted_count}\n"
    
    # Write to output file
    output_path = HTML_DIR / OUTPUT_FILE
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output_content)
    
    print(f"Extracted {extracted_count} fact check comments")
    print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
