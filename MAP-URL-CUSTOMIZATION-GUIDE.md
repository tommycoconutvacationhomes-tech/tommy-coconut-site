# Google Maps Static API URL - Complete Breakdown

## THE COMPLETE MAP URL

```
https://maps.googleapis.com/maps/api/staticmap?
center=12.0924,-68.8796&
zoom=12&
size=1000x400&
scale=2&
maptype=roadmap&
style=feature:water|color:0x62D0C9&
style=feature:landscape|color:0xF7F5F2&
style=feature:road|visibility:simplified|color:0xFFFFFF&
style=feature:poi|visibility:off&
style=feature:administrative|visibility:off&
style=feature:transit|visibility:off&
markers=color:0x62D0C9|label:H|12.0924,-68.8796&
markers=color:0x005A5B|label:1|12.0856,-68.8701&
markers=color:0x005A5B|label:2|12.1139,-68.9324&
markers=color:0x005A5B|label:3|12.0774,-68.8954&
key=YOUR_API_KEY_HERE
```

---

## PARAMETER BREAKDOWN

### Basic Map Parameters

| Parameter | Value | Purpose | How to Change |
|-----------|-------|---------|---------------|
| `center` | `12.0924,-68.8796` | Center of map (Happy Hideaway) | Use exact property coordinates |
| `zoom` | `12` | Zoom level (1-20) | Lower = wider area, Higher = closer view |
| `size` | `1000x400` | Image dimensions (pixels) | Max 640x640 (free), 2048x2048 (paid) |
| `scale` | `2` | Retina display support | 1 = standard, 2 = high-res (double pixels) |
| `maptype` | `roadmap` | Map type | roadmap, satellite, hybrid, terrain |

### Tommy Coconut Custom Styling

| Feature | Color | Effect |
|---------|-------|--------|
| `water` | `0x62D0C9` | Teal water (primary brand color) |
| `landscape` | `0xF7F5F2` | Off-white land (surface color) |
| `road` | `0xFFFFFF` | White simplified roads |
| `poi` | visibility:off | Hide points of interest |
| `administrative` | visibility:off | Hide borders/boundaries |
| `transit` | visibility:off | Hide transit lines |

**To change water color:**
```
style=feature:water|color:0xNEWCOLOR
```

Example for darker teal:
```
style=feature:water|color:0x3DACA5
```

### Markers

**Format:**
```
markers=color:0xHEXCODE|label:X|LATITUDE,LONGITUDE
```

**Current Markers:**

1. **Happy Hideaway (H) - Teal**
   ```
   markers=color:0x62D0C9|label:H|12.0924,-68.8796
   ```

2. **Jan Thiel Beach (1) - Navy**
   ```
   markers=color:0x005A5B|label:1|12.0856,-68.8701
   ```

3. **Willemstad (2) - Navy**
   ```
   markers=color:0x005A5B|label:2|12.1139,-68.9324
   ```

4. **Caracasbaai (3) - Navy**
   ```
   markers=color:0x005A5B|label:3|12.0774,-68.8954
   ```

**To add new marker (e.g., Airport):**
```
&markers=color:0x005A5B|label:4|12.1889,-68.9601
```

---

## COMMON CUSTOMIZATIONS

### Change Zoom Level

**Current:** `zoom=12` (shows Jan Thiel area + Willemstad)

**Show more island:**
```
zoom=11
```

**Closer to property:**
```
zoom=13
```

**Very close (neighborhood only):**
```
zoom=14
```

### Change Map Dimensions

**Desktop-optimized (current):**
```
size=1000x400
```

**Square map:**
```
size=600x600
```

**Wider panoramic:**
```
size=1200x300
```

**Note:** Free tier max is 640x640. With billing enabled: 2048x2048 max.

### Change Map Type

**Current:** `maptype=roadmap`

**Satellite view:**
```
maptype=satellite
```

**Hybrid (satellite + roads):**
```
maptype=hybrid
```

**Topographic:**
```
maptype=terrain
```

### Add More Markers

**Format for each location:**
```
&markers=color:0xHEXCODE|label:LETTER|LATITUDE,LONGITUDE
```

**Example - Add 3 more destinations:**

```
&markers=color:0x005A5B|label:4|12.1889,-68.9601
&markers=color:0x005A5B|label:5|12.3728,-69.0267
&markers=color:0x005A5B|label:6|12.0449,-68.8858
```

Then update the legend in HTML to match.

### Custom Marker Sizes

**Default (current):** Medium size

**Small markers:**
```
markers=size:small|color:0x62D0C9|label:H|12.0924,-68.8796
```

**Large markers:**
```
markers=size:large|color:0x62D0C9|label:H|12.0924,-68.8796
```

**Tiny markers (no label):**
```
markers=size:tiny|color:0x62D0C9|12.0924,-68.8796
```

---

## FINDING COORDINATES

### Method 1: Google Maps (Easiest)

1. Go to https://maps.google.com
2. Right-click on location
3. Click the coordinates that appear (e.g., "12.0924, -68.8796")
4. Coordinates are copied to clipboard

### Method 2: URL from Google Maps

