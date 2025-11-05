# Tommy Coconut Property Pages - Quick Reference Guide

## All Properties at a Glance

| Property Name | File | Lodgify ID | Status |
|--------------|------|------------|--------|
| Happy Hideaway | villa-happy-hideaway.html | 355309 | Complete (Template) |
| Villa Palm Breeze | villa-palm-breeze.html | 268945 | Ready for Images |
| Villa Bayside Hill | villa-bayside-hill.html | 269574 | Ready for Images |
| Castaway Beach | castaway-beach.html | 269575 | Ready for Images |
| Sailaway Beach | sailaway-beach.html | 269577 | Ready for Images |
| Villa Dushi Hideaway | villa-dushi-hideaway.html | 324227 | Ready for Images |
| Tropical Haven | tropical-haven.html | 360710 | Ready for Images |
| Sunshine Bay | sunshine-bay.html | 518559 | Ready for Images |

---

## What Changed Per Property

For each property page, these replacements were made:

### 1. Property Name
- **Before:** "Happy Hideaway"
- **After:** [Property Name] (e.g., "Villa Palm Breeze")
- **Locations:** Title tag, H1, meta description, all headings, image alt tags, analytics labels

### 2. Lodgify Rental ID
- **Before:** `data-rental-id="355309"`
- **After:** `data-rental-id="[Property ID]"` (e.g., "268945")
- **Location:** Lodgify widget configuration

### 3. Image References
- **Before:** `happy-hideaway-1_hx9jke`
- **After:** `[property-slug]-1_hx9jke` (e.g., `villa-palm-breeze-1_hx9jke`)
- **Locations:** All Cloudinary image URLs (hero, thumbnails, category images)

---

## What Stayed The Same

These elements remain consistent across all properties:

1. Tommy Coconut Design System (colors, fonts, spacing)
2. Lodgify configuration (website ID, slug, language, currency)
3. Private Resort Package content
4. Trust badges and social proof
5. FAQ structure
6. Navigation and footer
7. Inline booking widget (no new tab)
8. Conversion funnel flow

---

## Next Steps for Each Property

### Step 1: Upload Property Images to Cloudinary
Required images per property (use property slug as prefix):

```
[property-slug]-1.jpg    (Hero image - main exterior/pool shot)
[property-slug]-2.jpg    (Gallery thumbnail 2)
[property-slug]-3.jpg    (Gallery thumbnail 3)
[property-slug]-4.jpg    (Gallery thumbnail 4)
[property-slug]-5.jpg    (Gallery thumbnail 5)
[property-slug]-6.jpg    (Gallery thumbnail 6)
[property-slug]-7.jpg    (Gallery thumbnail 7)
[property-slug]-8.jpg    (Gallery thumbnail 8)
[property-slug]-9.jpg    (Gallery thumbnail 9)
[property-slug]-outdoor.jpg  (Outdoor living category)
[property-slug]-indoor.jpg   (Indoor living category)
[property-slug]-bedroom.jpg  (Bedroom category)
[property-slug]-location.jpg (Location/map)
```

### Step 2: Update Property Details
Edit the following sections in each HTML file:

**Quick Stats (lines ~1090-1120):**
- Number of bedrooms
- Number of bathrooms
- Number of guests
- Pool size/type
- Key amenities

**Villa Title (line ~1143):**
- Already updated with property name

**Star Rating (lines ~1148-1155):**
- Update rating number (currently 5.0)
- Update review count (currently 28)

**Location Section (lines ~1560-1590):**
- Update distance to beaches
- Update neighborhood name
- Update nearby attractions
- Update map image

### Step 3: Test Lodgify Widget
1. Open property page in browser
2. Scroll to booking section
3. Select dates and guests
4. Verify pricing displays correctly
5. Confirm "Book Now" button works

### Step 4: Customize Content (Optional)
If properties have unique features:
- Update villa narrative section
- Modify Private Resort Package if different
- Add property-specific amenities
- Update FAQ answers if needed

---

## Image Naming Convention

All images follow Cloudinary pattern:
```
https://res.cloudinary.com/dhschyq40/image/upload/f_auto,q_auto,w_[WIDTH]/[SLUG]-[NUMBER]_[ID]
```

**Example for Villa Palm Breeze:**
```
https://res.cloudinary.com/dhschyq40/image/upload/f_auto,q_auto,w_1920/villa-palm-breeze-1_hx9jke
```

**Width parameters:**
- Hero images: w_1920
- Thumbnails: w_150
- Category images: w_800 (or original size)

**Note:** The `_[ID]` suffix (e.g., `_hx9jke`) comes from Cloudinary after upload. You'll need to update these after uploading property-specific images.

---

## Lodgify Widget Verification

