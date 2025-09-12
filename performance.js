/**
 * Tommy Coconut Performance Monitoring Module
 * Tracks site performance, loading times, and optimizes user experience
 */

(function() {
    'use strict';

    const TCPerformance = {
        metrics: {},

        // Measure page load performance
        measurePageLoad: function() {
            if (window.performance && window.performance.timing) {
                window.addEventListener('load', function() {
                    setTimeout(function() {
                        const timing = window.performance.timing;
                        const metrics = {
                            // Total page load time
                            pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                            // DOM ready time
                            domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                            // Time to first byte
                            ttfb: timing.responseStart - timing.navigationStart,
                            // DNS lookup time
                            dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
                            // TCP connection time
                            tcpTime: timing.connectEnd - timing.connectStart,
                            // Request time
                            requestTime: timing.responseEnd - timing.requestStart,
                            // DOM processing time
                            domProcessingTime: timing.domComplete - timing.domLoading
                        };

                        TCPerformance.metrics = metrics;
                        TCPerformance.reportMetrics(metrics);
                    }, 0);
                });
            }
        },

        // Report metrics to analytics
        reportMetrics: function(metrics) {
            // Log to console in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Performance Metrics:', metrics);
            }

            // Send to analytics if available
            if (window.TCAnalytics && window.TCAnalytics.trackEvent) {
                // Report critical metrics
                if (metrics.pageLoadTime > 3000) {
                    window.TCAnalytics.trackEvent('Performance', 'slow_page_load', window.location.pathname, Math.round(metrics.pageLoadTime));
                }
                
                // Track performance categories
                let loadCategory = 'fast';
                if (metrics.pageLoadTime > 5000) loadCategory = 'slow';
                else if (metrics.pageLoadTime > 2000) loadCategory = 'moderate';
                
                window.TCAnalytics.trackEvent('Performance', 'load_speed', loadCategory, Math.round(metrics.pageLoadTime));
            }
        },

        // Lazy load images
        lazyLoadImages: function() {
            const images = document.querySelectorAll('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                });

                images.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback for browsers that don't support IntersectionObserver
                images.forEach(function(img) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                });
            }
        },

        // Optimize video loading
        optimizeVideos: function() {
            const videos = document.querySelectorAll('video[data-src]');
            
            videos.forEach(function(video) {
                // Only load video when user interacts or scrolls near
                const loadVideo = function() {
                    if (video.dataset.src) {
                        video.src = video.dataset.src;
                        video.removeAttribute('data-src');
                        video.load();
                    }
                };

                // Load on user interaction
                ['click', 'touchstart'].forEach(function(event) {
                    video.addEventListener(event, loadVideo, { once: true });
                });

                // Or load when scrolled into view
                if ('IntersectionObserver' in window) {
                    const videoObserver = new IntersectionObserver(function(entries) {
                        entries.forEach(function(entry) {
                            if (entry.isIntersecting) {
                                loadVideo();
                                videoObserver.unobserve(video);
                            }
                        });
                    }, {
                        rootMargin: '100px 0px',
                        threshold: 0.01
                    });
                    
                    videoObserver.observe(video);
                }
            });
        },

        // Preload critical resources
        preloadCriticalResources: function() {
            // Preload fonts
            const fonts = [
                'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap'
            ];

            fonts.forEach(function(font) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = font;
                document.head.appendChild(link);
            });

            // Preconnect to external domains
            const domains = [
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com',
                'https://res.cloudinary.com',
                'https://cdnjs.cloudflare.com'
            ];

            domains.forEach(function(domain) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = domain;
                document.head.appendChild(link);
            });
        },

        // Monitor and report Core Web Vitals
        measureWebVitals: function() {
            // Largest Contentful Paint (LCP)
            if ('PerformanceObserver' in window) {
                try {
                    const lcpObserver = new PerformanceObserver(function(entryList) {
                        const entries = entryList.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        TCPerformance.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
                    });
                    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
                } catch (e) {
                    // LCP observer not supported
                }

                // First Input Delay (FID)
                try {
                    const fidObserver = new PerformanceObserver(function(entryList) {
                        const entries = entryList.getEntries();
                        entries.forEach(function(entry) {
                            TCPerformance.metrics.fid = entry.processingStart - entry.startTime;
                        });
                    });
                    fidObserver.observe({ type: 'first-input', buffered: true });
                } catch (e) {
                    // FID observer not supported
                }

                // Cumulative Layout Shift (CLS)
                let clsValue = 0;
                let clsEntries = [];
                try {
                    const clsObserver = new PerformanceObserver(function(entryList) {
                        for (const entry of entryList.getEntries()) {
                            if (!entry.hadRecentInput) {
                                clsValue += entry.value;
                                clsEntries.push(entry);
                            }
                        }
                        TCPerformance.metrics.cls = clsValue;
                    });
                    clsObserver.observe({ type: 'layout-shift', buffered: true });
                } catch (e) {
                    // CLS observer not supported
                }
            }
        },

        // Optimize animations for performance
        optimizeAnimations: function() {
            // Reduce animations for users who prefer reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.classList.add('reduce-motion');
            }

            // Pause animations when tab is not visible
            document.addEventListener('visibilitychange', function() {
                const videos = document.querySelectorAll('video');
                if (document.hidden) {
                    videos.forEach(video => video.pause());
                } else {
                    videos.forEach(video => {
                        if (video.hasAttribute('autoplay')) {
                            video.play();
                        }
                    });
                }
            });
        },

        // Initialize all performance optimizations
        init: function() {
            // Start measuring as soon as possible
            this.measurePageLoad();
            this.measureWebVitals();
            
            // Preload critical resources
            this.preloadCriticalResources();
            
            // Set up lazy loading and optimizations when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    TCPerformance.lazyLoadImages();
                    TCPerformance.optimizeVideos();
                    TCPerformance.optimizeAnimations();
                });
            } else {
                this.lazyLoadImages();
                this.optimizeVideos();
                this.optimizeAnimations();
            }

            console.log('Tommy Coconut Performance module initialized');
        }
    };

    // Make TCPerformance globally available
    window.TCPerformance = TCPerformance;

    // Initialize immediately
    TCPerformance.init();

})();