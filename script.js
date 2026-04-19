const cartToggle = document.querySelector('.cart-toggle');
const cartPanel = document.getElementById('cartPanel');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeCartButton = document.querySelector('.close-cart');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const searchInput = document.getElementById('searchInput');
const productCards = document.querySelectorAll('.card');

let cart = {};

function formatTsh(value) {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        maximumFractionDigits: 0,
    }).format(value);
}

function updateCartUI() {
    const items = Object.values(cart);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatTsh(totalPrice);

    if (!items.length) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty. Add products to start shopping.</p>';
        return;
    }

    cartItemsContainer.innerHTML = items
        .map(item => `
            <div class="cart-item">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="cart-controls">
                    <span class="quantity">Qty: ${item.quantity}</span>
                    <span class="price">${formatTsh(item.price * item.quantity)}</span>
                </div>
                <button class="remove-button" data-product="${item.id}">Remove</button>
            </div>
        `)
        .join('');
}

function addToCart(product) {
    if (cart[product.id]) {
        cart[product.id].quantity += 1;
    } else {
        cart[product.id] = {
            ...product,
            quantity: 1,
        };
    }
    updateCartUI();
    openCart();
}

function removeFromCart(productId) {
    delete cart[productId];
    updateCartUI();
}

function openCart() {
    cartPanel.classList.add('open');
}

function closeCart() {
    cartPanel.classList.remove('open');
}

function handleAddButtons() {
    const buttons = document.querySelectorAll('.add-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.productId;
            const productName = btn.dataset.productName;
            const productPrice = Number(btn.dataset.productPrice);
            const productDescription = btn.dataset.productDescription;

            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                description: productDescription,
            });
        });
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('data-lang');
    const newLang = currentLang === 'sw' ? 'en' : 'sw';
    document.documentElement.setAttribute('data-lang', newLang);
    localStorage.setItem('lang', newLang);
    updateLanguage();
}

function loadLanguage() {
    const savedLang = localStorage.getItem('lang') || 'en';
    document.documentElement.setAttribute('data-lang', savedLang);
    updateLanguage();
}

function updateLanguage() {
    const lang = document.documentElement.getAttribute('data-lang');
    const elements = document.querySelectorAll('[data-en], [data-sw]');
    elements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            el.textContent = text;
        }
    });
    // Update placeholders
    const placeholders = document.querySelectorAll('[data-en-placeholder], [data-sw-placeholder]');
    placeholders.forEach(el => {
        const placeholder = el.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            el.placeholder = placeholder;
        }
    });
}

function searchProducts() {
    const query = searchInput.value.toLowerCase();
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const isVisible = title.includes(query) || description.includes(query);
        card.style.display = isVisible ? 'block' : 'none';
    });
}

cartToggle.addEventListener('click', openCart);
closeCartButton.addEventListener('click', closeCart);
cartItemsContainer.addEventListener('click', event => {
    if (event.target.matches('.remove-button')) {
        removeFromCart(event.target.dataset.product);
    }
});

checkoutBtn.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
        alert('Your cart is empty. Add a few items first.');
        return;
    }
    alert('Asante! Your order is ready for pickup or delivery.');
    cart = {};
    updateCartUI();
});

themeToggle.addEventListener('click', toggleTheme);
langToggle.addEventListener('click', toggleLanguage);
searchInput.addEventListener('input', searchProducts);

window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadLanguage();
    updateCartUI();
    handleAddButtons();
});
