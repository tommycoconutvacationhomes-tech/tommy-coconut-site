/**
 * Tommy Coconut Funnel Comprehensive Test Suite
 * Story Weaver's Quality Assurance Framework
 *
 * This suite verifies all three mandates are working perfectly:
 * 1. Value Stack perfection
 * 2. Trust Bridge architecture
 * 3. A/B testing framework
 */

// Test Configuration
const BASE_URL = 'http://localhost:8000';
const TESTS_PASSED = [];
const TESTS_FAILED = [];

// Utility Functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const logTest = (testName, passed, details = '') => {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}${details ? ': ' + details : ''}`);
    if (passed) {
        TESTS_PASSED.push(testName);
    } else {
        TESTS_FAILED.push({ name: testName, details });
    }
};

// Test Functions
async function testHomepage() {
    console.log('\n🏝️ Testing Homepage (index.html)...\n');

    try {
        const response = await fetch(`${BASE_URL}/index.html`);
        const html = await response.text();

        // Test 1: Page loads successfully
        logTest('Homepage loads', response.ok, `Status: ${response.status}`);

        // Test 2: A/B testing framework present
        const hasABFramework = html.includes('tommy_headline_version') &&
                               html.includes('version-a') &&
                               html.includes('version-b');
        logTest('A/B testing framework present', hasABFramework);

        // Test 3: Google Analytics present
        const hasGA = html.includes('G-PVETEG7EB4') && html.includes('gtag');
        logTest('Google Analytics configured', hasGA);

        // Test 4: Meta Pixel present
        const hasPixel = html.includes('2243630632819568') && html.includes('fbq');
        logTest('Meta Pixel configured', hasPixel);

        // Test 5: Clarity tracking present
        const hasClarity = html.includes('tb6p3y1vba') && html.includes('clarity');
        logTest('Microsoft Clarity configured', hasClarity);

        // Test 6: Both headline variants present
        const hasHeadlineA = html.includes('headline-a');
        const hasHeadlineB = html.includes('headline-b');
        logTest('Both headline variants present', hasHeadlineA && hasHeadlineB);

        // Test 7: CTA button present
        const hasCTA = html.includes('treasure-map.html') || html.includes('Get Started');
        logTest('Main CTA button present', hasCTA);

    } catch (error) {
        logTest('Homepage test suite', false, error.message);
    }
}

async function testTreasureMap() {
    console.log('\n🗺️ Testing Treasure Map (treasure-map.html)...\n');

    try {
        const response = await fetch(`${BASE_URL}/treasure-map.html`);
        const html = await response.text();

        // Test 1: Page loads successfully
        logTest('Treasure Map loads', response.ok, `Status: ${response.status}`);

        // Test 2: Step indicators present
        const hasStepIndicators = html.includes('step-indicator') ||
                                  html.includes('progress-step');
        logTest('Step indicators present', hasStepIndicators);

        // Test 3: Palm tree, key, calendar icons
        const hasIcons = (html.includes('fa-palm') || html.includes('🌴')) &&
                        (html.includes('fa-key') || html.includes('🔑') || html.includes('🗝️')) &&
                        (html.includes('fa-calendar') || html.includes('📅'));
        logTest('Navigation icons configured', hasIcons);

        // Test 4: Whisper testimonials section
        const hasTestimonials = html.includes('whisper-testimonial') ||
                               html.includes('testimonial-whisper');
        logTest('Whisper testimonials present', hasTestimonials);

        // Test 5: Date picker integration
        const hasDatePicker = html.includes('flatpickr') ||
                             html.includes('date-picker');
        logTest('Date picker configured', hasDatePicker);

        // Test 6: Form structure
        const hasForm = html.includes('<form') &&
                       html.includes('concierge-ready.html');
        logTest('Form with correct action', hasForm);

        // Test 7: Teal color for active state
        const hasTealColor = html.includes('#008080') ||
                            html.includes('rgb(0, 128, 128)');
        logTest('Teal color configured', hasTealColor);

    } catch (error) {
        logTest('Treasure Map test suite', false, error.message);
    }
}

