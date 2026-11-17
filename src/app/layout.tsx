import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Chỉnh Sửa File - Ứng dụng Chỉnh sửa, Bôi xóa & Quản lý Tài liệu Đa định dạng',
  description: 'Trình chỉnh sửa PDF, Word (.docx) và Ảnh trực tuyến. Bôi xóa chi tiết nhạy cảm, thêm văn bản, hình vẽ, chuyển đổi và xuất tệp chất lượng cao chuẩn 100%.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
