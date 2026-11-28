"use strict";

// BƯỚC 2: Hàm chung chỉ lấy JSON, không cập nhật giao diện.
async function fetchJSON(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(API_CONFIG.BASE_URL + path, { signal: controller.signal });
    if (response.status === 404) throw new Error("Không tìm thấy sản phẩm này.");
    if (!response.ok) throw new Error(`Không tải được dữ liệu (HTTP ${response.status}).`);
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Kết nối quá lâu. Hãy thử lại.");
    throw error;
  } finally { clearTimeout(timer); }
}

// Dùng chung cấu trúc cho danh sách, chi tiết và giỏ; tiền lưu dưới dạng cents.
function normalizeProduct(item) {
  if (!item || !Number.isInteger(item.id) || !item.title || !Number.isFinite(item.price) || item.price < 0) {
    throw new Error("API trả thông tin sản phẩm không hợp lệ.");
  }
  const images = (Array.isArray(item.images) ? item.images : []).filter(url => typeof url === "string" && url.startsWith("https://"));
  return {
    id: item.id, title: item.title, category: item.category,
    description: item.description || "Đang cập nhật mô tả.",
    priceCents: Math.round(item.price * 100),
    thumbnail: typeof item.thumbnail === "string" && item.thumbnail.startsWith("https://") ? item.thumbnail : API_CONFIG.PLACEHOLDER,
    images, stock: Number.isInteger(item.stock) && item.stock > 0 ? item.stock : 0,
    brand: item.brand || "Đang cập nhật", sku: item.sku || "Đang cập nhật",
    rating: Number(item.rating) || 0, discount: Number(item.discountPercentage) || 0,
    warranty: item.warrantyInformation || "Xem thông tin nhà cung cấp.",
    shipping: item.shippingInformation || "Đang cập nhật.",
    reviews: Array.isArray(item.reviews) ? item.reviews : [],
  };
}

async function fetchProducts() {
  const data = await fetchJSON(`/products/category/${API_CONFIG.CATEGORY}?limit=0`);
  // Danh sách trả { products: [...] }, không dùng data.map() trên object này.
  if (!Array.isArray(data.products)) throw new Error("API không trả về mảng products.");
  return data.products.map(normalizeProduct);
}

async function fetchProductById(id) {
  if (!/^\d{1,8}$/.test(String(id))) throw new Error("Mã sản phẩm không hợp lệ. Hãy chọn lại từ danh sách.");
  // Chi tiết trả MỘT object trực tiếp, không có data.products.
  const data = await fetchJSON(`/products/${encodeURIComponent(id)}`);
  if (data.category !== API_CONFIG.CATEGORY) throw new Error("Sản phẩm này không thuộc danh mục thể thao của SportZone.");
  return normalizeProduct(data);
}
