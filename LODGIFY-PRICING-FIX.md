# Lodgify Pricing API Error - Diagnostic & Fix Report

## Issue Summary
**Problem**: Lodgify booking calendar displays correctly, but pricing API returns 400 and 403 errors when users select dates.

**Error Messages**:
1. `Failed to load resource: the server responded with a status of 400 () (price, line 0)`
2. `Failed to load resource: the server responded with a status of 403 () (renderBookNowBox.js.map, line 0)`

**Date**: 2025-11-05
**File**: villa-happy-hideaway.html
**Configuration**: netlify.toml

---

## Root Cause Analysis

### Primary Issues Identified:

1. **CSP Configuration - Incomplete Lodgify Domain Coverage**
   - **Problem**: Content Security Policy was only allowing specific Lodgify subdomains (app.lodgify.com, api.lodgify.com, checkout.lodgify.com, websiteserver.lodgify.com)
   - **Impact**: Lodgify's widget may use additional subdomains for pricing API calls that weren't explicitly whitelisted
   - **Evidence**: 400 error on "price" endpoint and 403 on source map suggest blocked API calls

2. **Widget Configuration - Conflicting Data Attributes**
   - **Problem**: Widget had `data-slug="tommycoconut"` alongside `data-rental-id="355309"`
   - **Impact**: The slug parameter can cause API confusion when a specific rental-id is provided
   - **Evidence**: 400 Bad Request errors typically indicate parameter validation issues

3. **Widget Configuration - Unsupported Attribute**
   - **Problem**: `data-has-guests-breakdown` attribute may not be supported in current Lodgify widget version
   - **Impact**: Unknown attributes can cause widget initialization or API call failures

---

## Fixes Implemented

### Fix 1: Updated CSP to Allow All Lodgify Subdomains

**File**: `/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/netlify.toml`

**Changes**:
- **script-src**: Changed from `https://app.lodgify.com` to `https://*.lodgify.com`
- **connect-src**: Changed from individual subdomains to `https://*.lodgify.com`

**Before**:
```toml
script-src 'self' 'unsafe-inline' ... https://app.lodgify.com;
connect-src 'self' ... https://app.lodgify.com https://api.lodgify.com https://checkout.lodgify.com https://websiteserver.lodgify.com;
```

**After**:
```toml
script-src 'self' 'unsafe-inline' ... https://*.lodgify.com;
connect-src 'self' ... https://*.lodgify.com;
```

**Rationale**:
- Lodgify may use multiple subdomains for different API endpoints (pricing, availability, booking, etc.)
- Wildcard approach ensures all legitimate Lodgify API calls are permitted
- Still maintains security by restricting to lodgify.com domain only

---

### Fix 2: Simplified Widget Configuration

**File**: `/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/villa-happy-hideaway.html`

**Removed Parameters**:
1. `data-slug="tommycoconut"` - Conflicts with data-rental-id
2. `data-has-guests-breakdown` - May not be supported

**Before**:
```html
<div id="lodgify-book-now-box"
    data-rental-id="355309"
    data-website-id="271939"
    data-slug="tommycoconut"
    data-language-code="en"
    data-currency-code="USD"
    data-new-tab="true"
    data-version="stable"
    data-has-guests-breakdown
    data-book-button-label="Book Now"
    style="display: none;">
</div>
```

**After**:
```html
<div id="lodgify-book-now-box"
    data-rental-id="355309"
    data-website-id="271939"
    data-language-code="en"
    data-currency-code="USD"
    data-new-tab="true"
    data-version="stable"
    data-book-button-label="Book Now"
    style="display: none;">
</div>
```

**Rationale**:
- **data-slug removal**: When using data-rental-id (for single property), slug can cause API parameter conflicts
- **data-has-guests-breakdown removal**: Reduces potential compatibility issues with widget version
- **Keeps essential parameters**: rental-id, website-id, language, currency, version, button label