async function testConciergeReady() {
    console.log('\n🎩 Testing Concierge Ready (concierge-ready.html)...\n');

    try {
        const response = await fetch(`${BASE_URL}/concierge-ready.html`);
        const html = await response.text();

        // Test 1: Page loads successfully
        logTest('Concierge Ready loads', response.ok, `Status: ${response.status}`);

        // Test 2: Critical bullet point present
        const hasPriorityAccess = html.includes('priority access to dates the public can') ||
                                 html.includes('unlock priority access');
        logTest('Priority access bullet point', hasPriorityAccess);

        // Test 3: Perfect Match Promise present
        const hasPromise = html.includes('Perfect Match') ||
                          html.includes('perfect-match-promise');
        logTest('Perfect Match Promise present', hasPromise);

        // Test 4: WhatsApp integration (replaced traditional form)
        const hasWhatsApp = html.includes('whatsapp-btn') ||
                           html.includes('startWhatsAppCuration');
        logTest('WhatsApp integration', hasWhatsApp);

        // Test 5: CTA button
        const hasCTA = html.includes('Start My Curation on WhatsApp') ||
                      html.includes('whatsapp-btn');
        logTest('WhatsApp CTA button configured', hasCTA);

        // Test 6: Visual hierarchy
        const hasProperStyling = html.includes('concierge-card') &&
                                html.includes('promise-list');
        logTest('Visual hierarchy styling', hasProperStyling);

        // Test 7: Tracking present
        const hasTracking = html.includes('clarity') || html.includes('gtag');
        logTest('Conversion tracking present', hasTracking);

    } catch (error) {
        logTest('Concierge Ready test suite', false, error.message);
    }
}

async function testMobileResponsiveness() {
    console.log('\n📱 Testing Mobile Responsiveness...\n');

    const pages = ['index.html', 'treasure-map.html', 'concierge-ready.html'];

    for (const page of pages) {
        try {
            const response = await fetch(`${BASE_URL}/${page}`);
            const html = await response.text();

            // Check for viewport meta tag
            const hasViewport = html.includes('viewport') &&
                               html.includes('width=device-width');
            logTest(`${page} - Viewport meta tag`, hasViewport);

            // Check for responsive CSS
            const hasMediaQueries = html.includes('@media') ||
                                   html.includes('max-width:') ||
                                   html.includes('min-width:');
            logTest(`${page} - Responsive CSS`, hasMediaQueries);

        } catch (error) {
            logTest(`${page} - Mobile test`, false, error.message);
        }
    }
}

async function testPerformance() {
    console.log('\n⚡ Testing Performance...\n');

    const pages = [
        { name: 'Homepage', url: 'index.html' },
        { name: 'Treasure Map', url: 'treasure-map.html' },
        { name: 'Concierge Ready', url: 'concierge-ready.html' }
    ];

    for (const page of pages) {
        try {
            const startTime = Date.now();
            const response = await fetch(`${BASE_URL}/${page.url}`);
            await response.text();
            const loadTime = Date.now() - startTime;

            const isAcceptable = loadTime < 2000; // 2 seconds threshold
            logTest(`${page.name} load time`, isAcceptable, `${loadTime}ms`);

        } catch (error) {
            logTest(`${page.name} performance`, false, error.message);
        }
    }
}

