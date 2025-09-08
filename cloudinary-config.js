// Cloudinary Configuration for Tommy Coconut
// Replace 'YOUR_CLOUD_NAME' with your actual Cloudinary cloud name

const CloudinaryConfig = {
    // Your Cloudinary cloud name (found in dashboard)
    cloudName: 'dhschyq40', // Tommy Coconut Cloudinary account
    
    // Base URL for all Cloudinary assets
    baseURL: function() {
        return `https://res.cloudinary.com/${this.cloudName}`;
    },
    
    // Default transformations for all images
    defaultImageTransform: 'f_auto,q_auto,w_auto,dpr_auto',
    
    // Video transformations
    defaultVideoTransform: 'f_auto,q_auto,vc_auto',
    
    // Folder structure in Cloudinary
    folders: {
        villas: 'tommy-coconut/villas',
        heroes: 'tommy-coconut/heroes',
        icons: 'tommy-coconut/icons',
        reviews: 'tommy-coconut/reviews',
        videos: 'tommy-coconut/videos'
    }
};

// Helper Functions for Cloudinary URLs
class CloudinaryHelper {
    constructor(config = CloudinaryConfig) {
        this.config = config;
    }
    
    // Generate optimized image URL
    getImageURL(publicId, transformations = {}) {
        const baseTransform = this.config.defaultImageTransform;
        
        // Build custom transformations
        let customTransform = '';
        if (transformations.width) customTransform += `,w_${transformations.width}`;
        if (transformations.height) customTransform += `,h_${transformations.height}`;
        if (transformations.crop) customTransform += `,c_${transformations.crop}`;
        if (transformations.quality) customTransform += `,q_${transformations.quality}`;
        if (transformations.effect) customTransform += `,e_${transformations.effect}`;
        
        return `${this.config.baseURL()}/image/upload/${baseTransform}${customTransform}/${publicId}`;
    }
    
    // Generate responsive image srcset
    getResponsiveSrcSet(publicId, sizes = [400, 800, 1200, 1600]) {
        return sizes.map(size => {
            const url = this.getImageURL(publicId, { width: size });
            return `${url} ${size}w`;
        }).join(', ');
    }
    
    // Generate video URL with optimizations
    getVideoURL(publicId, options = {}) {
        const transform = options.transform || this.config.defaultVideoTransform;
        return `${this.config.baseURL()}/video/upload/${transform}/${publicId}`;
    }
    
    // Generate placeholder (blur) image for lazy loading
    getPlaceholderURL(publicId) {
        return this.getImageURL(publicId, {
            width: 100,
            quality: 10,
            effect: 'blur:1000'
        });
    }
    
    // Villa image URLs mapping (to be updated with actual Cloudinary public IDs)
    villaImages: {
        'Villa Coral Vista': 'tommy-coconut/villas/coral-vista',
        'Villa Ocean Dreams': 'tommy-coconut/villas/ocean-dreams',
        'Villa Sunset Paradise': 'tommy-coconut/villas/sunset-paradise',
        'Villa Beach Haven': 'tommy-coconut/villas/beach-haven'
    },
    
    // Get villa image URL by name
    getVillaImage(villaName, transformations = {}) {
        const publicId = this.villaImages[villaName];
        if (!publicId) {
            console.warn(`Villa image not found for: ${villaName}`);
            return this.getImageURL('tommy-coconut/villas/default', transformations);
        }
        return this.getImageURL(publicId, transformations);
    }
}

// Lazy Loading Implementation
class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }
    
    init() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Observe all images with data-cloudinary attribute
            this.observeImages();
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            this.loadAllImages();
        }
    }
    
    observeImages() {
        const images = document.querySelectorAll('img[data-cloudinary]');
        images.forEach(img => this.imageObserver.observe(img));
    }
    
    loadImage(img) {
        const src = img.dataset.cloudinary;
        const srcset = img.dataset.srcset;
        
        if (src) {
            // Add loading animation
            img.classList.add('loading');
            
            // Create new image to preload
            const newImg = new Image();
            newImg.onload = () => {
                img.src = src;
                if (srcset) img.srcset = srcset;
                img.classList.remove('loading');
                img.classList.add('loaded');
            };
            newImg.src = src;
        }
    }
    
    loadAllImages() {
        const images = document.querySelectorAll('img[data-cloudinary]');
        images.forEach(img => this.loadImage(img));
    }
}

// Progressive Image Loading (blur-up effect)
class ProgressiveImageLoader {
    constructor(cloudinaryHelper) {
        this.cloudinary = cloudinaryHelper;
    }
    
    load(img, publicId) {
        // Load placeholder first
        const placeholder = this.cloudinary.getPlaceholderURL(publicId);
        img.src = placeholder;
        img.classList.add('progressive-placeholder');
        
        // Load full image
        const fullImage = new Image();
        fullImage.onload = () => {
            img.src = this.cloudinary.getImageURL(publicId);
            img.classList.remove('progressive-placeholder');
            img.classList.add('progressive-loaded');
        };
        fullImage.src = this.cloudinary.getImageURL(publicId);
    }
}

// Initialize on DOM ready
let cloudinary, lazyLoader, progressiveLoader;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Cloudinary helper
    cloudinary = new CloudinaryHelper();
    
    // Initialize lazy loading
    lazyLoader = new LazyImageLoader();
    
    // Initialize progressive loading
    progressiveLoader = new ProgressiveImageLoader(cloudinary);
    
    // Add CSS for loading effects
    if (!document.getElementById('cloudinary-styles')) {
        const style = document.createElement('style');
        style.id = 'cloudinary-styles';
        style.textContent = `
            /* Loading animation */
            img.loading {
                filter: blur(5px);
                opacity: 0.8;
                transition: filter 0.3s, opacity 0.3s;
            }
            
            img.loaded {
                filter: blur(0);
                opacity: 1;
            }
            
            /* Progressive loading */
            img.progressive-placeholder {
                filter: blur(20px);
                transform: scale(1.05);
                transition: all 0.3s ease-out;
            }
            
            img.progressive-loaded {
                filter: blur(0);
                transform: scale(1);
            }
            
            /* Responsive images */
            img[data-cloudinary] {
                width: 100%;
                height: auto;
                display: block;
            }
        `;
        document.head.appendChild(style);
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CloudinaryConfig, CloudinaryHelper, LazyImageLoader, ProgressiveImageLoader };
}