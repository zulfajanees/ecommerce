const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "electronics",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Running Shoes",
    category: "fashion",
    price: 74.5,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "electronics",
    price: 129.0,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Coffee Maker",
    category: "home",
    price: 55.25,
    image:
      "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Backpack",
    category: "fashion",
    price: 45.0,
    image:
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "home",
    price: 28.75,
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    category: "electronics",
    price: 62.0,
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "Travel Bottle",
    category: "home",
    price: 18.4,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
  },
];

const productsGrid = document.getElementById("products-grid");
const categoryFilter = document.getElementById("category-filter");
const searchInput = document.getElementById("search-input");
const cartButton = document.getElementById("cart-button");
const closeCartButton = document.getElementById("close-cart");
const cartDrawer = document.getElementById("cart-drawer");
const backdrop = document.getElementById("backdrop");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutButton = document.getElementById("checkout-btn");
const newsletterForm = document.getElementById("newsletter-form");
const newsletterEmail = document.getElementById("newsletter-email");
const newsletterMessage = document.getElementById("newsletter-message");

let cart = JSON.parse(localStorage.getItem("shopease-cart") || "{}");

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function getFilteredProducts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  return products.filter((product) => {
    const matchKeyword = product.name.toLowerCase().includes(keyword);
    const matchCategory = category === "all" || product.category === category;
    return matchKeyword && matchCategory;
  });
}

function renderProducts() {
  const visibleProducts = getFilteredProducts();

  if (!visibleProducts.length) {
    productsGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  productsGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-content">
            <h3>${product.name}</h3>
            <div class="product-meta">
              <span>${product.category}</span>
              <span class="price">${formatMoney(product.price)}</span>
            </div>
            <button data-add="${product.id}">Add to Cart</button>
          </div>
        </article>
      `
    )
    .join("");
}

function populateCategories() {
  const categories = [...new Set(products.map((product) => product.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category[0].toUpperCase() + category.slice(1);
    categoryFilter.append(option);
  });
}

function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  persistCart();
  renderCart();
}

function updateQuantity(productId, delta) {
  const next = (cart[productId] || 0) + delta;
  if (next <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = next;
  }
  persistCart();
  renderCart();
}

function persistCart() {
  localStorage.setItem("shopease-cart", JSON.stringify(cart));
}

function renderCart() {
  const entries = Object.entries(cart);
  const cartItems = entries
    .map(([id, quantity]) => {
      const product = products.find((p) => p.id === Number(id));
      if (!product) return null;
      return {
        ...product,
        quantity,
        subtotal: product.price * quantity,
      };
    })
    .filter(Boolean);

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = formatMoney(total);

  if (!cartItems.length) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItemsContainer.innerHTML = cartItems
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <p>${formatMoney(item.price)} each</p>
          </div>
          <div class="qty-controls">
            <button data-minus="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button data-plus="${item.id}">+</button>
          </div>
        </div>
      `
    )
    .join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  backdrop.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  backdrop.classList.remove("show");
}

productsGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-add]");
  if (!button) return;
  addToCart(Number(button.dataset.add));
  openCart();
});

cartItemsContainer.addEventListener("click", (event) => {
  const plus = event.target.closest("button[data-plus]");
  const minus = event.target.closest("button[data-minus]");
  if (plus) updateQuantity(Number(plus.dataset.plus), 1);
  if (minus) updateQuantity(Number(minus.dataset.minus), -1);
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);

checkoutButton.addEventListener("click", () => {
  const hasItems = Object.keys(cart).length > 0;
  if (!hasItems) {
    alert("Your cart is empty.");
    return;
  }
  alert("Order placed successfully. Thank you for shopping with ShopEase.");
  cart = {};
  persistCart();
  renderCart();
  closeCart();
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = newsletterEmail.value.trim();
  if (!email) return;
  newsletterMessage.textContent = "Subscribed! You will receive weekly deals.";
  newsletterEmail.value = "";
});

populateCategories();
renderProducts();
renderCart();
