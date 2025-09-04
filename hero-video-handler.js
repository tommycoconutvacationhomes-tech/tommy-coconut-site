// Hero Video Handler
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-video');
    const heroPlaceholder = document.querySelector('.hero-video-placeholder');
    
    if (heroVideo) {
        // Handle video loading
        heroVideo.addEventListener('loadstart', function() {
            console.log('Hero video loading started');
        });
        
        heroVideo.addEventListener('canplay', function() {
            console.log('Hero video can play');
            heroVideo.style.opacity = '1';
            if (heroPlaceholder) {
                heroPlaceholder.style.display = 'none';
            }
        });
        
        heroVideo.addEventListener('error', function(e) {
            console.error('Hero video failed to load:', e);
            heroVideo.style.opacity = '0';
            if (heroPlaceholder) {
                heroPlaceholder.style.display = 'block';
            }
        });
        
        // Force play if needed (some browsers require user interaction)
        heroVideo.addEventListener('loadedmetadata', function() {
            heroVideo.play().catch(function(error) {
                console.warn('Autoplay prevented:', error);
                // Show placeholder if autoplay fails
                if (heroPlaceholder) {
                    heroPlaceholder.style.display = 'block';
                }
            });
        });
        
        // Intersection Observer for better performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(console.warn);
                } else {
                    heroVideo.pause();
                }
            });
        });
        
        observer.observe(heroVideo);
    }
});