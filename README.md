## Hệ thống quản lý sản phẩm (Node.js + Express + MongoDB)

Dự án là một web app quản lý sản phẩm với giao diện client và trang quản trị (admin), xây dựng bằng **Node.js, Express, Mongoose, Pug**.

### 1. Yêu cầu môi trường

- **Node.js**: phiên bản khuyến nghị ≥ 18
- **npm**: đi kèm Node
- **MongoDB**: có sẵn một MongoDB server (local hoặc cloud, ví dụ MongoDB Atlas)

### 2. Cài đặt dependencies

Trong thư mục gốc dự án:

```bash
npm install
```

### 3. Cấu hình biến môi trường

Dự án sử dụng file `.env` (đã có sẵn trong root) với ít nhất 2 biến sau:

```bash
PORT=3000                # Cổng server Express
MONGO_URL=mongodb://...  # Connection string tới MongoDB
```

- Chỉnh `PORT` theo ý bạn (hoặc giữ nguyên).
- Chỉnh `MONGO_URL` để trỏ đúng tới MongoDB của bạn.

> Kết nối DB được cấu hình ở `config/database.js` và được gọi trong `index.js`.

### 4. Chạy dự án

Trong thư mục gốc:

```bash
npm start
```

Lệnh này sẽ chạy:

```bash
nodemon --inspect index.js
```

Nếu cấu hình đúng, terminal sẽ log:

- `connect Success!` (kết nối MongoDB thành công)
- `Example app listening on port <PORT>`

### 5. Cấu trúc chính của dự án

- `index.js`: file khởi động Express app, load `.env`, kết nối DB, cấu hình view engine Pug, static files, routes.
- `config/database.js`: cấu hình kết nối MongoDB bằng Mongoose.
- `config/system.js`: cấu hình `prefixAdmin` (mặc định `/admin`).
- `models/product.model.js`: định nghĩa schema `Product` (title, slug, description, price, stock, thumbnail, status, position, deleted, deleteAt, timestamps).
- `controllers/`: xử lý logic cho từng route.
  - `controllers/admin/product.controller.js`: CRUD sản phẩm, filter, search, pagination, trash/restore, change status, change multi.
  - `controllers/admin/dashboard.controller.js`: dashboard admin.
  - `controllers/client/*.js`: controller cho giao diện người dùng (home, products).
- `routers/`:
  - `routers/admin/index.route.js`: group các route admin dưới prefix `/admin` (dashboard, products).
  - `routers/client/index.route.js`: group các route client (home, products).
- `views/`: template Pug cho client và admin (ví dụ `views/admin/pages/products/create.pug`, `views/admin/pages/products/index.pug`, ...).
- `public/`: static assets (JS, CSS, images).

### 6. Các route quan trọng

#### 6.1. Client

- **Trang chủ**: `GET /`
- **Danh sách sản phẩm**: `GET /products`
- (Các view client khác nằm trong `views/` và được map qua `routers/client/*.route.js`)

#### 6.2. Admin

Prefix admin được định nghĩa ở `config/system.js`:

```js
const PATH_ADMIN = "/admin";
module.exports = { prefixAdmin: PATH_ADMIN };
```

Do đó các route admin có dạng:

- **Dashboard**: `GET /admin/dashboard`
- **Danh sách sản phẩm**: `GET /admin/products`
- **Thêm sản phẩm**:
  - `GET /admin/products/create` – hiển thị form
  - `POST /admin/products/create` – submit form
- **Đổi trạng thái**: `PATCH /admin/products/change-status/:status/:id`
- **Thay đổi hàng loạt**: `PATCH /admin/products/change-multi`
  - Thay đổi status nhiều sản phẩm
  - Xóa mềm (soft delete) nhiều sản phẩm
- **Xóa mềm 1 sản phẩm**: `DELETE /admin/products/delete/:id`
- **Thùng rác sản phẩm**: `GET /admin/products/trash`
- **Khôi phục sản phẩm**: `PATCH /admin/products/restore/:id`

> Lưu ý: Dự án dùng `method-override` với query `_method` để hỗ trợ `PATCH`, `DELETE` từ form HTML.

### 7. Upload ảnh sản phẩm

Khi tạo sản phẩm, nếu có upload ảnh:

- Ảnh được lưu vào thư mục (ví dụ) `public/uploads/products/`
- Trên DB, field `thumbnail` lưu path: `/uploads/products/<tên_file>`

Hãy đảm bảo:

- Thư mục lưu ảnh tồn tại và server có quyền ghi.
- Trên form tạo sản phẩm (`views/admin/pages/products/create.pug`) có input `type="file"` đúng name theo cấu hình multer.

### 8. Quy ước dữ liệu sản phẩm

- **title**: bắt buộc, dùng để hiển thị và tạo `slug`.
- **price**: số, bắt buộc (nếu không hợp lệ sẽ chuyển về 0).
- **stock**: số, mặc định 0 nếu không nhập.
- **status**: `active` / `inactive` (dùng để filter hiển thị trong admin).
- **position**: số, dùng để sắp xếp sản phẩm.
- **deleted**: `false` (mặc định), `true` khi xóa mềm.
- **deleteAt**: thời điểm xóa mềm.
- **slug**: được tạo tự động từ title, đảm bảo unique (tự động thêm hậu tố `-1`, `-2`, ... nếu trùng).

### 9. Quy trình phát triển / chỉnh sửa

1. Chạy MongoDB và chỉnh `MONGO_URL` trong `.env` cho đúng.
2. Chạy `npm install` (lần đầu hoặc khi thêm package).
3. Chạy `npm start` để bật server.
4. Vào trình duyệt:
   - Kiểm tra giao diện client: `http://localhost:<PORT>/`
   - Kiểm tra trang admin: `http://localhost:<PORT>/admin/products` hoặc `/admin/dashboard`.
5. Khi cần thêm chức năng:
   - Thêm/ chỉnh sửa **model** trong `models/`.
   - Viết **controller** trong `controllers/`.
   - Khai báo **route** trong `routers/`.
   - Tạo/ chỉnh sửa **view Pug** trong `views/`.

### 10. Gợi ý tiếp theo

- Thêm chức năng **phân quyền đăng nhập admin**.
- Thêm **validate dữ liệu** phía server lẫn client.
- Thêm **test** (unit/integration) cho các controller, model quan trọng.

---

Nếu bạn muốn tôi viết thêm hướng dẫn chi tiết cho một phần cụ thể (ví dụ: chỉ riêng module sản phẩm, hoặc upload ảnh), hãy nói rõ phần đó.

