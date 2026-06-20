/**
 * @fileoverview Counter animation module for statistics display.
 * @author ProCare Development Team
 * @version 1.0.0
 */

'use strict';

/**
 * Counter animation controller for number increment effects.
 * @class
 */
const CounterController = {
    /**
     * Animation configuration.
     * @constant {Object}
     */
    CONFIG: Object.freeze({
        DURATION: 2,
        EASE: 'power2.out',
        DECIMAL_PLACES: 1
    }),

    /**
     * Animates a single counter element.
     * @param {HTMLElement} element - The counter element.
     * @param {number} endValue - The final value to count to.
     * @param {string} suffix - Optional suffix (e.g., '+', '%').
     * @param {number} decimals - Number of decimal places.
     * @returns {void}
     */
    animateCounter(element, endValue, suffix = '', decimals = 0) {
        if (!element || typeof gsap === 'undefined') {
            return;
        }

        const counter = { value: 0 };

        gsap.to(counter, {
            value: endValue,
            duration: this.CONFIG.DURATION,
            ease: this.CONFIG.EASE,
            onUpdate: () => {
                const displayValue = decimals > 0
                    ? counter.value.toFixed(decimals)
                    : Math.floor(counter.value);
                element.textContent = displayValue + suffix;
            }
        });
    },

    /**
     * Initializes all counters in a container.
     * @param {HTMLElement} container - The container to search in.
     * @returns {void}
     */
    initCounters(container) {
        if (!container) {
            return;
        }

        const counters = container.querySelectorAll('[data-counter]');

        counters.forEach((counter) => {
            const value = Number.parseFloat(counter.dataset.counter);
            const suffix = counter.dataset.suffix || '';
            const decimals = Number.parseInt(counter.dataset.decimals || '0', 10);

            if (!Number.isNaN(value)) {
                this.animateCounter(counter, value, suffix, decimals);
            }
        });
    },

    /**
     * Resets counters to zero for re-animation.
     * @param {HTMLElement} container - The container to search in.
     * @returns {void}
     */
    resetCounters(container) {
        if (!container) {
            return;
        }

        const counters = container.querySelectorAll('[data-counter]');

        counters.forEach((counter) => {
            counter.textContent = '0';
        });
    }
};

/**
 * Animates counters in a slide when it becomes active.
 * @param {HTMLElement} slide - The slide element.
 * @returns {void}
 */
function animateCounters(slide) {
    CounterController.initCounters(slide);
}
