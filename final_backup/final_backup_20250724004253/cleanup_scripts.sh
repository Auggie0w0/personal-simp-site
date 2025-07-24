#!/bin/bash

# This script removes unnecessary shell scripts that are no longer needed

echo "Cleaning up unnecessary shell scripts..."

# List of scripts to remove (keep only essential ones)
SCRIPTS_TO_REMOVE=(
  "add_disclaimer.sh"
  "add_disclaimer_to_all.sh"
  "check_footer.sh"
  "cleanup_gallery_files.sh"
  "final_fix_footers.sh"
  "fix_all_footers.sh"
  "fix_footer.sh"
  "remove_review_section.sh"
  "update_all_footers.sh"
  "update_character_facts.sh"
  "update_character_pages.sh"
  "update_character_utils.sh"
  "update_footer.sh"
  "update_footer_with_disclaimer.sh"
  "update_gallery_system.sh"
)

# Remove each script
for script in "${SCRIPTS_TO_REMOVE[@]}"; do
  if [ -f "$script" ]; then
    echo "Removing $script..."
    rm "$script"
  else
    echo "File $script not found, skipping."
  fi
done

echo "Done cleaning up unnecessary shell scripts!" 