"use strict";

// Giỏ chỉ lưu ID + quantity. Tên/ảnh/giá luôn đọc lại từ API khi render giỏ.
function readCart() {
  try {
    const data = JSON.parse(localStorage.getItem(API_CONFIG.CART_KEY) || "[]");
    if (!Array.isArray(data)) return [];
    const seen = new Set();
    return data.filter(item => {
      if (!item || !Number.isInteger(item.id) || item.id < 1 || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999 || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  } catch { return []; }
}

function updateCartBadge() {
  const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach(badge => { badge.textContent = count; });
}

function saveCart(cart) {
  localStorage.setItem(API_CONFIG.CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addProductToCart(product, quantity) {
  const cart = readCart();
  const item = cart.find(item => item.id === product.id);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity + (item?.quantity || 0) > Math.min(product.stock, 999)) {
    throw new Error("Số lượng không hợp lệ hoặc vượt tồn kho mẫu, tính cả sản phẩm đã có trong giỏ.");
  }
  if (item) item.quantity += quantity;
  else cart.push({ id: product.id, quantity });
  saveCart(cart);
}

updateCartBadge();
window.addEventListener("storage", updateCartBadge);
