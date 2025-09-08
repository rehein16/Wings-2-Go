// ============================
// CART SYSTEM
// ============================

// Global variable for popup timeout
let popupTimeout;

// ✅ Add to Cart with popup notification
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    showCartPopup(`Added "${name}" to cart ✅`);
}

// ✅ Popup notification
function showCartPopup(message) {
    const popup = document.getElementById('cartPopup');
    if (!popup) return;

    popup.textContent = message;
    popup.classList.add('show');

    clearTimeout(popupTimeout); // prevent overlap
    popupTimeout = setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

// ✅ Display cart items
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalContainer = document.getElementById("cart-total");
    if (!cartItemsContainer || !cartTotalContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotalContainer.innerHTML = "";
        return;
    }

    let html = "";
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        html += `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-details">
                <h3>${item.name}</h3>
                <p>₱${item.price.toFixed(2)} x 
                    <input type="number" min="1" value="${item.quantity}" 
                        onchange="updateQuantity(${index}, this.value)">
                </p>
                <button class="btn" onclick="removeItem(${index})">Remove</button>
            </div>
        </div>`;
    });

    cartItemsContainer.innerHTML = html;
    cartTotalContainer.innerHTML = `<h3>Total: ₱${total.toFixed(2)}</h3>`;
}

// ✅ Update quantity
function updateQuantity(index, newQty) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    newQty = Math.max(1, parseInt(newQty)); // Ensure at least 1
    cart[index].quantity = newQty;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// ✅ Remove item
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// ✅ Checkout
function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        showCartPopup("Your cart is empty ❌");
        return;
    }
    alert("Thank you for your order! 🛒");
    localStorage.removeItem("cart");
    displayCart();
    updateCartCount();
}

// ✅ Clear cart
function clearCart() {
    localStorage.removeItem("cart");
    displayCart();
    updateCartCount();
    showCartPopup("Cart cleared 🗑️");
}

// ✅ Cart Count Badge
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return;

    let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQty;
}

// ============================
// NAVIGATION HIGHLIGHT
// ============================
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();

    if (document.getElementById("cart-items")) {
        displayCart();
    }

    // Highlight current page
    const links = document.querySelectorAll(".nav-links a");
    links.forEach(link => {
        if (link.href.split('?')[0] === window.location.href.split('?')[0]) {
            link.classList.add("active");
        }
    });
});
