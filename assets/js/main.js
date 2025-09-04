// Tommy Coconut - Consolidated JavaScript

/**
 * Main Application Class
 */
class TommyCoconutApp {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.initializeNavigation();
        this.initializeHeroVideo();
        this.initializeScrollEffects();
        this.initializeAnimations();
        this.initializeForms();
        this.initializeCarousels();
        this.initializeFAQ();
        this.initializeModals();
        this.initializePropertyFilters();
        
        // Mark body as loaded for CSS animations
        document.body.classList.add('loaded');
    }

    // Navigation - Updated for Split Menu
    initializeNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenuLeft = document.querySelector('.nav-menu-left');
        const navMenuRight = document.querySelector('.nav-menu-right');

        if (navToggle && navMenuLeft && navMenuRight) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu(navToggle, navMenuLeft, navMenuRight);
            });

            // Close menu when clicking links
            const navLinks = document.querySelectorAll('.nav-menu-left a, .nav-menu-right a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu(navToggle, navMenuLeft, navMenuRight);
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && 
                    !navMenuLeft.contains(e.target) && 
                    !navMenuRight.contains(e.target)) {
                    this.closeMobileMenu(navToggle, navMenuLeft, navMenuRight);
                }
            });
        }

        // Add active class to current page
        this.setActiveNavLink();

        // Navbar scroll effect
        this.initializeNavbarScroll();

        // Smooth scrolling for anchor links
        this.initializeSmoothScrolling();
    }

    toggleMobileMenu(toggle, menuLeft, menuRight) {
        const isActive = menuLeft.classList.toggle('active');
        menuRight.classList.toggle('active', isActive);
        toggle.classList.toggle('active', isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
        
        // Accessibility
        toggle.setAttribute('aria-expanded', isActive);
        menuLeft.setAttribute('aria-hidden', !isActive);
        menuRight.setAttribute('aria-hidden', !isActive);
    }

    closeMobileMenu(toggle, menuLeft, menuRight) {
        menuLeft.classList.remove('active');
        menuRight.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
        menuLeft.setAttribute('aria-hidden', 'true');
        menuRight.setAttribute('aria-hidden', 'true');
    }

    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu-left a, .nav-menu-right a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }

    initializeNavbarScroll() {
        let ticking = false;
        let lastScrollTop = 0;
        
        const updateNavbar = () => {
            const navbar = document.querySelector('.navbar');
            const topBanner = document.querySelector('.top-banner');
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (navbar && topBanner) {
                // Enhanced sticky behavior with smooth transitions
                if (scrollTop > 100) {
                    // Add scrolled class for enhanced styling
                    navbar.classList.add('scrolled');
                    
                    // Hide banner on scroll down, show on scroll up
                    if (scrollTop > lastScrollTop && scrollTop > 200) {
                        // Scrolling down - hide banner
                        topBanner.classList.add('hidden');
                        navbar.classList.add('banner-hidden');
                    } else if (scrollTop < lastScrollTop) {
                        // Scrolling up - show banner
                        topBanner.classList.remove('hidden');
                        navbar.classList.remove('banner-hidden');
                    }
                } else {
                    // At top - show everything
                    navbar.classList.remove('scrolled');
                    topBanner.classList.remove('hidden');
                    navbar.classList.remove('banner-hidden');
                }
                
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }

    initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Hero Video
    initializeHeroVideo() {
        const video = document.querySelector('.hero-video');
        const placeholder = document.querySelector('.hero-video-placeholder');

        if (!video || !placeholder) return;

        let videoLoaded = false;

        const showVideo = () => {
            if (!videoLoaded) {
                videoLoaded = true;
                video.style.display = 'block';
                placeholder.style.display = 'none';
            }
        };

        const showFallback = () => {
            video.style.display = 'none';
            placeholder.style.display = 'block';
        };

        // Try to load and play video
        video.addEventListener('canplaythrough', () => {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(showVideo).catch(showFallback);
            }
        });

        video.addEventListener('error', showFallback);

        // Timeout fallback
        setTimeout(() => {
            if (!videoLoaded) {
                showFallback();
            }
        }, 5000);

        video.load();
    }

    // Scroll Effects
    initializeScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        const animateElements = document.querySelectorAll(
            '.property-card, .scene-item, .value-card, .team-member, .review-slide, .faq-item'
        );

        animateElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Animations
    initializeAnimations() {
        // Trust badge hover effect
        const trustBadges = document.querySelectorAll('.trust-badge');
        trustBadges.forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'scale(1.05)';
            });
            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'scale(1)';
            });
        });
    }

    // Forms
    initializeForms() {
        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(e.target);
            });
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(e.target);
            });
        }

        // Form validation
        this.initializeFormValidation();
    }

    handleNewsletterSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;
        if (email) {
            this.showNotification('Thank you for joining the Coconut Cartel! You\'ll receive insider tips and exclusive offers soon.', 'success');
            form.reset();
        }
    }

    handleContactSubmit(form) {
        const formData = new FormData(form);
        const name = formData.get('fullName');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || !email || !message) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            this.showNotification('Masha danki! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            form.reset();
        }, 2000);
    }

    initializeFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;

        let isValid = true;
        let errorMessage = '';

        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        this.showFieldError(field, isValid ? '' : errorMessage);
    }

    showFieldError(field, message) {
        let errorElement = field.parentNode.querySelector('.form-error');
        
        if (message) {
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'form-error';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
            field.classList.add('error');
        } else {
            if (errorElement) {
                errorElement.remove();
            }
            field.classList.remove('error');
        }
    }

    clearFieldError(field) {
        this.showFieldError(field, '');
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Carousels
    initializeCarousels() {
        const carousels = document.querySelectorAll('.reviews-carousel');
        carousels.forEach(carousel => {
            new ReviewsCarousel(carousel);
        });

        // Scene 5 dual image carousel
        const scene5Container = document.querySelector('.scene5-dual-images');
        if (scene5Container) {
            new Scene5Carousel(scene5Container);
        }
    }

    // FAQ
    initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (!question || !answer) return;

            // Set initial state
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease';

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';

                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        
                        if (otherQuestion && otherAnswer) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });

                // Toggle current item
                if (isExpanded) {
                    question.setAttribute('aria-expanded', 'false');
                    answer.style.maxHeight = '0';
                } else {
                    question.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // Modals
    initializeModals() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });

        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal(button.closest('.modal'));
            });
        });

        // Close modal when clicking backdrop
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Property Filters (for rentals page)
    initializePropertyFilters() {
        const filtersContainer = document.querySelector('.property-filters');
        if (!filtersContainer) return;

        const locationFilter = document.getElementById('location-filter');
        const guestsFilter = document.getElementById('guests-filter');
        const priceFilter = document.getElementById('price-filter');
        const amenitiesFilter = document.getElementById('amenities-filter');
        const clearFiltersBtn = document.getElementById('clear-filters');

        if (!locationFilter) return;

        const applyFilters = () => {
            const filters = {
                location: locationFilter.value,
                guests: guestsFilter?.value,
                price: priceFilter?.value,
                amenities: amenitiesFilter?.value
            };

            this.filterProperties(filters);
        };

        [locationFilter, guestsFilter, priceFilter, amenitiesFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', applyFilters);
            }
        });

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', this.clearAllFilters.bind(this));
        }
    }

    filterProperties(filters) {
        const properties = document.querySelectorAll('.property-card');
        let visibleCount = 0;

        properties.forEach(property => {
            const shouldShow = this.shouldShowProperty(property, filters);
            
            if (shouldShow) {
                property.classList.remove('hidden');
                property.style.animation = 'fadeInUp 0.6s ease-out';
                visibleCount++;
            } else {
                property.classList.add('hidden');
            }
        });

        // Update count
        const countElement = document.getElementById('filtered-count');
        if (countElement) {
            countElement.textContent = visibleCount;
        }
    }

    shouldShowProperty(property, filters) {
        // This would be customized based on your property data structure
        // For now, returning true to show all properties
        return true;
    }

    clearAllFilters() {
        const filters = document.querySelectorAll('.property-filters select');
        filters.forEach(filter => {
            filter.value = 'all';
        });

        const properties = document.querySelectorAll('.property-card');
        properties.forEach(property => {
            property.classList.remove('hidden');
        });

        const countElement = document.getElementById('filtered-count');
        if (countElement) {
            countElement.textContent = properties.length;
        }
    }

    // Utilities
    showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = `notification notification-${type}`;
            document.body.appendChild(notification);

            // Add CSS if not already present
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 16px 24px;
                        border-radius: 8px;
                        color: white;
                        font-weight: 600;
                        z-index: 10000;
                        transform: translateX(100%);
                        transition: transform 0.3s ease;
                    }
                    .notification.show { transform: translateX(0); }
                    .notification-success { background: #10b981; }
                    .notification-error { background: #ef4444; }
                    .notification-info { background: #3b82f6; }
                `;
                document.head.appendChild(style);
            }
        }

        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

/**
 * Reviews Carousel Component
 */
class ReviewsCarousel {
    constructor(element) {
        this.element = element;
        this.slides = element.querySelectorAll('.review-slide');
        this.dots = element.querySelectorAll('.carousel-dot');
        this.prevBtn = element.querySelector('.carousel-prev');
        this.nextBtn = element.querySelector('.carousel-next');
        this.currentSlide = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        this.showSlide(0);
        this.startAutoPlay();

        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause on hover
        this.element.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.element.addEventListener('mouseleave', () => this.resumeAutoPlay());

        // Touch support
        this.addTouchSupport();
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        if (this.slides[index]) {
            this.slides[index].classList.add('active');
            this.currentSlide = index;
        }

        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    resumeAutoPlay() {
        this.startAutoPlay();
    }

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.resumeAutoPlay();
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;

        this.element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.element.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
}

/**
 * Scene 5 Carousel Component
 */
class Scene5Carousel {
    constructor(element) {
        this.element = element;
        this.images = element.querySelectorAll('.scene5-image');
        this.currentIndex = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        if (this.images.length < 2) return;

        this.showImage(0);
        this.startAutoPlay();

        this.element.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.element.addEventListener('mouseleave', () => this.resumeAutoPlay());
    }

    showImage(index) {
        this.images.forEach(img => img.classList.remove('active'));
        if (this.images[index]) {
            this.images[index].classList.add('active');
            this.currentIndex = index;
        }
    }

    nextImage() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(nextIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextImage();
        }, 4000);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    resumeAutoPlay() {
        this.startAutoPlay();
    }
}

// Initialize app when DOM is ready
const app = new TommyCoconutApp();