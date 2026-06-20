/**
 * @fileoverview Map Modal Component JavaScript
 * @author ProCare Development Team
 * @version 1.0.0
 */

'use strict';

/**
 * Opens the map modal popup showing clinic location.
 */
function openMapModal() {
    const modal = document.getElementById('mapModal');
    if (modal) {
        // Lazy-load the map iframe on first open
        const iframe = document.getElementById('mapIframe');
        if (iframe && !iframe.src && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Closes the map modal popup.
 */
function closeMapModal() {
    const modal = document.getElementById('mapModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}


/**
 * Opens Google Maps in a new tab with directions from user's location to clinic.
 */
function initMapModal() {
    // Disabled: Click-outside-to-close (user requested modal to stay open)
    // Uncomment below to re-enable:
    /*
    document.addEventListener('click', function (e) {
        const modal = document.getElementById('mapModal');
        if (e.target === modal) {
            closeMapModal();
        }
    });
    */
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMapModal);
} else {
    initMapModal();
}
