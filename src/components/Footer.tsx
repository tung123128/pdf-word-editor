import React from 'react';
import Link from 'next/link';
import { FileEdit, ShieldCheck, Zap, Lock, Sparkles, CheckCircle, Globe, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#f8f9fa] dark:bg-dark-card border-t border-gray-200 dark:border-dark-border transition-colors duration-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/25">
                <FileEdit className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-950 dark:text-white">
                Chỉnh sửa <span className="text-brand-500">file</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed max-w-sm">
              Ứng dụng web xử lý tài liệu đa định dạng hàng đầu: tải lên tệp PDF, Word và Hình ảnh, bôi xóa chi tiết thừa, che phủ thông tin bảo mật và xuất tệp chất lượng cao ngay trên trình duyệt của bạn.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span>100% Xử lý Client-Side an toàn • Không lưu trữ tệp trên server</span>
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              CHỈNH SỬA & BÔI XÓA
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-gray-600 dark:text-dark-muted">
              <li>
                <Link href="/editor?tool=edit&type=pdf" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                  <span>Chỉnh sửa tệp PDF</span>
                </Link>
              </li>
              <li>
                <Link href="/editor?tool=redact&type=pdf" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white"></span>
                  <span>Biên tập & Che phủ PDF</span>
                </Link>
              </li>
              <li>
                <Link href="/editor?tool=erase&type=image" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Bôi xóa chi tiết Ảnh PNG/JPG</span>
                </Link>
              </li>
              <li>
                <Link href="/editor?tool=word&type=docx" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Soạn thảo & Sửa Word (.docx)</span>
                </Link>
              </li>
              <li>
                <Link href="/editor?tool=draw&type=pdf" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>Vẽ tay & Chữ ký số</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              CÔNG CỤ PHỔ BIẾN
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-gray-600 dark:text-dark-muted">
              <li>
                <Link href="/editor?tool=merge&type=pdf" className="hover:text-brand-500 transition-colors">
                  Hợp nhất PDF
                </Link>
              </li>
              <li>
                <Link href="/editor?tool=split&type=pdf" className="hover:text-brand-500 transition-colors">
                  Tách trang PDF
                </Link>
              </li>
              <li>
                <Link href="/editor?tool=compress&type=pdf" className="hover:text-brand-500 transition-colors">
                  Nén dung lượng PDF
                </Link>
              </li>
              <li>
                <Link href="/editor?tool=word-to-pdf&type=docx" className="hover:text-brand-500 transition-colors">
                  Chuyển Word sang PDF
                </Link>
              </li>
              <li>
                <Link href="/editor?tool=pdf-to-word&type=pdf" className="hover:text-brand-500 transition-colors">
                  Chuyển PDF sang Word
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech & Trust */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              CÔNG NGHỆ & BẢO MẬT
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">Xử lý tức thì</span>
                  <p className="text-gray-500 dark:text-dark-muted">Tốc độ cao qua HTML5 Canvas & WebAssembly</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">Bảo mật vĩnh viễn</span>
                  <p className="text-gray-500 dark:text-dark-muted">Dữ liệu tài liệu được bảo vệ an toàn</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">Triển khai Vercel</span>
                  <p className="text-gray-500 dark:text-dark-muted">100% Serverless & Tối ưu hóa CDN</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-dark-muted">
          <div>
            © {new Date().getFullYear()} Chỉnh sửa file • Ứng dụng Biên tập & Bôi xóa Đa định dạng chuyên nghiệp.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sẵn sàng trên Vercel
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Tiếng Việt (VN)</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
