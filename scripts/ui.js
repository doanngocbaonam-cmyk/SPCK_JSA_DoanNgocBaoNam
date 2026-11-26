"use strict";

// BƯỚC 3: Các hàm hiển thị dùng lại ở nhiều trang.
function formatMoney(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: API_CONFIG.CURRENCY }).format(cents / 100);
}

function setProductImage(image, url, title) {
  image.onerror = () => { image.onerror = null; image.src = API_CONFIG.PLACEHOLDER; };
  image.src = url || API_CONFIG.PLACEHOLDER;
  image.alt = title;
}

function showPageError(container, error, retry) {
  container.replaceChildren();
  const message = document.createElement("p");
  message.className = "notice error";
  message.setAttribute("role", "alert");
  message.textContent = error.message || "Không tải được dữ liệu. Kiểm tra Internet và thử lại.";
  container.append(message);
  if (retry) {
    const button = document.createElement("button");
    button.className = "button secondary";
    button.type = "button";
    button.textContent = "Thử lại";
    button.addEventListener("click", retry);
    container.append(button);
  }
}

// Tạo card bằng DOM: dữ liệu bên ngoài dùng textContent, không ghép vào innerHTML.
function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "card";
  const imageLink = document.createElement("a");
  imageLink.className = "card-image";
  imageLink.href = `detail.html?id=${product.id}`;
  const image = document.createElement("img");
  image.loading = "lazy";
  setProductImage(image, product.thumbnail, product.title);
  imageLink.append(image);
  const body = document.createElement("div");
  body.className = "card-body";
  const category = document.createElement("span");
  category.className = "eyebrow";
  category.textContent = "DỤNG CỤ THỂ THAO";
  const title = document.createElement("h3");
  title.textContent = product.title;
  const price = document.createElement("p");
  price.className = "price";
  price.textContent = formatMoney(product.priceCents);
  const link = document.createElement("a");
  link.className = "button secondary";
  link.href = imageLink.href;
  link.textContent = "Xem chi tiết";
  body.append(category, title, price, link);
  article.append(imageLink, body);
  return article;
}
