/**
 * @fileoverview GSAP animation module for slide content transitions.
 * @author ProCare Development Team
 * @version 1.0.0
 */

'use strict';

/**
 * Animation controller for GSAP-based slide transitions.
 * @class
 */
const AnimationController = {
    /**
     * CSS selectors for animatable elements.
     * @constant {string[]}
     */
    ANIMATABLE_SELECTORS: Object.freeze([
        '.tag',
        '.title',
        '.subtitle',
        '.text',
        '.cta-group',
        '.trust-badges',
        '.feature',
        '.feature-card',
        '.service-card',
        '.team-card',
        '.value-card',
        '.process-card',
        '.faq-item',
        '.info-row',
        '.form-card'
    ]),

    /**
     * CSS selectors for image elements.
     * @constant {string[]}
     */
    IMAGE_SELECTORS: Object.freeze([
        '.hero-image-wrapper',
        '.about-image-stack',
        '.wellness-img'
    ]),

    /**
     * Checks if GSAP library is available.
     * @returns {boolean} True if GSAP is loaded.
     */
    isGsapAvailable() {
        return typeof gsap !== 'undefined';
    },

    /**
     * Animates the content of a slide.
     * @param {HTMLElement} slide - The slide element to animate.
     * @returns {void}
     */
    animateSlide(slide) {
        if (!this.isGsapAvailable() || !slide) {
            return;
        }

        // Kill previous animations to prevent conflicts
        gsap.killTweensOf(slide.querySelectorAll('*'));

        this.animateTextElements(slide);
        this.animateImageElements(slide);

        // Trigger counter animations if available
        if (typeof animateCounters === 'function') {
            animateCounters(slide);
        }

        // Trigger typewriter for home slide
        if (slide.classList.contains('slide-home') && typeof Typewriter !== 'undefined') {
            setTimeout(() => {
                Typewriter.type('#tamil-quote', [
                    '"பக்கவாதம் இல்லாத சமுதாயத்தை உருவாக்குவோம்"',
                    '"பக்கவாதத்திற்கான சிறப்பு சிகிச்சை அளிக்கப்படுகிறது"'
                ], 25, false); // Smooth: faster speed, no randomization
            }, 300);
        }
    },

    /**
     * Animates text and component elements with stagger effect.
     * @param {HTMLElement} slide - The slide element.
     * @returns {void}
     */
    animateTextElements(slide) {
        const selector = this.ANIMATABLE_SELECTORS.join(', ');
        const elements = slide.querySelectorAll(selector);

        if (elements.length === 0) {
            return;
        }

        gsap.fromTo(
            elements,
            {
                y: 30,
                autoAlpha: 0, // Handles opacity + visibility
                filter: 'blur(10px)'
            },
            {
                y: 0,
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: APP_CONFIG.ANIMATION_DURATION,
                stagger: 0.1,
                ease: 'power2.out',
                clearProps: 'all' // Completely clean up inline styles to prevent "stuck" rendering
            }
        );
    },

    /**
     * Animates image elements with scale effect.
     * @param {HTMLElement} slide - The slide element.
     * @returns {void}
     */
    animateImageElements(slide) {
        const selector = this.IMAGE_SELECTORS.join(', ');
        const images = slide.querySelectorAll(selector);

        if (images.length === 0) {
            return;
        }

        gsap.fromTo(
            images,
            { scale: 0.9, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: 'power3.out'
            }
        );
    }
};

/**
 * Animates the content of a specific slide.
 * @param {HTMLElement} slide - The slide element to animate.
 * @returns {void}
 */
function animateSlideContent(slide) {
    AnimationController.animateSlide(slide);
}

/**
 * Animates the initially active slide on page load.
 * @returns {void}
 */
function animateInitialSlide() {
    const activeSlide = document.querySelector('.swiper-slide-active');

    if (activeSlide) {
        AnimationController.animateSlide(activeSlide);
    }
}
