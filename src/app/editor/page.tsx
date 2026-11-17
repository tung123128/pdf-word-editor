'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FileUploader } from '@/components/editor/FileUploader';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { PageThumbnails } from '@/components/editor/PageThumbnails';
import { CanvasView } from '@/components/editor/CanvasView';
import { WordEditorView } from '@/components/editor/WordEditorView';
import { 
  Annotation, 
  DocumentPage, 
  SupportedFileType, 
  ToolType 
} from '@/types';
import { 
  loadPdfDocument,
  renderPdfPageFromDoc,
  renderPdfPage, 
  getPdfPageCount, 
  exportModifiedPdf 
} from '@/lib/pdf-engine';
import { 
  loadImageFromFile, 
  exportModifiedImage 
} from '@/lib/image-engine';
import { parseDocxFile, exportModifiedDocx } from '@/lib/docx-engine';
import { downloadBlob } from '@/lib/export-utils';
import { getTransferFile } from '@/lib/file-transfer';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function EditorContent() {
  const searchParams = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<SupportedFileType | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileBytes, setFileBytes] = useState<ArrayBuffer | null>(null);

  // Cached PDF Document instance
  const pdfDocRef = useRef<any>(null);

  // Document Pages State
  const [pages, setPages] = useState<DocumentPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [wordHtml, setWordHtml] = useState<string>('');
  const [wordRawText, setWordRawText] = useState<string>('');

  // Annotations & History State
  const [annotations, setAnnotations] = useState<Record<number, Annotation[]>>({});
  const [history, setHistory] = useState<Record<number, Annotation[][]>>({});
  const [historyIndex, setHistoryIndex] = useState<Record<number, number>>({});

  // Tool State
  const [activeTool, setActiveTool] = useState<ToolType>('redact');
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(20);
  const [fontSize, setFontSize] = useState<number>(20);
  const [zoom, setZoom] = useState<number>(1.0);

  // Status & Progress
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync tool from URL search params if present
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    if (toolParam) {
      const validTools: ToolType[] = ['select', 'redact', 'erase', 'text', 'draw', 'rectangle', 'circle', 'arrow'];
      if (validTools.includes(toolParam as ToolType)) {
        setActiveTool(toolParam as ToolType);
      } else if (toolParam === 'edit') {
        setActiveTool('text');
      } else if (toolParam === 'compress' || toolParam === 'merge' || toolParam === 'split') {
        setActiveTool('redact');
      }
    }
  }, [searchParams]);

  // Check if file was passed from homepage Hero via in-memory transfer or sessionStorage
  useEffect(() => {
    const memoryFile = getTransferFile();
    if (memoryFile) {
      handleFileSelect(memoryFile);
      return;
    }

    try {
      const pendingData = sessionStorage.getItem('pending_file_data');
      const pendingName = sessionStorage.getItem('pending_file_name');
      const pendingType = sessionStorage.getItem('pending_file_type');

      if (pendingData && pendingName) {
        sessionStorage.removeItem('pending_file_data');
        sessionStorage.removeItem('pending_file_name');
        sessionStorage.removeItem('pending_file_type');

        fetch(pendingData)
          .then((res) => res.blob())
          .then((blob) => {
            const reconstructedFile = new File([blob], pendingName, { type: pendingType || blob.type });
            handleFileSelect(reconstructedFile);
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  // Handle incoming file selection
  const handleFileSelect = async (selectedFile: File) => {
    setIsLoading(true);
    setFileName(selectedFile.name);
    setFile(selectedFile);
    setCurrentPageIndex(0);
    setAnnotations({});
    setHistory({});
    setHistoryIndex({});
    pdfDocRef.current = null;

    const nameLower = selectedFile.name.toLowerCase();
    const isPdf = nameLower.endsWith('.pdf');
    const isDocx = nameLower.endsWith('.docx') || nameLower.endsWith('.doc');
    const isImg = /\.(png|jpe?g|webp)$/i.test(nameLower);

    try {
      if (isPdf) {
        setFileType('pdf');
        const buffer = await selectedFile.arrayBuffer();
        // Save safe copy of bytes for exporting later
        setFileBytes(buffer.slice(0));

        // Load PDF document using safe cloned Uint8Array
        const pdfDoc = await loadPdfDocument(buffer);
        pdfDocRef.current = pdfDoc;
        const pageCount = pdfDoc.numPages;
        const initialPages: DocumentPage[] = [];

        // Render page 1 immediately
        const firstPage = await renderPdfPageFromDoc(pdfDoc, 1, 1.5);
        initialPages.push({
          index: 0,
          width: firstPage.width,
          height: firstPage.height,
          renderCanvas: firstPage.canvas,
          thumbnailDataUrl: firstPage.dataUrl,
          isRendered: true,
        });

        // Placeholders for remaining pages
        for (let i = 1; i < pageCount; i++) {
          initialPages.push({
            index: i,
            width: firstPage.width,
            height: firstPage.height,
            isRendered: false,
          });
        }
        setPages(initialPages);

        // Pre-render remaining thumbnails in background asynchronously
        (async () => {
          for (let i = 2; i <= pageCount; i++) {
            try {
              const p = await renderPdfPageFromDoc(pdfDoc, i, 0.4);
              setPages((prev) =>
                prev.map((item, idx) =>
                  idx === i - 1
                    ? {
                        ...item,
                        thumbnailDataUrl: p.dataUrl,
                      }
                    : item
                )
              );
            } catch (err) {
              console.warn('Could not render thumbnail for page', i, err);
            }
          }
        })();

        showToast(`Đã mở tệp PDF thành công (${pageCount} trang)!`);
      } else if (isDocx) {
        setFileType('docx');
        const buffer = await selectedFile.arrayBuffer();
        setFileBytes(buffer.slice(0));

        const parsed = await parseDocxFile(buffer);
        setWordHtml(parsed.html);
        setWordRawText(parsed.rawText);

        setPages([
          {
            index: 0,
            width: 800,
            height: 1100,
            isRendered: true,
          },
        ]);

        showToast('Đã nạp văn bản Word (.docx) thành công!');
      } else if (isImg) {
        setFileType('image');
        const imgInfo = await loadImageFromFile(selectedFile);

        const maxDim = 1000;
        let dispW = imgInfo.width;
        let dispH = imgInfo.height;
        if (dispW > maxDim || dispH > maxDim) {
          const ratio = Math.min(maxDim / dispW, maxDim / dispH);
          dispW = Math.round(dispW * ratio);
          dispH = Math.round(dispH * ratio);
        }

        setPages([
          {
            index: 0,
            width: dispW,
            height: dispH,
            thumbnailDataUrl: imgInfo.dataUrl,
            isRendered: true,
          },
        ]);

        showToast(`Đã nạp ảnh thành công (${imgInfo.width}x${imgInfo.height}px)!`);
      }
    } catch (err: any) {
      console.error('File load error:', err);
      showToast('Lỗi khi mở tệp: ' + (err.message || 'Tệp không hợp lệ'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch active page
  const handleSelectPage = async (pageIdx: number) => {
    setCurrentPageIndex(pageIdx);
    const targetPage = pages[pageIdx];

    // If PDF page is not rendered at full scale yet, render it now
    if (fileType === 'pdf' && targetPage && !targetPage.renderCanvas) {
      try {
        let pdfDoc = pdfDocRef.current;
        if (!pdfDoc && fileBytes) {
          pdfDoc = await loadPdfDocument(fileBytes);
          pdfDocRef.current = pdfDoc;
        }

        if (pdfDoc) {
          const rendered = await renderPdfPageFromDoc(pdfDoc, pageIdx + 1, 1.5);
          setPages((prev) =>
            prev.map((p, idx) =>
              idx === pageIdx
                ? {
                    ...p,
                    renderCanvas: rendered.canvas,
                    thumbnailDataUrl: rendered.dataUrl,
                    width: rendered.width,
                    height: rendered.height,
                    isRendered: true,
                  }
                : p
            )
          );
        }
      } catch (err) {
        console.error('Failed to render page on switch', err);
      }
    }
  };

  // Push annotation state to history stack
  const pushToHistory = (pageIdx: number, newAnnotations: Annotation[]) => {
    const curHistory = history[pageIdx] || [[]];
    const curIndex = historyIndex[pageIdx] !== undefined ? historyIndex[pageIdx] : 0;
    const nextHistory = curHistory.slice(0, curIndex + 1);
    nextHistory.push(newAnnotations);

    setHistory((prev) => ({ ...prev, [pageIdx]: nextHistory }));
    setHistoryIndex((prev) => ({ ...prev, [pageIdx]: nextHistory.length - 1 }));
  };

  // Add annotation
  const handleAddAnnotation = (newAnn: Annotation) => {
    const pageAnns = annotations[currentPageIndex] || [];
    const updated = [...pageAnns, newAnn];

    setAnnotations((prev) => ({
      ...prev,
      [currentPageIndex]: updated,
    }));
    pushToHistory(currentPageIndex, updated);
  };

  // Update annotation
  const handleUpdateAnnotation = (updatedAnn: Annotation) => {
    const pageAnns = annotations[currentPageIndex] || [];
    const updated = pageAnns.map((a) => (a.id === updatedAnn.id ? updatedAnn : a));

    setAnnotations((prev) => ({
      ...prev,
      [currentPageIndex]: updated,
    }));
    pushToHistory(currentPageIndex, updated);
  };

  // Delete annotation
  const handleDeleteAnnotation = (id: string) => {
    const pageAnns = annotations[currentPageIndex] || [];
    const updated = pageAnns.filter((a) => a.id !== id);

    setAnnotations((prev) => ({
      ...prev,
      [currentPageIndex]: updated,
    }));
    pushToHistory(currentPageIndex, updated);
  };

  // Undo action
  const handleUndo = () => {
    const curHistory = history[currentPageIndex];
    const curIndex = historyIndex[currentPageIndex];
    if (!curHistory || curIndex === undefined || curIndex <= 0) return;

    const newIndex = curIndex - 1;
    const targetState = curHistory[newIndex] || [];

    setHistoryIndex((prev) => ({ ...prev, [currentPageIndex]: newIndex }));
    setAnnotations((prev) => ({ ...prev, [currentPageIndex]: targetState }));
  };

  // Redo action
  const handleRedo = () => {
    const curHistory = history[currentPageIndex];
    const curIndex = historyIndex[currentPageIndex];
    if (!curHistory || curIndex === undefined || curIndex >= curHistory.length - 1) return;

    const newIndex = curIndex + 1;
    const targetState = curHistory[newIndex] || [];

    setHistoryIndex((prev) => ({ ...prev, [currentPageIndex]: newIndex }));
    setAnnotations((prev) => ({ ...prev, [currentPageIndex]: targetState }));
  };

  // Clear current page annotations
  const handleClearPage = () => {
    if (!confirm('Bạn có chắc muốn xóa tất cả bôi xóa & chỉnh sửa trên trang này không?')) return;
    setAnnotations((prev) => ({ ...prev, [currentPageIndex]: [] }));
    pushToHistory(currentPageIndex, []);
  };

  // Main Export handler
  const handleExport = async () => {
    if (!fileType) return;
    setIsProcessing(true);

    try {
      if (fileType === 'pdf') {
        if (!fileBytes) throw new Error('Không tìm thấy dữ liệu tệp PDF gốc.');

        const dimensions: Record<number, { width: number; height: number }> = {};
        pages.forEach((p, idx) => {
          dimensions[idx] = { width: p.width, height: p.height };
        });

        const modifiedPdfBlob = await exportModifiedPdf(fileBytes, annotations, dimensions);
        const downloadName = fileName.replace(/\.[^/.]+$/, '') + '_da_chinh_sua.pdf';
        downloadBlob(modifiedPdfBlob, downloadName);
        showToast('Xuất tệp PDF hoàn tất! Tệp đang được tải xuống.');
      } else if (fileType === 'image') {
        const pageAnns = annotations[0] || [];
        const currentPage = pages[0];
        const modifiedImgBlob = await exportModifiedImage(
          currentPage.thumbnailDataUrl || '',
          pageAnns,
          currentPage.width,
          currentPage.height,
          'image/png'
        );
        const downloadName = fileName.replace(/\.[^/.]+$/, '') + '_da_chinh_sua.png';
        downloadBlob(modifiedImgBlob, downloadName);
        showToast('Xuất tệp Ảnh hoàn tất! Tệp đang được tải xuống.');
      } else if (fileType === 'docx') {
        const editorEl = document.querySelector('[contenteditable]');
        const paragraphs: string[] = [];
        if (editorEl) {
          const childNodes = editorEl.childNodes;
          childNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
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
        }
        if (paragraphs.length === 0) {
          paragraphs.push(wordRawText || 'Tài liệu Word');
        }
        const docxBlob = await exportModifiedDocx(paragraphs);
        const downloadName = fileName.replace(/\.[^/.]+$/, '') + '_da_chinh_sua.docx';
        downloadBlob(docxBlob, downloadName);
        showToast('Đã xuất tài liệu Word thành công!');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Lỗi khi xuất tệp: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Count edits by page for badges
  const annotationsCountByPage: Record<number, number> = {};
  Object.keys(annotations).forEach((k) => {
    const idx = Number(k);
    annotationsCountByPage[idx] = annotations[idx]?.length || 0;
  });

  const currentPage = pages[currentPageIndex];
  const curHistory = history[currentPageIndex] || [];
  const curIdx = historyIndex[currentPageIndex] ?? 0;
  const canUndo = curIdx > 0;
  const canRedo = curIdx < curHistory.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col">
        {!file ? (
          /* Step 1: File Uploader */
          <main className="flex-1 flex flex-col justify-center">
            <FileUploader onFileSelected={handleFileSelect} isLoading={isLoading} />
          </main>
        ) : (
          /* Step 2: Multi-layer Editor Canvas */
          <div className="flex-1 flex flex-col">
            {/* Top Toolbar */}
            <EditorToolbar
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
              strokeWidth={strokeWidth}
              setStrokeWidth={setStrokeWidth}
              fontSize={fontSize}
              setFontSize={setFontSize}
              zoom={zoom}
              setZoom={setZoom}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
              onClearPage={handleClearPage}
              onExport={handleExport}
              onNewFile={() => {
                if (confirm('Bạn có muốn mở tệp khác không? Chỉnh sửa chưa lưu sẽ bị hủy.')) {
                  setFile(null);
                  setFileType(null);
                  setPages([]);
                  pdfDocRef.current = null;
                }
              }}
              fileName={fileName}
              fileType={fileType || ''}
              isProcessing={isProcessing}
            />

            {/* Editor Workspace Container */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Thumbnails (Multi-page PDF / Document) */}
              {pages.length > 1 && (
                <PageThumbnails
                  pages={pages}
                  currentPageIndex={currentPageIndex}
                  onSelectPage={handleSelectPage}
                  annotationsCountByPage={annotationsCountByPage}
                />
              )}

              {/* Main Content Area */}
              <main className="flex-1 overflow-auto bg-slate-100/90 dark:bg-[#0a0a0f] flex justify-center items-start relative">
                {fileType === 'docx' ? (
                  <WordEditorView
                    initialHtml={wordHtml}
                    initialText={wordRawText}
                    fileName={fileName}
                    zoom={zoom}
                  />
                ) : currentPage ? (
                  <CanvasView
                    pageIndex={currentPageIndex}
                    width={currentPage.width}
                    height={currentPage.height}
                    baseImageSource={currentPage.renderCanvas || currentPage.thumbnailDataUrl}
                    annotations={annotations[currentPageIndex] || []}
                    onAddAnnotation={handleAddAnnotation}
                    onUpdateAnnotation={handleUpdateAnnotation}
                    onDeleteAnnotation={handleDeleteAnnotation}
                    activeTool={activeTool}
                    currentColor={currentColor}
                    strokeWidth={strokeWidth}
                    fontSize={fontSize}
                    zoom={zoom}
                  />
                ) : (
                  <div className="p-16 text-center text-gray-500 flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-bold">Đang tải và chuẩn bị trang tài liệu...</span>
                  </div>
                )}
              </main>
            </div>
          </div>
        )}
      </div>

      {/* Toast Feedback Notification with modern pill design & glow */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm text-white animate-in slide-in-from-bottom duration-200 ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-600 shadow-[0_10px_25px_-5px_rgba(5,150,105,0.4)]' 
              : 'bg-brand-500 shadow-glow-red'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {!file && <Footer />}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg text-gray-800 dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold">Đang khởi chạy trình chỉnh sửa...</span>
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
