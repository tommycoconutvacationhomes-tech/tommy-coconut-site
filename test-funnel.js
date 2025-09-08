const { chromium } = require('playwright');

async function testFunnel() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Listen for console messages and errors
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    
    try {
        console.log('Testing Tommy Coconut funnel flow...');
        
        // Step 1: Go to homepage
        console.log('1. Loading homepage...');
        await page.goto('https://tommy-coconut-site.netlify.app');
        await page.waitForLoadState('domcontentloaded');
        
        // Check if hero is visible
        const heroVisible = await page.isVisible('.hero-content');
        console.log(`   Hero content visible: ${heroVisible}`);
        
        // Step 2: Click "Let Us Find Your Villa" button
        console.log('2. Clicking "Let Us Find Your Villa" button...');
        const villaButton = page.locator('text="Let Us Find Your Villa"');
        if (await villaButton.isVisible()) {
            await villaButton.click();
            await page.waitForLoadState('domcontentloaded');
            console.log(`   Navigated to: ${page.url()}`);
        } else {
            console.log('   ❌ "Let Us Find Your Villa" button not found');
        }
        
        // Step 3: Check if treasure-map loads
        if (page.url().includes('treasure-map')) {
            console.log('3. Testing treasure-map functionality...');
            
            // Wait for the page to fully load
            await page.waitForTimeout(2000);
            
            // Check if questionnaire is visible
            const questionVisible = await page.isVisible('.curation-container');
            console.log(`   Questionnaire container visible: ${questionVisible}`);
            
            const step1Visible = await page.isVisible('#step1.active');
            console.log(`   Step 1 visible: ${step1Visible}`);
            
            // Try to click first option if visible
            const firstOption = page.locator('.option-button').first();
            if (await firstOption.isVisible()) {
                console.log('   Clicking first preference option...');
                await firstOption.click();
                await page.waitForTimeout(2000);
                
                // Check if step 2 appears
                const step2Visible = await page.isVisible('#step2.active');
                console.log(`   Step 2 visible after selection: ${step2Visible}`);
                
                if (step2Visible) {
                    console.log('   ✅ Successfully progressed to step 2');
                    
                    // Try clicking first option in step 2
                    const step2Option = page.locator('#step2 .option-button').first();
                    if (await step2Option.isVisible()) {
                        console.log('   Clicking step 2 option...');
                        await step2Option.click();
                        await page.waitForTimeout(2000);
                        
                        // Check for step 3
                        const step3Visible = await page.isVisible('#step3.active');
                        console.log(`   Step 3 visible: ${step3Visible}`);
                    }
                } else {
                    console.log('   ❌ Step 2 did not appear - checking for continue button');
                    const nextButton = page.locator('#dateConfirm');
                    const nextButtonVisible = await nextButton.isVisible();
                    console.log(`   Date confirm button visible: ${nextButtonVisible}`);
                }
            } else {
                console.log('   ❌ No preference options visible');
            }
        } else {
            console.log('3. ❌ Did not navigate to treasure-map');
        }
        
        // Take a screenshot for debugging
        await page.screenshot({ path: 'funnel-test.png', fullPage: true });
        console.log('Screenshot saved as funnel-test.png');
        
    } catch (error) {
        console.error('Error during funnel test:', error);
        await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

testFunnel();