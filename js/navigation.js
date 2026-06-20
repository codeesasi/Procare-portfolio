/**
 * @fileoverview Navigation and Swiper slider module.
 * @author ProCare Development Team
 * @version 1.0.0
 */

'use strict';

/**
 * Navigation controller for page transitions and progress tracking.
 * @class
 */
const NavigationController = {
    /** @type {Object|null} */
    swiperInstance: null,

    /** @type {NodeList|null} */
    navItems: null,

    /** @type {HTMLElement|null} */
    progressBar: null,

    /**
     * Swiper configuration options.
     * @constant {Object}
     */
    SWIPER_CONFIG: Object.freeze({
        direction: 'horizontal',
        speed: 800,
        effect: 'slide',
        allowTouchMove: true,
        keyboard: { enabled: true },
        mousewheel: { enabled: true, forceToAxis: true }
    }),

    /**
     * Initializes the navigation controller.
     * @returns {void}
     */
    init() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.progressBar = document.getElementById('progressBar');

        this.initSwiper();
        this.bindNavigation();
        this.bindButtonNavigation();
        this.updateProgress(0, this.getTotalSlides());
    },

    /**
     * Initializes the Swiper slider.
     * @returns {void}
     */
    initSwiper() {
        const config = {
            ...this.SWIPER_CONFIG,
            on: {
                slideChange: () => this.handleSlideChange()
            }
        };

        this.swiperInstance = new Swiper('.main-swiper', config);
    },

    /**
     * Handles slide change events.
     * @returns {void}
     */
    handleSlideChange() {
        const activeIndex = this.swiperInstance.activeIndex;
        const totalSlides = this.getTotalSlides();
        const activeSlide = this.swiperInstance.slides[activeIndex];

        this.updateNavItems(activeIndex);
        this.updateProgress(activeIndex, totalSlides);

        if (typeof animateSlideContent === 'function') {
            animateSlideContent(activeSlide);
        }

        // Initialize products grid if navigating to the products page
        if (activeSlide && activeSlide.dataset.page === 'products') {
            if (typeof window.initProducts === 'function') {
                window.initProducts();
            }
        }
    },

    /**
     * Binds click events to navigation items.
     * @returns {void}
     */
    bindNavigation() {
        this.navItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent jump from anchor tags
                const index = parseInt(item.dataset.index, 10);
                this.navigateTo(index);
            });
        });
    },

    /**
     * Binds click events to buttons with data-goto attribute.
     * @returns {void}
     */
    bindButtonNavigation() {
        const buttons = document.querySelectorAll('[data-goto]');

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.goto, 10);
                this.navigateTo(index);
            });
        });
    },

    /**
     * Navigates to a specific slide index.
     * @param {number} index - The slide index to navigate to.
     * @returns {void}
     */
    navigateTo(index) {
        if (this.swiperInstance && index >= 0 && index < this.getTotalSlides()) {
            this.swiperInstance.slideTo(index);
        }
    },

    /**
     * Updates the active state of navigation items.
     * @param {number} activeIndex - The current active slide index.
     * @returns {void}
     */
    updateNavItems(activeIndex) {
        this.navItems.forEach((item, index) => {
            const isActive = index === activeIndex;
            item.classList.toggle('active', isActive);
        });
    },

    /**
     * Updates the progress bar width.
     * @param {number} current - The current slide index.
     * @param {number} total - The total number of slides.
     * @returns {void}
     */
    updateProgress(current, total) {
        if (!this.progressBar || total === 0) {
            return;
        }

        const percentage = ((current + 1) / total) * 100;
        this.progressBar.style.width = `${percentage}%`;
    },

    /**
     * Gets the total number of slides.
     * @returns {number} The total slide count.
     */
    getTotalSlides() {
        return this.swiperInstance?.slides?.length || 0;
    },

    /**
     * Gets the Swiper instance for external use.
     * @returns {Object|null} The Swiper instance.
     */
    getSwiper() {
        return this.swiperInstance;
    }
};

/**
 * Initializes the navigation controller.
 * @returns {void}
 */
function initNavigation() {
    NavigationController.init();
}

/**
 * Updates the navigation state.
 * @param {number} index - The active index.
 * @returns {void}
 */
function updateNavigation(index) {
    NavigationController.updateNavItems(index);
}

/**
 * Updates the progress bar.
 * @param {number} current - Current slide index.
 * @param {number} total - Total slides.
 * @returns {void}
 */
function updateProgress(current, total) {
    NavigationController.updateProgress(current, total);
}

/**
 * Gets the Swiper instance.
 * @returns {Object|null} The Swiper instance.
 */
function getSwiper() {
    return NavigationController.getSwiper();
}

/**
 * Mobile menu controller for hamburger menu functionality.
 * @class
 */
const MobileMenuController = {
    /** @type {HTMLElement|null} */
    hamburgerBtn: null,

    /** @type {HTMLElement|null} */
    navMenu: null,

    /** @type {HTMLElement|null} */
    overlay: null,

    /** @type {boolean} */
    isOpen: false,

    /**
     * Initializes the mobile menu controller.
     * @returns {void}
     */
    init() {
        this.hamburgerBtn = document.getElementById('hamburgerBtn');
        this.navMenu = document.getElementById('navMenu');

        if (!this.hamburgerBtn || !this.navMenu) {
            return;
        }

        this.createOverlay();
        this.bindEvents();
    },

    /**
     * Creates the mobile menu overlay element.
     * @returns {void}
     */
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'mobile-menu-overlay';
        this.overlay.id = 'mobileMenuOverlay';
        document.body.appendChild(this.overlay);
    },

    /**
     * Binds event listeners.
     * @returns {void}
     */
    bindEvents() {
        // Hamburger button toggle
        this.hamburgerBtn.addEventListener('click', () => this.toggle());

        // Close on overlay click
        this.overlay.addEventListener('click', () => this.close());

        // Close on nav item click
        const navItems = this.navMenu.querySelectorAll('.nav-item');
        navItems.forEach((item) => {
            item.addEventListener('click', () => this.close());
        });

        // Close on escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Close on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.close();
            }
        });
    },

    /**
     * Toggles the mobile menu state.
     * @returns {void}
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    /**
     * Opens the mobile menu.
     * @returns {void}
     */
    open() {
        this.isOpen = true;
        this.hamburgerBtn.classList.add('active');
        this.navMenu.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Closes the mobile menu.
     * @returns {void}
     */
    close() {
        this.isOpen = false;
        this.hamburgerBtn.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/**
 * Initializes the mobile menu controller.
 * @returns {void}
 */
function initMobileMenu() {
    MobileMenuController.init();
}
