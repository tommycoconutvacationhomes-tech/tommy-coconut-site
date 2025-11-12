const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the experiences page
  await page.goto('http://localhost:8000/experiences.html');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Get page metrics
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const scrollsNeeded = Math.ceil(pageHeight / viewportHeight);

  console.log('=== PAGE METRICS ===');
  console.log(`Total page height: ${pageHeight}px`);
  console.log(`Viewport height: ${viewportHeight}px`);
  console.log(`Number of scrolls needed: ${scrollsNeeded}`);
  console.log(`Ratio: ${(pageHeight / viewportHeight).toFixed(2)}x viewport height`);

  // Analyze text content
  const textMetrics = await page.evaluate(() => {
    const allText = document.body.innerText;
    const paragraphs = Array.from(document.querySelectorAll('p'));
    const wordCount = allText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    // Analyze paragraph lengths
    const paragraphStats = paragraphs.map(p => ({
      text: p.innerText.trim(),
      words: p.innerText.trim().split(/\s+/).length,
      sentences: p.innerText.split(/[.!?]+/).filter(s => s.trim()).length
    })).filter(p => p.words > 0);

    const avgWordsPerParagraph = paragraphStats.reduce((sum, p) => sum + p.words, 0) / paragraphStats.length;
    const longParagraphs = paragraphStats.filter(p => p.words > 50);

    return {
      totalWords: wordCount,
      readingTimeMinutes: readingTime,
      totalParagraphs: paragraphStats.length,
      avgWordsPerParagraph: Math.round(avgWordsPerParagraph),
      longParagraphs: longParagraphs.length,
      longParagraphDetails: longParagraphs.map(p => ({
        preview: p.text.substring(0, 80) + '...',
        words: p.words
      }))
    };
  });

  console.log('\n=== TEXT ANALYSIS ===');
  console.log(`Total word count: ${textMetrics.totalWords}`);
  console.log(`Estimated reading time: ${textMetrics.readingTimeMinutes} minutes`);
  console.log(`Total paragraphs: ${textMetrics.totalParagraphs}`);
  console.log(`Average words per paragraph: ${textMetrics.avgWordsPerParagraph}`);
  console.log(`Paragraphs over 50 words: ${textMetrics.longParagraphs}`);

  if (textMetrics.longParagraphDetails.length > 0) {
    console.log('\n=== LONG PARAGRAPHS (>50 words) ===');
    textMetrics.longParagraphDetails.forEach((p, i) => {
      console.log(`${i + 1}. [${p.words} words] ${p.preview}`);
    });
  }

  // Analyze sections
  const sectionAnalysis = await page.evaluate(() => {
    const sections = [];

    // Hero section
    const hero = document.querySelector('.hero-section, header');
    if (hero) {
      sections.push({
        name: 'Hero',
        height: hero.offsetHeight,
        textLength: hero.innerText.length
      });
    }

    // Main content sections
    const mainSections = Array.from(document.querySelectorAll('section, .section'));
    mainSections.forEach((section, i) => {
      const heading = section.querySelector('h1, h2, h3');
      const sectionName = heading ? heading.innerText : `Section ${i + 1}`;
      sections.push({
        name: sectionName,
        height: section.offsetHeight,
        textLength: section.innerText.length,
        wordCount: section.innerText.split(/\s+/).length
      });
    });

    return sections;
  });

  console.log('\n=== SECTION BREAKDOWN ===');
  sectionAnalysis.forEach(section => {
    console.log(`${section.name}:`);
    console.log(`  Height: ${section.height}px`);
    console.log(`  Word count: ${section.wordCount || 'N/A'}`);
    console.log(`  Text density: ${(section.textLength / section.height).toFixed(2)} chars/px`);
  });

  // Take screenshots at different scroll positions
  console.log('\n=== CAPTURING SCREENSHOTS ===');

  // Full page screenshot
  await page.screenshot({
    path: '/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/screenshot-full-page.png',
    fullPage: true
  });
  console.log('Saved: screenshot-full-page.png');

  // Hero/above-the-fold
  await page.screenshot({
    path: '/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/screenshot-hero.png'
  });
  console.log('Saved: screenshot-hero.png');

  // Scroll positions
  const scrollPositions = [0.25, 0.5, 0.75];
  for (const position of scrollPositions) {
    await page.evaluate((pos) => {
      window.scrollTo(0, document.body.scrollHeight * pos);
    }, position);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/screenshot-${Math.round(position * 100)}percent.png`
    });
    console.log(`Saved: screenshot-${Math.round(position * 100)}percent.png`);
  }

  // Mobile view
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:8000/experiences.html');
  await page.waitForLoadState('networkidle');

  const mobileHeight = await page.evaluate(() => document.body.scrollHeight);
  const mobileViewportHeight = await page.evaluate(() => window.innerHeight);
  const mobileScrolls = Math.ceil(mobileHeight / mobileViewportHeight);

  console.log('\n=== MOBILE METRICS ===');
  console.log(`Mobile page height: ${mobileHeight}px`);
  console.log(`Mobile viewport height: ${mobileViewportHeight}px`);
  console.log(`Mobile scrolls needed: ${mobileScrolls}`);

  await page.screenshot({
    path: '/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/screenshot-mobile-hero.png'
  });
  console.log('Saved: screenshot-mobile-hero.png');

  await page.screenshot({
    path: '/Users/curacaodreamproperty/Downloads/deploy-68b5e9ea92ff1c69a4b32deb/screenshot-mobile-full.png',
    fullPage: true
  });
  console.log('Saved: screenshot-mobile-full.png');

  await browser.close();

  console.log('\n=== ANALYSIS COMPLETE ===');
})();