Each property page should have this configuration:

```html
<div id="lodgify-book-now-box"
    data-rental-id="[PROPERTY_ID]"        <!-- Unique per property -->
    data-website-id="271939"               <!-- Same for all -->
    data-slug="tommycoconut"               <!-- Same for all -->
    data-language-code="en"                <!-- Same for all -->
    data-currency-code="USD"               <!-- Same for all -->
    data-version="stable"                  <!-- Same for all -->
    ...
    style="display: none;">                <!-- Required for inline widget -->
</div>
```

**Critical:** NO `data-new-tab="true"` attribute anywhere in the widget configuration.

---

## Testing Checklist

For each property page:

- [ ] Property name appears correctly in title tag
- [ ] Property name appears in H1 heading
- [ ] Lodgify rental ID is correct
- [ ] All images load (or show placeholder until real images uploaded)
- [ ] Booking widget displays when scrolling down
- [ ] "Check Availability" button scrolls to widget
- [ ] Widget shows correct property pricing
- [ ] Mobile responsive design works
- [ ] Navigation links work
- [ ] Footer links work

---

## File Paths

All files located in:
```
/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/
```

**Property Files:**
- villa-palm-breeze.html
- villa-bayside-hill.html
- castaway-beach.html
- sailaway-beach.html
- villa-dushi-hideaway.html
- tropical-haven.html
- sunshine-bay.html

**Supporting Files:**
- assets/css/main.css
- assets/css/components.css
- assets/css/design-system.css
- cloudinary-config.js

---

## Common Tasks

### Update Property Title
**Line ~6:** Change title tag
**Line ~7:** Update meta description
**Line ~1143:** Update H1 heading

### Update Lodgify ID
**Line ~1657:** Change `data-rental-id="[ID]"`

### Update Images
**Lines ~1052-1080:** Update all Cloudinary URLs with correct property slug and IDs

### Update Property Details
**Lines ~1090-1120:** Edit specs (beds, baths, guests, amenities)

---

## Support Commands

### Verify Lodgify IDs
```bash
grep "data-rental-id" *.html | grep -E "(villa-|castaway|sailaway|tropical|sunshine)"
```

### Check Property Names in Titles
```bash
grep "<title>" *.html | grep -E "(Villa|Castaway|Sailaway|Tropical|Sunshine)"
```

### Find Image References
```bash
grep "cloudinary.com" villa-palm-breeze.html | head -5
```

---

## Quick Updates Script

To update a property's details, use this pattern:

```bash
# 1. Update property name
sed -i '' 's/Villa Palm Breeze/New Property Name/g' property-file.html

# 2. Update Lodgify ID
sed -i '' 's/data-rental-id="268945"/data-rental-id="123456"/g' property-file.html

# 3. Update image slug
sed -i '' 's/villa-palm-breeze/new-property-slug/g' property-file.html
```

---

## Design System Reference

### Colors
- Primary: #62D0C9 (Tommy Coconut teal)
- Secondary: #005A5B (Navy light)
- Accent: #00CFCF (Bright teal)
- Driftwood Sand: #F5E6D3 (Warm neutral)

### Typography
- Font Family: Montserrat
- Hero: clamp(3.2rem, 6vw, 4.5rem)
- H1: clamp(2.5rem, 5vw, 3.5rem)
- H2: clamp(2rem, 4vw, 2.5rem)
- Body XL: clamp(1.15rem, 2.2vw, 1.375rem)

### Spacing
- xs: 0.25rem
- sm: 0.5rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem
- 2xl: 3rem
- 3xl: 4rem

---

## Troubleshooting

### Widget Not Appearing
1. Check Lodgify script is loaded (bottom of HTML)
2. Verify `data-rental-id` is correct
3. Check browser console for errors
4. Ensure no `data-new-tab="true"` attribute

### Images Not Loading
1. Verify Cloudinary URLs are correct
2. Check image IDs match uploaded files
3. Test image URLs directly in browser
4. Confirm f_auto,q_auto parameters are present

### Property Name Wrong
1. Search and replace in HTML file
2. Update title tag, meta description, H1
3. Update all alt tags for images
4. Update analytics event labels

### Pricing Not Showing
1. Verify Lodgify property is active
2. Check dates are available for booking
3. Ensure minimum stay requirements are met
4. Test with different date ranges

---

## Contact Information

For implementation questions:
- Design System: Reference design-system.css
- Lodgify API: docs.lodgify.com
- Cloudinary: cloudinary.com/documentation
- Tommy Coconut Brand: Follow villa-happy-hideaway.html template

---

**Last Updated:** November 5, 2025
**Template Version:** Happy Hideaway v2.0 (Optimized Booking Funnel)
**Total Properties:** 8 (including template)
