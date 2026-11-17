// ==========================================
// 1. Product Data List
// ==========================================
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "electronics",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Men's Casual Shirt",
    category: "clothing",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Ceramic Table Lamp",
    category: "home",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "electronics",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Denim Jacket",
    category: "clothing",
    price: 59.50,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    name: "Coffee Mug Set",
    category: "home",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    category: "electronics",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 8,
    name: "Cotton Throw Pillow",
    category: "home",
    price: 15.00,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80"
  }
];

// ==========================================
// 2. Application State
// ==========================================
let cart = [];
let currentCategory = "all";
let currentSearch = "";

// ==========================================
// 3. Render Products to Page
// ==========================================
function displayProducts() {
  const productGrid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResultsMessage");

  // Filter based on selected category and search input
  const filteredProducts = products.filter(function (product) {
    const matchesCategory =
      currentCategory === "all" || product.category === currentCategory;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(currentSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // If no items match, display the warning message
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "";
    noResults.classList.remove("d-none");
    return;
  }

  noResults.classList.add("d-none");

  // Build HTML cards for each product
  let html = "";
  for (let i = 0; i < filteredProducts.length; i++) {
    const item = filteredProducts[i];
    html += `
      <div class="col">
        <div class="card h-100 shadow-sm">
          <img src="${item.image}" class="card-img-top" alt="${item.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fs-6">${item.name}</h5>
            <p class="card-text text-muted mb-2 text-capitalize">${item.category}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="fw-bold">$${item.price.toFixed(2)}</span>
              <button class="btn btn-sm btn-primary" onclick="addToCart(${item.id})">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  productGrid.innerHTML = html;
}

// ==========================================
// 4. Live Search
// ==========================================
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function (event) {
  currentSearch = event.target.value.trim();
  displayProducts();
});

// ==========================================
// 5. Category Filtering
// ==========================================
function filterCategory(category, buttonElement) {
  currentCategory = category;

  // Update active state on buttons
  const buttons = document.querySelectorAll(".btn-group button");
  buttons.forEach(function (btn) {
    btn.classList.remove("active");
  });
  buttonElement.classList.add("active");

  displayProducts();
}

// ==========================================
// 6. Shopping Cart Functions
// ==========================================
function addToCart(productId) {
  // Find product by id
  const product = products.find(function (p) {
    return p.id === productId;
  });

  if (!product) return;

  // Check if product is already in cart
  const existingItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  updateCartDisplay();
}

function removeFromCart(productId) {
  // Filter out the item
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });
  updateCartDisplay();
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cartCount");
  const cartTableBody = document.getElementById("cartTableBody");
  const cartTable = document.getElementById("cartTable");
  const emptyCartText = document.getElementById("emptyCartText");
  const cartTotalDisplay = document.getElementById("cartTotalDisplay");

  // Calculate total items count and total price
  let totalItems = 0;
  let totalPrice = 0;

  for (let i = 0; i < cart.length; i++) {
    totalItems += cart[i].quantity;
    totalPrice += cart[i].price * cart[i].quantity;
  }

  // Update badge count in navbar
  cartCount.textContent = totalItems;
  cartTotalDisplay.textContent = "$" + totalPrice.toFixed(2);

  // If cart is empty
  if (cart.length === 0) {
    cartTable.classList.add("d-none");
    emptyCartText.classList.remove("d-none");
    cartTableBody.innerHTML = "";
    return;
  }

  cartTable.classList.remove("d-none");
  emptyCartText.classList.add("d-none");

  // Render table rows
  let rowsHtml = "";
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    rowsHtml += `
      <tr>
        <td>${item.name}</td>
        <td class="text-center">${item.quantity}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeFromCart(${item.id})">
            &times;
          </button>
        </td>
      </tr>
    `;
  }

  cartTableBody.innerHTML = rowsHtml;
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your order! Checkout simulated successfully.");
  clearCart();

  // Close the modal using Bootstrap API
  const modalElement = document.getElementById("cartModal");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) {
    modalInstance.hide();
  }
}

// ==========================================
// 7. Initial Load
// ==========================================
window.onload = function () {
  displayProducts();
  updateCartDisplay();
};
