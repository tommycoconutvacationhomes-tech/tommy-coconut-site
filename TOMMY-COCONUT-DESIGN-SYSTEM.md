# Tommy Coconut Design System
## For Lodgify Web Builder Integration

---

## 🎨 BRAND COLOR PALETTE

### Primary Colors
```css
Primary Teal:     #62D0C9  (rgb(98, 208, 201))
Navy:             #005A5B  (rgb(0, 90, 91))
White:            #FFFFFF  (rgb(255, 255, 255))
```

### Accent Colors
```css
Gold (Stars):     #FFD700  (rgb(255, 215, 0))
WhatsApp Green:   #25D366  (rgb(37, 211, 102))
Success:          #25D366
Warning:          #FFA500
Danger:           #FF4444
```

### Neutral Colors
```css
Charcoal (Text):  #333333  (rgb(51, 51, 51))
Medium Gray:      #666666  (rgb(102, 102, 102))
Light Gray:       #999999  (rgb(153, 153, 153))
Off-White:        #F8FFFE  (rgb(248, 255, 254))
```

### Color Usage Guidelines
- **Headlines:** #005A5B (Navy) or #008080 (Teal)
- **Body Text:** #333333 (Charcoal)
- **Buttons:** #62D0C9 (Primary Teal)
- **Dark Backgrounds:** #005A5B with white text
- **Light Backgrounds:** #F8FFFE or #FFFFFF

---

## 📝 TYPOGRAPHY SYSTEM

### Font Family
```
Primary: 'Montserrat', sans-serif
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif
```

### Google Fonts CDN Link
```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Font Weights
```css
Light:       300
Regular:     400
Medium:      500
SemiBold:    600
Bold:        700
ExtraBold:   800
```

### Type Scale
```css
Hero Title:       48px - 72px (responsive: clamp(48px, 6vw, 72px))
H1:               36px - 56px (responsive: clamp(36px, 5vw, 56px))
H2:               28px - 42px (responsive: clamp(28px, 4vw, 42px))
H3:               24px - 32px (responsive: clamp(24px, 3vw, 32px))
Large Body:       18px - 20px
Body:             16px
Small:            14px
Extra Small:      12px
```

### Line Height
```css
Headings:         1.1 - 1.3
Body Text:        1.6 - 1.7
Tight:            1.2
Loose:            1.8
```

### Letter Spacing
```css
Headings:         -0.02em (tight)
Body:             0.01em (slight)
Buttons:          0.025em (loose)
Labels:           0.5px - 1px (uppercase)
```

---

## 📏 SPACING SYSTEM

### Spacing Scale
```css
xs:      4px    (0.25rem)
sm:      8px    (0.5rem)
md:      16px   (1rem)
lg:      24px   (1.5rem)
xl:      32px   (2rem)
2xl:     48px   (3rem)
3xl:     64px   (4rem)
4xl:     96px   (6rem)
```

### Section Padding
```css
Desktop:     80px - 100px top/bottom, 20px sides
Tablet:      60px - 80px top/bottom, 20px sides
Mobile:      40px - 60px top/bottom, 20px sides
```

### Component Spacing
```css
Card Padding:        30px - 40px
Button Padding:      14px - 18px vertical, 28px - 40px horizontal
Form Field Padding:  14px - 16px
```

---

## 🔲 BORDER RADIUS

### Radius Scale
```css
sm:      8px
md:      12px
lg:      16px
xl:      20px
2xl:     24px
pill:    50px (buttons, badges)
full:    9999px (circles)
```

### Usage
```css
Cards:       20px - 24px
Buttons:     50px (pill shape)
Images:      12px - 20px
Badges:      50px (pill shape)
Modals:      20px - 24px
```

---

## 🎭 SHADOWS

### Shadow Scale
```css
sm:   0 2px 4px rgba(0, 0, 0, 0.05)
md:   0 4px 8px rgba(0, 0, 0, 0.1)
lg:   0 8px 16px rgba(0, 0, 0, 0.15)
xl:   0 16px 32px rgba(0, 0, 0, 0.2)
2xl:  0 24px 48px rgba(0, 0, 0, 0.25)
```

### Special Shadows
```css
Teal Glow:       0 0 40px rgba(98, 208, 201, 0.3)
Button Shadow:   0 8px 32px rgba(98, 208, 201, 0.3)
Card Hover:      0 15px 50px rgba(0, 0, 0, 0.15)
```

---

## 🔘 BUTTON STYLES

### Primary Button
```html
<a href="#" style="display: inline-block; font-family: 'Montserrat', sans-serif; background: #62D0C9; color: white; padding: 18px 36px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 8px 32px rgba(98, 208, 201, 0.3); transition: all 0.3s ease;">
    Button Text
