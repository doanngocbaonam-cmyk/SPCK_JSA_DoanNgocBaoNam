# SportZone — hướng dẫn API và trang chi tiết sản phẩm

## 1. Chạy project

Mở thư mục bằng VS Code, dùng Live Server mở `index.html`. Giữ kết nối Internet. Không cần API key, backend hay cài thư viện cho các trang sản phẩm.

Luồng chính:

```text
index.html → products.html → detail.html?id=137 → cart.html
                       ↗
                  sale.html
```

`products.html` là danh sách. `detail.html` đã chuyển thành **một trang chi tiết dùng chung**, ID đọc từ URL và fetch trực tiếp endpoint chi tiết. Các file detail0…detail4 cũ đã được bỏ, không cần redirect/tương thích URL cũ.

## 2. Nguồn API và phạm vi dữ liệu

- Tài liệu: https://dummyjson.com/docs/products
- Danh sách: https://dummyjson.com/products/category/sports-accessories?limit=0
- Chi tiết: https://dummyjson.com/products/137
- GET công khai không cần key; ID ví dụ có thể thay đổi theo catalog.
- Danh mục hiện tại là dụng cụ/phụ kiện thể thao, không còn bộ giày/áo hardcode cũ.
- Giá hiển thị USD, là dữ liệu shop mẫu; không phải báo giá hay tồn kho cửa hàng thật.
- Trang ưu đãi lọc `discountPercentage >= 10`, vẫn hiển thị giá API. Không dựng giá gạch ngang hoặc giảm tiếp khi chưa xác định quy tắc giá.

## 3. Cấu trúc file

```text
index.html                    Sản phẩm nổi bật từ API
products.html                 Danh sách, tìm kiếm, sắp xếp
detail.html                   Chi tiết theo ID, ảnh, số lượng, thêm giỏ
sale.html                     Dùng cùng API, lọc chỉ số ưu đãi
cart.html                     Giỏ demo, giá đọc lại từ API
introduce.html                Giới thiệu
login.html, register.html     Tài khoản demo của học sinh
review.html                   Bản nháp cũ đang comment, chưa dùng
css/
  style.css                   UI shop dùng chung
  style1.css                  UI tài khoản, khung form tối đa 420px
scripts/
  config.js                   URL, danh mục, tiền tệ, key giỏ
  api.js                      fetchJSON, normalizeProduct, các hàm GET
  ui.js                       Format tiền, ảnh, lỗi và card dùng chung
  cart-store.js               Đọc/ghi ID + quantity, cập nhật badge
  account.js                  Menu tài khoản, giữ key currentUser
  home.js                     Render sản phẩm nổi bật
  products.js                 Danh sách và ưu đãi
  detail.js                   Fetch/render trang chi tiết
  cart.js                     Render giỏ, sửa/xóa và tính tạm tính
  login.js, register.js        Logic tài khoản cũ
images/
  product-placeholder.svg     Ảnh dự phòng
```

Giữ HTML ở gốc, CSS trong css, JS trong scripts, ảnh trong images. Không thêm nhiều trang chi tiết tĩnh cho từng sản phẩm.

## 4. Thứ tự học code

### Bước 1 — products.html và config.js

Tìm `#product-list`, ô tìm kiếm và select sắp xếp. Xem API_CONFIG trong config.js: thay đổi cấu hình ở một nơi. Các trang shop nạp config → api → ui/cart-store/account → script riêng.

### Bước 2 — api.js

`fetchJSON(path)` dùng fetch, kiểm tra HTTP, đọc JSON và timeout. Không sửa DOM trong hàm lấy dữ liệu.

Phân biệt hai kiểu response:

```js
// Danh sách: object chứa mảng products
const data = await fetchJSON('/products/category/sports-accessories?limit=0');
const list = data.products;

// Chi tiết: object trực tiếp, không có data.products
const product = await fetchJSON('/products/137');
```

`normalizeProduct()` đưa cả hai về cấu trúc chung. Tiền đổi thành số nguyên `priceCents` để tính tổng, chỉ chia 100 khi hiển thị bằng formatMoney. fetchProductById kiểm tra ID và category để không hiển thị sản phẩm ngoài danh mục SportZone.

### Bước 3 — ui.js và products.js

createProductCard tạo DOM, dùng textContent cho chữ và link `detail.html?id=...` cùng ID API. renderProducts lọc trên mảng đã tải, sort trên mảng kết quả; không fetch lại theo từng ký tự.

### Bước 4 — detail.html và detail.js

Đây là phần đã hoàn thiện trong lần chỉnh, không còn để học sinh tự viết toàn bộ:

