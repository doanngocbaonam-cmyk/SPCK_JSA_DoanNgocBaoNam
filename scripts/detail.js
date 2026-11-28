"use strict";

// BƯỚC 5: Đọc ID từ URL rồi fetch MỘT sản phẩm; không dùng dữ liệu viết sẵn.
const detailContainer = document.querySelector("#product-detail");
const productId = new URLSearchParams(location.search).get("id");

function renderProductDetail(product) {
  const view = document.querySelector("#detail-template").content.cloneNode(true);
  const mainImage = view.querySelector(".detail-image");
  setProductImage(mainImage, product.images[0] || product.thumbnail, product.title);
  view.querySelector(".detail-title").textContent = product.title;
  view.querySelector(".detail-price").textContent = formatMoney(product.priceCents);
  view.querySelector(".detail-description").textContent = product.description;
  view.querySelector(".detail-rating").textContent = `${product.rating.toFixed(1)}/5 · Dữ liệu đánh giá mẫu`;
  view.querySelector(".detail-stock").textContent = product.stock ? `Còn ${product.stock} sản phẩm (tồn kho mẫu)` : "Tạm hết hàng";
  view.querySelector(".detail-brand").textContent = product.brand;
  view.querySelector(".detail-sku").textContent = product.sku;
  view.querySelector(".detail-warranty").textContent = product.warranty;
  view.querySelector(".detail-shipping").textContent = product.shipping;

  // Ảnh nhỏ đổi ảnh chính. Nếu API chỉ có một ảnh thì không cần dải ảnh nhỏ.
  const gallery = view.querySelector(".detail-thumbnails");
  if (product.images.length > 1) product.images.forEach((url, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Xem ảnh ${index + 1} của ${product.title}`);
    button.setAttribute("aria-pressed", String(index === 0));
    const image = document.createElement("img");
    setProductImage(image, url, "");
    button.append(image);
    button.addEventListener("click", () => {
      setProductImage(mainImage, url, product.title);
      gallery.querySelectorAll("button").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    });
    gallery.append(button);
  });

  const quantity = view.querySelector("#quantity");
  quantity.max = Math.min(product.stock, 999);
  const addButton = view.querySelector("#add-product");
  addButton.disabled = !product.stock;
  view.querySelectorAll("[data-step]").forEach(button => {
    button.disabled = !product.stock;
    button.addEventListener("click", () => {
      const current = Math.trunc(Number(quantity.value)) || 1;
      quantity.value = Math.min(Math.max(1, current + Number(button.dataset.step)), Math.min(product.stock, 999));
    });
  });

  const message = view.querySelector("#add-message");
  view.querySelector("#add-form").addEventListener("submit", event => {
    event.preventDefault();
    try {
      addProductToCart(product, Number(quantity.value));
      message.className = "notice success";
      message.textContent = "Đã thêm sản phẩm vào giỏ hàng.";
    } catch (error) { message.className = "notice error"; message.textContent = error.message; }
  });

  const reviews = view.querySelector(".detail-reviews");
  if (!product.reviews.length) reviews.textContent = "Chưa có đánh giá mẫu.";
  product.reviews.slice(0, 3).forEach(review => {
    const item = document.createElement("article");
    item.className = "review";
    const name = document.createElement("h3");
    name.textContent = review.reviewerName || "Khách hàng";
    const text = document.createElement("p");
    text.textContent = review.comment || "";
    item.append(name, text);
    reviews.append(item);
  });
  detailContainer.replaceChildren(view);
  document.title = `${product.title} | SportZone`;
  document.querySelector("#breadcrumb-title").textContent = product.title;
}

async function loadProductDetail() {
  detailContainer.textContent = "Đang tải thông tin sản phẩm...";
  detailContainer.setAttribute("aria-busy", "true");
  try {
    if (!productId) throw new Error("Bạn chưa chọn sản phẩm. Hãy quay lại danh sách.");
    const product = await fetchProductById(productId);
    renderProductDetail(product);
  } catch (error) { showPageError(detailContainer, error, /^\d{1,8}$/.test(productId || "") ? loadProductDetail : null); }
  finally { detailContainer.setAttribute("aria-busy", "false"); }
}

loadProductDetail();
// TODO HS: Bổ sung sản phẩm liên quan bằng fetchProducts(), bỏ ID đang xem.