</a>
```

### Secondary Button (White)
```html
<a href="#" style="display: inline-block; font-family: 'Montserrat', sans-serif; background: white; color: #005A5B; padding: 18px 36px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
    Button Text
</a>
```

### WhatsApp Button
```html
<a href="https://wa.me/59996707977" style="display: inline-flex; align-items: center; gap: 10px; font-family: 'Montserrat', sans-serif; background: #25D366; color: white; padding: 14px 24px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 15px;">
    💬 Chat With Us
</a>
```

### Button Sizes
```css
Small:       padding: 10px 20px; font-size: 14px
Medium:      padding: 14px 28px; font-size: 16px
Large:       padding: 18px 36px; font-size: 18px
Extra Large: padding: 20px 40px; font-size: 20px
```

---

## 🖼️ IMAGE SPECIFICATIONS

### Cloudinary Base URL
```
https://res.cloudinary.com/dhschyq40/image/upload/
```

### Standard Transformations
```
f_auto          - Automatic format selection
q_auto          - Automatic quality
w_800           - Width 800px
h_600           - Height 600px
c_fill          - Crop to fill dimensions
```

### Key Image URLs

#### Logo
```
https://res.cloudinary.com/dhschyq40/image/upload/f_auto,q_auto,w_240/tommy-coconut-logo_lbj0xu
```

#### Villa Images
```
Bayside Hill:    tommy-coconut/villas/bayside-hill-hero
Happy Hideaway:  Happy_Hideaway_Final-18_zkh25v
Sailaway Beach:  Sailaway_Beach_Final-96_l4xlce
Sunshine Bay:    Sunshine-Bay-3-of-46_wqvazq
```

#### Hero Video
```
https://res.cloudinary.com/dhschyq40/video/upload/f_auto,q_auto/video-output-2DF885B0-E272-4C20-A5A5-BFF4B2FB300B_e1zkdo
```

### Responsive Image Sizes
```css
Mobile:      600px width
Tablet:      900px width
Desktop:     1200px width
Full Width:  1600px width
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
Mobile:         max-width: 480px
Tablet:         max-width: 768px
Desktop:        max-width: 1024px
Large Desktop:  max-width: 1200px
Extra Large:    1400px+
```

### Mobile-First Approach
```css
Base styles:              Mobile (320px+)
Tablet adjustments:       @media (min-width: 768px)
Desktop adjustments:      @media (min-width: 1024px)
Large desktop:            @media (min-width: 1200px)
```

---

## 🎯 COMMON COMPONENTS

### Card Component
```html
<div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease;">
    <img src="IMAGE_URL" style="width: 100%; height: 250px; object-fit: cover;">
    <div style="padding: 30px;">
        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 24px; font-weight: 700; color: #005A5B; margin: 0 0 15px 0;">Title</h3>
        <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; color: #666; line-height: 1.6;">Description text</p>
    </div>
</div>
```

### Section Container
```html
<div style="background: #FFFFFF; padding: 80px 20px;">
    <div style="max-width: 1200px; margin: 0 auto;">
        <!-- Content here -->
    </div>
