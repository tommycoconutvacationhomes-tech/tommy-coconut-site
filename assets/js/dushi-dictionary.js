/**
 * Dushi Life Dictionary Protocol
 * Elegant hover translations for Papiamento words
 * Tommy Coconut - Authentic Cultural Discovery
 */

(function() {
    'use strict';
    
    let currentTooltip = null;
    let hideTimeout = null;
    
    // Initialize the Dushi Dictionary Protocol
    function initDushiDictionary() {
        const dushiWords = document.querySelectorAll('.dushi-word');
        
        dushiWords.forEach(word => {
            // Mouse enter - show tooltip
            word.addEventListener('mouseenter', showTooltip);
            
            // Mouse leave - hide tooltip with slight delay
            word.addEventListener('mouseleave', hideTooltip);
            
            // Touch support for mobile
            word.addEventListener('touchstart', handleTouch, { passive: true });
        });
        
        // Hide tooltip when clicking anywhere else
        document.addEventListener('click', hideAllTooltips);
    }
    
    function showTooltip(event) {
        const word = event.target;
        const papiamento = word.getAttribute('data-papiamento');
        const translation = word.getAttribute('data-translation');
        
        // Clear any existing hide timeout
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        
        // Remove any existing tooltip
        if (currentTooltip) {
            currentTooltip.remove();
            currentTooltip = null;
        }
        
        // Create new tooltip
        const tooltip = createTooltip(papiamento, translation);
        document.body.appendChild(tooltip);
        currentTooltip = tooltip;
        
        // Position the tooltip
        positionTooltip(tooltip, word);
        
        // Show tooltip with animation
        requestAnimationFrame(() => {
            tooltip.classList.add('show');
        });
    }
    
    function hideTooltip(event) {
        // Add small delay to prevent tooltip from flickering
        hideTimeout = setTimeout(() => {
            if (currentTooltip) {
                currentTooltip.classList.remove('show');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    if (currentTooltip && currentTooltip.parentNode) {
                        currentTooltip.remove();
                        currentTooltip = null;
                    }
                }, 300);
            }
        }, 100);
    }
    
    function hideAllTooltips() {
        if (currentTooltip) {
            currentTooltip.classList.remove('show');
            setTimeout(() => {
                if (currentTooltip && currentTooltip.parentNode) {
                    currentTooltip.remove();
                    currentTooltip = null;
                }
            }, 300);
        }
    }
    
    function handleTouch(event) {
        event.preventDefault();
        
        if (currentTooltip) {
            hideAllTooltips();
        } else {
            showTooltip(event);
            
            // Auto-hide after 3 seconds on mobile
            setTimeout(hideAllTooltips, 3000);
        }
    }
    
    function createTooltip(papiamento, translation) {
        const tooltip = document.createElement('div');
        tooltip.className = 'dushi-tooltip';
        
        const papiamentoEl = document.createElement('div');
        papiamentoEl.className = 'dushi-word-papiamento';
        papiamentoEl.textContent = papiamento;
        
        const translationEl = document.createElement('div');
        translationEl.className = 'dushi-word-translation';
        translationEl.textContent = translation;
        
        tooltip.appendChild(papiamentoEl);
        tooltip.appendChild(translationEl);
        
        return tooltip;
    }
    
    function positionTooltip(tooltip, word) {
        const wordRect = word.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        let top, left;
        let showBelow = false;
        
        // Default: show above
        top = wordRect.top + scrollTop - tooltipRect.height - 12;
        
        // If tooltip would go above viewport, show below
        if (wordRect.top - tooltipRect.height - 12 < 0) {
            top = wordRect.bottom + scrollTop + 12;
            showBelow = true;
            tooltip.classList.add('below');
        }
        
        // Center horizontally on the word
        left = wordRect.left + scrollLeft + (wordRect.width / 2) - (tooltipRect.width / 2);
        
        // Ensure tooltip doesn't go off screen horizontally
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > windowWidth - 10) {
            left = windowWidth - tooltipRect.width - 10;
        }
        
        // Apply position
        tooltip.style.top = Math.max(0, top) + 'px';
        tooltip.style.left = Math.max(0, left) + 'px';
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDushiDictionary);
    } else {
        initDushiDictionary();
    }
    
    // Reinitialize if new content is added dynamically
    window.reinitDushiDictionary = initDushiDictionary;
    
})();