---

## Testing & Verification

### Expected Behavior After Fix:
1. Calendar should load and display correctly (already working)
2. Users should be able to select check-in and check-out dates
3. Pricing should load without 400 errors
4. No CSP violation errors in browser console
5. "Book Now" button should function properly

### Testing Steps:
1. Deploy updated files to Netlify
2. Clear browser cache and reload villa-happy-hideaway.html
3. Open browser DevTools Console
4. Select dates in the booking widget
5. Verify pricing loads without errors
6. Check Console for any CSP violations or 400/403 errors

### Debugging Commands:
```bash
# Check for CSP violations in browser console
# Look for messages like: "Refused to connect to '...' because it violates the following Content Security Policy directive"

# Check network tab for failed requests
# Filter by: Status = 400 or 403
# Look at: Request URL, Headers, Response
```

---

## Additional Recommendations

### 1. Monitor Lodgify API Calls
Once deployed, monitor the Network tab to see exactly which Lodgify endpoints are being called:
- Check if any additional domains outside *.lodgify.com are needed
- Verify API response codes (should be 200 OK)

### 2. Verify Lodgify Account Configuration
Ensure in your Lodgify dashboard:
- Property ID 355309 is active and published
- Website ID 271939 is correctly configured
- Pricing is set for the property
- API access is enabled (if required)

### 3. Test Edge Cases
- Select dates far in the future
- Select dates during high season
- Test minimum/maximum stay requirements
- Verify multi-day pricing calculations

### 4. Consider Adding Error Handling
Add JavaScript to detect and report widget loading failures:
```javascript
// Add to villa-happy-hideaway.html if needed
window.addEventListener('load', function() {
    setTimeout(function() {
        const widget = document.getElementById('lodgify-book-now-box');
        if (!widget || widget.children.length === 0) {
            console.error('Lodgify widget failed to load');
            // Optional: Show fallback booking link
        }
    }, 3000);
});
```

---

## Files Modified

1. **netlify.toml**
   - Line 26: Updated script-src to use wildcard for Lodgify
   - Line 31: Updated connect-src to use wildcard for Lodgify
   - Impact: Allows all Lodgify subdomain API calls

2. **villa-happy-hideaway.html**
   - Lines 1656-1666: Simplified Lodgify widget configuration
   - Removed: data-slug, data-has-guests-breakdown
   - Impact: Cleaner widget configuration, reduced API parameter conflicts

---

## Success Metrics

- No 400 errors when selecting dates
- No 403 errors on widget resources
- Pricing displays correctly for selected date ranges
- No CSP violations in browser console
- Smooth booking flow from date selection to "Book Now" click

---

## Rollback Plan

If issues persist, rollback options:

1. **Revert CSP to specific domains** (if wildcard causes issues):
```toml
connect-src 'self' ... https://app.lodgify.com https://api.lodgify.com https://checkout.lodgify.com https://websiteserver.lodgify.com https://pricing.lodgify.com;
```

2. **Contact Lodgify Support**:
   - Provide rental-id: 355309
   - Provide website-id: 271939
   - Ask for correct widget configuration for embedded booking with pricing

3. **Alternative: Use Lodgify's Direct Embed Code**:
   - Log into Lodgify dashboard
   - Navigate to Website > Widgets > Book Now Box
   - Copy the auto-generated embed code
   - Replace current implementation

---

## Next Steps

1. Deploy changes to Netlify
2. Test booking widget functionality
3. Monitor for any new errors
4. If issues persist, check Lodgify dashboard for property configuration
5. Consider reaching out to Lodgify support with this diagnostic report

---

## Contact & Support

**Lodgify Support**: support@lodgify.com
**Property ID**: 355309
**Website ID**: 271939
**Implementation**: Tommy Coconut - Happy Hideaway

---

**Report Generated**: 2025-11-05
**Status**: Fixes Implemented - Awaiting Deployment & Testing
