# Tommy Coconut Website Standardization Guide

## Overview
This guide documents the required changes to standardize CSS/JS architecture and design consistency across all pages.

## Current Issues Identified

### 1. CSS Architecture Inconsistency
**Homepage (index.html)**: Uses `styles.css`
**Other pages**: Mixed architectures:
- contact.html, rentals.html, about.html: Use `styles/globals.css`, `styles/components.css`, `styles/pages.css`
- blog.html: Uses old `styles.css`
- ownership.html, experiences.html: Hybrid approach with both old and new CSS

### 2. Logo Height Inconsistency  
- **Homepage**: 56px height
- **Other pages**: 73px height

### 3. JavaScript References
- Pages reference individual JS files instead of consolidated `assets/js/main.js`

## Required Changes for Each HTML File

### CSS References - Update to:
```html
<link rel="stylesheet" href="assets/css/main.css">
<link rel="stylesheet" href="assets/css/components.css">
<!-- Only for treasure-map.html: -->
<link rel="stylesheet" href="assets/css/treasure-map.css">
```

**Replace these old references:**
- `<link rel="stylesheet" href="styles.css">`
- `<link rel="stylesheet" href="styles/globals.css">`
- `<link rel="stylesheet" href="styles/components.css">`
- `<link rel="stylesheet" href="styles/pages.css">`
- `<link rel="stylesheet" href="/css/safe-mode.css">`
- Individual page CSS files (ownership.css, experiences.css, etc.)

### Logo Height - Standardize to:
```html
<img src="images/icons/tommy-coconut-logo.png" alt="Tommy Coconut Logo" style="height: 56px; width: auto; display: block;">
```

**Change from:**
```html
<img src="images/icons/tommy-coconut-logo.png" alt="Tommy Coconut Logo" style="height: 73px; width: auto; display: block;">
```

### JavaScript References - Update to:
```html
<script src="assets/js/main.js"></script>
<script src="analytics.js"></script>
<!-- Keep page-specific JS if needed (contact.js, etc.) -->
```

**Replace:**
- `<script src="script.js"></script>`

## Files Requiring Updates

### Priority 1: Core Pages
1. **blog.html**
   - Update CSS: `styles.css` → consolidated assets
   - Fix logo height: 73px → 56px  
   - Update JS: `script.js` → `assets/js/main.js`

2. **contact.html**
   - Update CSS: Remove `styles/` references, use consolidated assets
   - Fix logo height: 73px → 56px
   - Update JS: `script.js` → `assets/js/main.js`

3. **ownership.html**
   - Update CSS: Remove hybrid references, use consolidated assets
   - Fix logo height: 73px → 56px
   - Update JS: Remove individual files, use consolidated

4. **experiences.html**
   - Update CSS: Remove hybrid references, use consolidated assets  
   - Fix logo height: 73px → 56px
   - Update JS: Remove individual files, use consolidated

### Priority 2: Other Pages
Check and update if needed:
- rentals.html
- about.html
- cartel.html
- faq.html
- treasure-map.html (keep treasure-map.css)

## Files to Remove After Standardization

### Legacy CSS Files:
- `styles.css`
- `styles/globals.css`
- `styles/components.css`
- `styles/pages.css`
- `/css/safe-mode.css`
- Individual page CSS files:
  - `ownership.css`
  - `experiences.css`
  - Any other page-specific CSS

### Legacy JS Files:
- Individual page JS files that duplicate functionality now in `assets/js/main.js`

## Expected Results

After standardization:
- ✅ Consistent visual design across all pages
- ✅ Unified CSS architecture (3 files instead of 8+)
- ✅ Consistent 56px logo height everywhere
- ✅ Consolidated JavaScript functionality
- ✅ Better performance (fewer HTTP requests)
- ✅ Easier maintenance

## Verification Steps

1. **Visual Check**: All pages should have consistent navigation height and logo size
2. **CSS Loading**: Verify all pages load styles correctly from assets/css/
3. **JavaScript Functionality**: Test interactive elements work on all pages
4. **Mobile Responsiveness**: Check all pages respond consistently
5. **Performance**: Confirm reduced number of CSS/JS file requests

## Notes
- Keep analytics.js on all pages for tracking
- Keep page-specific JS only if it provides unique functionality not in main.js
- treasure-map.html should keep its specific CSS for funnel functionality
- Test thoroughly after each change to ensure no functionality is broken