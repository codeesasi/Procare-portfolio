/**
 * @fileoverview Logic for the Chatbot Widget
 * Handles markup injection, toggling, and basic message flow.
 * Enhanced with GSAP animations and quick replies.
 */

'use strict';

const Chatbot = {
    // API Configuration
    apiConfig: {
        // TODO: Replace with actual API Gateway URL
        endpoint: 'https://txyrqi3randof7adm2mhyquaqy0czstb.lambda-url.ap-south-1.on.aws/',
        apiKey: '' // If required
    },

    init() {
        this.injectHTML();
        this.cacheDOM();
        this.bindEvents();
        this.addInitialQuickReplies();
    },

    /**
     * Send message to AWS Lambda backend
     * @param {string} message User message
     * @returns {Promise<string>} Bot response
     */
    async sendMessageToLambda(message) {
        try {
            const response = await fetch(this.apiConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiConfig.apiKey && { 'x-api-key': this.apiConfig.apiKey })
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            // Assuming Lambda returns { body: "response text" } or similar structure
            // Adjust based on your actual Lambda response format
            return data.reply || data.body || "I received your message but couldn't parse the response.";

        } catch (error) {
            console.error('Error calling Lambda:', error);
            throw error;
        }
    },

    injectHTML() {
        // Create the chatbot HTML structure
        const chatbotHTML = `
            <!-- Toggler Removed -->

            <div class="chatbot-window">
                <header class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-logo">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div>
                            <div class="chatbot-header-name">
                                <h3>ProCare Assistant</h3>
                                <div class="governance-trigger">
                                    <i class="fa-solid fa-triangle-exclamation"></i>
                                    <div class="governance-tooltip">
                                        <div class="tooltip-header">
                                            <i class="fa-solid fa-shield-halved"></i>
                                            <span>Medical Disclaimer</span>
                                        </div>
                                        <p>This assistant provides informational guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="chatbot-status">
                                <span class="status-dot"></span>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>
                    <button class="chatbot-close-btn" aria-label="Close Chat" onclick="Chatbot.toggleChat(false)">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </header>
                
                <ul class="chatbox">
                    <li class="chat-message incoming">
                        <div class="bot-icon">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div class="chat-bubble">
                            Hi there! 👋<br>We are currently working on this feature to bring you automated booking and support. Stay tuned!
                        </div>
                    </li>
                </ul>

                <div class="quick-replies" id="quickReplies">
                    <!-- Chips injected via JS -->
                </div>
                
                <div class="chat-input-area">
                    <textarea id="chat-input" placeholder="Type a message..." required></textarea>
                    <button id="sendBtn" class="chat-send-btn" aria-label="Send Message">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            <!-- BOOKING MODAL (Non-closeable) -->
            <div class="chatbot-modal-overlay" id="bookingModal">
                <div class="chatbot-modal-container">
                    <div class="booking-icon">
                        <i class="fa-solid fa-calendar-check"></i>
                    </div>
                    <h3 class="booking-title">Book Function</h3>
                    <p class="booking-desc">Please enter your mobile number to proceed with the appointment booking.</p>
                    
                    <div class="booking-form-group" id="mobileInputGroup">
                        <label class="booking-label">Mobile Number</label>
                        <div class="booking-input-wrapper">
                            <i class="fa-solid fa-phone"></i>
                            <input type="tel" class="booking-input" id="bookingPhone" placeholder="Enter 10-digit number" maxlength="10">
                        </div>
                        <div class="validation-msg" id="validationMsg">Please enter a valid number</div>
                    </div>

                    <!-- OTP Group (Hidden initially) -->
                    <div class="otp-container" id="otpGroup">
                        <p class="timer-display" id="timerDisplay">02:00</p>
                        <div class="otp-input-group">
                            <input type="text" class="otp-digit" maxlength="1" inputmode="numeric">
                            <input type="text" class="otp-digit" maxlength="1" inputmode="numeric">
                            <input type="text" class="otp-digit" maxlength="1" inputmode="numeric">
                            <input type="text" class="otp-digit" maxlength="1" inputmode="numeric">
                        </div>
                        <p class="booking-desc" style="margin-bottom: 1rem;">Enter the 4-digit code sent to your mobile.</p>
                    </div>

                    <button class="booking-submit-btn" id="bookingSubmit">Verified & Proceed</button>
                </div>
            </div>
        `;

        // Inject into body
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    },

    cacheDOM() {
        // this.toggler = document.querySelector('.chatbot-toggler');
        this.closeBtn = document.querySelector('.chatbot-close-btn');
        this.chatbotWindow = document.querySelector('.chatbot-window');
        this.chatbox = document.querySelector('.chatbox');
        this.textarea = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('sendBtn');
        this.quickRepliesContainer = document.getElementById('quickReplies');

        // Booking Modal Elements
        this.bookingModal = document.getElementById('bookingModal');
        this.bookingContainer = this.bookingModal.querySelector('.chatbot-modal-container');
        this.bookingInput = document.getElementById('bookingPhone');
        this.bookingSubmit = document.getElementById('bookingSubmit');
        this.validationMsg = document.getElementById('validationMsg');

        // OTP Elements
        this.mobileGroup = document.getElementById('mobileInputGroup');
        this.otpGroup = document.getElementById('otpGroup');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.otpDigits = document.querySelectorAll('.otp-digit');
    },

    bindEvents() {
        // Toggle Open/Close
        // this.toggler.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat(false));

        // Send Message
        this.sendBtn.addEventListener('click', () => this.handleChat());

        // Enter key to send
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleChat();
            }
        });

        // Auto-expand textarea
        this.textarea.addEventListener('input', () => {
            this.textarea.style.height = 'auto';
            this.textarea.style.height = `${this.textarea.scrollHeight}px`;
        });

        // Close when clicking outside (with delay to prevent immediate close on open)
        document.addEventListener('click', (e) => {
            // Don't close if chatbot just opened (within 100ms)
            if (this._justOpened) return;

            // Don't close if clicking on the Book Now button
            if (e.target.closest('.btn-secondary')) return;

            if (document.body.classList.contains('show-chatbot') &&
                !this.chatbotWindow.contains(e.target) &&
                !this.bookingModal.classList.contains('active')) {
                this.toggleChat(false);
            }
        });

        // Booking Input Validation
        this.bookingInput.addEventListener('input', (e) => {
            // Allow only numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            this.validateBookingInput();
        });

        this.bookingSubmit.addEventListener('click', () => {
            if (this.otpGroup.classList.contains('active')) {
                this.verifyOTP();
            } else {
                this.submitMobile();
            }
        });

        // OTP Input Logic
        this.otpDigits.forEach((digit, index) => {
            digit.addEventListener('input', (e) => {
                // Allow numeric only
                e.target.value = e.target.value.replace(/[^0-9]/g, '');

                if (e.target.value) {
                    digit.classList.add('filled');
                    // Auto-focus next
                    if (index < this.otpDigits.length - 1) {
                        this.otpDigits[index + 1].focus();
                    } else {
                        // Check if all filled
                        this.checkOTPComplete();
                    }
                } else {
                    digit.classList.remove('filled');
                }
            });

            digit.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    this.otpDigits[index - 1].focus();
                }
            });
        });
    },

    addInitialQuickReplies() {
        const replies = [
            "Our Services",
            "Emergency Info",
            "Book Appointment",
            "Meet the Team"
        ];

        replies.forEach(text => {
            const chip = document.createElement('div');
            chip.className = 'reply-chip';
            chip.innerText = text;
            chip.onclick = () => {
                this.textarea.value = text;
                this.handleChat();
            };
            this.quickRepliesContainer.appendChild(chip);
        });
    },

    toggleChat(forceState) {
        const isOpening = forceState !== undefined ? forceState : !document.body.classList.contains('show-chatbot');

        // If already in desired state, do nothing (prevents double triggers)
        if (isOpening === document.body.classList.contains('show-chatbot')) return;

        document.body.classList.toggle('show-chatbot', isOpening);

        // Also toggle classes on elements for specific styles
        this.chatbotWindow.classList.toggle('active', isOpening);
        // this.toggler.classList.toggle('active', isOpening);

        // Animation for the window
        if (isOpening) {
            // Set flag to prevent immediate close from click-outside handler
            this._justOpened = true;
            setTimeout(() => { this._justOpened = false; }, 150);

            gsap.fromTo(this.chatbotWindow,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
            );
            setTimeout(() => this.textarea.focus(), 100);
        } else {
            gsap.to(this.chatbotWindow, {
                opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in"
            });
        }
    },

    handleChat() {
        const userMessage = this.textarea.value.trim();
        if (!userMessage) return;

        // Hide quick replies after first interaction
        if (this.quickRepliesContainer.style.display === '' || this.quickRepliesContainer.style.display === 'flex') {
            gsap.to(this.quickRepliesContainer, {
                opacity: 0, height: 0, padding: 0, duration: 0.3, onComplete: () => {
                    this.quickRepliesContainer.style.display = 'none';
                }
            });
        }

        // Add User Message
        this.addMessage(userMessage, 'outgoing');
        this.textarea.value = '';
        this.textarea.style.height = 'auto';

        // Call typing indicator
        const typingMsg = this.showTypingIndicator();

        setTimeout(() => {
            typingMsg.remove();
            
            // Check for Booking Trigger
            if (userMessage.toLowerCase().includes('book') || userMessage.toLowerCase().includes('appointment')) {
                this.addMessage("We are currently working on our online booking assistant! In the meantime, you can book an appointment by giving us a call at <strong>+91 98943 21019</strong> or using the contact form in our Contact slide.", 'incoming');
            } else {
                this.addMessage("ProCare Assistant is currently under development. We are actively working on it to provide you with automated clinical guidance and instant support soon!", 'incoming');
            }
        }, 800);
    },

    handleBookingFlow() {
        this.addMessage("Certainly! I can help you book an appointment. Please enter your mobile number in the secure form below.", 'incoming');

        // Reset state
        this.mobileGroup.style.display = 'block';
        this.otpGroup.classList.remove('active');
        this.bookingInput.value = '';
        this.bookingSubmit.textContent = 'Verified & Proceed';
        this.otpDigits.forEach(d => { d.value = ''; d.classList.remove('filled'); });

        setTimeout(() => {
            this.bookingModal.classList.add('active');
            this.bookingInput.focus();
        }, 800);
    },

    validateBookingInput() {
        const value = this.bookingInput.value;
        const isValid = /^\d{10}$/.test(value);

        if (isValid) {
            this.bookingInput.classList.remove('error');
            this.bookingInput.classList.add('success');
            this.validationMsg.classList.remove('visible');
            this.bookingSubmit.classList.add('active');
        } else {
            this.bookingInput.classList.remove('success');
            this.bookingSubmit.classList.remove('active');

            if (value.length > 0 && value.length !== 10) {
                this.validationMsg.textContent = "Please enter exactly 10 digits";
                this.validationMsg.classList.add('visible');
            } else {
                this.validationMsg.classList.remove('visible');
            }
        }
    },

    submitMobile() {
        const phone = this.bookingInput.value;
        if (!/^\d{10}$/.test(phone)) return;

        // Transition to OTP
        this.mobileGroup.style.display = 'none';
        this.otpGroup.classList.add('active');
        this.bookingSubmit.textContent = 'Verify OTP';
        this.bookingSubmit.classList.remove('active'); // Disable until OTP filled

        // Focus first OTP digit
        this.otpDigits[0].focus();

        // Start Timer
        this.startTimer(120); // 2 minutes
    },

    checkOTPComplete() {
        const otp = Array.from(this.otpDigits).map(d => d.value).join('');
        if (otp.length === 4) {
            this.bookingSubmit.classList.add('active');
        } else {
            this.bookingSubmit.classList.remove('active');
        }
    },

    verifyOTP() {
        // Verify Button Clicked
        const otp = Array.from(this.otpDigits).map(d => d.value).join('');
        if (otp.length < 4) return;

        clearInterval(this.timerInterval);

        // Hide Modal
        this.bookingModal.classList.remove('active');

        // Confirm in Chat via Lambda API
        const typingMsg = this.showTypingIndicator();
        this.sendMessageToLambda(`[SYSTEM] Verify OTP: ${otp} for Mobile: ${this.bookingInput.value}`)
            .then(reply => {
                typingMsg.remove();
                this.addMessage(reply || `Success! Your number is verified. Our team will contact you shortly.`, 'incoming');
            })
            .catch(error => {
                typingMsg.remove();
                this.addMessage(`Thanks for authenticating. (Note: Booking backend is currently unreachable, but we've recorded your attempt.)`, 'incoming');
            });
    },

    startTimer(duration) {
        let timer = duration, minutes, seconds;
        this.timerDisplay.textContent = "02:00";
        this.timerDisplay.classList.remove('warning');

        this.timerInterval = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            this.timerDisplay.textContent = minutes + ":" + seconds;

            if (--timer < 10) {
                this.timerDisplay.classList.add('warning');
            }

            if (timer < 0) {
                clearInterval(this.timerInterval);
                this.handleSessionExpiry();
            }
        }, 1000);
    },

    handleSessionExpiry() {
        this.timerDisplay.textContent = "Session Expired!";
        this.bookingSubmit.classList.remove('active');
        this.otpGroup.style.opacity = '0.5';
        this.otpGroup.style.pointerEvents = 'none';

        setTimeout(() => {
            this.bookingModal.classList.remove('active');
            this.addMessage("Session expired. Please start the booking process again.", 'incoming');
        }, 2000);
    },

    showTypingIndicator() {
        const li = document.createElement('li');
        li.className = `chat-message incoming typing`;
        li.innerHTML = `
            <div class="bot-icon"><i class="fa-solid fa-robot"></i></div>
            <div class="chat-bubble">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        this.chatbox.appendChild(li);
        this.chatbox.scrollTop = this.chatbox.scrollHeight;
        return li;
    },

    addMessage(text, type) {
        const li = document.createElement('li');
        li.className = `chat-message ${type}`;

        const iconHTML = type === 'incoming'
            ? `<div class="bot-icon"><i class="fa-solid fa-robot"></i></div>`
            : '';

        li.innerHTML = `
            ${iconHTML}
            <div class="chat-bubble">${text}</div>
        `;

        this.chatbox.appendChild(li);
        this.chatbox.scrollTop = this.chatbox.scrollHeight;

        // Animate entrance
        gsap.from(li, {
            y: 20,
            opacity: 0,
            duration: 0.4,
            ease: "power2.out"
        });
    }
};

// Initialize on load
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    Chatbot.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        Chatbot.init();
    });
}
