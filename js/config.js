/**
 * @fileoverview Configuration and page content constants for ProCare website.
 * @author ProCare Development Team
 * @version 1.0.0
 */

'use strict';

/**
 * List of page identifiers used for navigation and content loading.
 * @constant {string[]}
 */
const PAGES = Object.freeze(['home', 'about', 'services', 'team', 'gallery', 'contact', 'faq', 'products']);

/**
 * Application configuration constants.
 * @constant {Object}
 */
const APP_CONFIG = Object.freeze({
    STORAGE_KEY: 'procare-theme',
    DEFAULT_THEME: 'light',
    ANIMATION_DURATION: 0.8,
    STAGGER_DELAY: 0.1,
    CURSOR_SMOOTHING: 0.15
});

/**
 * Fallback HTML content for each page section.
 * Used when running locally (file:// protocol) or when fetch fails.
 * @constant {Object<string, string>}
 */
const FALLBACK_CONTENT = Object.freeze({
    home: `<div class="slide-content">
        <div class="content-left">
            <span class="tag">Stroke Rehabilitation Centre</span>
            <h1 class="title">Empowering <span>Recovery.</span><br>Restoring <span>Mobility.</span></h1>
            <p class="subtitle">ProCare Physiotherapy & Rehabilitation Centre is dedicated to restoring your mobility, strength, and quality of life through personalized care.</p>
            <div class="cta-group">
                <button class="btn-primary" data-goto="2">Our Services</button>
                <button class="btn-secondary" data-goto="4">Book Now <i class="fa-solid fa-arrow-right"></i></button>
            </div>
            <div class="trust-badges">
                <div class="badge"><strong data-counter="10" data-suffix="+">0</strong><span>Years</span></div>
                <div class="badge"><strong data-counter="200" data-suffix="+">0</strong><span>Patients</span></div>
                <div class="badge"><strong data-counter="4.9" data-decimals="1">0</strong><span>Rating</span></div>
            </div>
        </div>
        <div class="content-right">
            <div class="hero-image-wrapper">
                <img src="images/sendhil.png" alt="Medical Care">
                <div class="floating-card card-1"><i class="fa-solid fa-heart-pulse"></i><span>Expert Care</span></div>
            </div>
        </div>
    </div>`,

    about: `<div class="slide-content">
        <div class="content-left">
            <div class="about-image-stack">
                <img src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" class="img-main" alt="About">
                <div class="experience-badge"><span class="number" data-counter="10" data-suffix="+">0</span><span class="text">Years of Excellence</span></div>
            </div>
        </div>
        <div class="content-right">
            <span class="tag">About Us</span>
            <h2 class="title">Dedicated to Your <span>Health Journey.</span></h2>
            <p class="text">At Procare Rehabilitation Center, we are dedicated to supporting your journey toward better health and mobility. Our team of experienced professionals provides expert care and personalized rehabilitation programs.</p>
            <div class="feature-list">
                <div class="feature"><div class="feature-icon"><i class="fa-solid fa-check"></i></div><div><strong>Compassionate Care</strong><span>Patient-centered philosophy</span></div></div>
                <div class="feature"><div class="feature-icon"><i class="fa-solid fa-check"></i></div><div><strong>Certified Experts</strong><span>Qualified professionals</span></div></div>
                <div class="feature"><div class="feature-icon"><i class="fa-solid fa-check"></i></div><div><strong>Modern Technology</strong><span>State-of-the-art equipment</span></div></div>
            </div>
        </div>
    </div>`,

    services: `<div class="slide-content centered">
        <span class="tag">What We Offer</span>
        <h2 class="title centered">Specialized <span>Treatments</span></h2>
        <p class="subtitle centered">Click any service to learn more</p>
        <div class="services-grid">
            <div class="service-card" data-service="sports"><div class="card-icon"><i class="fa-solid fa-person-running"></i></div><h3>Sports Injury</h3><span class="click-hint">Click for details</span></div>
            <div class="service-card" data-service="neurological"><div class="card-icon"><i class="fa-solid fa-brain"></i></div><h3>Neurological</h3><span class="click-hint">Click for details</span></div>
            <div class="service-card" data-service="orthopedic"><div class="card-icon"><i class="fa-solid fa-bone"></i></div><h3>Orthopedic</h3><span class="click-hint">Click for details</span></div>
            <div class="service-card" data-service="geriatric"><div class="card-icon"><i class="fa-solid fa-person-cane"></i></div><h3>Geriatric</h3><span class="click-hint">Click for details</span></div>
            <div class="service-card" data-service="postsurgical"><div class="card-icon"><i class="fa-solid fa-syringe"></i></div><h3>Post-Surgical</h3><span class="click-hint">Click for details</span></div>
            <div class="service-card" data-service="workplace"><div class="card-icon"><i class="fa-solid fa-briefcase-medical"></i></div><h3>Workplace</h3><span class="click-hint">Click for details</span></div>
        </div>
    </div>`,

    faq: `<div class="slide-content centered">
        <span class="tag">Common Questions</span>
        <h2 class="title centered">Frequently Asked <span>Questions</span></h2>
        <div class="faq-container">
            <div class="faq-item"><button class="faq-question"><span>Do I need a doctor's referral?</span><i class="fa-solid fa-plus"></i></button><div class="faq-answer"><p>No, you do not need a doctor's referral to see a physiotherapist. However, some insurance plans may require one for reimbursement purposes. We recommend checking with your provider.</p></div></div>
            <div class="faq-item"><button class="faq-question"><span>What should I wear to my appointment?</span><i class="fa-solid fa-plus"></i></button><div class="faq-answer"><p>Please wear loose, comfortable clothing that allows for easy movement and provides access to the area being treated. For example, shorts for leg injuries or a tank top for shoulder issues.</p></div></div>
            <div class="faq-item"><button class="faq-question"><span>How long is each session?</span><i class="fa-solid fa-plus"></i></button><div class="faq-answer"><p>The initial assessment usually lasts about 45-60 minutes. Follow-up treatment sessions are typically 30-45 minutes, depending on your specific condition and treatment plan.</p></div></div>
            <div class="faq-item"><button class="faq-question"><span>Will the treatment hurt?</span><i class="fa-solid fa-plus"></i></button><div class="faq-answer"><p>Physiotherapy aims to relieve pain, but some manual therapy techniques or exercises may cause temporary discomfort. Your therapist will always work within your pain tolerance and adjust accordingly.</p></div></div>
            <div class="faq-item"><button class="faq-question"><span>Do you accept insurance?</span><i class="fa-solid fa-plus"></i></button><div class="faq-answer"><p>Yes, we accept most major insurance plans. Please bring your insurance card to your first appointment, and our staff will help verify your coverage benefits.</p></div></div>
        </div>
    </div>`,

    team: `<div class="slide-content centered">
        <span class="tag">The Experts</span>
        <h2 class="title centered">Meet Our <span>Team</span></h2>
        <div class="team-grid">
            <div class="team-card"><div class="team-img"><img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Doctor"></div><div class="team-info"><h4>Dr. U. Senthilrajan (PT)</h4><span>Founder & Lead Physiotherapist</span></div></div>
            <div class="team-card"><div class="team-img"><img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Doctor"></div><div class="team-info"><h4>Dr. Muruga Venkatesh</h4><span>Medical Officer</span></div></div>
            <div class="team-card"><div class="team-img"><img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Doctor"></div><div class="team-info"><h4>Mrs. Nandhini. C</h4><span>Staff Nurse (13 Years)</span></div></div>
        </div>
    </div>`,

    gallery: `<div class="slide-content centered">
        <h2 class="title centered">Clinic <span>Gallery</span></h2>
        <div class="gallery-grid">
            <div class="gallery-item"><img src="Gallery/image_1.webp" alt="Spacious Clinical Rehabilitation Space"></div>
            <div class="gallery-item"><img src="Gallery/image_2.webp" alt="Advanced Physiotherapy Treatment Beds"></div>
            <div class="gallery-item"><img src="Gallery/image_3.webp" alt="Modern Therapeutic Equipment Station"></div>
            <div class="gallery-item"><img src="Gallery/image_4.webp" alt="Therapist Consultation & Assessment Desk"></div>
            <div class="gallery-item"><img src="Gallery/image_5.webp" alt="Dedicated Strength & Mobility Training Zone"></div>
            <div class="gallery-item"><img src="Gallery/image_6.webp" alt="Clean and Comfortable Recovery Lounge"></div>
            <div class="gallery-item"><img src="Gallery/image_7.webp" alt="Hygienic Patient Treatment & Care Cabin"></div>
            <div class="gallery-item"><img src="Gallery/image_8.webp" alt="High-End Rehabilitation Assessment Space"></div>
        </div>
    </div>`,

    contact: `<div class="slide-content">
        <div class="content-left">
            <span class="tag">Get In Touch</span>
            <h2 class="title">Let's Start Your <span>Recovery.</span></h2>
            <div class="contact-info">
                <div class="info-row"><i class="fa-solid fa-location-dot"></i><div><strong>Location</strong><p>No 32, Gowthamapuri Nagar, Peelamedu, Coimbatore 641004</p><small>Near Gandhimaa Nagar Police Station</small></div></div>
                <div class="info-row"><i class="fa-solid fa-phone"></i><div><strong>Phone</strong><p>+91 98943 21019</p></div></div>
                <div class="info-row"><i class="fa-solid fa-envelope"></i><div><strong>Email</strong><p>contact@procareprc.com</p></div></div>
            </div>
        </div>
        <div class="content-right">
            <div class="form-card">
                <h3>Book Appointment</h3>
                <form>
                    <input type="text" placeholder="Your Name" required>
                    <input type="tel" placeholder="Phone Number" required>
                    <textarea placeholder="Describe your condition..." rows="3"></textarea>
                    <button type="submit" class="btn-primary full">Submit Booking</button>
                </form>
            </div>
        </div>
    </div>`,

    products: `<div class="slide-content centered products-slide-wrapper">
        <div class="products-header">
            <h2 class="title" align="left">Our <span>Products</span></h2>
            <div class="cart-toggle" onclick="toggleCart()">
                <div class="cart-icon-container">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span id="cart-count" class="cart-badge">0</span>
                </div>
            </div>
        </div>
        <div class="products-container" id="products-grid"></div>
        <div class="pagination-controls" id="pagination-controls"></div>

        <div class="product-detail-modal" id="product-detail-modal">
            <div class="pdm-overlay" onclick="closeProductDetail()"></div>
            <div class="pdm-content">
                <button class="pdm-close" onclick="closeProductDetail()"><i class="fa-solid fa-xmark"></i></button>
                <div class="pdm-image-section">
                    <img class="pdm-image" src="" alt="">
                    <span class="pdm-category tag"></span>
                </div>
                <div class="pdm-info">
                    <h2 class="pdm-name"></h2>
                    <p class="pdm-desc"></p>
                    <div class="pdm-footer">
                        <span class="pdm-price"></span>
                        <button class="pdm-add-btn btn-primary"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="cart-overlay" id="cart-overlay" onclick="toggleCart()"></div>
        <div class="cart-sidebar" id="cart-sidebar">
            <div class="cart-header">
                <h3>Your Cart</h3>
                <button class="close-cart-btn" onclick="toggleCart()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="cart-items-container" id="cart-items"></div>
            <div class="cart-footer">
                <div class="cart-summary">
                    <span>Subtotal:</span>
                    <strong id="cart-total">₹0.00</strong>
                </div>
                <button class="btn-primary full checkout-btn" onclick="checkout()"><i class="fa-solid fa-lock" style="margin-right: 8px;"></i> Checkout Securely</button>
                <p class="cart-disclaimer">Free delivery on orders above ₹1000</p>
            </div>
        </div>
    </div>`
});
