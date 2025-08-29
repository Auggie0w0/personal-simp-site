# Fact Check Extraction Tool

This document explains how to use the fact check extraction tool to help maintain character information accuracy.

## Overview

The fact check extraction tool pulls out all the character fact check comments from HTML files and compiles them into a single text file for easy review. This helps ensure character information is accurate and consistent across the site.

## Usage

### Using the Site Maintenance Script

The easiest way to extract fact check comments is through the site maintenance script:

```bash
./site-maintenance.sh extract
```

This will:
1. Extract all fact check comments from character HTML files
2. Compile them into a single text file (`character-fact-checks.txt`)
3. Add a summary of extracted comments

### Direct Script Usage

You can also run the extraction scripts directly:

#### Python Script

```bash
python3 tools/extract-fact-checks.py
```

#### Node.js Script

```bash
node tools/extract-fact-checks.js
```

#### Bash Script

```bash
bash tools/extract-fact-checks.sh
```

## Output Format

The output file (`character-fact-checks.txt`) contains:

1. A header with generation timestamp
2. Sections for each character with their fact check information
3. A summary section with statistics

Example:

```
# Character Fact Check Information
# Generated on 2023-06-15 14:30:45

## mackenyu

CHARACTER FACT CHECK INFORMATION
============================

Name: Mackenyu Arata
Series: Actor

STATS:
Age: 26
Birthday: November 16, 1996
Role: Actor

DESCRIPTION:
[Character description...]

...

## Summary
- Total character files: 19
- Characters with fact check comments: 19
- Characters missing fact check comments: 0
```

## Troubleshooting

If you encounter issues:

1. Make sure character HTML files contain fact check comments (added via `./site-maintenance.sh comments`)
2. Check that the extraction scripts have executable permissions (`chmod +x tools/extract-fact-checks.*`)
3. Ensure dependencies are installed (Python's BeautifulSoup or Node's cheerio for better parsing)

## Integration with Workflow

For best results, integrate fact checking into your workflow:

1. Add fact check comments to all character pages: `./site-maintenance.sh comments`
2. Extract and review fact check information: `./site-maintenance.sh extract`
3. Update character JSON files as needed
4. Regenerate character pages: `./site-maintenance.sh generate`
