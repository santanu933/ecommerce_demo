console.log("shop.js loaded");

const products = [
    {
        id: 1,
        name: "Laptop",
        price: 50000,
        image: "https://www.pexels.com/photo/macbook-pro-129208/300x200?text=Laptop"
    },
    {
        id: 2,
        name: "Phone",
        price: 25000,
        image: "https://via.placeholder.com/300x200?text=Phone"
    },
    {
        id: 3,
        name: "Monitor",
        price: 12000,
        image: "https://via.placeholder.com/300x200?text=Monitor"
    },
    {
        id: 4,
        name: "Keyboard",
        price: 1500,
        image: "https://via.placeholder.com/300x200?text=Keyboard"
    }
];

let cart = [];

function renderProducts() {
    const searchInput = document.getElementById("search");
    const container = document.getElementById("products");

    if (!container) {
        console.error("Products container not found");
        return;
    }

    const search = searchInput ? searchInput.value.toLowerCase() : "";

    container.innerHTML = "";

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search)
    );

    filteredProducts.forEach(product => {
        container.innerHTML += `
            <div class="card">
                <img src="${product.image}" alt="${product.name}">
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <div class="price">₹${product.price}</div>
                    <div class="stock instock">In Stock</div>

                    <button
                        class="btn"
                        onclick="addToCart(${product.id})">
                        Add To Cart
                    </button>
                </div>
            </div>
        `;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            ...product,
            qty: 1
        });
    }

    renderCart();
}

function increase(id) {
    const item = cart.find(c => c.id === id);

    if (item) {
        item.qty++;
        renderCart();
    }
}

function decrease(id) {
    const item = cart.find(c => c.id === id);

    if (!item) return;

    item.qty--;

    if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== id);
    }

    renderCart();
}

function removeItem(id) {
    cart = cart.filter(c => c.id !== id);
    renderCart();
}

function renderCart() {
    const cartDiv = document.getElementById("cart");
    const totalDiv = document.getElementById("total");

    if (!cartDiv || !totalDiv) return;

    cartDiv.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;

        cartDiv.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    ₹${item.price}
                </div>

                <div>
                    <button class="qty-btn" onclick="decrease(${item.id})">-</button>

                    ${item.qty}

                    <button class="qty-btn" onclick="increase(${item.id})">+</button>

                    <button class="remove-btn" onclick="removeItem(${item.id})">
                        X
                    </button>
                </div>
            </div>
        `;
    });

    totalDiv.innerText = `₹${total}`;
}

async function placeOrder() {
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const payload = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        payment: document.getElementById("payment").value,
        items: cart
    };

    try {
        const response = await fetch("/place-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        document.getElementById("msg").innerHTML =
            `✅ Order placed successfully.<br>Order ID: ${result.orderId}`;

        cart = [];

        renderCart();

    } catch (error) {
        console.error(error);

        document.getElementById("msg").innerHTML =
            "❌ Failed to place order";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");

    renderProducts();
    renderCart();
});
