/**
 * @fileoverview Main application entry point for ProCare website.
 * @author ProCare Development Team
 * @version 1.0.0
 */

'use strict';

/**
 * Main application controller.
 * @class
 */
const App = {
    /**
     * Initializes the application.
     * @returns {Promise<void>}
     */
    async init() {
        try {
            await this.bootstrap();
        } catch (error) {
            this.handleInitError(error);
        }
    },

    /**
     * Bootstraps all application modules in the correct order.
     * @returns {Promise<void>}
     */
    async bootstrap() {
        // 1. Load page content first
        await loadAllPages();

        // 1.5 Initialize home page background image slider
        initHomeBgSlider();

        // 2. Initialize theme toggle
        initTheme();

        // 3. Initialize navigation and swiper
        initNavigation();

        // 4. Initialize mobile menu (hamburger)
        if (typeof initMobileMenu === 'function') {
            initMobileMenu();
        }

        // 5. Initialize modal popup
        if (typeof initModal === 'function') {
            initModal();
        }

        // 6. Animate the initial slide
        animateInitialSlide();

        // 7. Setup service card click handlers
        if (typeof setupServiceCardClicks === 'function') {
            setupServiceCardClicks();
        }

        // 9. Initialize FAQ accordion
        initFaq();

        // 10. Load sub-includes (About sections)
        await loadIncludes();

        // 10.5 Initialize Reviews Swiper (after includes loaded)
        if (typeof initReviews === 'function') {
            initReviews();
        }

        // 11. Initialize About Page Swiper
        initAboutSwiper();

        // 12. Load Team Members dynamically
        await loadTeamMembers();

        // 13. Load Reviews dynamically
        await loadReviews();
    },

    /**
     * Handles initialization errors.
     * @param {Error} error - The error that occurred.
     * @returns {void}
     */
    handleInitError(error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Log to console in development
        if (this.isDevelopment()) {
            console.error('App initialization failed:', errorMessage);
        }
    },

    /**
     * Checks if running in development mode.
     * @returns {boolean} True if in development.
     */
    isDevelopment() {
        const location = globalThis.location || {};
        return location.hostname === 'localhost'
            || location.hostname === '127.0.0.1'
            || location.protocol === 'file:';
    }
};

/**
 * DOMContentLoaded event handler.
 * @returns {void}
 */
function onDOMReady() {
    App.init();
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', onDOMReady);

/**
 * Initializes the FAQ accordion functionality.
 */
/**
 * Initializes the FAQ accordion functionality.
 */
function initFaq() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Loads included HTML content.
 */
async function loadIncludes() {
    const includes = document.querySelectorAll('[data-include]');
    for (const el of includes) {
        const file = el.dataset.include;
        try {
            // If path starts with 'components/', use as-is, otherwise prepend 'pages/'
            const filePath = file.startsWith('components/') ? `${file}.html` : `pages/${file}.html`;
            const response = await fetch(filePath);
            if (response.ok) {
                el.innerHTML = await response.text();
            } else {
                console.error(`Failed to load include: ${file}`);
            }
        } catch (error) {
            console.error(`Error loading include ${file}:`, error);
        }
    }
}

/**
 * Initializes the nested Swiper for the About page.
 */
function initAboutSwiper() {
    // Check if the about swiper container exists
    if (!document.querySelector('.about-swiper')) return;

    // Fixed: Store instance in a variable or attach to window if needed
    const aboutSwiper = new Swiper('.about-swiper', {
        effect: 'fade', // Smooth disappear/appear
        fadeEffect: {
            crossFade: true
        },
        direction: 'horizontal',
        spaceBetween: 0,
        slidesPerView: 1,
        nested: true, // Crucial for nested swipers
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        on: {
            slideChange: function () {
                const activeSlide = this.slides[this.activeIndex];
                // Trigger the global blur-in animation for the new slide
                if (typeof animateSlideContent === 'function') {
                    animateSlideContent(activeSlide);
                }
            }
        },
        speed: 1500, // Slower speed for smoother fade
        grabCursor: true
    });
}

/**
 * Dynamically loads team members from data/team.json and renders them.
 * @returns {Promise<void>}
 */
async function loadTeamMembers() {
    const container = document.getElementById('team-container');
    if (!container) return;

    try {
        const response = await fetch('data/team.json');
        if (!response.ok) throw new Error('Failed to load team data');

        const members = await response.json();

        // Duplicate the list for seamless marquee effect
        const seamlessMembers = [...members, ...members];

        // Generate HTML for all members (Flat Card Design)
        const html = seamlessMembers.map(member => `
            <div class="team-marquee-card">
                <img src="images/${member.image}" alt="${member.name}" loading="lazy">
                <div class="card-overlay">
                    <h4>${member.name}</h4>
                    <span>${member.role}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        // Pause animation on hover functionality is handled via CSS
    } catch (error) {
        console.error('Error loading team members:', error);
        container.innerHTML = '<p>Unable to load team members.</p>';
    }
}

/**
 * Dynamically loads reviews from data/reviews.json and renders them.
 * @returns {Promise<void>}
 */
async function loadReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return; // Only exists on home page

    try {
        const response = await fetch('data/reviews.json');
        if (!response.ok) throw new Error('Failed to load review data');

        const reviews = await response.json();

        // Duplicate list for seamless scrolling
        const seamlessReviews = [...reviews, ...reviews, ...reviews]; // Triple to ensure enough content

        const html = seamlessReviews.map(review => `
            <div class="review-card">
                <div class="review-stars">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
                <p class="review-text">"${review.text}"</p>
                <div class="review-author">
                    <strong>${review.name}</strong>
                    <span class="verified-badge"><i class="fas fa-check-circle"></i> Verified Patient</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading reviews:', error);
        container.style.display = 'none'; // Hide section if failed
    }
}

/**
 * Initializes the background image slider on the home page.
 * Rotates background images from the Gallery folder with crossfades.
 */
function initHomeBgSlider() {
    const sliderContainer = document.querySelector('.home-bg-slider');
    if (!sliderContainer) return;

    const slides = sliderContainer.querySelectorAll('.home-bg-slide');
    if (slides.length <= 1) return;

    let currentIndex = 0;
    const intervalTime = 6000; // Change image every 6 seconds for a slow, premium pace

    setInterval(() => {
        // Remove active class from current slide
        slides[currentIndex].classList.remove('active');

        // Increment index
        currentIndex = (currentIndex + 1) % slides.length;

        // Add active class to new slide
        slides[currentIndex].classList.add('active');
    }, intervalTime);
}