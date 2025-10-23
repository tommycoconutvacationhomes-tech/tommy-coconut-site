const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Collect network errors
  const networkErrors = [];
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure().errorText
    });
  });

  console.log('=== INSPECTING RENTALS PAGE ===\n');
  
  try {
    // Navigate to rentals page
    await page.goto('https://tommycoconutvacations.com/rentals.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait a bit for widgets to load
    await page.waitForTimeout(5000);

    // Take screenshot of the full page
    await page.screenshot({ 
      path: '/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/rentals-full-page.png',
      fullPage: true 
    });

    // Find Palm Breeze widget specifically
    const palmBreezeWidget = await page.locator('#lodgify_search_widget_268945').boundingBox();
    if (palmBreezeWidget) {
      console.log('Palm Breeze widget found at:', palmBreezeWidget);
      
      // Screenshot just the widget area
      await page.locator('#lodgify_search_widget_268945').screenshot({
        path: '/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/palm-breeze-widget.png'
      });
    } else {
      console.log('ERROR: Palm Breeze widget div not found!');
    }

    // Check widget content
    const widgetHTML = await page.locator('#lodgify_search_widget_268945').innerHTML().catch(() => 'NOT FOUND');
    console.log('\nPalm Breeze Widget HTML Content:');
    console.log(widgetHTML.substring(0, 500));
    console.log(widgetHTML.length > 500 ? '... (truncated)' : '');

    // Check if Lodgify script is loaded
    const lodgifyScripts = await page.locator('script[src*="lodgify"]').count();
    console.log(`\nLodgify scripts found: ${lodgifyScripts}`);

    // Check all widget divs on the page
    const allWidgets = await page.locator('[id^="lodgify_search_widget_"]').all();
    console.log(`\nTotal Lodgify widget divs found: ${allWidgets.length}`);
    
    for (let i = 0; i < allWidgets.length; i++) {
      const id = await allWidgets[i].getAttribute('id');
      const isEmpty = await allWidgets[i].evaluate(el => el.innerHTML.trim() === '');
      const boundingBox = await allWidgets[i].boundingBox();
      console.log(`  - ${id}: ${isEmpty ? 'EMPTY' : 'HAS CONTENT'}, visible: ${boundingBox !== null}`);
    }

    // Print console errors
    console.log('\n=== CONSOLE MESSAGES (Errors & Warnings) ===');
    consoleMessages
      .filter(msg => msg.type === 'error' || msg.type === 'warning')
      .forEach(msg => {
        console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
      });

    // Print network errors
    if (networkErrors.length > 0) {
      console.log('\n=== NETWORK ERRORS ===');
      networkErrors.forEach(err => {
        console.log(`Failed: ${err.url}`);
        console.log(`  Reason: ${err.failure}`);
      });
    } else {
      console.log('\n=== No network errors detected ===');
    }

    console.log('\n=== NOW CHECKING VILLA PAGE FOR COMPARISON ===\n');

    // Now check a villa page that should work
    await page.goto('https://tommycoconutvacations.com/villa-bayside-hill.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForTimeout(5000);

    // Screenshot villa page widget
    const villaWidget = await page.locator('[id^="lodgify_search_widget_"]').first();
    const villaWidgetId = await villaWidget.getAttribute('id');
    console.log(`Villa widget ID: ${villaWidgetId}`);

    const villaWidgetHTML = await villaWidget.innerHTML().catch(() => 'NOT FOUND');
    console.log('\nVilla Widget HTML Content:');
    console.log(villaWidgetHTML.substring(0, 500));
    console.log(villaWidgetHTML.length > 500 ? '... (truncated)' : '');

    const villaIsEmpty = await villaWidget.evaluate(el => el.innerHTML.trim() === '');
    console.log(`\nVilla widget is empty: ${villaIsEmpty}`);

    await villaWidget.screenshot({
      path: '/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/villa-widget-comparison.png'
    });

  } catch (error) {
    console.error('Error during inspection:', error.message);
  }

  await browser.close();
})();
