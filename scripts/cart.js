"use strict";

// Phần nối tối thiểu cho nút Thêm vào giỏ trên trang chi tiết, chưa có thanh toán thật.
const cartContent = document.querySelector("#cart-content");
let cartProducts = [];

function renderCart() {
  const cart = readCart();
  cartContent.replaceChildren();
  if (!cart.length) {
    const empty = document.createElement("p");
    empty.className = "notice";
    empty.textContent = "Giỏ hàng đang trống. Hãy chọn sản phẩm từ danh sách.";
    cartContent.append(empty);
    return;
  }
  let total = 0;
  let needsUpdate = false;
  cart.forEach(item => {
    const product = cartProducts.find(product => product.id === item.id);
    const view = document.querySelector("#cart-item-template").content.cloneNode(true);
    setProductImage(view.querySelector("img"), product?.thumbnail, product?.title || "Sản phẩm không còn trong danh mục");
    view.querySelector(".cart-item-title").textContent = product?.title || "Sản phẩm không còn trong danh mục";
    view.querySelector(".cart-item-price").textContent = product ? formatMoney(product.priceCents) : "Hãy xóa mục này";
    const quantity = view.querySelector(".cart-quantity");
    quantity.value = item.quantity;
    quantity.max = Math.min(product?.stock || 0, 999);
    quantity.disabled = !product?.stock;
    quantity.setAttribute("aria-label", `Số lượng ${product?.title || "sản phẩm"}`);
    quantity.addEventListener("change", () => {
      const value = Number(quantity.value);
      if (!Number.isInteger(value) || value < 1 || value > Math.min(product.stock, 999)) {
        quantity.value = item.quantity;
        document.querySelector("#cart-notice").textContent = "Số lượng phải là số nguyên từ 1 đến tồn kho mẫu (tối đa 999).";
        return;
      }
      try { saveCart(readCart().map(entry => entry.id === item.id ? { ...entry, quantity: value } : entry)); renderCart(); }
      catch (error) { showPageError(cartContent, error, loadCart); }
    });
    view.querySelector(".remove-item").addEventListener("click", () => {
      try { saveCart(readCart().filter(entry => entry.id !== item.id)); renderCart(); }
      catch (error) { showPageError(cartContent, error, loadCart); }
    });
    const lineTotal = (product?.priceCents || 0) * item.quantity;
    total += lineTotal;
    needsUpdate ||= !product || item.quantity > product.stock;
    view.querySelector(".cart-line-total").textContent = formatMoney(lineTotal);
    cartContent.append(view);
  });
  const notice = document.createElement("p");
  notice.id = "cart-notice";
  notice.className = "notice";
  notice.setAttribute("role", "status");
  notice.textContent = needsUpdate ? "Có sản phẩm không còn đủ số lượng. Hãy cập nhật hoặc xóa trước khi tiếp tục." : "Giỏ hàng demo, chưa bao gồm vận chuyển và chưa có thanh toán thực tế.";
  const summary = document.createElement("p");
  summary.className = "cart-total";
  summary.textContent = `Tạm tính: ${formatMoney(total)}`;
  cartContent.append(notice, summary);
}

async function loadCart() {
  cartContent.textContent = "Đang tải giỏ hàng...";
  try { cartProducts = await fetchProducts(); renderCart(); }
  catch (error) { showPageError(cartContent, error, loadCart); }
}
window.addEventListener("storage", renderCart);
loadCart();
