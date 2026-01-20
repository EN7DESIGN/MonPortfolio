
/**
 * Global Loader Script
 * Handles the loading screen for all pages.
 * Waits for:
 * 1. DOM Content Loaded
 * 2. All assets (images, styles) via window.load
 * 3. Fonts loaded
 */

(function() {
    // Helper to hide loader
    function hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            // Add hidden class to trigger CSS transition
            loader.classList.add('hidden');
            
            // Remove from DOM after transition to avoid z-index issues
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600); // 400ms transition + buffer
        }
    }

    // Main load handler
    async function initLoader() {
        // Ensure minimum display time for UX (avoid flickering on fast connections)
        const minLoadTime = new Promise(resolve => setTimeout(resolve, 800));
        
        // Wait for window load (images, etc.)
        const windowLoad = new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });

        // Wait for fonts
        const fontLoad = document.fonts ? document.fonts.ready : Promise.resolve();

        try {
            await Promise.all([minLoadTime, windowLoad, fontLoad]);
        } catch (err) {
            console.warn('Loader error:', err);
        } finally {
            hideLoader();
        }
    }

    // Initialize
    initLoader();
})();
