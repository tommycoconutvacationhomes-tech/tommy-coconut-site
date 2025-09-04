const { chromium } = require('playwright');

async function analyzeTommyCoconutFunnel() {
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1000 // Slow down for better observation
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  console.log('🏝️  Starting Tommy Coconut Funnel Analysis...\n');
  
  try {
    // 1. Navigate to Homepage
    console.log('📍 Step 1: Loading Homepage...');
    await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Take screenshot of homepage
    await page.screenshot({ 
      path: 'homepage-desktop.png', 
      fullPage: true 
    });
    console.log('✅ Homepage screenshot saved as homepage-desktop.png');
    
    // Analyze homepage elements
    console.log('\n🔍 Homepage Analysis:');
    
    // Check hero section
    const heroExists = await page.locator('.hero, [class*="hero"], .banner, [class*="banner"]').count();
    console.log(`   Hero section elements found: ${heroExists}`);
    
    // Check social proof elements
    const socialProofElements = await page.locator('[class*="social"], [class*="proof"], [class*="counter"], [class*="guests"], [class*="rating"]').count();
    console.log(`   Social proof elements found: ${socialProofElements}`);
    
    // Check CTAs
    const ctaButtons = await page.locator('button, .btn, [class*="button"], a[class*="cta"]').count();
    console.log(`   CTA buttons found: ${ctaButtons}`);
    
    // Check value proposition section
    const valuePropsection = await page.locator('[class*="value"], [class*="included"], [class*="what"], [class*="benefit"]').count();
    console.log(`   Value proposition elements found: ${valuePropsection}`);
    
    // Check "How It Works" section
    const howItWorksSection = await page.locator('[class*="how"], [class*="works"], [class*="step"], [class*="process"]').count();
    console.log(`   How It Works elements found: ${howItWorksSection}`);
    
    // Check floating WhatsApp button
    const whatsappButton = await page.locator('[class*="whatsapp"], [class*="float"], [href*="whatsapp"], [href*="wa.me"]').count();
    console.log(`   WhatsApp button found: ${whatsappButton}`);
    
    // 2. Test Mobile View
    console.log('\n📱 Step 2: Testing Mobile Responsiveness...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'homepage-mobile.png', 
      fullPage: true 
    });
    console.log('✅ Mobile screenshot saved as homepage-mobile.png');
    
    // Check sticky mobile CTA bar
    const stickyMobileCTA = await page.locator('[class*="sticky"], [class*="fixed"], [class*="mobile-cta"]').count();
    console.log(`   Sticky mobile CTA elements found: ${stickyMobileCTA}`);
    
    // Reset to desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    // 3. Navigate to Villa Discovery
    console.log('\n🏡 Step 3: Testing Villa Discovery Flow...');
    
    // Look for discovery/explore buttons
    const discoveryButtons = await page.locator('text=/discover|explore|find|search|villa/i').all();
    if (discoveryButtons.length > 0) {
      console.log(`   Found ${discoveryButtons.length} discovery-related buttons`);
      
      // Click the first discovery button
      await discoveryButtons[0].click();
      await page.waitForTimeout(3000);
      
      await page.screenshot({ 
        path: 'villa-discovery.png', 
        fullPage: true 
      });
      console.log('✅ Villa discovery screenshot saved as villa-discovery.png');
      
      // Check property cards
      const propertyCards = await page.locator('[class*="card"], [class*="property"], [class*="villa"], [class*="island"]').count();
      console.log(`   Property cards found: ${propertyCards}`);
      
      // Check urgency indicators
      const urgencyElements = await page.locator('[class*="urgent"], [class*="limited"], [class*="available"], [class*="book"]').count();
      console.log(`   Urgency indicators found: ${urgencyElements}`);
    }
    
    // 4. Test Booking Flow
    console.log('\n📞 Step 4: Testing Contact/Booking Flow...');
    
    // Look for contact/booking buttons
    const bookingButtons = await page.locator('text=/book|contact|reserve|inquire|get quote/i').all();
    if (bookingButtons.length > 0) {
      console.log(`   Found ${bookingButtons.length} booking-related buttons`);
      
      // Test clicking a booking button
      await bookingButtons[0].click();
      await page.waitForTimeout(2000);
      
      // Check if modal or new page opened
      const modalExists = await page.locator('.modal, [class*="modal"], .popup, [class*="popup"], .overlay, [class*="overlay"]').count();
      if (modalExists > 0) {
        console.log('   ✅ Booking modal/popup detected');
        await page.screenshot({ 
          path: 'booking-modal.png' 
        });
        console.log('✅ Booking modal screenshot saved as booking-modal.png');
      }
    }
    
    // 5. Test Exit Intent Modal
    console.log('\n🚪 Step 5: Testing Exit Intent Modal...');
    
    // Simulate mouse moving to leave page (trigger exit intent)
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1000);
    
    const exitModal = await page.locator('[class*="exit"], [class*="intent"], .modal, [class*="modal"]').count();
    if (exitModal > 0) {
      console.log('   ✅ Exit intent modal detected');
      await page.screenshot({ 
        path: 'exit-intent-modal.png' 
      });
      console.log('✅ Exit intent modal screenshot saved as exit-intent-modal.png');
    }
    
    // 6. Performance Analysis
    console.log('\n⚡ Step 6: Performance Analysis...');
    
    // Check page load performance
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation')[0]);
    });
    
    const perf = JSON.parse(performanceEntries);
    console.log(`   DOM Content Loaded: ${Math.round(perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart)}ms`);
    console.log(`   Page Load Complete: ${Math.round(perf.loadEventEnd - perf.loadEventStart)}ms`);
    
    // 7. Accessibility Quick Check
    console.log('\n♿ Step 7: Basic Accessibility Check...');
    
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    const buttonsWithoutLabel = await page.locator('button:not([aria-label]):not([aria-labelledby])').filter({ hasText: '' }).count();
    const linksWithoutText = await page.locator('a').filter({ hasText: '' }).count();
    
    console.log(`   Images without alt text: ${imagesWithoutAlt}`);
    console.log(`   Buttons without labels: ${buttonsWithoutLabel}`);
    console.log(`   Links without text: ${linksWithoutText}`);
    
    console.log('\n🎉 Funnel Analysis Complete!');
    console.log('\nScreenshots saved:');
    console.log('- homepage-desktop.png');
    console.log('- homepage-mobile.png');
    console.log('- villa-discovery.png');
    console.log('- booking-modal.png (if modal detected)');
    console.log('- exit-intent-modal.png (if modal detected)');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  } finally {
    await browser.close();
  }
}

analyzeTommyCoconutFunnel();