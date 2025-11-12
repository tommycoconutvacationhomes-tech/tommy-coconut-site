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
  await page.goto(`file://${filePath}`, { waitUntil: 'domcontentloaded' });

  // Wait a bit for styles to load
  await page.waitForTimeout(2000);

  // Scroll to the team section
  await page.evaluate(() => {
    const teamSection = document.querySelector('.team-section-wrapper');
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(1000);

  // Take screenshot of the team section
  const teamSection = await page.locator('.team-section-wrapper');
  if (await teamSection.count() > 0) {
    await teamSection.screenshot({
      path: 'team-section-after.png'
    });
    console.log('Screenshot saved: team-section-after.png');
  }

  // Keep browser open for 30 seconds to review
  console.log('Browser will stay open for 30 seconds...');
  await page.waitForTimeout(30000);

  await browser.close();
})();
