"use strict";

// Trang chủ dùng cùng nguồn/ID với trang danh sách và trang chi tiết.
const featuredList = document.querySelector("#featured-products");
async function loadFeaturedProducts() {
  featuredList.textContent = "Đang tải sản phẩm nổi bật...";
  try {
    const products = await fetchProducts();
    featuredList.replaceChildren();
    if (!products.length) featuredList.textContent = "Danh mục đang được cập nhật.";
    products.slice(0, 3).forEach(product => featuredList.append(createProductCard(product)));
  } catch (error) { showPageError(featuredList, error, loadFeaturedProducts); }
}
loadFeaturedProducts();
