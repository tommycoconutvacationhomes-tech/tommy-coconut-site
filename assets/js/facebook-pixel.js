/**
 * Facebook Pixel Tracking Implementation
 * Tommy Coconut - Advanced Marketing Analytics
 * Pixel ID: 2243630632819568
 */

(function() {
    'use strict';
    
    // Facebook Pixel Base Code
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    // Initialize Pixel with your ID
    fbq('init', '2243630632819568');
    
    // Track page view on all pages
    fbq('track', 'PageView');
    
    // Enhanced tracking for specific pages
    document.addEventListener('DOMContentLoaded', function() {
        
        // Get current page info
        const currentPage = window.location.pathname;
        const pageTitle = document.title;
        
        // Track specific page types
        if (currentPage.includes('rentals')) {
            // Track rental page views
            fbq('track', 'ViewContent', {
                content_type: 'product_group',
                content_category: 'Vacation Rentals',
                content_name: 'Rentals Page'
            });
        }
        
        // Track individual property views
        if (currentPage.includes('villa-') || currentPage.includes('bayside-hill') || 
            currentPage.includes('palm-breeze') || currentPage.includes('hideaway')) {
            fbq('track', 'ViewContent', {
                content_type: 'product',
                content_category: 'Villa',
                content_name: pageTitle,
                currency: 'USD',
                value: 450.00 // Average nightly rate
            });
        }
        
        // Track contact page
        if (currentPage.includes('contact')) {
            fbq('track', 'Contact', {
                content_name: 'Contact Page Visit'
            });
        }
        
        // Track experiences page
        if (currentPage.includes('experiences')) {
            fbq('track', 'ViewContent', {
                content_type: 'experience',
                content_category: 'Activities',
                content_name: 'Tommy Coconut Experiences'
            });
        }
        
        // Track ownership/investment interest
        if (currentPage.includes('ownership')) {
            fbq('track', 'ViewContent', {
                content_type: 'investment',
                content_category: 'Fractional Ownership',
                content_name: 'Investment Opportunity'
            });
        }
        
        // Track WhatsApp button clicks
        document.addEventListener('click', function(e) {
            if (e.target.closest('a[href*="wa.me"]')) {
                fbq('track', 'Contact', {
                    content_name: 'WhatsApp Click',
                    contact_type: 'whatsapp',
                    page: currentPage
                });
            }
        });
        
        // Track form interactions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Track when someone starts filling out a form
            form.addEventListener('focusin', function() {
                if (!form.dataset.fbqTracked) {
                    fbq('track', 'InitiateCheckout', {
                        content_name: 'Form Interaction',
                        content_category: 'Lead Generation'
                    });
                    form.dataset.fbqTracked = 'true';
                }
            }, { once: true });
            
            // Track form submissions
            form.addEventListener('submit', function(e) {
                // Get form data if available
                const formData = new FormData(form);
                const email = formData.get('email') || '';
                
                // Track as Lead event
                fbq('track', 'Lead', {
                    content_name: 'Booking Form Submission',
                    content_category: 'Lead Generation',
                    currency: 'USD',
                    value: 450.00 // Potential booking value
                });
                
                // Also track as CompleteRegistration for form completions
                if (email) {
                    fbq('track', 'CompleteRegistration', {
                        content_name: 'Form Completed',
                        status: 'completed',
                        value: 1
                    });
                }
            });
        });
        
        // Track scroll depth (25%, 50%, 75%, 100%)
        let scrollTracked = {25: false, 50: false, 75: false, 100: false};
        
        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
            
            [25, 50, 75, 100].forEach(threshold => {
                if (scrollPercent >= threshold && !scrollTracked[threshold]) {
                    scrollTracked[threshold] = true;
                    fbq('trackCustom', 'ScrollDepth', {
                        depth: threshold + '%',
                        page: currentPage
                    });
                }
            });
        });
        
        // Track time on page (every 30 seconds)
        let timeOnPage = 0;
        setInterval(function() {
            timeOnPage += 30;
            if (timeOnPage === 30 || timeOnPage === 60 || timeOnPage === 120) {
                fbq('trackCustom', 'TimeOnPage', {
                    seconds: timeOnPage,
                    page: currentPage
                });
            }
        }, 30000);
    });
    
    // Special tracking for thank you page (conversion confirmation)
    if (window.location.pathname.includes('thank-you')) {
        fbq('track', 'Purchase', {
            content_name: 'Booking Confirmed',
            content_type: 'product',
            currency: 'USD',
            value: 450.00 // Average booking value
        });
    }
    
})();

// Advanced E-commerce Tracking for specific properties
window.trackPropertyView = function(propertyName, price, location) {
    if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
            content_ids: [propertyName.toLowerCase().replace(/\s+/g, '-')],
            content_type: 'product',
            content_name: propertyName,
            content_category: location || 'Curaçao',
            currency: 'USD',
            value: parseFloat(price) || 450.00
        });
    }
};

// Track dynamic pricing changes
window.trackPriceChange = function(propertyName, newPrice) {
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', 'PriceViewed', {
            content_name: propertyName,
            currency: 'USD',
            value: parseFloat(newPrice)
        });
    }
};

// Track booking intent
window.trackBookingIntent = function(propertyName, checkIn, checkOut, guests) {
    if (typeof fbq !== 'undefined') {
        fbq('track', 'AddToCart', {
            content_name: propertyName,
            content_type: 'product',
            check_in: checkIn,
            check_out: checkOut,
            num_guests: guests,
            currency: 'USD',
            value: 450.00
        });
    }
};

console.log('Facebook Pixel initialized with ID: 2243630632819568');