#!/usr/bin/env python3
"""
Script to update property pages with Happy Hideaway layout while preserving property-specific data.
"""

import re
from pathlib import Path

# Property-specific configuration - EXTRACTED FROM CURRENT FILES
PROPERTIES = {
    "castaway-beach": {
        "filename": "castaway-beach.html",
        "elfsight_id": "fa3f121a-ba12-405a-a304-6a9086984569",
        "lodgify_rental_id": "269575",
        "title": "Castaway Beach - Top 1% Waterfront Jewel | Tommy Coconut Private Resort",
        "meta_description": "Top 1% waterfront paradise with 4.98 stars from 50 reviews. Experience the best vacation ever with all-inclusive SUV, private boat adventures, welcome dinner, beach club access, and 24/7 concierge in Curaçao.",
        "display_name": "Castaway Beach",
        "tagline": "Top 1% Waterfront Jewel",
        "subtitle": "All-inclusive waterfront bliss with harbor views. Personal SUV + private boat adventures + welcome dinner + beach club access + 24/7 concierge. The Dushi Life awaits.",
        "rating": "4.98",
        "review_count": "50 reviews",
        "location": "Jan Thiel base",
        "description": 'Guests call this <strong style="font-weight: 600; color: var(--secondary);">"the best vacation experience ever"</strong> for good reason. Castaway Beach isn\'t about hidden costs or planning logistics—it\'s about waking up to waterfront views, exploring by private boat, and living stress-free hospitality designed by family. Everything\'s included. Nothing\'s complicated. <strong style="font-weight: 600; color: var(--secondary);">Just pure Dushi Life.</strong>',
        "image_prefix": "tommy-coconut/villas/castaway-beach",
    },
    "tropical-haven": {
        "filename": "tropical-haven.html",
        "elfsight_id": "9bccd1aa-45f4-430a-baf7-97bd4e951087",
        "lodgify_rental_id": "360710",
        "title": "Tropical Haven - Waterfront Resort Apartment | Tommy Coconut Private Resort",
        "meta_description": "Superhost waterfront apartment with 4.98 stars from 55 reviews. Resort-style living with water views, EV-SUV, two boat cruises, beach club access, private flamingo tour, and $150 dining credit in Spanish Water, Curaçao.",
        "display_name": "Tropical Haven",
        "tagline": "Waterfront Resort Living",
        "subtitle": "Superhost waterfront apartment with terrace views. EV-SUV + two boat cruises + beach club access + private flamingo tour + $150 dining credit. Resort amenities, apartment charm.",
        "rating": "4.98",
        "review_count": "55 reviews",
        "location": "Spanish Water",
        "description": 'Experience resort luxury with apartment intimacy at Spanish Water\'s finest location. Wake to <strong style="font-weight: 600; color: var(--secondary);">water views from your terrace</strong>, explore in your personal EV-SUV, cruise on two boat adventures, and enjoy reserved beach setups at Zanzibar, Papagayo, Zest, and Koko\'s. Plus, meet the flamingos on your private walking tour. <strong style="font-weight: 600; color: var(--secondary);">Curated experiences. Effortless relaxation.</strong>',
        "image_prefix": "tommy-coconut/villas/tropical-haven",
    },
    "sailaway-beach": {
        "filename": "sailaway-beach.html",
        "elfsight_id": "18444264-b77e-41be-b994-d451d16c9889",
        "lodgify_rental_id": "269577",
        "title": "Sailaway Beach - Beachfront Paradise | Tommy Coconut Private Resort",
        "meta_description": "Top 1% Airbnb beachfront paradise with 5.0 stars from 78 reviews. Your exclusive Private Resort with gentle waves at your doorstep, EV-SUV, private boat, and legendary island experiences in Curaçao.",
        "display_name": "Sailaway Beach",
        "tagline": "Exclusive Beachfront Paradise",
        "subtitle": "Wake up to gentle waves at your doorstep. Beachfront luxury + EV-SUV + private boat & captain + 24/7 concierge. The ultimate island escape.",
        "rating": "5.0",
        "review_count": "78 reviews",
        "location": "Beachfront Jan Thiel",
        "description": 'This isn\'t just beachfront—it\'s <strong style="font-weight: 600; color: var(--secondary);">your own private shore</strong>. Wake to gentle waves lapping at your doorstep, fall asleep to the rhythm of the Caribbean. Sailaway Beach is where water meets wonder, where every sunrise feels legendary, and where Curaçao\'s top 1% Airbnb status becomes your daily reality. <strong style="font-weight: 600; color: var(--secondary);">No planning. No stress. Just pure island bliss.</strong>',
        "image_prefix": "tommy-coconut/villas/sailaway-beach",
    },
    "sunshine-bay": {
        "filename": "sunshine-bay.html",
        "elfsight_id": "5da860eb-9cde-4276-8780-74c66db3d324",
        "lodgify_rental_id": "518559",
        "title": "Sunshine Bay - Top 1% Exclusive Waterfront Escape | Tommy Coconut",
        "meta_description": "Top 1% Airbnb with perfect 5.0 stars from 28 reviews. Exclusive Sunshine Bay waterfront with gentle waves at your doorstep. Live the legendary Dushi Island life with premium amenities and effortless luxury in Curaçao.",
        "display_name": "Sunshine Bay",
        "tagline": "Top 1% Waterfront Legend",
        "subtitle": "Perfect 5.0 rating. Exclusive Sunshine Bay location with gentle waves at your doorstep. Premium amenities that elevate good vacations to legendary status. Live the ultimate Dushi Island life.",
        "rating": "5.0",
        "review_count": "28 reviews",
        "location": "Sunshine Bay",
        "description": 'This is where <strong style="font-weight: 600; color: var(--secondary);">excellence meets exclusivity</strong>. Sunshine Bay\'s top 1% status isn\'t marketing—it\'s your daily reality. Wake to gentle Caribbean waves at your doorstep, live with amenities that transform vacations into legends. This isn\'t just travel; it\'s the <strong style="font-weight: 600; color: var(--secondary);">ultimate island escape</strong> crafted by a vacation-architect who knows what perfection feels like.',
        "image_prefix": "tommy-coconut/villas/sunshine-bay",
    },
}

