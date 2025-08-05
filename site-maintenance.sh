#!/bin/bash

# Main site maintenance script
# This script provides a wrapper for the tools/site-maintenance.sh script
# and ensures it's executed from the correct directory

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the script directory to ensure proper path resolution
cd "$SCRIPT_DIR"

# Execute the main maintenance script in the tools directory
if [ -f "tools/site-maintenance.sh" ]; then
    cd tools && ./site-maintenance.sh "$@"
else
    echo "❌ Error: tools/site-maintenance.sh not found!"
    echo "Please ensure the tools directory and site-maintenance.sh script exist."
    exit 1
fi
