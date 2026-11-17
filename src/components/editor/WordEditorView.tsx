'use client';

import React, { useRef, useState } from 'react';
import { EyeOff, Download, FileText, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { exportModifiedDocx } from '@/lib/docx-engine';
import { downloadBlob } from '@/lib/export-utils';

interface WordEditorViewProps {
  initialHtml: string;
  initialText: string;
  fileName: string;
  zoom: number;
}

export function WordEditorView({
  initialHtml,
  initialText,
  fileName,
  zoom,
}: WordEditorViewProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Redact selected text by wrapping in black redaction span
  const applyRedactionToSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      alert('Vui lòng bôi đen đoạn văn bản bạn muốn che phủ bảo mật trước!');
      return;
    }

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = '#000000';
    span.style.color = '#000000';
    span.style.userSelect = 'none';
    span.style.borderRadius = '3px';
    span.style.padding = '1px 5px';
    span.title = 'Thông tin đã được che phủ bảo mật vĩnh viễn (Redacted)';
    span.className = 'redacted-text';

    try {
      range.surroundContents(span);
      selection.removeAllRanges();
      setStatusMessage('Đã che phủ đoạn văn bản bảo mật!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch {
      alert('Không thể che phủ vùng chọn qua nhiều phần tử. Vui lòng chọn trong cùng một dòng.');
    }
  };

  // Export modified Word docx
  const handleExportDocx = async () => {
    if (!editorRef.current) return;
    setIsExporting(true);
    setStatusMessage('Đang đóng gói và xuất tệp DOCX...');

    try {
      // Collect paragraphs text from contentEditable
      const paragraphs: string[] = [];
      const childNodes = editorRef.current.childNodes;

      childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          // Clone and replace redacted text with [BẢO MẬT] or black blocks
          const clone = el.cloneNode(true) as HTMLElement;
          clone.querySelectorAll('.redacted-text').forEach((r) => {
            r.textContent = '██████████';
          });
          const text = clone.innerText?.trim();
          if (text) paragraphs.push(text);
        } else if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text) paragraphs.push(text);
        }
      });

      if (paragraphs.length === 0) {
        paragraphs.push(editorRef.current.innerText || 'Tài liệu Word');
      }

      const docxBlob = await exportModifiedDocx(paragraphs);
      const downloadName = fileName.replace(/\.[^/.]+$/, '') + '_da_chinh_sua.docx';
      downloadBlob(docxBlob, downloadName);
      setStatusMessage('Đã tải về tệp Word thành công!');
    } catch (err: any) {
      console.error(err);
      alert('Lỗi xuất tệp Word: ' + err.message);
    } finally {
      setIsExporting(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 w-full studio-grid-light dark:studio-grid-dark min-h-[calc(100vh-140px)]">
      {/* Studio Action Bar for Word Document */}
      <div className="w-full max-w-4xl mb-6 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-dark-card p-3.5 rounded-2xl border border-gray-200/90 dark:border-dark-border shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={applyRedactionToSelection}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-extrabold text-xs hover:bg-black active:scale-95 shadow-sm transition-all"
            title="Bôi đen đoạn chữ đã chọn để che phủ vĩnh viễn"
          >
            <EyeOff className="w-4 h-4 text-brand-500" />
            <span>Che phủ đoạn chọn (Redact)</span>
          </button>

          <span className="text-xs text-gray-500 dark:text-dark-muted hidden md:inline font-medium">
            • Bạn có thể gõ trực tiếp vào trang để sửa chữ • Bôi đen để che bảo mật
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {statusMessage && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{statusMessage}</span>
            </span>
          )}

          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 hover:shadow-glow-red transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang xuất DOCX...' : 'Tải về Word (.docx)'}</span>
          </button>
        </div>
      </div>

      {/* Standard A4 Paper Sheet View with realistic multi-layer paper shadow */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
        className="transition-transform duration-100 ease-out"
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: initialHtml }}
          className="w-[820px] min-h-[1140px] p-20 bg-white text-gray-900 rounded-sm shadow-[0_20px_45px_-10px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-brand-500/20 prose max-w-none text-base leading-relaxed"
          style={{
            fontFamily: 'Arial, sans-serif',
          }}
        />
      </div>
    </div>
  );
}
