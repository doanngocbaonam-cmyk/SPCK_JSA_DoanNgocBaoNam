"use strict";

// BƯỚC 1: Chỉ đặt URL/danh mục/key lưu trữ tại một nơi.
// DummyJSON GET công khai, không cần API key: https://dummyjson.com/docs/products
const API_CONFIG = {
  BASE_URL: "https://dummyjson.com",
  CATEGORY: "sports-accessories",
  CURRENCY: "USD", // Giá nguồn là số liệu demo, không tự gắn ký hiệu VND.
  CART_KEY: "sportzone-cart",
  PLACEHOLDER: "images/product-placeholder.svg",
};
