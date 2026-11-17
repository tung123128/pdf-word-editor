import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ToolsGrid } from '@/components/ToolsGrid';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { 
  FileCheck, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Image as ImageIcon, 
  Layers, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Tools Catalog Grid */}
        <ToolsGrid />

        {/* Superpowers Showcase Section */}
        <section className="py-20 bg-gray-50/70 dark:bg-dark-card/40 border-t border-b border-gray-200/90 dark:border-dark-border transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tight mb-4">
                Giải pháp chỉnh sửa và che phủ đa định dạng tiên phong
              </h2>
              <p className="text-gray-600 dark:text-dark-muted text-base sm:text-lg">
                Không chỉ dừng lại ở tệp PDF, ứng dụng mang đến trải nghiệm đồng nhất trên cả Word (.docx) và Ảnh (PNG/JPG).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: PDF */}
              <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-dark-border shadow-paper dark:shadow-paper-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 text-brand-500 flex items-center justify-center mb-6 shadow-xs">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-950 dark:text-white mb-3">
                  Xử lý & Biên tập PDF Vector
                </h3>
                <p className="text-sm text-gray-600 dark:text-dark-muted mb-6 leading-relaxed">
                  Bôi đen che phủ bảo mật (Redact) vĩnh viễn dữ liệu nhạy cảm. Thêm chữ, ghi chú, vẽ tay mà không làm giảm độ nét gốc của tệp PDF.
                </p>
                <ul className="space-y-3 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Hộp che Redact vĩnh viễn 100% vector</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Hỗ trợ tệp nhiều trang với thumbnails</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Xuất file Blob PDF chuẩn qua pdf-lib</span>
                  </li>
                </ul>
              </div>

              {/* Feature 2: Image */}
              <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-dark-border shadow-paper dark:shadow-paper-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mb-6 shadow-xs">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-950 dark:text-white mb-3">
                  Bôi xóa Pixel & Sửa Ảnh Sắc Nét
                </h3>
                <p className="text-sm text-gray-600 dark:text-dark-muted mb-6 leading-relaxed">
                  Tẩy xóa vật thể lạ, xóa nền hoặc bôi trắng chi tiết trên ảnh PNG, JPG. Luôn duy trì độ phân giải gốc khi xuất file.
                </p>
                <ul className="space-y-3 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Cọ tẩy Erase Brush tùy biến độ dày</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Giữ nguyên Natural Resolution 4K / 8K</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Tải về PNG trong suốt hoặc JPG nén</span>
                  </li>
                </ul>
              </div>

              {/* Feature 3: Word */}
              <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-dark-border shadow-paper dark:shadow-paper-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 flex items-center justify-center mb-6 shadow-xs">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-950 dark:text-white mb-3">
                  Biên tập Word (.docx) Tiện Lợi
                </h3>
                <p className="text-sm text-gray-600 dark:text-dark-muted mb-6 leading-relaxed">
                  Trích xuất và hiển thị chuẩn trang văn bản Word qua Mammoth. Cho phép chỉnh sửa câu từ, bôi xóa đoạn văn và xuất file .docx hoặc PDF.
                </p>
                <ul className="space-y-3 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Hiển thị định dạng trang giấy A4 trực quan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Chỉnh sửa nội dung văn bản trực tiếp</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Tải về DOCX hoàn chỉnh hoặc xuất PDF</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-2xl shadow-brand-500/25 relative overflow-hidden">
            {/* Background blur patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">
                Sẵn sàng trải nghiệm trình chỉnh sửa toàn năng?
              </h2>
              <p className="max-w-xl mx-auto text-sm sm:text-lg text-brand-100 mb-8 leading-relaxed">
                Tải lên tệp tài liệu của bạn và bắt đầu chỉnh sửa, bôi xóa hoàn toàn miễn phí, nhanh chóng và bảo mật 100%.
              </p>
              <Link
                href="/editor"
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl bg-white text-brand-600 font-black text-base hover:bg-gray-50 active:scale-95 shadow-xl transition-all"
              >
                <span>Bắt đầu ngay bây giờ</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
