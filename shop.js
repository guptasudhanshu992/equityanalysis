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
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" />
      <div>
        <h4>${item.title}</h4>
        <p>$${item.price.toFixed(2)}</p>
        <input type="number" min="1" value="${item.quantity}" onchange="Cart.updateQuantity('${item.id}', this.value)">
        <button onclick="Cart.removeItem('${item.id}'); renderCart('${containerId}')">Remove</button>
      </div>
    </div>
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