```text
URLSearchParams đọc id
  → fetchProductById(id)
  → GET /products/{id}
  → normalizeProduct
  → clone template chi tiết
  → điền tên/ảnh/mô tả/giá/stock/thông tin nguồn
  → gắn sự kiện ảnh nhỏ, tăng/giảm, submit thêm giỏ
```

Thiếu ID, sai định dạng, không tồn tại, sai danh mục hoặc lỗi mạng đều có thông báo; lỗi có thể tải lại thì có nút Thử lại. Có link quay về danh sách.

API có nhiều ảnh thì hiện gallery; một ảnh thì chỉ hiện ảnh chính. Thiếu thương hiệu/bảo hành/mô tả dùng thông báo dự phòng, không tự bịa chất liệu/size. Review trên trang là dữ liệu mẫu của API, không phải khách thật của shop.

### Bước 5 — cart-store.js và cart.js

Key `sportzone-cart` lưu:

```json
[{ "id": 137, "quantity": 2 }]
```

Thêm cùng ID thì cộng số lượng; kiểm tra tổng với số đã có trong giỏ. Chặn số âm/lẻ/rỗng/vượt stock mẫu. Giỏ đọc lại catalog để lấy giá/ảnh/tên hiện tại, không lưu cứng các trường này trong localStorage.

cart.js render giỏ và tạm tính, sửa số lượng/xóa/badge. Chưa có checkout hay thanh toán thật; không làm nút Mua hàng giả thành công.

### Bước 6 — account.js và tài khoản hiện có

Menu dùng `currentUser`; danh sách tài khoản trong `users` vẫn theo mã học sinh. account.js chỉ đọc an toàn và render menu, không thay toàn bộ login/register. Mật khẩu demo hiện còn dạng rõ trong localStorage, cần học sinh cải thiện; không dùng mật khẩu thật.

## 5. Việc học sinh làm tiếp

- [ ] Tự giải thích luồng danh sách → ID → chi tiết → giỏ; chỉ rõ từng request trong Network.
- [ ] Bổ sung sản phẩm liên quan trên detail, bỏ ID đang xem, dùng lại card/API.
- [ ] Thêm đánh giá lọc theo sao hoặc thống kê đơn giản từ reviews mẫu.
- [ ] Khi muốn mở rộng giày/quần áo, chọn danh mục API phù hợp rồi thiết kế filter; không ghép bừa sản phẩm ngoài category hiện tại.
- [ ] Checkout demo: thêm thông tin người nhận và validate tên/email/điện thoại/địa chỉ; thống nhất phí vận chuyển, xử lý giỏ trống.
- [ ] Chỉ xóa giỏ sau khi xác nhận đơn demo hợp lệ; nếu sau này có backend, server phải tự tính giá/stock/quyền.
- [ ] Đăng ký: email chuẩn hóa chữ thường, chặn trùng email không phân biệt hoa thường, trim tên và thông báo dưới trường sai.
- [ ] Đăng nhập không trim mật khẩu khác với đăng ký; chỉ lưu thông tin phiên công khai vào currentUser, không lưu lại password trong phiên.
- [ ] Đọc users bằng try/catch và kiểm tra kiểu dữ liệu. Tài khoản localStorage chỉ là demo, không phải xác thực server.
- [ ] Dọn hoặc xây dựng review.html vì bản cũ đang comment toàn bộ, không phải trang chức năng đang chạy.
- [ ] Kiểm tra trực quan mobile/desktop, focus bàn phím và menu tài khoản trước khi nộp.

## 6. Checklist chạy thử

| Tình huống | Mong đợi |
|---|---|
| Mở sản phẩm | Card từ API, tìm và sắp xếp hoạt động |
| Bấm một card | detail.html có ID đúng, request chi tiết đúng sản phẩm |
| Thiếu ID / id=abc | Báo lỗi, có link về danh sách |
| ID không có / thuộc mỹ phẩm | Không hiển thị sản phẩm sai danh mục |
| Offline rồi tải lại | Thông báo lỗi và Thử lại |
| Số lượng âm/lẻ/vượt stock | Không thêm vào giỏ |
| Thêm 2 lần, reload, mở giỏ | ID được gộp, giữ số lượng, tổng USD đúng |
| Sửa/xóa ở giỏ | Tạm tính và badge cập nhật |
| Ảnh lỗi hoặc thiếu | Placeholder, không vỡ bố cục |
| Màn hình 390px / desktop | Form tài khoản gọn; card/chi tiết không tràn ngang |

Xem NOTE_REVIEW_CUA_THAY.txt để biết phạm vi đã sửa và phần chưa hoàn thiện. Kiểm tra mô phỏng không thay cho việc tự chạy sản phẩm bằng trình duyệt.
