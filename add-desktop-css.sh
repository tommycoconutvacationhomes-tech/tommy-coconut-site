#!/bin/bash

# Add desktop-enhancements.css to all HTML files
for file in *.html; do
    if [ -f "$file" ]; then
        echo "Processing $file..."

        # Check if desktop-enhancements.css is already included
        if grep -q "desktop-enhancements.css" "$file"; then
            echo "  - Already has desktop-enhancements.css, skipping"
        else
            # Add the desktop CSS link right after tommy-coconut-bundle.css
            sed -i '' '/<link rel="stylesheet" href="assets\/css\/tommy-coconut-bundle.css">/a\
    <link rel="stylesheet" href="assets/css/desktop-enhancements.css">
' "$file"
            echo "  - Added desktop-enhancements.css"
        fi
    fi
done

echo "Done! Desktop CSS added to all HTML files."