# Hệ Thống Quản Lý Thư Viện (LibMaster)

Hệ thống Quản lý Thư viện trực quan, gọn nhẹ và hiện đại được xây dựng hoàn toàn bằng **HTML5, CSS3 và Vanilla JavaScript thuần**, hoạt động độc lập ngay trên trình duyệt mà không cần cài đặt các thư viện hoặc build-tool phức tạp. Dữ liệu được lưu trữ trực tiếp và bền vững thông qua `LocalStorage`.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
d:\2026-2027 HK1\
│
├── src/
│   ├── index.html        # Giao diện chính người dùng (HTML5 ngữ nghĩa, Dashboard, Modals)
│   ├── style.css         # Bảng kiểu giao diện hiện đại (Modern CSS, Responsive, UI/UX)
│   └── app.js            # Toàn bộ logic nghiệp vụ, xử lý LocalStorage và tương tác DOM
│
├── README.md             # Hướng dẫn mở chạy ứng dụng và tổng quan cấu trúc thư mục
└── BaoCao_Lab.md         # Báo cáo chi tiết bài tập Lab, sơ đồ nghiệp vụ và kiểm thử
```

---

## 🚀 Hướng Dẫn Mở & Chạy Ứng Dụng

Ứng dụng không yêu cầu cài đặt môi trường Node.js hay cơ sở dữ liệu ngoài, bạn có thể chạy theo một trong các cách sau:

### Cách 1: Mở trực tiếp trên Trình duyệt Web (Nhanh nhất)
1. Điều hướng vào thư mục `src/` trong máy tính của bạn: `d:\2026-2027 HK1\src\`.
2. Nhấp đúp chuột trái vào file **`index.html`** (hoặc chuột phải chọn **Open with** > **Google Chrome / Microsoft Edge / Firefox**).
3. Ứng dụng sẽ khởi động ngay lập tức với đầy đủ dữ liệu mẫu ban đầu.

### Cách 2: Sử dụng Live Server trong Antigravity IDE / VS Code
1. Mở thư mục dự án trong IDE.
2. Chuột phải vào file `src/index.html` và chọn **"Open with Live Server"** (nếu đã cài extension Live Server).
3. Trình duyệt sẽ tự động mở trang web tại địa chỉ `http://127.0.0.1:5500/src/index.html`.

### Cách 3: Chạy máy chủ cục bộ bằng Python (Nếu có cài Python)
Mở cửa sổ dòng lệnh (Terminal/PowerShell) tại thư mục dự án và gõ:
```bash
# Di chuyển vào thư mục src
cd src

# Khởi chạy HTTP Server đơn giản
python -m http.server 8000
```
Sau đó mở trình duyệt và truy cập: [http://localhost:8000](http://localhost:8000)

---

## 🌟 Các Tính Năng Chính Của Hệ Thống

1. **Dashboard Thống Kê Thời Gian Thực**:
   - Thống kê 4 chỉ số cốt lõi: Tổng đầu sách, Tổng bản sao khả dụng, Số phiếu đang mượn, Số phiếu quá hạn.
   - Danh sách phiếu mượn cần lưu ý (ưu tiên phiếu quá hạn) và biểu đồ phân bổ thể loại sách.

2. **Quản Lý Sách**:
   - Quản lý các trường: Mã sách, Tên sách, Tác giả, Thể loại, Tổng số bản in, Số bản khả dụng, Trạng thái (`Còn trong kho`, `Đang mượn`, `Hư hỏng`, `Thất lạc`).
   - Thêm, sửa, xóa sách (có ràng buộc bảo vệ: không cho xóa sách đang được mượn).
   - Tìm kiếm từ khóa theo mã, tên, tác giả; lọc linh hoạt theo thể loại và trạng thái.

3. **Quản Lý Độc Giả**:
   - Quản lý: Mã độc giả, Họ tên, SĐT, Email, Trạng thái thẻ (`Hoạt động`, `Bị khóa`).
   - Thêm, sửa, xóa độc giả (chặn xóa nếu độc giả đang mượn sách).
   - Nút thao tác nhanh 1 chạm: **Khóa / Mở khóa thẻ** độc giả.

4. **Nghiệp Vụ Mượn - Gia Hạn - Trả Sách**:
   - **Tạo phiếu mượn**: Kiểm tra nghiêm ngặt quy tắc nghiệp vụ:
     - Độc giả có thẻ `Bị khóa` -> Hệ thống lập tức từ chối và cảnh báo.
     - Sách có số bản khả dụng = 0 hoặc trạng thái `Hư hỏng`/`Thất lạc` -> Từ chối cho mượn.
     - Khi mượn thành công: Tự động trừ 1 bản sao khả dụng và cập nhật trạng thái sách.
   - **Gia hạn phiếu mượn**: Cộng thêm 7 ngày vào hạn trả quy định và tăng biến đếm số lần gia hạn.
   - **Trả sách**: Nhập ngày trả thực tế, hệ thống tự động đối soát với hạn trả để gắn nhãn `Đúng hạn` hoặc `Trễ hạn` (kèm số ngày trễ); đồng thời tự động hoàn trả +1 bản sao vào kho sách.

5. **Nút "Khôi phục dữ liệu mẫu"**:
   - Nằm ngay trên thanh Header, cho phép đưa toàn bộ dữ liệu về trạng thái mẫu ban đầu bất cứ lúc nào để phục vụ việc demo hoặc kiểm thử lại nhiều lần.

---

## 🛠️ Công Nghệ Sử Dụng

- **HTML5**: Cấu trúc ngữ nghĩa, Modal Dialogs, Datalist gợi ý, Form Controls chuẩn.
- **CSS3**: Bố cục Flexbox & CSS Grid, biến màu CSS Variables, hiệu ứng chuyển động mượt mà, hỗ trợ Responsive trên mọi kích thước màn hình.
- **JavaScript (ES6+)**: Module hóa DataService, sự kiện tương tác thời gian thực, quản lý trạng thái, tính toán ngày tháng và lưu trữ `window.localStorage`.
