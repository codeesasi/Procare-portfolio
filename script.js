/* =========================================
   MAIN SCRIPT - IMPORTS ALL MODULES
   ProCare V7 - Modular Architecture
   
   Note: For file:// protocol, we use inline scripts.
   For production, you can use a bundler (Webpack/Vite).
   ========================================= */

// This file serves as the main entry point.
// All modules are loaded via script tags in index.html
// in the correct dependency order:
//
// 1. js/config.js    - Configuration & fallback content
// 2. js/theme.js     - Theme management
// 3. js/cursor.js    - Custom cursor
// 4. js/navigation.js - Swiper & navigation
// 5. js/animations.js - GSAP animations
// 6. js/loader.js    - Page content loader
// 7. js/app.js       - Main application entry

console.log('📦 ProCare V7 - Modular JavaScript Architecture');
