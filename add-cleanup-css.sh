#!/bin/bash

# Add inline-style-cleanup.css to all HTML files
for file in *.html; do
    if [ -f "$file" ]; then
        echo "Processing $file..."

        # Check if inline-style-cleanup.css is already included
        if grep -q "inline-style-cleanup.css" "$file"; then
            echo "  - Already has inline-style-cleanup.css, skipping"
        else
            # Add the cleanup CSS link right after desktop-enhancements.css
            sed -i '' '/<link rel="stylesheet" href="assets\/css\/desktop-enhancements.css">/a\
    <link rel="stylesheet" href="assets/css/inline-style-cleanup.css">
' "$file"
            echo "  - Added inline-style-cleanup.css"
        fi
    fi
done

echo "Done! Cleanup CSS added to all HTML files."