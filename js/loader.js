/**
 * @fileoverview Page content loader module with fallback support.
 * @author ProCare Development Team
 * @version 1.0.0
 */

'use strict';

/**
 * Page loader controller for dynamic content loading.
 * @class
 */
const PageLoader = {
    /**
     * Checks if running on file:// protocol.
     * @returns {boolean} True if using file protocol.
     */
    isFileProtocol() {
        return window.location.protocol === 'file:';
    },

    /**
     * Loads all page content into slide elements.
     * @returns {Promise<void>}
     */
    async loadAllPages() {
        const slides = document.querySelectorAll('.swiper-slide[data-page]');
        const usesFallback = this.isFileProtocol();

        const loadPromises = Array.from(slides).map((slide) => {
            return this.loadPageContent(slide, usesFallback);
        });

        await Promise.all(loadPromises);
    },

    /**
     * Loads content for a single slide.
     * @param {HTMLElement} slide - The slide element.
     * @param {boolean} useFallback - Whether to use fallback content.
     * @returns {Promise<void>}
     */
    async loadPageContent(slide, useFallback) {
        const pageName = slide.dataset.page;

        if (!pageName) {
            return;
        }

        if (useFallback) {
            slide.innerHTML = this.getFallbackContent(pageName);
            if (pageName === 'products' && typeof window.initProducts === 'function') {
                window.initProducts();
            }
            return;
        }

        try {
            const content = await this.fetchPageContent(pageName);
            slide.innerHTML = content;
            if (pageName === 'products' && typeof window.initProducts === 'function') {
                window.initProducts();
            }
        } catch (error) {
            slide.innerHTML = this.getFallbackContent(pageName);
            if (pageName === 'products' && typeof window.initProducts === 'function') {
                window.initProducts();
            }
        }
    },

    /**
     * Fetches page content from the server.
     * @param {string} pageName - The page name to fetch.
     * @returns {Promise<string>} The page HTML content.
     * @throws {Error} If fetch fails.
     */
    async fetchPageContent(pageName) {
        const response = await fetch(`pages/${pageName}.html`);

        if (!response.ok) {
            throw new Error(`Failed to load page: ${pageName}`);
        }

        return response.text();
    },

    /**
     * Gets fallback content for a page.
     * @param {string} pageName - The page name.
     * @returns {string} The fallback HTML content.
     */
    getFallbackContent(pageName) {
        return FALLBACK_CONTENT[pageName] || '<p>Content not available</p>';
    }
};

/**
 * Loads all page content.
 * @returns {Promise<void>}
 */
async function loadAllPages() {
    await PageLoader.loadAllPages();
}
