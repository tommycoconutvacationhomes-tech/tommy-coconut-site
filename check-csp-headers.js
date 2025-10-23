#!/usr/bin/env node

/**
 * CSP Header Verification Script
 * Fetches actual HTTP headers from the live site to verify CSP configuration
 */

const https = require('https');

const url = 'https://tommycoconut.com/';

console.log('🔍 Fetching HTTP headers from:', url);
console.log('─'.repeat(80));

https.get(url, (res) => {
    console.log('\n📊 Status Code:', res.statusCode);
    console.log('\n🔐 Security Headers:\n');

    const securityHeaders = [
        'content-security-policy',
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy',
        'permissions-policy',
        'access-control-allow-origin'
    ];

    securityHeaders.forEach(header => {
        const value = res.headers[header];
        if (value) {
            console.log(`${header}:`);
            if (header === 'content-security-policy') {
                // Parse and display CSP directives nicely
                const directives = value.split(';').map(d => d.trim()).filter(d => d);
                directives.forEach(directive => {
                    console.log(`  - ${directive}`);
                });

                // Check for Lodgify domains specifically
                console.log('\n🎯 Lodgify Domain Check:');
                const hasLodgifyScript = value.includes('app.lodgify.com');
                const hasLodgifyConnect = value.includes('api.lodgify.com');
                const hasLodgifyFrame = value.includes('app.lodgify.com');

                console.log(`  ✓ script-src includes app.lodgify.com: ${hasLodgifyScript ? '✅ YES' : '❌ NO'}`);
                console.log(`  ✓ connect-src includes api.lodgify.com: ${hasLodgifyConnect ? '✅ YES' : '❌ NO'}`);
                console.log(`  ✓ frame-src includes app.lodgify.com: ${hasLodgifyFrame ? '✅ YES' : '❌ NO'}`);

                if (!hasLodgifyScript || !hasLodgifyConnect || !hasLodgifyFrame) {
                    console.log('\n⚠️  WARNING: Lodgify domains are MISSING from live CSP!');
                    console.log('   This means the deployment hasn\'t completed yet.');
                } else {
                    console.log('\n✅ All Lodgify domains are present in live CSP!');
                }
            } else {
                console.log(`  ${value}`);
            }
            console.log();
        }
    });

    console.log('─'.repeat(80));
    console.log('\n📋 All Response Headers:\n');
    Object.keys(res.headers).forEach(header => {
        console.log(`${header}: ${res.headers[header]}`);
    });

    console.log('\n' + '─'.repeat(80));

}).on('error', (err) => {
    console.error('❌ Error fetching headers:', err.message);
    process.exit(1);
});
