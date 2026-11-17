'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eraser, 
  UploadCloud, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  FileCheck,
  ArrowRight,
  Zap,
  Lock,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export function Hero() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create object URL and store in sessionStorage to pass to editor
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const dataUrl = reader.result as string;
          sessionStorage.setItem('pending_file_name', file.name);
          sessionStorage.setItem('pending_file_type', file.type || '');
          sessionStorage.setItem('pending_file_data', dataUrl);
          router.push('/editor');
        } catch {
          // If file is too large for sessionStorage, navigate to editor directly
          router.push('/editor');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-24 border-b border-gray-100 dark:border-dark-border/60 bg-gradient-to-b from-white via-red-50/20 to-white dark:from-dark-bg dark:via-[#151624]/60 dark:to-dark-bg transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Highlight Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50/90 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/40 shadow-sm animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Đột phá Công nghệ: Chỉnh sửa & Bôi xóa Đa định dạng</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Client-Side Private</span>
          </div>
          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40">
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            <span>Vercel Optimized</span>
          </div>
        </div>

        {/* Main H1 Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-950 dark:text-white tracking-tight leading-[1.1] mb-6">
          Mọi công cụ bạn cần để <br className="hidden sm:inline" />
          <span className="relative inline-block text-brand-500 underline decoration-brand-300 dark:decoration-brand-800 underline-offset-8">
            Chỉnh sửa, Bôi xóa
          </span>{' '}
          & Xử lý Tài liệu
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-gray-600 dark:text-dark-muted mb-10 leading-relaxed font-normal">
          Nền tảng xử lý tài liệu phong cách iLovePDF tiếng Việt: tải lên tệp <span className="font-semibold text-gray-900 dark:text-white">PDF</span>, văn bản <span className="font-semibold text-gray-900 dark:text-white">Word (.docx)</span> hay <span className="font-semibold text-gray-900 dark:text-white">Ảnh (PNG, JPG)</span>, tẩy xóa chi tiết thừa, che phủ thông tin nhạy cảm bảo mật và xuất tệp sắc nét 100%.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/editor"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-extrabold text-white bg-brand-500 hover:bg-brand-700 active:scale-95 rounded-2xl shadow-xl shadow-brand-500/30 hover:shadow-glow-red transition-all duration-200 group"
          >
            <Eraser className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
            <span>Mở Trình Chỉnh Sửa & Bôi Xóa</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-extrabold text-gray-800 dark:text-white bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-elevated border border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-borderHover rounded-2xl shadow-md transition-all duration-200 active:scale-95 group"
          >
            <UploadCloud className="w-5 h-5 text-brand-500 transition-transform duration-200 group-hover:-translate-y-1" />
            <span>Chọn tệp tải lên ngay</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.webp"
            onChange={handleFileChange}
          />
        </div>

        {/* Quick Format Pill Indicators */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 py-3 px-6 rounded-2xl bg-white/70 dark:bg-dark-card/60 border border-gray-200/80 dark:border-dark-border backdrop-blur-md shadow-sm text-xs sm:text-sm font-semibold text-gray-600 dark:text-dark-muted">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
            <span className="text-gray-900 dark:text-white font-bold">PDF Vector & Che phủ</span>
          </div>
          <span className="text-gray-300 dark:text-dark-border">•</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-900 dark:text-white font-bold">Word (.docx) Soạn thảo</span>
          </div>
          <span className="text-gray-300 dark:text-dark-border">•</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-gray-900 dark:text-white font-bold">Ảnh PNG / JPG Tẩy xóa</span>
          </div>
        </div>
      </div>
    </section>
  );
}
