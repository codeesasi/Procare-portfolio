/**
 * @fileoverview Simple Typewriter effect for text elements.
 */

'use strict';

const Typewriter = {
    /**
     * timeouts map to clear existing animations
     */
    timeouts: new Map(),

    /**
     * Types text into a target element.
     * @param {string} selector - CSS selector for the element.
     * @param {string|array} [text] - Text(s) to type.
     * @param {number} [speed] - Typing speed in ms.
     * @param {boolean} [randomize] - Randomize typing speed slightly.
     * @param {boolean} [loop] - Whether to loop through the texts continuously.
     */
    type(selector, text = null, speed = 50, randomize = true, loop = true) {
        const element = document.querySelector(selector);
        if (!element) return;

        // Clear existing animation for this element
        if (this.timeouts.has(selector)) {
            clearTimeout(this.timeouts.get(selector));
        }

        let contentArray = [];
        if (Array.isArray(text)) {
            contentArray = text;
        } else if (typeof text === 'string') {
            contentArray = [text];
        } else if (element.dataset.texts) {
            try { 
                contentArray = JSON.parse(element.dataset.texts); 
            } catch(e) {
                contentArray = [element.dataset.texts];
            }
        } else if (element.dataset.text) {
            contentArray = [element.dataset.text];
        }

        if (contentArray.length === 0) return;

        element.textContent = '';
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const animate = () => {
            const currentText = contentArray[textIndex];
            
            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let delay = randomize ? speed + Math.random() * (speed * 0.5) : speed;

            if (isDeleting) {
                delay /= 2; // Delete faster
            }

            if (!isDeleting && charIndex === currentText.length) {
                // Finished typing current word
                delay = 2500; // Pause at the end for reading
                if (contentArray.length > 1) {
                    if (loop || textIndex < contentArray.length - 1) {
                         isDeleting = true;
                    }
                }
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex++;
                if (textIndex >= contentArray.length) {
                    if (loop) {
                        textIndex = 0;
                    } else {
                        this.timeouts.delete(selector);
                        return; // Stop animation
                    }
                }
                delay = 500; // Pause before typing next
            }

            const timeoutId = setTimeout(animate, delay);
            this.timeouts.set(selector, timeoutId);
        };

        animate();
    }
};

// Expose to window for global access
window.Typewriter = Typewriter;
