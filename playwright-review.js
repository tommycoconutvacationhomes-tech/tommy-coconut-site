const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Load the index.html file
  const filePath = path.join(__dirname, 'index.html');
  await page.goto(`file://${filePath}`);

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Scroll to the "Meet the Family" section
  await page.evaluate(() => {
    const familySection = document.querySelector('#team, [id*="family"], h2:has-text("Meet the Family")');
    if (familySection) {
      familySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(1000);

  // Take full page screenshot
  await page.screenshot({
    path: 'meet-family-before-fullpage.png',
    fullPage: true
  });

  // Take screenshot of just the family section
  const familySection = await page.locator('section:has-text("Meet the Family")').first();
  if (await familySection.count() > 0) {
    await familySection.screenshot({
      path: 'meet-family-before-section.png'
    });
  }

  console.log('Screenshots saved:');
  console.log('- meet-family-before-fullpage.png');
  console.log('- meet-family-before-section.png');

  // Keep browser open for review
  console.log('\nBrowser will stay open for review. Press Ctrl+C to close.');

  // Wait indefinitely
  await new Promise(() => {});
})();
