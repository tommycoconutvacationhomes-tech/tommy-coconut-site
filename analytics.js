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
    
    // Configure Google Analytics
    gtag('config', 'G-PVETEG7EB4');

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

        // The Round Table's Guest Listening System - Tier 1 Analytics
        
        // Track treasure map funnel steps
        trackFunnelStep: function(stepNumber, stepName, data = {}) {
            this.trackEvent('Treasure Map Funnel', `step_${stepNumber}_${stepName}`, stepName, stepNumber);
            
            // Also send custom event with additional data
            if (typeof gtag !== 'undefined') {
                gtag('event', `funnel_step_${stepNumber}`, {
                    'event_category': 'funnel_progression',
                    'event_label': stepName,
                    'step_number': stepNumber,
                    'custom_parameter': JSON.stringify(data)
                });
            }
        },

        // Track funnel completion
        trackFunnelCompletion: function(villaMatch, userData) {
            this.trackEvent('Treasure Map Funnel', 'completion', villaMatch);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'funnel_completion', {
                    'event_category': 'conversion',
                    'event_label': villaMatch,
                    'villa_match': villaMatch,
                    'user_data': JSON.stringify(userData)
                });
            }
        },

        // Track WhatsApp conversion
        trackWhatsAppConversion: function(source, villaMatch = '') {
            this.trackEvent('WhatsApp Conversion', 'click', source);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_conversion', {
                    'event_category': 'conversion',
                    'event_label': source,
                    'villa_match': villaMatch,
                    'conversion_source': source
                });
            }
        },

        // Track concierge handshake engagement
        trackConciergeHandshake: function(action, data = {}) {
            this.trackEvent('Concierge Handshake', action, JSON.stringify(data));
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'concierge_handshake', {
                    'event_category': 'engagement',
                    'event_label': action,
                    'handshake_data': JSON.stringify(data)
                });
            }
        },

        // Track villa page engagement
        trackVillaPageEngagement: function(villaName, action, value = '') {
            this.trackEvent('Villa Page Engagement', action, `${villaName}: ${value}`);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'villa_engagement', {
                    'event_category': 'villa_interaction',
                    'event_label': action,
                    'villa_name': villaName,
                    'interaction_value': value
                });
            }
        },

        // Track heat map events (for integration with Hotjar/Clarity)
        trackHeatMapEvent: function(elementType, action, location) {
            this.trackEvent('Heat Map Event', action, `${elementType} at ${location}`);
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