// Round Table Quality Assessment
function roundTableAssessment() {
    console.log('\n👑 Round Table Quality Assessment\n');
    console.log('═══════════════════════════════════\n');

    const assessments = [
        {
            member: 'Hormozi',
            question: 'Is value crystal clear at every step?',
            criteria: [
                'Clear value proposition on homepage',
                'Benefits highlighted in treasure map',
                'Compelling offer on concierge page'
            ]
        },
        {
            member: 'Brunson',
            question: 'Does the story flow naturally to conversion?',
            criteria: [
                'Emotional hook in headline',
                'Progressive disclosure through quiz',
                'Natural progression to concierge'
            ]
        },
        {
            member: 'Bezos',
            question: 'Is it fast, frictionless, customer-obsessed?',
            criteria: [
                'Page load times under 2 seconds',
                'Minimal form fields',
                'Clear next steps'
            ]
        },
        {
            member: 'Jobs',
            question: 'Is the design elegant and distraction-free?',
            criteria: [
                'Clean visual hierarchy',
                'Consistent branding',
                'No unnecessary elements'
            ]
        },
        {
            member: 'Buffett',
            question: 'Does it build authentic trust?',
            criteria: [
                'Testimonials present',
                'Clear promises',
                'Professional presentation'
            ]
        },
        {
            member: 'Naval',
            question: 'Is it systematically optimized for scale?',
            criteria: [
                'A/B testing framework',
                'Analytics tracking',
                'Automated follow-up'
            ]
        },
        {
            member: 'Piña & Colada',
            question: 'Does it embody the Dushi Life philosophy?',
            criteria: [
                'Warm, welcoming tone',
                'Island imagery',
                'Family feeling'
            ]
        }
    ];

    assessments.forEach(assessment => {
        console.log(`🎯 ${assessment.member}: "${assessment.question}"`);
        assessment.criteria.forEach(criterion => {
            console.log(`   • ${criterion}`);
        });
        console.log('');
    });
}

// Main Test Runner
async function runAllTests() {
    console.log('═══════════════════════════════════════════════════');
    console.log('🌴 TOMMY COCONUT FUNNEL COMPREHENSIVE TEST SUITE 🌴');
    console.log('═══════════════════════════════════════════════════');
    console.log(`Testing at: ${BASE_URL}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('═══════════════════════════════════════════════════');

    // Run all test suites
    await testHomepage();
    await delay(500);

    await testTreasureMap();
    await delay(500);

    await testConciergeReady();
    await delay(500);

    await testMobileResponsiveness();
    await delay(500);

    await testPerformance();
    await delay(500);

    // Round Table Assessment
    roundTableAssessment();

    // Final Report
    console.log('\n═══════════════════════════════════════');
    console.log('📊 FINAL TEST REPORT');
    console.log('═══════════════════════════════════════\n');

    console.log(`✅ Tests Passed: ${TESTS_PASSED.length}`);
    console.log(`❌ Tests Failed: ${TESTS_FAILED.length}`);

    const successRate = (TESTS_PASSED.length / (TESTS_PASSED.length + TESTS_FAILED.length) * 100).toFixed(1);
    console.log(`📈 Success Rate: ${successRate}%`);

    if (TESTS_FAILED.length > 0) {
        console.log('\n⚠️ Failed Tests:');
        TESTS_FAILED.forEach(test => {
            console.log(`   • ${test.name}: ${test.details}`);
        });
    }

    // Three Mandates Status
    console.log('\n🎯 THREE MANDATES STATUS:');
    console.log('═══════════════════════════════');

    const valueStackOK = TESTS_PASSED.includes('Priority access bullet point') &&
                        TESTS_PASSED.includes('Perfect Match Promise present');
    console.log(`1. Value Stack Perfection: ${valueStackOK ? '✅ VERIFIED' : '❌ NEEDS ATTENTION'}`);

    const trustBridgeOK = TESTS_PASSED.includes('Whisper testimonials present') &&
                         TESTS_PASSED.includes('Microsoft Clarity configured');
    console.log(`2. Trust Bridge Architecture: ${trustBridgeOK ? '✅ VERIFIED' : '❌ NEEDS ATTENTION'}`);

    const abTestingOK = TESTS_PASSED.includes('A/B testing framework present') &&
                       TESTS_PASSED.includes('Both headline variants present');
    console.log(`3. A/B Testing Framework: ${abTestingOK ? '✅ VERIFIED' : '❌ NEEDS ATTENTION'}`);

    // Overall Status
    const allMandatesOK = valueStackOK && trustBridgeOK && abTestingOK;
    console.log('\n═══════════════════════════════════════');
    console.log(`🏆 OVERALL STATUS: ${allMandatesOK ? '✅ READY FOR LAUNCH' : '⚠️ REQUIRES ATTENTION'}`);
    console.log('═══════════════════════════════════════\n');
}

// Run the test suite
runAllTests().catch(console.error);