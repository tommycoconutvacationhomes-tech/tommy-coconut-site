#!/bin/bash

# TOMMY COCONUT - SITE-WIDE ENHANCEMENT SCRIPT
# Applies villa-quality improvements to all major pages

echo "🥥 Starting Tommy Coconut Site-Wide Enhancement..."

# List of pages to enhance
pages=(
    "clan.html"
    "blog.html"
    "contact.html"
    "faq.html"
    "treasure-map.html"
    "villa-bayside-hill.html"
    "villa-castaway-beach.html"
    "villa-dushi-hideaway.html"
    "villa-happy-hideaway.html"
    "villa-palm-breeze.html"
    "villa-sailaway-beach.html"
    "villa-sunshine-bay.html"
    "villa-tropical-haven.html"
)

# Function to add enhancements to a page
enhance_page() {
    local page=$1
    echo "🏖️  Enhancing $page..."

    # Backup original
    cp "$page" "${page}.backup"

    # Add cache busting and enhanced meta tags after charset
    sed -i '' '/<meta charset="UTF-8">/a\
    <!-- CACHE BUST VERSION: 2025-09-30-UX-ENHANCEMENT -->
    ' "$page"

    # Add performance optimizations after viewport
    sed -i '' '/<meta name="viewport"/a\
    <!-- Performance Optimizations -->\
    <link rel="preconnect" href="https://fonts.googleapis.com">\
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">\
    <link rel="dns-prefetch" href="https://www.googletagmanager.com">
    ' "$page"

    echo "✅ Enhanced $page"
}

# Enhance each page
for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        enhance_page "$page"
    else
        echo "⚠️  $page not found, skipping..."
    fi
done

echo "🚀 Tommy Coconut Site-Wide Enhancement Complete!"
echo "📊 Enhanced ${#pages[@]} pages with villa-quality improvements"