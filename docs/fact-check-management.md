# Character Fact Check Management

This document explains how to manage character fact check information in your site.

## Overview

Character fact check comments are hidden HTML comments embedded in character pages that contain accurate information about each character for reference. These comments help maintain consistency and accuracy across the site.

## Fact Check Workflow

The site now includes a comprehensive fact check management system:

1. **Add** fact check comments to character pages
2. **Update** fact check information with accurate details
3. **Extract** fact checks to a single text file for review
4. **Verify** character information against fact checks

## Adding Fact Check Comments

To add initial fact check comments to character pages:

```bash
./site-maintenance.sh comments
```

This adds basic fact check comments to all character pages based on the information in the HTML.

## Updating Fact Check Information

When you have more accurate character information:

```bash
./site-maintenance.sh update-facts
```

This updates all character pages with the latest fact check information defined in `tools/update-fact-checks.js`.

To add new character fact checks or modify existing ones, edit the `characterFactChecks` object in `tools/update-fact-checks.js`.

## Extracting Fact Checks for Review

To extract all fact check comments into a single text file:

```bash
./site-maintenance.sh extract
```

This creates a file called `character-fact-checks.txt` in the root directory containing all fact check information in a readable format.

## Fact Check Format

Each fact check comment follows this format:

```
<!--
CHARACTER FACT CHECK INFORMATION
============================

Name: Character Name
Series: Series Name

DESCRIPTION:
Concise, accurate description of the character with source references when possible.

Last Updated: 2023-08-28T17:16:57.123Z
This comment is for fact checking only and is not visible on the website.
-->
```

## Modifying the Fact Check System

The fact check system consists of three main scripts:

1. **tools/add-character-comments.js** - Adds initial fact check comments
2. **tools/update-fact-checks.js** - Updates fact check information with accurate details
3. **tools/extract-fact-checks.py** - Extracts fact checks to a text file

You can modify these scripts to add additional fields or change the format of fact checks as needed.

## Best Practices

1. **Keep descriptions concise** - Focus on key facts and canonical information
2. **Include source references** - When possible, include references to official sources
3. **Update regularly** - Whenever new information becomes available
4. **Verify against official sources** - Use official websites, publications, or widely recognized references
5. **Extract and review** - Periodically extract and review all fact checks for consistency

## Troubleshooting

If you encounter issues with fact check management:

1. **Missing fact checks** - Run `./site-maintenance.sh comments` to add missing fact check comments
2. **Outdated information** - Update the character data in `tools/update-fact-checks.js` and run `./site-maintenance.sh update-facts`
3. **Extraction issues** - Check if BeautifulSoup is installed for Python (`pip install beautifulsoup4`) for better extraction
