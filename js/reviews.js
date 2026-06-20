/**
 * @fileoverview Reviews Section Logic
 */

function initReviews() {
    // Check elements
    const swiperEl1 = document.querySelector('.reviews-swiper-1');
    const swiperEl2 = document.querySelector('.reviews-swiper-2');

    if (!swiperEl1 || !swiperEl2) return;

    // Destroy existing instances if needed
    if (swiperEl1.swiper) swiperEl1.swiper.destroy(true, true);
    if (swiperEl2.swiper) swiperEl2.swiper.destroy(true, true);

    // Common Configuration
    const commonConfig = {
        slidesPerView: 1, // Mobile defaults to 1
        spaceBetween: 20,
        loop: true,
        nested: true,
        bgGrab: true,
        breakpoints: {
            768: {
                slidesPerView: 2, // Tablet: 2 per row
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 2, // Desktop: 2 per row (Total 4 visible)
                spaceBetween: 30
            }
        }
    };

    // SWIPER 1 (Top Row) - Moves Left (Standard)
    new Swiper('.reviews-swiper-1', {
        ...commonConfig,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            reverseDirection: false // Moves -> Left
        }
    });

    // SWIPER 2 (Bottom Row) - Moves Right (Reverse)
    new Swiper('.reviews-swiper-2', {
        ...commonConfig,
        autoplay: {
            delay: 3500, // Slightly different delay for offset feeling
            disableOnInteraction: false,
            reverseDirection: true // Moves -> Right
        }
    });

    console.log('Dual Review Swipers initialized');
}

globalThis.initReviews = initReviews;

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initReviews, 100);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initReviews, 100);
    });
}
