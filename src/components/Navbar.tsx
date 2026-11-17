'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { 
  Heart, 
  ChevronDown, 
  Menu, 
  X, 
  FileEdit, 
  Eraser, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Presentation,
  Sparkles,
  Scissors,
  Minimize2,
  FilePlus2,
  FileCheck2
} from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 bg-white/90 dark:bg-dark-bg/90 border-gray-200/80 dark:border-dark-border shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_20px_-3px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Heart className="w-5 h-5 fill-white animate-pulse" />
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-950 dark:text-white flex items-center">
                iLove<span className="text-brand-500 transition-colors group-hover:text-brand-600">PDF</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                href="/editor?tool=merge&type=pdf"
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-gray-100/80 dark:hover:bg-dark-card transition-all"
              >
                HỢP NHẤT PDF
              </Link>
              <Link
                href="/editor?tool=split&type=pdf"
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-gray-100/80 dark:hover:bg-dark-card transition-all"
              >
                TÁCH PDF
              </Link>
              <Link
                href="/editor?tool=compress&type=pdf"
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-gray-100/80 dark:hover:bg-dark-card transition-all"
              >
                NÉN PDF
              </Link>

              {/* Chỉnh sửa & Bôi xóa Highlight Badge */}
              <Link
                href="/editor"
                className={`px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-sm ${
                  pathname === '/editor'
                    ? 'bg-brand-500 text-white shadow-brand-500/30'
                    : 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/40 border border-brand-200/60 dark:border-brand-800/40'
                }`}
              >
                <Eraser className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                <span>CHỈNH SỬA & BÔI XÓA</span>
              </Link>

              {/* Dropdown Menu Tất cả công cụ */}
              <div 
                className="relative"
                onMouseEnter={() => setToolsDropdownOpen(true)}
                onMouseLeave={() => setToolsDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-gray-100/80 dark:hover:bg-dark-card transition-all flex items-center gap-1.5"
                >
                  <span>TẤT CẢ CÔNG CỤ PDF</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180 text-brand-500' : ''}`} />
                </button>

                {toolsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-96 rounded-2xl bg-white dark:bg-dark-elevated shadow-2xl border border-gray-100 dark:border-dark-border py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 mb-1 border-b border-gray-100 dark:border-dark-border flex items-center justify-between text-[11px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                      <span>Công cụ chọn lọc tiêu biểu</span>
                      <span className="text-brand-500 lowercase font-medium">31+ tính năng</span>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                      {/* Đỏ PDF: Chỉnh sửa */}
                      <Link
                        href="/editor?tool=edit&type=pdf"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-card transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-brand-500 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                          <FileEdit className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-500">Chỉnh sửa PDF</div>
                          <div className="text-xs text-gray-500 dark:text-dark-muted">Thêm văn bản, cọ vẽ, hình học vector</div>
                        </div>
                      </Link>

                      {/* Che phủ bảo mật Redact */}
                      <Link
                        href="/editor?tool=redact&type=pdf"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-card transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-sm">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-500">Biên tập & Che phủ PDF (Redact)</div>
                          <div className="text-xs text-gray-500 dark:text-dark-muted">Che vĩnh viễn dữ liệu CCCD, số thẻ, bí mật</div>
                        </div>
                      </Link>

                      {/* Xanh Word */}
                      <Link
                        href="/editor?tool=word&type=docx"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-card transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500">Chỉnh sửa & Bôi xóa Word (.docx)</div>
                          <div className="text-xs text-gray-500 dark:text-dark-muted">Soạn thảo trực tiếp, bôi đen và xuất file</div>
                        </div>
                      </Link>

                      {/* Cam: Bôi xóa Ảnh */}
                      <Link
                        href="/editor?tool=erase&type=image"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-card transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                          <Eraser className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-500">Bôi xóa & Tẩy chi tiết Ảnh</div>
                          <div className="text-xs text-gray-500 dark:text-dark-muted">Xóa chi tiết thừa trên ảnh PNG, JPG</div>
                        </div>
                      </Link>

                      {/* Tím AI */}
                      <Link
                        href="/editor?tool=ai-summary&type=pdf"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-card transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-500">Trí tuệ nhân tạo (AI Tools)</div>
                          <div className="text-xs text-gray-500 dark:text-dark-muted">Tóm tắt & Dịch thuật tài liệu thông minh</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            <Link
              href="/editor"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white bg-brand-500 hover:bg-brand-700 active:scale-95 rounded-xl shadow-md shadow-brand-500/25 hover:shadow-glow-red transition-all duration-200"
            >
              <span>Vào Trình Chỉnh Sửa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-gray-800 dark:text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <Link
            href="/editor"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/30"
          >
            <span>Trình Chỉnh Sửa & Bôi Xóa Toàn Năng</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/editor?tool=edit&type=pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card"
          >
            Chỉnh sửa PDF (Thêm chữ, vẽ)
          </Link>
          <Link
            href="/editor?tool=redact&type=pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card"
          >
            Biên tập & Che phủ PDF (Redact)
          </Link>
          <Link
            href="/editor?tool=erase&type=image"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card"
          >
            Bôi xóa & Chỉnh sửa Ảnh (PNG / JPG)
          </Link>
          <Link
            href="/editor?tool=word&type=docx"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card"
          >
            Bôi xóa & Chỉnh sửa Word (.docx)
          </Link>
          <Link
            href="/editor?tool=merge&type=pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card"
          >
            Hợp nhất PDF
          </Link>
          <Link
            href="/editor?tool=compress&type=pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card"
          >
            Nén PDF
          </Link>
        </div>
      )}
    </header>
  );
}
