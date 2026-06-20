/**
 * @fileoverview Theme management module for light/dark mode toggle.
 * @author ProCare Development Team
 * @version 1.0.0
 */

'use strict';

/**
 * Theme manager class for handling light/dark mode functionality.
 * @class
 */
const ThemeManager = {
    /** @type {HTMLElement|null} */
    toggleButton: null,

    /** @type {HTMLElement} */
    htmlElement: document.documentElement,

    /**
     * Initializes the theme manager.
     * Sets up event listeners and applies saved/system theme.
     * @returns {void}
     */
    init() {
        this.toggleButton = document.getElementById('themeToggle');

        if (!this.toggleButton) {
            return;
        }

        this.applyInitialTheme();
        this.bindEvents();
    },

    /**
     * Applies the initial theme based on saved preference or system setting.
     * @returns {void}
     */
    applyInitialTheme() {
        const savedTheme = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            this.htmlElement.setAttribute('data-theme', savedTheme);
        } else if (systemPrefersDark) {
            this.htmlElement.setAttribute('data-theme', 'dark');
        }
    },

    /**
     * Binds event listeners for theme toggle and system preference changes.
     * @returns {void}
     */
    bindEvents() {
        this.toggleButton.addEventListener('click', () => this.toggleTheme());

        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (event) => this.handleSystemThemeChange(event));
    },

    /**
     * Toggles between light and dark themes.
     * @returns {void}
     */
    toggleTheme() {
        const currentTheme = this.htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        this.htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(APP_CONFIG.STORAGE_KEY, newTheme);

        this.animateToggle();
    },

    /**
     * Animates the toggle button using GSAP if available.
     * @returns {void}
     */
    animateToggle() {
        if (typeof gsap === 'undefined') {
            return;
        }

        gsap.fromTo(
            this.toggleButton,
            { scale: 0.8, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' }
        );
    },

    /**
     * Handles system theme preference changes.
     * Only applies if user hasn't manually set a preference.
     * @param {MediaQueryListEvent} event - The media query change event.
     * @returns {void}
     */
    handleSystemThemeChange(event) {
        const hasUserPreference = localStorage.getItem(APP_CONFIG.STORAGE_KEY) !== null;

        if (!hasUserPreference) {
            this.htmlElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
        }
    },

    /**
     * Gets the current theme.
     * @returns {string} The current theme ('light' or 'dark').
     */
    getCurrentTheme() {
        return this.htmlElement.getAttribute('data-theme') || APP_CONFIG.DEFAULT_THEME;
    }
};

/**
 * Initializes the theme manager.
 * @returns {void}
 */
function initTheme() {
    ThemeManager.init();
}
