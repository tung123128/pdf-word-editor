# Chỉnh Sửa File - Trình Chỉnh Sửa & Bôi Xóa Đa Định Dạng (PDF, Word, Ảnh)

Ứng dụng web toàn năng xử lý tài liệu đa định dạng tiếng Việt, hỗ trợ chỉnh sửa nội dung, bôi xóa / che phủ bảo mật (Redact), thêm văn bản, hình vẽ và xuất tệp chất lượng cao trực tiếp tại trình duyệt (100% Client-Side, tương thích tuyệt đối với Vercel).

## 🚀 Các tính năng chính
- **Trang chủ (`/`)**:
  - Giao diện hiện đại (Logo Chỉnh Sửa File, menu điều hướng, nút chuyển đổi Light/Dark mode).
  - Lưới hiển thị 31 công cụ chuẩn chia theo danh mục (Tổ chức PDF, Tối ưu hóa, Chuyển đổi sang/từ PDF, Chỉnh sửa & Biên tập, Bảo mật & Ký tên, AI).
- **Trình Chỉnh Sửa & Bôi Xóa (`/editor`)**:
  - Bộ tiếp nhận tệp đa định dạng: PDF (`.pdf`), Word (`.docx`, `.doc`), Hình ảnh (`.png`, `.jpg`, `.jpeg`, `.webp`).
  - Hỗ trợ nạp tệp mẫu nhanh (PDF, DOCX, PNG) để kiểm thử tức thì không cần tải tệp từ ngoài.
  - Multi-layer Canvas Editor:
    - PDF nhiều trang với thanh thumbnail chuyển trang mượt mà.
    - Công cụ Bôi xóa (Erase Brush) tẩy trắng chi tiết thừa.
    - Công cụ Che phủ bảo mật (Redact Box) vẽ hộp đen/trắng che kín vĩnh viễn thông tin nhạy cảm.
    - Công cụ Thêm văn bản (Text Annotation) với cỡ chữ, màu sắc, font tùy chỉnh.
    - Công cụ Bút vẽ tự do (Draw Brush) và Hình học (Rectangle, Circle, Arrow).
    - Phóng to, thu nhỏ, tỷ lệ vừa trang (Fit Page).
    - Bộ hoàn tác (Undo - Ctrl+Z) và Làm lại (Redo - Ctrl+Y).
- **Word Editor View**:
  - Trích xuất cấu trúc văn bản qua Mammoth, hiển thị chuẩn trang giấy A4.
  - Chỉnh sửa nội dung trực tiếp (WYSIWYG contentEditable).
  - Che phủ văn bản nhạy cảm và xuất file DOCX mới hoặc PDF.
- **Engine Xuất & Tải về chất lượng cao**:
  - Xuất PDF: Nhúng trực tiếp hộp che vector, văn bản và nét cọ qua `pdf-lib` bảo toàn chất lượng gốc của toàn bộ tài liệu.
  - Xuất Ảnh: Gộp các lớp canvas ở độ phân giải gốc (Natural Resolution).
  - Xuất Word: Đóng gói tệp `.docx` chuẩn qua thư viện `docx`.

## 🛠️ Cài đặt & Chạy ứng dụng

```bash
# Cài đặt phụ thuộc
npm install

# Chạy môi trường phát triển
npm run dev

# Chạy bộ kiểm thử tự động
npm test

# Build ứng dụng cho môi trường Production / Vercel
npm run build
```

## 🌐 Triển khai Vercel
Ứng dụng được tối ưu 100% không dùng native C++ addons, sẵn sàng kết nối và deploy trực tiếp trên Vercel chỉ với 1 click.
