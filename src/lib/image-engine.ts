import { Annotation } from '@/types';

export interface LoadedImageInfo {
  image: HTMLImageElement;
  width: number;
  height: number;
  dataUrl: string;
}

/**
 * Load an image file into an HTMLImageElement
 */
export async function loadImageFromFile(file: File): Promise<LoadedImageInfo> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({
          image: img,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          dataUrl,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Render image with annotations onto a canvas at original natural resolution and export as Blob
 */
export async function exportModifiedImage(
  imageSource: HTMLImageElement | string,
  annotations: Annotation[],
  displayWidth: number,
  displayHeight: number,
  outputFormat: 'image/png' | 'image/jpeg' = 'image/png'
): Promise<Blob> {
  let img: HTMLImageElement;
  if (typeof imageSource === 'string') {
    img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = imageSource;
    });
  } else {
    img = imageSource;
  }

  const naturalWidth = img.naturalWidth || img.width || displayWidth;
  const naturalHeight = img.naturalHeight || img.height || displayHeight;

  // Scale factor between editor display canvas and full resolution image
  const scaleX = naturalWidth / displayWidth;
  const scaleY = naturalHeight / displayHeight;

  const canvas = document.createElement('canvas');
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // 1. Draw base image
  ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight);

  // 2. Draw annotations in order
  for (const ann of annotations) {
    ctx.save();

    if (ann.type === 'erase') {
      // Erase brush: whiteout overlay or destination-out
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = (ann.brushSize || ann.strokeWidth || 20) * scaleX;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (ann.points && ann.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(ann.points[0].x * scaleX, ann.points[0].y * scaleY);
        for (let i = 1; i < ann.points.length; i++) {
          ctx.lineTo(ann.points[i].x * scaleX, ann.points[i].y * scaleY);
        }
        ctx.stroke();
      }
    } else if (ann.type === 'redact') {
      // Security Redact box (black/white)
      ctx.fillStyle = ann.color || '#000000';
      ctx.fillRect(
        ann.x * scaleX,
        ann.y * scaleY,
        ann.width * scaleX,
        ann.height * scaleY
      );
    } else if (ann.type === 'draw') {
      // Brush draw
      ctx.strokeStyle = ann.color || '#e5322d';
      ctx.lineWidth = (ann.strokeWidth || 4) * scaleX;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = ann.opacity || 1.0;
      if (ann.points && ann.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(ann.points[0].x * scaleX, ann.points[0].y * scaleY);
        for (let i = 1; i < ann.points.length; i++) {
          ctx.lineTo(ann.points[i].x * scaleX, ann.points[i].y * scaleY);
        }
        ctx.stroke();
      }
    } else if (ann.type === 'text') {
      // Text annotation
      const fontSize = (ann.fontSize || 20) * scaleY;
      ctx.font = `${ann.isBold ? 'bold ' : ''}${ann.isItalic ? 'italic ' : ''}${fontSize}px ${ann.fontFamily || 'Inter, sans-serif'}`;
      ctx.fillStyle = ann.color || '#000000';
      ctx.globalAlpha = ann.opacity || 1.0;
      ctx.textBaseline = 'top';
      ctx.fillText(ann.text, ann.x * scaleX, ann.y * scaleY);
    } else if (ann.type === 'rectangle') {
      // Shape: rectangle
      ctx.strokeStyle = ann.color || '#e5322d';
      ctx.lineWidth = (ann.strokeWidth || 3) * scaleX;
      ctx.globalAlpha = ann.opacity || 1.0;
      ctx.strokeRect(
        ann.x * scaleX,
        ann.y * scaleY,
        ann.width * scaleX,
        ann.height * scaleY
      );
      if (ann.fillColor && ann.fillColor !== 'transparent') {
        ctx.fillStyle = ann.fillColor;
        ctx.fillRect(
          ann.x * scaleX,
          ann.y * scaleY,
          ann.width * scaleX,
          ann.height * scaleY
        );
      }
    } else if (ann.type === 'circle') {
      // Shape: circle / ellipse
      ctx.strokeStyle = ann.color || '#e5322d';
      ctx.lineWidth = (ann.strokeWidth || 3) * scaleX;
      ctx.globalAlpha = ann.opacity || 1.0;
      const rx = (ann.width / 2) * scaleX;
      const ry = (ann.height / 2) * scaleY;
      const cx = (ann.x + ann.width / 2) * scaleX;
      const cy = (ann.y + ann.height / 2) * scaleY;

      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
      ctx.stroke();
      if (ann.fillColor && ann.fillColor !== 'transparent') {
        ctx.fillStyle = ann.fillColor;
        ctx.fill();
      }
    } else if (ann.type === 'arrow') {
      // Shape: arrow
      ctx.strokeStyle = ann.color || '#e5322d';
      ctx.fillStyle = ann.color || '#e5322d';
      ctx.lineWidth = (ann.strokeWidth || 3) * scaleX;
      ctx.globalAlpha = ann.opacity || 1.0;

      const fromX = ann.x * scaleX;
      const fromY = (ann.y + ann.height / 2) * scaleY;
      const toX = (ann.x + ann.width) * scaleX;
      const toY = (ann.y + ann.height / 2) * scaleY;

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // Arrow head
      const headlen = 15 * scaleX;
      const angle = Math.atan2(toY - fromY, toX - fromX);
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate image Blob from canvas'));
      },
      outputFormat,
      0.95
    );
  });
}
