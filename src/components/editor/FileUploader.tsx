'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Layers, 
  ShieldCheck, 
  Lock,
  CheckCircle2
} from 'lucide-react';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export function FileUploader({ onFileSelected, isLoading = false }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSelectFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelectFile(file);
      // Reset input value so the same file can be re-selected if needed
      e.target.value = '';
    }
  };

  const validateAndSelectFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg', 'webp'];
    if (ext && validExtensions.includes(ext)) {
      onFileSelected(file);
    } else {
      alert('Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp PDF, Word (.docx) hoặc Ảnh (PNG, JPG).');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      {/* Upload Drop Zone Card - Entire card is clickable */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!isLoading) inputRef.current?.click();
        }}
        className={`relative rounded-3xl p-8 sm:p-14 text-center transition-all duration-300 border-2 cursor-pointer group select-none ${
          isDragOver
            ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/30 scale-[1.01] shadow-glow-red'
            : 'border-dashed border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card hover:border-brand-500 dark:hover:border-brand-500 shadow-paper dark:shadow-paper-dark hover:shadow-lg'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.webp"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Upload Icon Container */}
        <div className={`mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-300 ${
          isDragOver 
            ? 'bg-brand-500 text-white scale-110 shadow-glow-red' 
            : 'bg-brand-50 dark:bg-brand-950/50 text-brand-500 border border-brand-200/50 dark:border-brand-800/30 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white'
        }`}>
          <UploadCloud className="w-10 h-10 animate-float" />
        </div>

        {/* Main CTA Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight mb-3">
          Tải lên tài liệu của bạn
        </h2>

        {/* Big CTA Button */}
        <div className="mb-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) inputRef.current?.click();
            }}
            disabled={isLoading}
            type="button"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-brand-500/30 hover:shadow-glow-red transition-all duration-200 disabled:opacity-50"
          >
            <UploadCloud className="w-6 h-6" />
            <span>{isLoading ? 'Đang nạp và xử lý tài liệu...' : 'Chọn tệp từ máy tính'}</span>
          </button>
        </div>

        {/* Drag label */}
        <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-muted font-medium mb-8">
          Nhấp vào bất kỳ đâu trong khung này hoặc kéo thả tệp PDF, Word (.docx), Ảnh vào đây
        </p>

        {/* Supported format badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-50 dark:bg-dark-elevated text-xs font-bold text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-dark-border shadow-xs">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
            <span>PDF (*.pdf)</span>
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-50 dark:bg-dark-elevated text-xs font-bold text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-dark-border shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Word (*.docx, *.doc)</span>
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-50 dark:bg-dark-elevated text-xs font-bold text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-dark-border shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Ảnh (PNG, JPG, WEBP)</span>
          </span>
        </div>
      </div>

      {/* Security note */}
      <div className="mt-8 flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-dark-muted font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        <span>100% Bảo mật: Toàn bộ quá trình xử lý, bôi xóa và chỉnh sửa diễn ra trực tiếp trên trình duyệt của bạn, tệp không bị gửi lên máy chủ.</span>
      </div>
    </div>
  );
}
