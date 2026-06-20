/**
 * @fileoverview Products and Shopping Cart Logic
 */

'use strict';

// --- Mock Data ---
const PRODUCTS_DATA = [
    { id: 1,  name: 'Premium Resistance Bands Set',  price: 1250, category: 'exercise', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=500&fit=crop', description: 'Set of 5 premium varying resistance bands for home workouts and advanced rehab exercises.' },
    { id: 2,  name: 'Orthopedic Knee Brace',         price: 2400, category: 'support',  image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=500&h=500&fit=crop', description: 'Adjustable hinged knee brace for maximum joint stability and enhanced post-surgery support.' },
    { id: 3,  name: 'Ergonomic Cervical Pillow',     price: 1800, category: 'wellness', image: 'https://images.unsplash.com/photo-1584285408432-886ec5717bc3?w=500&h=500&fit=crop', description: 'High-density memory foam pillow designed to support neck curvature and relieve morning pain.' },
    { id: 4,  name: 'Digital TENS Therapy Unit',     price: 3500, category: 'wellness', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=500&fit=crop', description: 'Portable 4-channel electrotherapy device for effective chronic pain management and relief.' },
    { id: 5,  name: 'Balance Wobble Board',          price: 1450, category: 'exercise', image: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=500&h=500&fit=crop', description: 'Durable wooden balance board ideal for ankle strengthening rehab and core stability training.' },
    { id: 6,  name: 'Hot / Cold Therapy Pack',       price: 450,  category: 'wellness', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&h=500&fit=crop', description: 'Reusable dual-action medical gel pack designed for acute inflammation and muscle soreness.' },
    { id: 7,  name: 'Lumbar Support Cushion',        price: 1200, category: 'support',  image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&h=500&fit=crop', description: 'Ergonomic breathable backrest designed for office chairs to significantly improve daily posture.' },
    { id: 8,  name: 'Adjustable Hand Grip',          price: 350,  category: 'exercise', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=500&fit=crop', description: 'Variable resistance hand exerciser for targeted finger, wrist, and forearm strength building.' },
    { id: 9,  name: 'Acupressure Mat & Pillow',     price: 1600, category: 'wellness', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop', description: 'Complete set featuring thousands of stimulation points for deep relaxation and tension relief.' },
    { id: 10, name: 'Adjustable Ankle Weights',      price: 850,  category: 'exercise', image: 'https://images.unsplash.com/photo-1596357395104-146fd089aef7?w=500&h=500&fit=crop', description: 'Comfortable strap-on 2kg weights perfect for gentle lower body resistance and cardio training.' },
    { id: 11, name: 'High-Density Foam Roller',      price: 950,  category: 'wellness', image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341d1d?w=500&h=500&fit=crop', description: 'Firm deep tissue massage roller essential for rapid muscle recovery and myofascial release.' },
    { id: 12, name: 'Posture Corrector Brace',       price: 1100, category: 'support',  image: 'https://images.unsplash.com/photo-1559757175-7cb36e00e8b5?w=500&h=500&fit=crop', description: 'Lightweight and seamless wearable brace structured to gently align shoulders and straighten spine.' },
    { id: 13, name: 'Mini Pedal Exerciser',          price: 2100, category: 'exercise', image: 'https://images.unsplash.com/photo-1534005825316-16a7f85dc913?w=500&h=500&fit=crop', description: 'Compact under-desk stationary bike with tension control for smooth leg or arm rehabilitation.' },
    { id: 14, name: 'Kinesiology Tape Rolls',        price: 1350, category: 'support',  image: 'https://images.unsplash.com/photo-1544067980-60b6b0c2a297?w=500&h=500&fit=crop', description: 'Professional grade elastic sports tape (3 pack) for joint stabilization and injury prevention.' },
    { id: 15, name: 'Shoulder Pulley System',        price: 650,  category: 'exercise', image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=500&h=500&fit=crop', description: 'Simple over-the-door stretching mechanism for safely restoring and improving shoulder mobility.' }
];

// --- State ---
let cart = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 9; // 3×3 grid — fits viewport without scroll

// --- Functions ---

/**
 * Returns total number of pages based on product count.
 * @returns {number}
 */
function getTotalPages() {
    return Math.ceil(PRODUCTS_DATA.length / ITEMS_PER_PAGE);
}

/**
 * Initialize products page when content is loaded.
 */
function initProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid && productsGrid.children.length === 0) {
        renderProducts();
        renderPagination();
        loadCartFromStorage();
    }
}

// Expose globally so navigation/loader can call it
window.initProducts = initProducts;

/**
 * Format price in Indian Rupees.
 * @param {number} number
 * @returns {string}
 */
function formatPrice(number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

/**
 * Render compact product cards for the current page.
 * Description is NOT shown on the card — clicking opens the detail modal.
 */
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageProducts = PRODUCTS_DATA.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    pageProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);

        card.innerHTML =
            '<div class="product-image" onclick="showProductDetail(' + product.id + ')">' +
                '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy"' +
                ' onerror="this.style.display=\'none\'">' +
                '<span class="product-category tag">' + product.category + '</span>' +
                '<div class="product-view-hint"><i class="fa-solid fa-eye"></i></div>' +
            '</div>' +
            '<div class="product-info">' +
                '<h3 class="product-title" onclick="showProductDetail(' + product.id + ')">' + product.name + '</h3>' +
                '<div class="product-footer">' +
                    '<span class="product-price">' + formatPrice(product.price) + '</span>' +
                    '<button class="btn-add-cart" onclick="addToCart(' + product.id + ')">' +
                        '<i class="fa-solid fa-cart-plus"></i> Add' +
                    '</button>' +
                '</div>' +
            '</div>';

        grid.appendChild(card);
    });
}

/**
 * Renders compact pagination controls.
 */
function renderPagination() {
    const container = document.getElementById('pagination-controls');
    if (!container) return;

    const totalPages = getTotalPages();
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    // Previous button
    html += '<button class="page-btn page-nav' + (currentPage === 1 ? ' disabled' : '') + '"' +
        (currentPage > 1 ? ' onclick="goToPage(' + (currentPage - 1) + ')"' : ' disabled') +
        '><i class="fa-solid fa-chevron-left"></i></button>';

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        html += '<button class="page-btn' + (i === currentPage ? ' active' : '') + '"' +
            ' onclick="goToPage(' + i + ')">' + i + '</button>';
    }

    // Next button
    html += '<button class="page-btn page-nav' + (currentPage === totalPages ? ' disabled' : '') + '"' +
        (currentPage < totalPages ? ' onclick="goToPage(' + (currentPage + 1) + ')"' : ' disabled') +
        '><i class="fa-solid fa-chevron-right"></i></button>';

    // Page info
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, PRODUCTS_DATA.length);
    html += '<span class="page-info">Showing ' + startItem + '–' + endItem + ' of ' + PRODUCTS_DATA.length + '</span>';

    container.innerHTML = html;
}

/**
 * Navigate to a specific page.
 * @param {number} page
 */
function goToPage(page) {
    const totalPages = getTotalPages();
    if (page < 1 || page > totalPages || page === currentPage) return;

    currentPage = page;
    renderProducts();
    renderPagination();
}

// --- Product Detail Modal ---

/**
 * Shows the product detail modal for a given product ID.
 * @param {number} productId
 */
function showProductDetail(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-detail-modal');
    if (!modal) return;

    modal.querySelector('.pdm-image').src   = product.image;
    modal.querySelector('.pdm-image').alt   = product.name;
    modal.querySelector('.pdm-category').textContent = product.category;
    modal.querySelector('.pdm-name').textContent     = product.name;
    modal.querySelector('.pdm-desc').textContent     = product.description;
    modal.querySelector('.pdm-price').textContent    = formatPrice(product.price);

    const addBtn = modal.querySelector('.pdm-add-btn');
    // Remove old listener and attach fresh one for this product
    const newAddBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newAddBtn, addBtn);
    newAddBtn.addEventListener('click', () => {
        addToCart(productId);
        closeProductDetail();
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the product detail modal.
 */
function closeProductDetail() {
    const modal = document.getElementById('product-detail-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

window.showProductDetail = showProductDetail;
window.closeProductDetail = closeProductDetail;

// --- Cart ---

/**
 * Cart Toggle — always re-renders cart on open so state is guaranteed fresh.
 */
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (!sidebar || !overlay) return;

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    if (sidebar.classList.contains('active')) {
        renderCart();                        // always show up-to-date cart
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Add item to cart.
 * @param {number} productId
 */
function addToCart(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCartToStorage();
    renderCart();
    showToast('Added ' + product.name + ' to cart!');
}

/**
 * Update item quantity.
 * @param {number} productId
 * @param {number} delta
 */
function updateQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCartToStorage();
        renderCart();
    }
}

/**
 * Remove item from cart.
 * @param {number} productId
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    renderCart();
}

/**
 * Render Cart Sidebar.
 */
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount          = document.getElementById('cart-count');
    const cartTotal          = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartCount || !cartTotal) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    cartCount.classList.remove('pulse-anim');
    void cartCount.offsetWidth; // reflow
    if (totalItems > 0) cartCount.classList.add('pulse-anim');

    cartItemsContainer.innerHTML = '';
    let totalValue = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML =
            '<div class="empty-cart">' +
                '<i class="fa-solid fa-cart-arrow-down empty-icon"></i>' +
                '<p>Your cart is empty.</p>' +
                '<button class="btn-secondary" onclick="toggleCart()" style="margin-top:1rem;">Continue Shopping</button>' +
            '</div>';
    } else {
        cart.forEach(item => {
            totalValue += item.price * item.quantity;

            const cartRow = document.createElement('div');
            cartRow.className = 'cart-item';
            cartRow.innerHTML =
                '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">' +
                '<div class="cart-item-details">' +
                    '<h4 class="cart-item-title">' + item.name + '</h4>' +
                    '<span class="cart-item-price">' + formatPrice(item.price) + '</span>' +
                    '<div class="cart-item-controls">' +
                        '<button class="qty-btn" onclick="updateQuantity(' + item.id + ', -1)">-</button>' +
                        '<span class="qty-value">' + item.quantity + '</span>' +
                        '<button class="qty-btn" onclick="updateQuantity(' + item.id + ', 1)">+</button>' +
                        '<button class="remove-btn" onclick="removeFromCart(' + item.id + ')"><i class="fa-solid fa-trash-can"></i></button>' +
                    '</div>' +
                '</div>';
            cartItemsContainer.appendChild(cartRow);
        });
    }

    cartTotal.textContent = formatPrice(totalValue);
}

/**
 * Checkout action.
 */
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    cart = [];
    saveCartToStorage();
    renderCart();
    toggleCart();
    showToast('Order placed successfully! We will contact you shortly.', 'success');
}

/**
 * Toast notification utility.
 * @param {string} message
 * @param {string} type - 'success' | 'error'
 */
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.procare-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'procare-toast ' + type;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-xmark';
    toast.innerHTML = '<i class="fa-solid ' + icon + '"></i> <span>' + message + '</span>';
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * LocalStorage Helpers.
 */
function saveCartToStorage() {
    try {
        if (cart.length === 0) {
            // Remove the key entirely so an empty previous session
            // doesn't pollute a fresh page load.
            localStorage.removeItem('procare-cart');
        } else {
            localStorage.setItem('procare-cart', JSON.stringify(cart));
        }
    } catch (e) {
        console.error('Could not save cart:', e);
    }
}

function loadCartFromStorage() {
    try {
        const saved = localStorage.getItem('procare-cart');
        if (saved) {
            cart = JSON.parse(saved);
            renderCart();
        }
    } catch (e) {
        console.error('Could not load cart:', e);
    }
}

// Hook into DOMContentLoaded as a safety net
document.addEventListener('DOMContentLoaded', initProducts);
