const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('📋 LODGIFY WIDGET INVESTIGATION REPORT');
  console.log('=' .repeat(60));
  console.log('');

  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });

  // Collect network requests
  const networkRequests = [];
  page.on('request', request => {
    if (request.url().includes('lodgify') || request.url().includes('book-now')) {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    }
  });

  // Collect network responses
  const networkResponses = [];
  page.on('response', response => {
    if (response.url().includes('lodgify') || response.url().includes('book-now')) {
      networkResponses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  // Navigate to the page
  console.log('🌐 Navigating to: https://tommycoconutvacations.com/test.html');
  try {
    await page.goto('https://tommycoconutvacations.com/test.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('✅ Page loaded successfully\n');
  } catch (error) {
    console.log('❌ Error loading page:', error.message, '\n');
  }

  // Wait a bit more for deferred scripts
  console.log('⏳ Waiting 5 seconds for deferred scripts to load...');
  await page.waitForTimeout(5000);
  console.log('');

  // Take initial screenshot
  console.log('📸 Taking full page screenshot...');
  await page.screenshot({
    path: '/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/lodgify-widget-fullpage.png',
    fullPage: true
  });
  console.log('✅ Saved: lodgify-widget-fullpage.png\n');

  // Check if the Lodgify div exists
  console.log('🔍 DOM INSPECTION');
  console.log('-'.repeat(60));

  const lodgifyDiv = await page.$('#lodgify-book-now-box');
  if (lodgifyDiv) {
    console.log('✅ Lodgify div #lodgify-book-now-box EXISTS');

    // Get the div's HTML content
    const innerHTML = await page.$eval('#lodgify-book-now-box', el => el.innerHTML);
    console.log('📄 Div inner HTML length:', innerHTML.length, 'characters');
    console.log('📄 Div content preview:', innerHTML.substring(0, 200) + (innerHTML.length > 200 ? '...' : ''));

    // Get the div's dimensions and visibility
    const boundingBox = await lodgifyDiv.boundingBox();
    if (boundingBox) {
      console.log('📐 Div dimensions:', boundingBox);
      if (boundingBox.height > 0) {
        console.log('👁️  Div is visible on page');

        // Take a screenshot of just the widget area
        try {
          await lodgifyDiv.screenshot({
            path: '/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/lodgify-widget-area.png'
          });
          console.log('✅ Saved: lodgify-widget-area.png');
        } catch (e) {
          console.log('⚠️  Could not screenshot widget area:', e.message);
        }
      } else {
        console.log('⚠️  Div has zero height (empty or collapsed)');
      }
    } else {
      console.log('⚠️  Div has no bounding box (may be empty or hidden)');
    }

    // Check for any child elements
    const childCount = await page.$eval('#lodgify-book-now-box', el => el.children.length);
    console.log('👶 Number of child elements:', childCount);

    if (childCount > 0) {
      const childTags = await page.$eval('#lodgify-book-now-box', el =>
        Array.from(el.children).map(child => child.tagName).join(', ')
      );
      console.log('🏷️  Child element tags:', childTags);
    }
  } else {
    console.log('❌ Lodgify div #lodgify-book-now-box NOT FOUND');
  }
  console.log('');

  // Check if Lodgify script is loaded
  console.log('📜 SCRIPT LOADING CHECK');
  console.log('-'.repeat(60));

  const lodgifyScriptExists = await page.$('script[src*="lodgify"]');
  if (lodgifyScriptExists) {
    const scriptSrc = await page.$eval('script[src*="lodgify"]', el => el.src);
    console.log('✅ Lodgify script tag found:', scriptSrc);

    // Check if the script has loaded
    const scriptLoaded = await page.evaluate(() => {
      return typeof window.renderBookNowBox !== 'undefined' ||
             typeof window.Lodgify !== 'undefined';
    });
    console.log('🔧 Lodgify functions available:', scriptLoaded);
  } else {
    console.log('❌ Lodgify script tag NOT FOUND');
  }
  console.log('');

  // Check network requests
  console.log('🌐 NETWORK REQUESTS (Lodgify-related)');
  console.log('-'.repeat(60));
  if (networkRequests.length > 0) {
    networkRequests.forEach((req, i) => {
      console.log(`${i + 1}. [${req.method}] ${req.resourceType}`);
      console.log(`   ${req.url}`);
    });
  } else {
    console.log('⚠️  No Lodgify-related network requests detected');
  }
  console.log('');

  // Check network responses
  console.log('📥 NETWORK RESPONSES (Lodgify-related)');
  console.log('-'.repeat(60));
  if (networkResponses.length > 0) {
    networkResponses.forEach((res, i) => {
      console.log(`${i + 1}. [${res.status} ${res.statusText}]`);
      console.log(`   ${res.url}`);
    });
  } else {
    console.log('⚠️  No Lodgify-related network responses detected');
  }
  console.log('');

  // Check console messages
  console.log('💬 CONSOLE MESSAGES');
  console.log('-'.repeat(60));
  if (consoleMessages.length > 0) {
    const errors = consoleMessages.filter(m => m.type === 'error');
    const warnings = consoleMessages.filter(m => m.type === 'warning');
    const others = consoleMessages.filter(m => m.type !== 'error' && m.type !== 'warning');

    if (errors.length > 0) {
      console.log('❌ ERRORS:');
      errors.forEach((msg, i) => {
        console.log(`   ${i + 1}. ${msg.text}`);
      });
    }

    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      warnings.forEach((msg, i) => {
        console.log(`   ${i + 1}. ${msg.text}`);
      });
    }

    if (others.length > 0) {
      console.log('ℹ️  OTHER MESSAGES:');
      others.slice(0, 10).forEach((msg, i) => {
        console.log(`   ${i + 1}. [${msg.type}] ${msg.text}`);
      });
      if (others.length > 10) {
        console.log(`   ... and ${others.length - 10} more messages`);
      }
    }
  } else {
    console.log('✅ No console messages');
  }
  console.log('');

  // Check page title and basic info
  console.log('📄 PAGE INFO');
  console.log('-'.repeat(60));
  const title = await page.title();
  const url = page.url();
  console.log('Title:', title);
  console.log('URL:', url);
  console.log('');

  // Try to find any iframes (Lodgify might inject an iframe)
  console.log('🖼️  IFRAME CHECK');
  console.log('-'.repeat(60));
  const iframes = await page.$$('iframe');
  console.log('Number of iframes on page:', iframes.length);
  if (iframes.length > 0) {
    for (let i = 0; i < iframes.length; i++) {
      const iframeSrc = await iframes[i].getAttribute('src');
      const iframeId = await iframes[i].getAttribute('id');
      const iframeClass = await iframes[i].getAttribute('class');
      console.log(`  Iframe ${i + 1}:`);
      console.log(`    - ID: ${iframeId || 'none'}`);
      console.log(`    - Class: ${iframeClass || 'none'}`);
      console.log(`    - Src: ${iframeSrc || 'none'}`);
    }
  }
  console.log('');

  console.log('=' .repeat(60));
  console.log('✅ Investigation complete! Check the screenshots above.');
  console.log('=' .repeat(60));

  await browser.close();
})();
