"use strict";

// BƯỚC 4: Cùng file dùng cho products.html và sale.html.
const productList = document.querySelector("#product-list");
const productSearch = document.querySelector("#product-search");
const productSort = document.querySelector("#product-sort");
const productStatus = document.querySelector("#product-status");
const productRetry = document.querySelector("#product-retry");
let products = [];
let loading = false;

function renderProducts() {
  const keyword = productSearch.value.trim().toLowerCase();
  let result = products.filter(product => product.title.toLowerCase().includes(keyword));
  // Trang ưu đãi lọc chỉ số của API; không tự dựng giá gạch ngang hay giảm thêm lần nữa.
  if (document.body.dataset.view === "sale") result = result.filter(product => product.discount >= 10);
  if (productSort.value === "low") result.sort((a, b) => a.priceCents - b.priceCents);
  if (productSort.value === "high") result.sort((a, b) => b.priceCents - a.priceCents);
  productList.replaceChildren();
  result.forEach(product => productList.append(createProductCard(product)));
  productStatus.textContent = result.length ? `${result.length} sản phẩm phù hợp` : "Không tìm thấy sản phẩm phù hợp.";
}

async function loadProducts() {
  if (loading) return;
  loading = true;
  productSearch.disabled = productSort.disabled = true;
  productRetry.hidden = true;
  productStatus.textContent = "Đang tải sản phẩm...";
  productList.setAttribute("aria-busy", "true");
  try {
    products = await fetchProducts();
    renderProducts();
    productSearch.disabled = productSort.disabled = false;
  } catch (error) { productStatus.textContent = "Không tải được danh sách."; showPageError(productList, error); productRetry.hidden = false; }
  finally { loading = false; productList.setAttribute("aria-busy", "false"); }
}

productSearch.addEventListener("input", renderProducts);
productSort.addEventListener("change", renderProducts);
productRetry.addEventListener("click", loadProducts);
loadProducts();
