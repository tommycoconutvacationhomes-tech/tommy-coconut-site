/**
 * Tommy Coconut Analytics Module
 * Handles Google Analytics, event tracking, and user behavior analytics
 */

(function() {
    'use strict';

    // Google Analytics initialization
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    
    // Configure Google Analytics (replace with actual GA ID when available)
    // gtag('config', 'GA_MEASUREMENT_ID');

    // Tommy Coconut Analytics Module
    const TCAnalytics = {
        // Track page views
        trackPageView: function(pageName) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', {
                    page_title: pageName || document.title,
                    page_location: window.location.href,
                    page_path: window.location.pathname
                });
            }
            console.log('Page view tracked:', pageName || document.title);
        },

        // Track custom events
        trackEvent: function(category, action, label, value) {
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    'event_category': category,
                    'event_label': label,
                    'value': value
                });
            }
            console.log('Event tracked:', {category, action, label, value});
        },

        // Track outbound links
        trackOutboundLink: function(url) {
            this.trackEvent('Outbound Link', 'click', url);
            // Small delay to ensure tracking before navigation
            setTimeout(function() {
                document.location = url;
            }, 100);
            return false;
        },

        // Track form submissions
        trackFormSubmission: function(formName) {
            this.trackEvent('Form', 'submit', formName);
        },

        // Track scroll depth
        trackScrollDepth: function() {
            let scrollPoints = [25, 50, 75, 100];
            let scrolled = [];
            
            window.addEventListener('scroll', function() {
                let scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
                
                scrollPoints.forEach(function(point) {
                    if (scrollPercent >= point && !scrolled.includes(point)) {
                        scrolled.push(point);
                        TCAnalytics.trackEvent('Engagement', 'scroll_depth', point + '%');
                    }
                });
            });
        },

        // Track time on page
        trackTimeOnPage: function() {
            let startTime = Date.now();
            
            window.addEventListener('beforeunload', function() {
                let timeOnPage = Math.round((Date.now() - startTime) / 1000);
                TCAnalytics.trackEvent('Engagement', 'time_on_page', window.location.pathname, timeOnPage);
            });
        },

        // Track booking widget interactions
        trackBookingInteraction: function(action, details) {
            this.trackEvent('Booking Widget', action, details);
        },

        // Track property views
        trackPropertyView: function(propertyName) {
            this.trackEvent('Property', 'view', propertyName);
        },

        // Track experience interest
        trackExperienceInterest: function(experienceName) {
            this.trackEvent('Experience', 'interest', experienceName);
        },

        // Initialize all tracking
        init: function() {
            // Track initial page view
            this.trackPageView();
            
            // Set up scroll depth tracking
            this.trackScrollDepth();
            
            // Set up time on page tracking
            this.trackTimeOnPage();
            
            // Track all outbound links
            document.addEventListener('click', function(e) {
                let target = e.target;
                while (target && target !== document) {
                    if (target.tagName === 'A' && target.href) {
                        let url = new URL(target.href);
                        if (url.hostname !== window.location.hostname) {
                            TCAnalytics.trackOutboundLink(target.href);
                            e.preventDefault();
                        }
                    }
                    target = target.parentElement;
                }
            });

            // Track form submissions
            document.addEventListener('submit', function(e) {
                if (e.target.tagName === 'FORM') {
                    let formName = e.target.getAttribute('data-form-name') || 
                                  e.target.id || 
                                  'unnamed_form';
                    TCAnalytics.trackFormSubmission(formName);
                }
            });

            // Track booking widget interactions if present
            if (document.querySelector('.booking-widget')) {
                document.querySelector('.booking-widget').addEventListener('click', function(e) {
                    if (e.target.classList.contains('check-availability')) {
                        TCAnalytics.trackBookingInteraction('check_availability', 'button_click');
                    }
                });
            }

            // Track property card clicks
            document.querySelectorAll('.property-card').forEach(function(card) {
                card.addEventListener('click', function() {
                    let propertyName = card.querySelector('h3')?.textContent || 'Unknown Property';
                    TCAnalytics.trackPropertyView(propertyName);
                });
            });

            // Track experience card clicks
            document.querySelectorAll('.experience-card').forEach(function(card) {
                card.addEventListener('click', function() {
                    let experienceName = card.querySelector('h3')?.textContent || 'Unknown Experience';
                    TCAnalytics.trackExperienceInterest(experienceName);
                });
            });

            console.log('Tommy Coconut Analytics initialized');
        }
    };

    // Make TCAnalytics globally available
    window.TCAnalytics = TCAnalytics;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            TCAnalytics.init();
        });
    } else {
        TCAnalytics.init();
    }

})();