def read_file(filepath):
    """Read a file and return its content."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Write content to a file."""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def update_property_page(template_content, property_key, property_data):
    """
    Update a property page by replacing Happy Hideaway data with property-specific data.
    """
    content = template_content

    # Update title
    content = re.sub(
        r'<title>.*?</title>',
        f'<title>{property_data["title"]}</title>',
        content
    )

    # Update meta description
    content = re.sub(
        r'<meta name="description" content=".*?">',
        f'<meta name="description" content="{property_data["meta_description"]}">',
        content
    )

    # Update Elfsight widget ID
    content = re.sub(
        r'class="elfsight-app-[a-f0-9-]+"',
        f'class="elfsight-app-{property_data["elfsight_id"]}"',
        content
    )

    # Update Lodgify rental ID
    content = re.sub(
        r'data-rental-id="\d+"',
        f'data-rental-id="{property_data["lodgify_rental_id"]}"',
        content
    )

    # Update Happy Hideaway image references to property-specific images
    # Replace happy-hideaway image URLs with property-specific ones
    content = re.sub(
        r'happy-hideaway-\d+_[a-z0-9]+',
        property_data["image_prefix"],
        content,
        flags=re.IGNORECASE
    )

    # Update property name in main title
    content = re.sub(
        r'<h1 class="villa-title"[^>]*>Happy Hideaway — Your Private Resort in Curaçao</h1>',
        f'<h1 class="villa-title" style="text-align: left; margin-bottom: var(--space-lg); font-weight: 600;">{property_data["display_name"]} — {property_data["tagline"]}</h1>',
        content
    )

    # Update subtitle
    content = re.sub(
        r'<p style="font-size: var\(--tc-font-body-xl\); margin-bottom: var\(--space-lg\); font-weight: 600; color: var\(--secondary\); text-align: left; line-height: 1\.6;">.*?</p>',
        f'<p style="font-size: var(--tc-font-body-xl); margin-bottom: var(--space-lg); font-weight: 600; color: var(--secondary); text-align: left; line-height: 1.6;">\n                    {property_data["subtitle"]}\n                </p>',
        content,
        count=1
    )

    # Update rating
    content = re.sub(
        r'<span style="font-weight: 700; color: var\(--primary\);">4\.99</span>',
        f'<span style="font-weight: 700; color: var(--primary);">{property_data["rating"]}</span>',
        content,
        count=1
    )

    # Update review count
    content = re.sub(
        r'<span style="color: var\(--text-secondary\);">from [^<]+</span>',
        f'<span style="color: var(--text-secondary);">from {property_data["review_count"]}</span>',
        content,
        count=1
    )

    # Update location
    content = re.sub(
        r'<span style="color: var\(--text-secondary\); font-weight: 600;">Jan Thiel base</span>',
        f'<span style="color: var(--text-secondary); font-weight: 600;">{property_data["location"]}</span>',
        content,
        count=1
    )

    # Update main description paragraph
    # Find the description paragraph that starts with "A great vacation"
    content = re.sub(
        r'<p style="font-size: var\(--tc-font-body-lg\); text-align: left; line-height: 1\.75; color: var\(--text-primary\);">[\s\S]*?A great vacation.*?</p>',
        f'<p style="font-size: var(--tc-font-body-lg); text-align: left; line-height: 1.75; color: var(--text-primary);">\n                    {property_data["description"]}\n                </p>',
        content,
        count=1
    )

    # Update "Stories from Happy Hideaway" to property-specific
    content = re.sub(
        r'Stories from Happy Hideaway',
        f'Stories from {property_data["display_name"]}',
        content
    )

    # Update alt text references to Happy Hideaway
    content = re.sub(
        r'alt="Happy Hideaway([^"]*)"',
        f'alt="{property_data["display_name"]}\\1"',
        content
    )

    # Update CSS media queries for property-specific images
    content = re.sub(
        r'div\[style\*="happy-hideaway-\d+_[a-z0-9]+"\]',
        f'div[style*="{property_data["image_prefix"]}"]',
        content
    )

    # Update specific image selectors in CSS
    content = re.sub(
        r'\.villa-story img\[src\*="happy-hideaway-\d+_[a-z0-9]+"\]',
        f'.villa-story img[src*="{property_data["image_prefix"]}"]',
        content
    )

    content = re.sub(
        r'section img\[src\*="happy-hideaway-\d+_[a-z0-9]+"\]',
        f'section img[src*="{property_data["image_prefix"]}"]',
        content
    )

    return content

def main():
    """Main function to update all property pages."""
    base_dir = Path(__file__).parent
    template_file = base_dir / "villa-happy-hideaway.html"

    print("Reading Happy Hideaway template...")
    template_content = read_file(template_file)

    for property_key, property_data in PROPERTIES.items():
        print(f"\nUpdating {property_data['display_name']}...")

        # Update the content
        updated_content = update_property_page(template_content, property_key, property_data)

        # Write the updated file
        output_file = base_dir / property_data["filename"]
        write_file(output_file, updated_content)

        print(f"  ✓ Updated {property_data['filename']}")
        print(f"    - Elfsight ID: {property_data['elfsight_id']}")
        print(f"    - Lodgify Rental ID: {property_data['lodgify_rental_id']}")
        print(f"    - Rating: {property_data['rating']}")

    print("\n✓ All property pages updated successfully!")
    print("\nNext steps:")
    print("  1. Review the updated files")
    print("  2. Test the booking widgets")
    print("  3. Verify reviews are loading correctly")
    print("  4. Commit changes to git")

if __name__ == "__main__":
    main()
