import { Annotation } from '@/types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Helper to convert hex color to RGB [0..1]
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2) || '0', 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4) || '0', 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6) || '0', 16) / 255;
  return { r: isNaN(r) ? 0 : r, g: isNaN(g) ? 0 : g, b: isNaN(b) ? 0 : b };
}

let pdfjsLib: any = null;

// Dynamically load pdfjs-dist on client with safe worker configuration
export async function getPdfJs() {
  if (typeof window === 'undefined') return null;
  if (!pdfjsLib) {
    const pdfjs = await import('pdfjs-dist');
    // Configure worker: prefer same-origin local worker, fallback to cdnjs
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    } catch {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '3.11.174'}/pdf.worker.min.js`;
    }
    pdfjsLib = pdfjs;
  }
  return pdfjsLib;
}

export interface RenderedPdfPage {
  pageIndex: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  dataUrl: string;
}

/**
 * Safely load a PDF document without detaching the caller's ArrayBuffer
 */
export async function loadPdfDocument(pdfData: ArrayBuffer) {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error('PDF.js not available in SSR');

  // CRITICAL: Always slice a fresh copy of the ArrayBuffer so postMessage
  // inside pdf.js Web Worker does not detach/neuter the original buffer.
  const bufferCopy = new Uint8Array(pdfData.slice(0));

  const loadingTask = pdfjs.getDocument({
    data: bufferCopy,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
  });

  return await loadingTask.promise;
}

/**
 * Render a specific page directly from an already loaded PDF document
 */
export async function renderPdfPageFromDoc(
  pdfDoc: any,
  pageNumber: number,
  scale: number = 1.5
): Promise<RenderedPdfPage> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  if (!context) throw new Error('Could not get 2D context from canvas');

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  return {
    pageIndex: pageNumber - 1,
    canvas,
    width: viewport.width,
    height: viewport.height,
    dataUrl: canvas.toDataURL('image/png'),
  };
}

/**
 * Render a specific page of a PDF document to an HTMLCanvasElement
 */
export async function renderPdfPage(
  pdfData: ArrayBuffer,
  pageNumber: number,
  scale: number = 1.5
): Promise<RenderedPdfPage> {
  const pdfDoc = await loadPdfDocument(pdfData);
  return await renderPdfPageFromDoc(pdfDoc, pageNumber, scale);
}

/**
 * Get total number of pages in a PDF file
 */
export async function getPdfPageCount(pdfData: ArrayBuffer): Promise<number> {
  try {
    const pdfDoc = await loadPdfDocument(pdfData);
    return pdfDoc.numPages;
  } catch (err) {
    console.warn('Could not read page count via PDF.js, trying pdf-lib fallback', err);
    try {
      const bufferCopy = new Uint8Array(pdfData.slice(0));
      const pdfLibDoc = await PDFDocument.load(bufferCopy, { ignoreEncryption: true });
      return pdfLibDoc.getPageCount();
    } catch {
      return 1;
    }
  }
}

/**
 * Export PDF with all vector annotations, redact boxes, text, and drawing strokes
 */
export async function exportModifiedPdf(
  originalPdfBytes: ArrayBuffer,
  annotationsByPage: Record<number, Annotation[]>,
  renderedPagesDimensions: Record<number, { width: number; height: number }>
): Promise<Blob> {
  // Always use a clean copy of the ArrayBuffer
  const bufferCopy = new Uint8Array(originalPdfBytes.slice(0));
  const pdfDoc = await PDFDocument.load(bufferCopy, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const page = pages[pageIdx];
    const annotations = annotationsByPage[pageIdx] || [];
    if (annotations.length === 0) continue;

    const { width: origW, height: origH } = page.getSize();
    const renderDim = renderedPagesDimensions[pageIdx] || { width: origW, height: origH };

    const scaleX = origW / renderDim.width;
    const scaleY = origH / renderDim.height;

    // Check if there are complex raster strokes (erase / draw) that need overlay canvas
    const complexStrokes = annotations.filter((a) => a.type === 'erase' || a.type === 'draw');
    if (complexStrokes.length > 0 && typeof document !== 'undefined') {
      const overlayCanvas = document.createElement('canvas');
      overlayCanvas.width = renderDim.width;
      overlayCanvas.height = renderDim.height;
      const ctx = overlayCanvas.getContext('2d');

      if (ctx) {
        for (const stroke of complexStrokes) {
          if (stroke.type === 'erase' && stroke.points && stroke.points.length > 1) {
            ctx.save();
            ctx.strokeStyle = '#ffffff'; // Whiteout erasing
            ctx.lineWidth = stroke.brushSize || stroke.strokeWidth || 20;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) {
              ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            ctx.stroke();
            ctx.restore();
          } else if (stroke.type === 'draw' && stroke.points && stroke.points.length > 1) {
            ctx.save();
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.strokeWidth || 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = stroke.opacity || 1.0;
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) {
              ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            ctx.stroke();
            ctx.restore();
          }
        }

        try {
          const overlayDataUrl = overlayCanvas.toDataURL('image/png');
          const overlayBytes = await fetch(overlayDataUrl).then((res) => res.arrayBuffer());
          const embeddedPng = await pdfDoc.embedPng(overlayBytes);
          page.drawImage(embeddedPng, {
            x: 0,
            y: 0,
            width: origW,
            height: origH,
          });
        } catch (err) {
          console.warn('Failed to embed stroke overlay PNG', err);
        }
      }
    }

    // Render vector annotations: Redact boxes, Text annotations, Shapes
    for (const ann of annotations) {
      if (ann.type === 'redact') {
        const c = hexToRgb(ann.color || '#000000');
        const pdfX = ann.x * scaleX;
        const pdfW = ann.width * scaleX;
        const pdfH = ann.height * scaleY;
        const pdfY = origH - (ann.y + ann.height) * scaleY;

        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: pdfW,
          height: pdfH,
          color: rgb(c.r, c.g, c.b),
          opacity: 1.0,
        });
      } else if (ann.type === 'text') {
        const c = hexToRgb(ann.color || '#000000');
        const textFont = ann.isBold ? fontBold : font;
        const pdfFontSize = (ann.fontSize || 16) * scaleY;
        const pdfX = ann.x * scaleX;
        const pdfY = origH - ann.y * scaleY - pdfFontSize;

        const safeText = (ann.text || '').replace(/[^\x00-\x7F]/g, (char) => {
          return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        });

        page.drawText(safeText, {
          x: pdfX,
          y: pdfY,
          size: pdfFontSize,
          font: textFont,
          color: rgb(c.r, c.g, c.b),
          opacity: ann.opacity || 1.0,
        });
      } else if (ann.type === 'rectangle') {
        const c = hexToRgb(ann.color || '#e5322d');
        const pdfX = ann.x * scaleX;
        const pdfW = ann.width * scaleX;
        const pdfH = ann.height * scaleY;
        const pdfY = origH - (ann.y + ann.height) * scaleY;

        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: pdfW,
          height: pdfH,
          borderColor: rgb(c.r, c.g, c.b),
          borderWidth: (ann.strokeWidth || 2) * scaleX,
          opacity: ann.opacity || 1.0,
        });
      }
    }
  }

  const modifiedPdfBytes = await pdfDoc.save();
  return new Blob([modifiedPdfBytes as any], { type: 'application/pdf' });
}
