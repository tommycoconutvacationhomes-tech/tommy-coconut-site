// Hero Image Carousel Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hero carousel script loaded');
    
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    const prevBtn = document.querySelector('.hero-nav-btn.prev');
    const nextBtn = document.querySelector('.hero-nav-btn.next');
    
    console.log('Found slides:', slides.length);
    console.log('Found indicators:', indicators.length);
    console.log('Found prev button:', !!prevBtn);
    console.log('Found next button:', !!nextBtn);
    
    if (slides.length === 0) {
        console.error('No hero slides found!');
        return;
    }
    
    let currentSlide = 0;
    let slideInterval;
    
    // Ensure first slide is active on load
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (indicators[index]) indicators[index].classList.remove('active');
    });
    slides[0].classList.add('active');
    if (indicators[0]) indicators[0].classList.add('active');
    
    // Show specific slide
    function goToSlide(slideIndex) {
        console.log('Going to slide:', slideIndex);
        
        // Remove active class from all slides and indicators
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (indicators[index]) indicators[index].classList.remove('active');
        });
        
        // Update current slide index
        currentSlide = slideIndex;
        
        // Add active class to new slide and indicator
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
    }
    
    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    // Previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }
    
    // Add event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Previous button clicked');
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next button clicked');
            nextSlide();
        });
    }
    
    // Add indicator listeners
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Indicator clicked:', index);
            goToSlide(index);
        });
    });
    
    // Auto-play functionality
    function startAutoPlay() {
        stopAutoPlay(); // Clear any existing interval
        slideInterval = setInterval(function() {
            console.log('Auto-advancing to next slide');
            nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoPlay);
        heroSection.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Start auto-play
    startAutoPlay();
    
    console.log('Hero carousel initialized successfully');
    
    // Initialize Reviews Carousel
    initReviewsCarousel();
});

// Reviews Carousel Handler
function initReviewsCarousel() {
    const reviewSlides = document.querySelectorAll('.review-slide');
    const reviewIndicators = document.querySelectorAll('.reviews-indicator');
    const reviewPrevBtn = document.querySelector('.reviews-nav-btn.prev');
    const reviewNextBtn = document.querySelector('.reviews-nav-btn.next');
    
    if (reviewSlides.length === 0) {
        console.log('No review slides found');
        return;
    }
    
    let currentReviewSlide = 0;
    let reviewInterval;
    
    // Show specific review slide
    function goToReviewSlide(slideIndex) {
        console.log('Going to review slide:', slideIndex);
        
        // Remove active class from all slides and indicators
        reviewSlides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (reviewIndicators[index]) reviewIndicators[index].classList.remove('active');
        });
        
        // Update current slide index
        currentReviewSlide = slideIndex;
        
        // Add active class to new slide and indicator
        reviewSlides[currentReviewSlide].classList.add('active');
        if (reviewIndicators[currentReviewSlide]) reviewIndicators[currentReviewSlide].classList.add('active');
    }
    
    // Next review slide
    function nextReviewSlide() {
        const nextIndex = (currentReviewSlide + 1) % reviewSlides.length;
        goToReviewSlide(nextIndex);
    }
    
    // Previous review slide
    function prevReviewSlide() {
        const prevIndex = (currentReviewSlide - 1 + reviewSlides.length) % reviewSlides.length;
        goToReviewSlide(prevIndex);
    }
    
    // Add event listeners
    if (reviewPrevBtn) {
        reviewPrevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Review previous button clicked');
            prevReviewSlide();
        });
    }
    
    if (reviewNextBtn) {
        reviewNextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Review next button clicked');
            nextReviewSlide();
        });
    }
    
    // Add indicator listeners
    reviewIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Review indicator clicked:', index);
            goToReviewSlide(index);
        });
    });
    
    // Auto-play functionality for reviews
    function startReviewAutoPlay() {
        stopReviewAutoPlay();
        reviewInterval = setInterval(function() {
            console.log('Auto-advancing to next review slide');
            nextReviewSlide();
        }, 4000); // Change every 4 seconds
    }
    
    function stopReviewAutoPlay() {
        if (reviewInterval) {
            clearInterval(reviewInterval);
            reviewInterval = null;
        }
    }
    
    // Pause on hover for reviews
    const reviewsContainer = document.querySelector('.reviews-carousel-container');
    if (reviewsContainer) {
        reviewsContainer.addEventListener('mouseenter', stopReviewAutoPlay);
        reviewsContainer.addEventListener('mouseleave', startReviewAutoPlay);
    }
    
    // Start auto-play for reviews
    startReviewAutoPlay();
    
    console.log('Reviews carousel initialized successfully');
}