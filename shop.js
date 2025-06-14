// shop.js

// UTILITIES
const storage = {
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

// ITEM STRUCTURE:
// {
//   id: "unique-id",
//   title: "Product Name",
//   price: 499.99,
//   quantity: 1,
//   image: "thumbnail.jpg"
// }

const CART_KEY = 'shopping_cart';
const WISHLIST_KEY = 'wishlist';


// ---------- SHOPPING CART ----------
const Cart = {
  getItems() {
    return storage.get(CART_KEY);
  },

  saveItems(items) {
    storage.set(CART_KEY, items);
  },

  addItem(product) {
    alert("item added");
    let items = this.getItems();
    const index = items.findIndex(item => item.id === product.id);
    if (index > -1) {
      items[index].quantity += product.quantity || 1;
    } else {
      items.push({ ...product, quantity: product.quantity || 1 });
    }
    this.saveItems(items);
    
  },

  removeItem(productId) {
    let items = this.getItems();
    items = items.filter(item => item.id !== productId);
    this.saveItems(items);
  },

  updateQuantity(productId, quantity) {
    let items = this.getItems();
    const index = items.findIndex(item => item.id === productId);
    if (index > -1 && quantity > 0) {
      items[index].quantity = quantity;
    } else if (index > -1) {
      items.splice(index, 1); // remove if quantity is 0
    }
    this.saveItems(items);
  },

  clearCart() {
    storage.remove(CART_KEY);
  },

  getTotalPrice() {
    const items = this.getItems();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getTotalItems() {
    const items = this.getItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  }
};


// ---------- WISHLIST ----------
const Wishlist = {
  getItems() {
    return storage.get(WISHLIST_KEY);
  },

  saveItems(items) {
    storage.set(WISHLIST_KEY, items);
  },

  addItem(product) {
    let items = this.getItems();
    if (!items.some(item => item.id === product.id)) {
      items.push(product);
      this.saveItems(items);
    }
  },

  removeItem(productId) {
    let items = this.getItems();
    items = items.filter(item => item.id !== productId);
    this.saveItems(items);
  },

  isInWishlist(productId) {
    return this.getItems().some(item => item.id === productId);
  },

  clearWishlist() {
    storage.remove(WISHLIST_KEY);
  }
};


// ---------- DOM INTEGRATION (Example Functions to Hook into UI) ----------
function renderCart(containerId) {
  const items = Cart.getItems();
  const container = document.getElementById(containerId);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  container.innerHTML = items.map(item => `
    <tr class="cart-item" data-id="prod-101">
      <td><img src="${item.image}" alt="${item.title}" class="img-thumbnail" /></td>
      <td>${item.title}</td>
      <td class="price">$${item.price.toFixed(2)}</td>
      <td><button class="btn btn-sm btn-danger" onclick="Cart.removeItem('prod-101'); renderCartTable('cart-items');">Remove</button></td>
    </tr>
  `).join('');
}


function renderWishlist(containerId) {
  const items = Wishlist.getItems();
  const container = document.getElementById(containerId);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="wishlist-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" />
      <div>
        <h4>${item.title}</h4>
        <p>$${item.price.toFixed(2)}</p>
        <button onclick="Wishlist.removeItem('${item.id}'); renderWishlist('${containerId}')">Remove</button>
        <button onclick="Cart.addItem(${JSON.stringify(item)}); renderCart('cartContainer')">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function renderCartTable(tableBodyId) {
  const items = Cart.getItems();
  const container = document.getElementById(tableBodyId);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<tr><td colspan="4">Your cart is empty.</td></tr>`;
    updateSummary(0); // also update summary
    return;
  }

  let subtotal = 0;

  container.innerHTML = items.map(item => {
    const totalItemPrice = item.price * item.quantity;
    subtotal += totalItemPrice;

    return `
      <tr class="cart-item" data-id="${item.id}">
        <td><img src="${item.image}" alt="${item.title}" class="img-thumbnail" style="max-width: 80px;" /></td>
        <td>${item.title}</td>
        <td class="price" data-price="${totalItemPrice.toFixed(2)}">$${totalItemPrice.toFixed(2)}</td>
        <td><span class="remove-btn" onclick="Cart.removeItem('${item.id}'); renderCartTable('${tableBodyId}');">Remove</span></td>
      </tr>
    `;
  }).join('');

  updateSummary(subtotal);
}

let discountAmount = 0;

function updateSummary(subtotal) {
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('discount').textContent = `-$${discountAmount.toFixed(2)}`;
  document.getElementById('total').textContent = `$${(subtotal - discountAmount).toFixed(2)}`;
}

function applyDiscount() {
  const coupon = document.getElementById('couponInput').value.trim();
  if (coupon.toLowerCase() === "save10") {
    discountAmount = 10;
    document.getElementById('discountMessage').textContent = "Coupon 'SAVE10' applied successfully!";
  } else {
    discountAmount = 0;
    document.getElementById('discountMessage').textContent = "Invalid coupon code.";
  }

  // Recalculate summary using actual cart data
  const items = Cart.getItems();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  updateSummary(subtotal);
}
