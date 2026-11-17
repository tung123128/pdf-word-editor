'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Layers, 
  ShieldCheck, 
  FileCheck,
  Sparkles,
  ArrowRight,
  ShieldAlert,
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
    if (file) validateAndSelectFile(file);
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

  // Helper to load sample files dynamically for instant testing
  const loadSampleFile = async (type: 'pdf' | 'docx' | 'image') => {
    if (type === 'image') {
      // Create a sample PNG canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw nice sample invoice / document
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1200, 800);
        
        ctx.fillStyle = '#e5322d';
        ctx.fillRect(40, 40, 20, 60);

        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#1e293b';
        ctx.fillText('HÓA ĐƠN BÁN HÀNG & HỢP ĐỒNG MẪU', 80, 80);

        ctx.font = '20px Arial';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Mã giao dịch: HD-98472918 | Ngày: 17/11/2026', 80, 120);

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 150);
        ctx.lineTo(1120, 150);
        ctx.stroke();

        ctx.font = '24px Arial';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('Thông tin khách hàng & Dữ liệu nhạy cảm cần bôi xóa:', 80, 200);

        ctx.font = '20px Arial';
        ctx.fillStyle = '#334155';
        ctx.fillText('• Họ và tên: NGUYỄN VĂN AN', 100, 250);
        ctx.fillText('• Số CMND / CCCD: 079198002345 (Cần bôi đen che phủ bảo mật)', 100, 290);
        ctx.fillText('• Số tài khoản ngân hàng: 1903487291823 - Techcombank (Cần che)', 100, 330);
        ctx.fillText('• Số điện thoại liên hệ: 0912.345.678', 100, 370);
        ctx.fillText('• Địa chỉ giao hàng: Số 88 đường Lê Lợi, Quận 1, TP. Hồ Chí Minh', 100, 410);

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(80, 460, 1040, 200);
        ctx.strokeRect(80, 460, 1040, 200);

        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('Ghi chú điều khoản hợp đồng:', 110, 510);

        ctx.font = '18px Arial';
        ctx.fillStyle = '#475569';
        ctx.fillText('1. Hóa đơn và tài liệu này dùng để kiểm thử tính năng Bôi xóa (Erase) và Che phủ (Redact).', 110, 550);
        ctx.fillText('2. Hãy dùng công cụ "Che phủ bảo mật" để vẽ hộp đen lên số CCCD và Số tài khoản.', 110, 590);
        ctx.fillText('3. Dùng công cụ "Bút tẩy" để xóa chi tiết thừa hoặc "Thêm chữ" để viết chú thích.', 110, 630);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'mau_hoa_don_kiem_thu.png', { type: 'image/png' });
          onFileSelected(file);
        }
      }, 'image/png');
    } else if (type === 'pdf') {
      // Create a valid sample PDF using pdf-lib
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      const page1 = pdfDoc.addPage([600, 800]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      page1.drawText('TAI LIEU MAU KIEM THU CHINH SUA PDF', {
        x: 50,
        y: 740,
        size: 20,
        font: fontBold,
        color: rgb(0.9, 0.2, 0.2),
      });

      page1.drawText('Chỉnh Sửa File - Sample Document (Page 1/2)', {
        x: 50,
        y: 710,
        size: 13,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });

      page1.drawRectangle({
        x: 50,
        y: 690,
        width: 500,
        height: 2,
        color: rgb(0.8, 0.8, 0.8),
      });

      page1.drawText('THONG TIN BAO MAT CAN CHE PHU (REDACT):', {
        x: 50,
        y: 650,
        size: 14,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      page1.drawText('1. Ho va ten chu tai khoan: NGUYEN VAN AN', {
        x: 70,
        y: 610,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      page1.drawText('2. So the tin dung (Secret): 4532 8923 1109 8832 (CVV: 889)', {
        x: 70,
        y: 570,
        size: 12,
        font: font,
        color: rgb(0.8, 0.1, 0.1),
      });

      page1.drawText('3. So CCCD / Passport: 079198002345 (Can boi den)', {
        x: 70,
        y: 530,
        size: 12,
        font: font,
        color: rgb(0.8, 0.1, 0.1),
      });

      page1.drawText('4. Mat ma giao dich: SECRET-TOKEN-KEY-98471', {
        x: 70,
        y: 490,
        size: 12,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });

      page1.drawText('Huong dan thu nghiem:', {
        x: 50,
        y: 420,
        size: 13,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      page1.drawText('- Chon cong cu "Che phu bao mat" (hop den) de che so the va so CCCD.', {
        x: 70,
        y: 390,
        size: 11,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });

      page1.drawText('- Chon cong cu "Them chu" de go "DA DUYET & BAO VE".', {
        x: 70,
        y: 365,
        size: 11,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });

      page1.drawText('- Nhan "Xuat & Tai ve" de tai file PDF vector hoan chinh.', {
        x: 70,
        y: 340,
        size: 11,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Page 2
      const page2 = pdfDoc.addPage([600, 800]);
      page2.drawText('TRANG 2 - TAI LIEU DINH KEM & PHU LUC', {
        x: 50,
        y: 740,
        size: 18,
        font: fontBold,
        color: rgb(0.2, 0.4, 0.8),
      });

      page2.drawText('Trang nay chung minh tinh nang chuyen trang & thumbnail nhieu trang.', {
        x: 50,
        y: 700,
        size: 12,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });

      const pdfBytes = await pdfDoc.save();
      const file = new File([pdfBytes as any], 'tai_lieu_mau_kiem_thu.pdf', { type: 'application/pdf' });
      onFileSelected(file);
    } else if (type === 'docx') {
      // Create a valid sample Word docx
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                heading: HeadingLevel.HEADING_1,
                alignment: 'center' as any,
              }),
              new Paragraph({
                text: 'Độc lập - Tự do - Hạnh phúc',
                alignment: 'center' as any,
                spacing: { after: 400 },
              }),
              new Paragraph({
                text: 'HỢP ĐỒNG KINH TẾ VÀ BẢO MẬT THÔNG TIN',
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Bên A (Khách hàng): Nguyễn Văn An - Số CMND: 079198002345 (Dữ liệu bảo mật).',
                    bold: true,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Bên B (Nhà cung cấp): Công ty Giải pháp Phần mềm Chỉnh Sửa File.',
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: 'Điều 1: Mục đích thử nghiệm tính năng biên tập, bôi xóa và trích xuất tài liệu Word (.docx).',
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: 'Điều 2: Bạn có thể chỉnh sửa câu từ trực tiếp, bôi đen che phủ thông tin bảo mật và tải về tệp Word hoặc xuất sang PDF.',
                spacing: { after: 200 },
              }),
            ],
          },
        ],
      });

      const docBlob = await Packer.toBlob(doc);
      const file = new File([docBlob], 'hop_dong_mau_kiem_thu.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      onFileSelected(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      {/* Upload Drop Zone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-3xl p-8 sm:p-14 text-center transition-all duration-300 border-2 ${
          isDragOver
            ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/30 scale-[1.01] shadow-glow-red'
            : 'border-dashed border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card hover:border-brand-400 dark:hover:border-dark-borderHover shadow-paper dark:shadow-paper-dark'
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
            : 'bg-brand-50 dark:bg-brand-950/50 text-brand-500 border border-brand-200/50 dark:border-brand-800/30'
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
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
            type="button"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-brand-500/30 hover:shadow-glow-red transition-all duration-200 disabled:opacity-50"
          >
            <UploadCloud className="w-6 h-6" />
            <span>{isLoading ? 'Đang nạp và xử lý tài liệu...' : 'Chọn tệp từ máy tính'}</span>
          </button>
        </div>

        {/* Drag label */}
        <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-muted font-medium mb-8">
          hoặc kéo thả tệp PDF, Word (.docx) hoặc Ảnh trực tiếp vào vùng này
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

      {/* Quick Sample Files Generator (3 interactive Cards) */}
      <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-paper dark:shadow-paper-dark">
        <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-white mb-2">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Thử nghiệm nhanh không cần chuẩn bị tệp:</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-dark-muted mb-6">
          Bấm vào bất kỳ thẻ mẫu dưới đây để nạp tài liệu kiểm thử chức năng Bôi xóa & Che phủ bảo mật:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: PDF */}
          <button
            onClick={() => loadSampleFile('pdf')}
            disabled={isLoading}
            type="button"
            className="group flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-200 bg-red-50/30 dark:bg-red-950/20 border-red-200/70 dark:border-red-900/40 hover:border-brand-500 hover:shadow-md hover:-translate-y-1 disabled:opacity-50"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center mb-3 shadow-sm transition-transform group-hover:scale-110">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-950 dark:text-white group-hover:text-brand-500 transition-colors">
                Tệp PDF Mẫu (2 trang)
              </h4>
              <p className="text-xs text-gray-600 dark:text-dark-muted mt-1 leading-relaxed">
                Tài liệu chứa số CCCD & thẻ tín dụng để thử nghiệm công cụ Che phủ (Redact) và xuất PDF.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400">
              <span>Nạp tệp PDF</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Card 2: Word */}
          <button
            onClick={() => loadSampleFile('docx')}
            disabled={isLoading}
            type="button"
            className="group flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-200 bg-blue-50/30 dark:bg-blue-950/20 border-blue-200/70 dark:border-blue-900/40 hover:border-blue-500 hover:shadow-md hover:-translate-y-1 disabled:opacity-50"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center mb-3 shadow-sm transition-transform group-hover:scale-110">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-950 dark:text-white group-hover:text-blue-500 transition-colors">
                Hợp đồng Word (.docx)
              </h4>
              <p className="text-xs text-gray-600 dark:text-dark-muted mt-1 leading-relaxed">
                Văn bản khổ A4 chuẩn, bôi đen che phủ bảo mật và tải về file Word đã cập nhật.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>Nạp tệp Word</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Card 3: Image */}
          <button
            onClick={() => loadSampleFile('image')}
            disabled={isLoading}
            type="button"
            className="group flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-200 bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-900/40 hover:border-amber-500 hover:shadow-md hover:-translate-y-1 disabled:opacity-50"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-sm transition-transform group-hover:scale-110">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-950 dark:text-white group-hover:text-amber-500 transition-colors">
                Hóa đơn Ảnh (PNG)
              </h4>
              <p className="text-xs text-gray-600 dark:text-dark-muted mt-1 leading-relaxed">
                Ảnh hóa đơn bán hàng độ nét cao để tẩy xóa chi tiết bằng bút cọ và xuất ảnh sạch.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Nạp tệp Ảnh</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