1. Go to location on Google Maps
2. Look at URL: `@12.0924,-68.8796,15z`
3. Numbers after `@` are coordinates

### Method 3: Drop Pin

1. Drop pin on Google Maps
2. Click pin
3. Coordinates show in info panel

---

## TOMMY COCONUT COLOR CODES

Use these exact colors for brand consistency:

| Color Name | Hex (CSS) | Hex (Maps URL) | Usage |
|------------|-----------|----------------|-------|
| Primary Teal | `#62D0C9` | `0x62D0C9` | Property marker, water |
| Secondary Navy | `#005A5B` | `0x005A5B` | Destination markers |
| Surface | `#F7F5F2` | `0xF7F5F2` | Landscape/land |
| White | `#FFFFFF` | `0xFFFFFF` | Roads |
| Sand | `#F5E6D3` | `0xF5E6D3` | Alt landscape (warmer) |

**Important:** Maps API uses `0x` prefix, CSS uses `#` prefix.

---

## ADVANCED STYLING

### Custom Road Colors

**Highways (orange accent):**
```
&style=feature:road.highway|color:0xFFA500|weight:3
```

**Local roads (light gray):**
```
&style=feature:road.local|color:0xEEEEEE|weight:1
```

### Adjust Land/Water Contrast

**Higher contrast (darker land):**
```
&style=feature:landscape|color:0xE8E3D8
```

**Lower contrast (lighter water):**
```
&style=feature:water|color:0x8DDDD7
```

### Show Only Specific POIs

**Show restaurants only:**
```
&style=feature:poi|visibility:off
&style=feature:poi.business|element:labels|visibility:on
```

### Add Text Labels

**Emphasize city names:**
```
&style=feature:administrative.locality|element:labels|visibility:on|weight:bold
```

---

## TESTING YOUR CHANGES

### Quick Test Process

1. **Copy full URL** from above
2. **Make your change** (e.g., change zoom to 13)
3. **Paste URL in browser** address bar
4. **Press Enter** - map loads instantly
5. **Looks good?** Add to HTML
6. **Needs tweaking?** Adjust and repeat

### Example Test Workflow

**Original:**
```
https://maps.googleapis.com/maps/api/staticmap?center=12.0924,-68.8796&zoom=12&size=1000x400&...
```

**Test zoom 13:**
```
https://maps.googleapis.com/maps/api/staticmap?center=12.0924,-68.8796&zoom=13&size=1000x400&...
```

**Test satellite view:**
```
https://maps.googleapis.com/maps/api/staticmap?center=12.0924,-68.8796&zoom=12&size=1000x400&maptype=satellite&...
```

---

## TROUBLESHOOTING

### Map Shows But Colors Wrong

**Problem:** Markers are Google's default red/blue
**Fix:** Check color format uses `0x` not `#`

```
❌ color:#62D0C9
✅ color:0x62D0C9
```

### Map Not Loading

**Problem:** Blank space where map should be
**Check:**
1. API key correct? (no spaces, complete)
2. Maps Static API enabled in Google Cloud?
3. Billing set up? (required even for free tier)
4. URL structure intact? (no broken `&` symbols)

### Map Looks Weird on Mobile

**Problem:** Map too tall/wide on phone
**Fix:** Add responsive CSS

```css
@media (max-width: 768px) {
    section img[alt*="location map"] {
        height: 250px;
        object-fit: cover;
    }
}
```

### Markers Cut Off at Edge

**Problem:** Markers at map edges are partially hidden
**Fix:** Reduce zoom slightly or adjust center

```
From: zoom=13
To:   zoom=12
```

---

## API KEY SECURITY

### Restrict by Domain (Recommended)

In Google Cloud Console:
1. Edit API key
2. Application restrictions → "HTTP referrers"
3. Add:
   - `*.tommycoconut.com/*`
   - `localhost:*` (for testing)

### Restrict by API

1. API restrictions → "Restrict key"
2. Select only: "Maps Static API"

### Monitor Usage

1. Google Cloud Console → Maps
2. Dashboard → Usage metrics
3. Set up alerts for unusual spikes

---

## COST CALCULATOR

**Free Tier:** 28,000 map loads/month = $0

**Typical Usage:**
- 1,000 page views/month = $0
- 10,000 page views/month = $0
- 50,000 page views/month = ~$44/month

**Formula:**
```
Cost = (loads - 28000) × $0.002
```

**Example:**
```
50,000 loads:
= (50,000 - 28,000) × $0.002
= 22,000 × $0.002
= $44
```

---

## REFERENCE

**Official Docs:**
- Static Maps API: https://developers.google.com/maps/documentation/maps-static
- Styling Guide: https://developers.google.com/maps/documentation/maps-static/styling
- Markers: https://developers.google.com/maps/documentation/maps-static/start#Markers

**Tommy Coconut Files:**
- Implementation: `LOCATION-MAP-IMPLEMENTATION.html`
- Quick guide: `QUICK-MAP-IMPLEMENTATION.md`
- Full guide: `MAP-IMPLEMENTATION-GUIDE.md`

---

**Created:** 2025-11-07
**Version:** 1.0
**Status:** Ready for Customization
