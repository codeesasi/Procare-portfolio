/**
 * @fileoverview Modal popup module for service details.
 * @author ProCare Development Team
 * @version 1.0.0
 */

'use strict';

/**
 * Service details data for modal popups.
 * @constant {Object}
 */
const SERVICE_DETAILS = Object.freeze({
    sports: {
        title: 'Sports Injury Rehabilitation',
        icon: 'fa-person-running',
        description: 'Our sports injury rehabilitation program is designed specifically for athletes and active individuals. We provide comprehensive treatment for sprains, strains, fractures, and overuse injuries.',
        features: [
            'Personalized recovery programs',
            'Performance enhancement training',
            'Injury prevention strategies',
            'Return-to-sport protocols'
        ]
    },
    neurological: {
        title: 'Neurological Rehabilitation',
        icon: 'fa-brain',
        description: 'Specialized care for patients recovering from stroke, brain injuries, and neurological conditions. Our team uses evidence-based techniques to restore function and independence.',
        features: [
            'Stroke recovery programs',
            'Balance and coordination therapy',
            'Cognitive rehabilitation',
            'Mobility restoration'
        ]
    },
    orthopedic: {
        title: 'Orthopedic Care',
        icon: 'fa-bone',
        description: 'Expert treatment for joint pain, arthritis, and musculoskeletal disorders. We focus on reducing pain, improving mobility, and preventing future injuries.',
        features: [
            'Joint replacement rehabilitation',
            'Arthritis management',
            'Spinal care programs',
            'Manual therapy techniques'
        ]
    },
    geriatric: {
        title: 'Geriatric Physiotherapy',
        icon: 'fa-person-cane',
        description: 'Compassionate care tailored for seniors to improve mobility, balance, and quality of life. We help elderly patients maintain independence and prevent falls.',
        features: [
            'Fall prevention programs',
            'Strength and flexibility training',
            'Pain management for seniors',
            'Home safety assessments'
        ]
    },
    postsurgical: {
        title: 'Post-Surgical Rehabilitation',
        icon: 'fa-syringe',
        description: 'Comprehensive recovery programs following surgical procedures. We work closely with surgeons to ensure optimal healing and return to normal activities.',
        features: [
            'Pre-operative preparation',
            'Post-operative care plans',
            'Scar tissue management',
            'Gradual strength rebuilding'
        ]
    },
    workplace: {
        title: 'Workplace Injury Programs',
        icon: 'fa-briefcase-medical',
        description: 'Specialized rehabilitation for work-related injuries. We help employees recover safely and return to work with proper ergonomic guidance.',
        features: [
            'Work conditioning programs',
            'Ergonomic assessments',
            'Return-to-work planning',
            'Injury prevention training'
        ]
    }
});

/**
 * Modal controller for service detail popups.
 * @class
 */
const ModalController = {
    /** @type {HTMLElement|null} */
    modal: null,

    /** @type {HTMLElement|null} */
    modalContent: null,

    /** @type {boolean} */
    isOpen: false,

    /**
     * Initializes the modal controller.
     * @returns {void}
     */
    init() {
        this.createModalElement();
        this.bindEvents();
    },

    /**
     * Creates the modal DOM element.
     * @returns {void}
     */
    createModalElement() {
        const modalHTML = `
            <div class="modal-overlay" id="serviceModal">
                <div class="modal-container">
                    <button class="modal-close" aria-label="Close Modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <div class="modal-header">
                        <div class="modal-icon"><i class="fa-solid fa-star"></i></div>
                        <h3 class="modal-title">Service Title</h3>
                    </div>
                    <div class="modal-body">
                        <p class="modal-description">Description here</p>
                        <ul class="modal-features"></ul>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-primary" data-goto="4">Book Appointment</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('serviceModal');
        this.modalContent = this.modal.querySelector('.modal-container');
    },

    /**
     * Binds event listeners.
     * @returns {void}
     */
    bindEvents() {
        // Close on overlay click
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        // Close button
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.close());

        // Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Book appointment button navigation
        const bookBtn = this.modal.querySelector('[data-goto]');
        bookBtn.addEventListener('click', () => {
            this.close();
            const index = Number.parseInt(bookBtn.dataset.goto, 10);
            if (typeof NavigationController !== 'undefined') {
                NavigationController.navigateTo(index);
            }
        });
    },

    /**
     * Opens the modal with service details.
     * @param {string} serviceKey - The service identifier.
     * @returns {void}
     */
    open(serviceKey) {
        const service = SERVICE_DETAILS[serviceKey];

        if (!service) {
            return;
        }

        // Update content
        const icon = this.modal.querySelector('.modal-icon i');
        const title = this.modal.querySelector('.modal-title');
        const description = this.modal.querySelector('.modal-description');
        const features = this.modal.querySelector('.modal-features');

        icon.className = `fa-solid ${service.icon}`;
        title.textContent = service.title;
        description.textContent = service.description;

        features.innerHTML = service.features
            .map(feature => `<li><i class="fa-solid fa-check"></i>${feature}</li>`)
            .join('');

        // Show modal with animation
        this.modal.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(
                this.modalContent,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        }
    },

    /**
     * Closes the modal.
     * @returns {void}
     */
    close() {
        const hasGsap = typeof gsap !== 'undefined';

        if (hasGsap) {
            gsap.to(this.modalContent, {
                scale: 0.8,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    this.hideModal();
                }
            });
        } else {
            this.hideModal();
        }
    },

    /**
     * Hides the modal immediately.
     * @returns {void}
     */
    hideModal() {
        this.modal.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
};

/**
 * Initializes the modal system.
 * @returns {void}
 */
function initModal() {
    ModalController.init();
}

/**
 * Sets up service card click handlers.
 * Should be called after content loads.
 * @returns {void}
 */
function setupServiceCardClicks() {
    const serviceCards = document.querySelectorAll('.service-card[data-service]');

    serviceCards.forEach((card) => {
        card.addEventListener('click', () => {
            const serviceKey = card.dataset.service;
            ModalController.open(serviceKey);
        });
    });
}
