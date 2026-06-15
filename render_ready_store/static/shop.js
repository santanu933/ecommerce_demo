console.log("shop.js loaded");

const products = [
{
id: 1,
name: "Laptop",
price: 50000,
image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
},
{
id: 2,
name: "Phone",
price: 25000,
image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
},
{
id: 3,
name: "Monitor",
price: 12000,
image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600"
},
{
id: 4,
name: "Keyboard",
price: 1500,
image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600"
}
];

let cart = [];

function renderProducts() {

```
const search =
    document.getElementById("search")
    .value
    .toLowerCase();

const container =
    document.getElementById("products");

container.innerHTML = "";

products
    .filter(p =>
        p.name.toLowerCase().includes(search)
    )
    .forEach(product => {

        container.innerHTML += `
            <div class="card">

                <img src="${product.image}">

                <div class="card-content">

                    <h3>${product.name}</h3>

                    <div class="price">
                        ₹${product.price}
                    </div>

                    <div class="stock instock">
                        In Stock
                    </div>

                    <button
                        class="btn"
                        onclick="addToCart(${product.id})">

                        Add To Cart

                    </button>

                </div>

            </div>
        `;
    });
```

}

function addToCart(id) {

```
const product =
    products.find(p => p.id === id);

const existing =
    cart.find(c => c.id === id);

if (existing) {
    existing.qty++;
} else {
    cart.push({
        ...product,
        qty: 1
    });
}

renderCart();
```

}

function increase(id) {

```
const item =
    cart.find(c => c.id === id);

item.qty++;

renderCart();
```

}

function decrease(id) {

```
const item =
    cart.find(c => c.id === id);

item.qty--;

if (item.qty <= 0) {
    cart =
        cart.filter(c => c.id !== id);
}

renderCart();
```

}

function removeItem(id) {

```
cart =
    cart.filter(c => c.id !== id);

renderCart();
```

}

function renderCart() {

```
const cartDiv =
    document.getElementById("cart");

let total = 0;

cartDiv.innerHTML = "";

cart.forEach(item => {

    total +=
        item.price * item.qty;

    cartDiv.innerHTML += `
        <div class="cart-item">

            <div>
                <strong>${item.name}</strong>
                <br>
                ₹${item.price}
            </div>

            <div>

                <button
                    class="qty-btn"
                    onclick="decrease(${item.id})">

                    -

                </button>

                ${item.qty}

                <button
                    class="qty-btn"
                    onclick="increase(${item.id})">

                    +

                </button>

                <button
                    class="remove-btn"
                    onclick="removeItem(${item.id})">

                    X

                </button>

            </div>

        </div>
    `;
});

document.getElementById("total")
    .innerText = `₹${total}`;
```

}

async function placeOrder() {

```
if (cart.length === 0) {

    alert("Cart is empty");

    return;
}

const payload = {

    name:
        document.getElementById("name").value,

    phone:
        document.getElementById("phone").value,

    address:
        document.getElementById("address").value,

    payment:
        document.getElementById("payment").value,

    items: cart
};

try {

    const response =
        await fetch("/place-order", {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body:
                JSON.stringify(payload)
        });

    const result =
        await response.json();

    document.getElementById("msg")
        .innerHTML =
        "✅ Order placed successfully.<br>Order ID: " +
        result.orderId;

    cart = [];

    renderCart();

} catch (error) {

    document.getElementById("msg")
        .innerHTML =
        "❌ Failed to place order";
}
```

}

renderProducts();
renderCart();
