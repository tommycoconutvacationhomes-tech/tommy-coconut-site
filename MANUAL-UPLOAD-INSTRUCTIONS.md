# Manual Logo Update Upload Instructions

## What You Have

✅ **File:** `logo-update-files.zip` (284KB)
✅ **Contains:** 35 HTML files with updated Tommy Coconut logo
✅ **Change:** Old logo ID → New logo ID across entire site

---

## Option 1: GitHub Web Upload (Easiest - 5 minutes)

### Step 1: Go to GitHub
1. Open: https://github.com/tommycoconutvacationhomes-tech/tommy-coconut-site
2. Make sure you're logged in

### Step 2: Upload Files
1. Click the **"Add file"** button (top right)
2. Select **"Upload files"**
3. Drag and drop `logo-update-files.zip` OR click "choose your files" and select it
4. GitHub will automatically extract and show all 35 files

### Step 3: Commit
1. Scroll to bottom of page
2. In "Commit message" box, paste:
   ```
   🎨 Replace Tommy Coconut logo with new Cloudinary asset
   ```
3. Select **"Commit directly to the main branch"**
4. Click **"Commit changes"** button

### Step 4: Wait for Deployment
1. Go to: https://app.netlify.com (your Netlify dashboard)
2. Look for new deployment (starts automatically within seconds)
3. Wait 1-3 minutes for "Published" status
4. Done! ✅

---

## Option 2: GitHub Desktop (If you have it installed)

### Step 1: Open GitHub Desktop
1. Launch GitHub Desktop application
2. Select tommy-coconut-site repository

### Step 2: Review Changes
1. You should see 1 commit ready to push (logo update)
2. Commit message shows: "🎨 Replace Tommy Coconut logo..."

### Step 3: Push
1. Click **"Push origin"** button at top
2. Wait for push to complete
3. Check Netlify for auto-deployment

---

## Option 3: Extract & Upload Individual Files (If zip upload fails)

### Step 1: Extract Zip
1. Double-click `logo-update-files.zip`
2. You'll see a folder with 35 HTML files

### Step 2: Upload One by One
For **each file**:
1. Go to file on GitHub (e.g., https://github.com/tommycoconutvacationhomes-tech/tommy-coconut-site/blob/main/index.html)
2. Click **pencil icon** (Edit this file)
3. Delete all content
4. Open the file from extracted folder
5. Copy all content
6. Paste into GitHub editor
7. Click **"Commit changes"**
8. Repeat for all 35 files

*Note: This is tedious but guaranteed to work*

---

## Verification After Upload

### Check 1: GitHub
1. Go to: https://github.com/tommycoconutvacationhomes-tech/tommy-coconut-site
2. Click on any file (e.g., index.html)
3. Press Cmd+F (Mac) or Ctrl+F (Windows)
4. Search for: `tommy-coconut-logo_lbj0xu`
5. Should find it ✅ (if you see `_ubfctu` instead, upload didn't work)

### Check 2: Netlify Deployment
1. Visit: https://app.netlify.com
2. Click on your site
3. Look for "Production deploys" section
4. Latest deploy should show within 3 minutes
5. Status should be "Published" ✅

### Check 3: Live Website
1. Visit: https://tommycoconutvacations.com
2. **Hard refresh:** Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Right-click on logo → Inspect
4. Image source should show: `tommy-coconut-logo_lbj0xu` ✅
5. New logo appears! 🎉

---

## Troubleshooting

**Problem:** GitHub upload says "Nothing changed"
- **Solution:** You might have already uploaded it. Check if logo is already updated on live site.

**Problem:** Netlify doesn't deploy automatically
- **Solution:** Go to Netlify → Deploys → Click "Trigger deploy" → "Deploy site"

**Problem:** New logo still doesn't show after 5 minutes
- **Solution:**
  1. Clear browser cache completely
  2. Try incognito/private window
  3. Check on mobile device
  4. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

**Problem:** Upload fails with "too large" error
- **Solution:** Use Option 3 (extract and upload individually)

---

## What Changed in These Files

**Simple find-and-replace across all 35 files:**

❌ **OLD:** `tommy-coconut-logo_ubfctu`
✅ **NEW:** `tommy-coconut-logo_lbj0xu`

Plus added width optimization: `w_240` for faster loading

**That's it!** No other changes. Just a logo asset ID swap.

---

## Files Included in logo-update-files.zip

1. about.html
2. best-beaches-curacao.html
3. blog.html
4. clan.html
5. contact.html
6. day-in-the-life.html
7. experiences.html
8. family-stories.html
9. faq.html
10. guide.html
11. index.html
12. meet-boy.html
13. meet-britt.html
14. meet-captain-mike.html
15. meet-charles-josie.html
16. meet-jerimiah.html
17. meet-juan-carlos.html
18. meet-kim.html
19. meet-ray.html
20. meet-raymonde.html
21. meet-tcam.html
22. meet-the-fisherman.html
23. ownership.html
24. rentals.html
25. reviews.html
26. thank-you.html
27. the-art-of-perfect-arrival.html
28. treasure-map.html
29. villa-bayside-hill.html
30. villa-happy-hideaway-2.html
31. villa-happy-hideaway-v2.html
32. villa-happy-hideaway.html
33. villa-sailaway-beach.html
34. villa-sunshine-bay.html
35. where-locals-eat-curacao.html

---

## Need Help?

If you get stuck, the files are safely stored in:
- `logo-update-files.zip` (backup copy)
- Local git commit 1780b25 (can always try git push again later)

The changes are simple and safe - just logo URL updates. Nothing can break!

**Good luck! 🥥**