</div>
```

### Gradient Background
```css
background: linear-gradient(135deg, #005A5B 0%, #62D0C9 100%);
background: linear-gradient(135deg, #F8FFFE 0%, #FFFFFF 100%);
background: linear-gradient(135deg, #FAFAF8 0%, #FFFFFF 100%);
```

---

## ⚡ ANIMATION & TRANSITIONS

### Standard Transitions
```css
Fast:        150ms ease
Normal:      300ms ease
Slow:        500ms ease
```

### Hover Effects
```css
Lift:        transform: translateY(-4px);
Scale:       transform: scale(1.05);
Shadow:      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
```

### Common Animations
```css
/* Fade In */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Slide In */
@keyframes slideIn {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
}
```

---

## 📊 GRID LAYOUTS

### Standard Grid
```html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px;">
    <!-- Grid items -->
</div>
```

### 2-Column Layout
```html
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
    <!-- Two columns -->
</div>
```

### 3-Column Layout
```html
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;">
    <!-- Three columns -->
</div>
```

### Responsive Grid
```html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
    <!-- Auto-responsive -->
</div>
```

---

## 🔍 ACCESSIBILITY

### Focus States
```css
outline: 3px solid #62D0C9;
outline-offset: 2px;
```

### Text Contrast
```
Navy on White:       AAA ✓
Teal on White:       AA ✓
White on Navy:       AAA ✓
White on Teal:       AA ✓
Charcoal on White:   AAA ✓
```

### Alt Text Guidelines
- Logo: "Tommy Coconut - Arrive as Guests, Leave as Family"
- Villa images: "Villa [Name] - [Key feature]"
- Icons: Descriptive text or aria-label

---

## 📞 CONTACT INFORMATION

```
Phone:         +5999 670 7977
WhatsApp:      +5999 670 7977
Email:         info@tommycoconut.com
Address:       Kaya Karamele 18, Curaçao

WhatsApp URL:  https://wa.me/59996707977
Phone URL:     tel:+59996707977
```

---

## 🔗 SOCIAL MEDIA

```
Instagram:     https://www.instagram.com/tommy.coconut/
Facebook:      https://www.facebook.com/TommyCoconut
YouTube:       https://www.youtube.com/channel/UCGPTXBR5jtvCUchgkIpz7MQ
TikTok:        https://bitly.ws/39WZF
```

---

## 💡 BRAND MESSAGING

### Tagline
```
"Arrive as Guests, Leave as Family"
```

### Key Value Props
- Premium all-inclusive villa experience
- Vehicle included with every rental
- Sunset boat trips included
- Personal concierge service
- Local expertise and curation
- Coconut Clan community membership

### Tone of Voice
- Warm and welcoming
- Professional yet personal
- Experience-focused
- Family-oriented
- Authentic Caribbean hospitality

---

## 🎯 CONVERSION ELEMENTS

### Primary CTAs
```
"Find My Perfect Villa"
"Book Your Dream Vacation"
"Join the Coconut Clan"
"Start Your Journey"
```

### Secondary CTAs
```
"View All Villas"
"Call Family Direct"
"Chat With Us"
"Read Our Story"
```

### Trust Signals
```
1,347+ Happy Guests
4.99★ Average Rating
648 Five-Star Reviews
98% Would Recommend
```

---

## 📦 COMPONENT CHECKLIST

When creating new components, ensure:

- [ ] Uses Montserrat font family
- [ ] Colors match brand palette exactly
- [ ] Includes inline CSS (no external stylesheets)
- [ ] Mobile-responsive (uses media queries or flexible units)
- [ ] Uses Cloudinary for all images
- [ ] Proper alt text on images
- [ ] Accessible contrast ratios
- [ ] Hover states on interactive elements
- [ ] Consistent spacing (using spacing scale)
- [ ] Border radius matches design system
- [ ] Box shadows match shadow scale

---

## 🚀 LODGIFY INTEGRATION TIPS

1. **Always test on mobile first** - Lodgify users are 60% mobile
2. **Use max-width containers** - Prevents content from stretching too wide
3. **Inline all CSS** - Lodgify may strip external stylesheets
4. **Test in Lodgify preview** - Styles may behave differently
5. **Keep components modular** - Easier to update individual sections
6. **Use relative units** - Better for responsive design
7. **Avoid JavaScript dependencies** - May not execute in Lodgify
8. **Optimize images** - Use Cloudinary transformations
9. **Test cross-browser** - Ensure compatibility
10. **Maintain brand consistency** - Follow design system strictly

---

**Document Version:** 1.0
**Last Updated:** 2025-10-06
**Maintained By:** Tommy Coconut Design Team
**For Questions:** Contact via WhatsApp +5999 670 7977
