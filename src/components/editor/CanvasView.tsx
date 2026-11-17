'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Annotation, ToolType } from '@/types';
import { Trash2 } from 'lucide-react';

interface CanvasViewProps {
  pageIndex: number;
  width: number;
  height: number;
  baseImageSource?: HTMLCanvasElement | HTMLImageElement | string;
  annotations: Annotation[];
  onAddAnnotation: (ann: Annotation) => void;
  onUpdateAnnotation: (ann: Annotation) => void;
  onDeleteAnnotation: (id: string) => void;
  activeTool: ToolType;
  currentColor: string;
  strokeWidth: number;
  fontSize: number;
  zoom: number;
}

export function CanvasView({
  pageIndex,
  width,
  height,
  baseImageSource,
  annotations,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  activeTool,
  currentColor,
  strokeWidth,
  fontSize,
  zoom,
}: CanvasViewProps) {
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Inline editing state for Text Annotation
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextValue, setEditingTextValue] = useState<string>('');

  // 1. Render Base Layer (PDF page canvas or Image)
  useEffect(() => {
    const canvas = baseCanvasRef.current;
    if (!canvas || !baseImageSource) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (baseImageSource instanceof HTMLCanvasElement || baseImageSource instanceof HTMLImageElement) {
      ctx.drawImage(baseImageSource, 0, 0, width, height);
    } else if (typeof baseImageSource === 'string') {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = baseImageSource;
    }
  }, [baseImageSource, width, height]);

  // 2. Render Overlay Layer (All annotations on current page)
  const renderOverlay = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw all committed annotations
    for (const ann of annotations) {
      ctx.save();

      if (ann.type === 'erase') {
        // Erase brush: whiteout stroke
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = ann.brushSize || ann.strokeWidth || 20;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (ann.points && ann.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(ann.points[0].x, ann.points[0].y);
          for (let i = 1; i < ann.points.length; i++) {
            ctx.lineTo(ann.points[i].x, ann.points[i].y);
          }
          ctx.stroke();
        }
      } else if (ann.type === 'redact') {
        // Security Redaction Box
        ctx.fillStyle = ann.color || '#000000';
        ctx.fillRect(ann.x, ann.y, ann.width, ann.height);
      } else if (ann.type === 'draw') {
        ctx.strokeStyle = ann.color || '#e5322d';
        ctx.lineWidth = ann.strokeWidth || 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = ann.opacity || 1.0;
        if (ann.points && ann.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(ann.points[0].x, ann.points[0].y);
          for (let i = 1; i < ann.points.length; i++) {
            ctx.lineTo(ann.points[i].x, ann.points[i].y);
          }
          ctx.stroke();
        }
      } else if (ann.type === 'text') {
        // Text
        const size = ann.fontSize || 18;
        ctx.font = `${ann.isBold ? 'bold ' : ''}${ann.isItalic ? 'italic ' : ''}${size}px ${ann.fontFamily || 'Inter, sans-serif'}`;
        ctx.fillStyle = ann.color || '#000000';
        ctx.textBaseline = 'top';
        ctx.fillText(ann.text, ann.x, ann.y);
      } else if (ann.type === 'rectangle') {
        ctx.strokeStyle = ann.color || '#e5322d';
        ctx.lineWidth = ann.strokeWidth || 3;
        ctx.strokeRect(ann.x, ann.y, ann.width, ann.height);
        if (ann.fillColor && ann.fillColor !== 'transparent') {
          ctx.fillStyle = ann.fillColor;
          ctx.fillRect(ann.x, ann.y, ann.width, ann.height);
        }
      } else if (ann.type === 'circle') {
        ctx.strokeStyle = ann.color || '#e5322d';
        ctx.lineWidth = ann.strokeWidth || 3;
        const rx = ann.width / 2;
        const ry = ann.height / 2;
        const cx = ann.x + rx;
        const cy = ann.y + ry;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
        ctx.stroke();
        if (ann.fillColor && ann.fillColor !== 'transparent') {
          ctx.fillStyle = ann.fillColor;
          ctx.fill();
        }
      } else if (ann.type === 'arrow') {
        ctx.strokeStyle = ann.color || '#e5322d';
        ctx.fillStyle = ann.color || '#e5322d';
        ctx.lineWidth = ann.strokeWidth || 3;

        const fromX = ann.x;
        const fromY = ann.y + ann.height / 2;
        const toX = ann.x + ann.width;
        const toY = ann.y + ann.height / 2;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        const headlen = 15;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      }

      // Draw selection handles if selected
      if (selectedId === ann.id) {
        ctx.strokeStyle = '#008ee9';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(ann.x - 3, ann.y - 3, ann.width + 6, ann.height + 6);
        ctx.setLineDash([]);

        // Handle dots at corners
        ctx.fillStyle = '#008ee9';
        const handles = [
          { x: ann.x - 3, y: ann.y - 3 },
          { x: ann.x + ann.width + 3, y: ann.y - 3 },
          { x: ann.x - 3, y: ann.y + ann.height + 3 },
          { x: ann.x + ann.width + 3, y: ann.y + ann.height + 3 },
        ];
        for (const h of handles) {
          ctx.fillRect(h.x - 3, h.y - 3, 6, 6);
        }
      }

      ctx.restore();
    }

    // Draw active drawing stroke in progress
    if (isDrawing) {
      ctx.save();
      if (activeTool === 'erase' && currentPoints.length > 0) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = strokeWidth || 20;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        for (let i = 1; i < currentPoints.length; i++) {
          ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
        }
        ctx.stroke();
      } else if (activeTool === 'draw' && currentPoints.length > 0) {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = strokeWidth || 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        for (let i = 1; i < currentPoints.length; i++) {
          ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
        }
        ctx.stroke();
      } else if (activeTool === 'redact' && startPoint && currentPoints.length > 0) {
        const last = currentPoints[currentPoints.length - 1];
        const rx = Math.min(startPoint.x, last.x);
        const ry = Math.min(startPoint.y, last.y);
        const rw = Math.abs(last.x - startPoint.x);
        const rh = Math.abs(last.y - startPoint.y);
        ctx.fillStyle = currentColor || '#000000';
        ctx.fillRect(rx, ry, rw, rh);
      } else if (activeTool === 'rectangle' && startPoint && currentPoints.length > 0) {
        const last = currentPoints[currentPoints.length - 1];
        const rx = Math.min(startPoint.x, last.x);
        const ry = Math.min(startPoint.y, last.y);
        const rw = Math.abs(last.x - startPoint.x);
        const rh = Math.abs(last.y - startPoint.y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = strokeWidth || 3;
        ctx.strokeRect(rx, ry, rw, rh);
      } else if (activeTool === 'circle' && startPoint && currentPoints.length > 0) {
        const last = currentPoints[currentPoints.length - 1];
        const rx = (last.x - startPoint.x) / 2;
        const ry = (last.y - startPoint.y) / 2;
        const cx = startPoint.x + rx;
        const cy = startPoint.y + ry;
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = strokeWidth || 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (activeTool === 'arrow' && startPoint && currentPoints.length > 0) {
        const last = currentPoints[currentPoints.length - 1];
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = strokeWidth || 3;
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }, [annotations, width, height, selectedId, isDrawing, activeTool, currentPoints, startPoint, currentColor, strokeWidth]);

  useEffect(() => {
    renderOverlay();
  }, [renderOverlay]);

  // Mouse Coordinate Helper
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Mouse Down Event
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);

    if (activeTool === 'select') {
      // Check hit on existing annotations (reverse search for topmost)
      const hit = [...annotations].reverse().find((ann) => {
        return (
          coords.x >= ann.x &&
          coords.x <= ann.x + ann.width &&
          coords.y >= ann.y &&
          coords.y <= ann.y + ann.height
        );
      });

      if (hit) {
        setSelectedId(hit.id);
        setDraggingId(hit.id);
        setDragOffset({ x: coords.x - hit.x, y: coords.y - hit.y });

        // Double click check for text editing
        if (hit.type === 'text') {
          setEditingTextId(hit.id);
          setEditingTextValue(hit.text);
        }
      } else {
        setSelectedId(null);
        setEditingTextId(null);
      }
      return;
    }

    if (activeTool === 'text') {
      // Create new text annotation at click location
      const newId = `text_${Date.now()}`;
      const defaultText = 'Nhập văn bản...';
      const approxWidth = defaultText.length * (fontSize * 0.6);
      const approxHeight = fontSize * 1.3;

      const newAnn: Annotation = {
        id: newId,
        pageIndex,
        type: 'text',
        x: coords.x,
        y: coords.y,
        width: Math.max(120, approxWidth),
        height: approxHeight,
        color: currentColor,
        strokeWidth: 1,
        opacity: 1.0,
        text: defaultText,
        fontSize,
        fontFamily: 'Inter, sans-serif',
      };

      onAddAnnotation(newAnn);
      setSelectedId(newId);
      setEditingTextId(newId);
      setEditingTextValue(defaultText);
      return;
    }

    // Active tool is drawing / redact / erase / shape
    setIsDrawing(true);
    setStartPoint(coords);
    setCurrentPoints([coords]);
  };

  // Mouse Move Event
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);

    if (activeTool === 'select' && draggingId) {
      const ann = annotations.find((a) => a.id === draggingId);
      if (ann) {
        const updated: Annotation = {
          ...ann,
          x: coords.x - dragOffset.x,
          y: coords.y - dragOffset.y,
        };
        onUpdateAnnotation(updated);
      }
      return;
    }

    if (!isDrawing) return;
    setCurrentPoints((prev) => [...prev, coords]);
  };

  // Mouse Up Event
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'select') {
      setDraggingId(null);
      return;
    }

    if (!isDrawing || !startPoint) return;
    setIsDrawing(false);

    const endCoords = getCanvasCoordinates(e);
    const newId = `ann_${Date.now()}`;

    if (activeTool === 'erase') {
      if (currentPoints.length > 0) {
        onAddAnnotation({
          id: newId,
          pageIndex,
          type: 'erase',
          x: 0,
          y: 0,
          width: width,
          height: height,
          color: '#ffffff',
          strokeWidth,
          brushSize: strokeWidth || 20,
          opacity: 1.0,
          points: currentPoints,
        });
      }
    } else if (activeTool === 'draw') {
      if (currentPoints.length > 0) {
        onAddAnnotation({
          id: newId,
          pageIndex,
          type: 'draw',
          x: 0,
          y: 0,
          width: width,
          height: height,
          color: currentColor,
          strokeWidth,
          opacity: 1.0,
          points: currentPoints,
        });
      }
    } else if (activeTool === 'redact') {
      const rx = Math.min(startPoint.x, endCoords.x);
      const ry = Math.min(startPoint.y, endCoords.y);
      const rw = Math.max(10, Math.abs(endCoords.x - startPoint.x));
      const rh = Math.max(10, Math.abs(endCoords.y - startPoint.y));

      onAddAnnotation({
        id: newId,
        pageIndex,
        type: 'redact',
        x: rx,
        y: ry,
        width: rw,
        height: rh,
        color: currentColor || '#000000',
        strokeWidth: 0,
        opacity: 1.0,
      });
    } else if (activeTool === 'rectangle') {
      const rx = Math.min(startPoint.x, endCoords.x);
      const ry = Math.min(startPoint.y, endCoords.y);
      const rw = Math.max(10, Math.abs(endCoords.x - startPoint.x));
      const rh = Math.max(10, Math.abs(endCoords.y - startPoint.y));

      onAddAnnotation({
        id: newId,
        pageIndex,
        type: 'rectangle',
        x: rx,
        y: ry,
        width: rw,
        height: rh,
        color: currentColor,
        strokeWidth,
        opacity: 1.0,
      });
    } else if (activeTool === 'circle') {
      const rx = Math.min(startPoint.x, endCoords.x);
      const ry = Math.min(startPoint.y, endCoords.y);
      const rw = Math.max(10, Math.abs(endCoords.x - startPoint.x));
      const rh = Math.max(10, Math.abs(endCoords.y - startPoint.y));

      onAddAnnotation({
        id: newId,
        pageIndex,
        type: 'circle',
        x: rx,
        y: ry,
        width: rw,
        height: rh,
        color: currentColor,
        strokeWidth,
        opacity: 1.0,
      });
    } else if (activeTool === 'arrow') {
      const rw = endCoords.x - startPoint.x;
      const rh = endCoords.y - startPoint.y;

      onAddAnnotation({
        id: newId,
        pageIndex,
        type: 'arrow',
        x: startPoint.x,
        y: startPoint.y,
        width: rw,
        height: rh,
        color: currentColor,
        strokeWidth,
        opacity: 1.0,
      });
    }

    setStartPoint(null);
    setCurrentPoints([]);
  };

  // Keyboard shortcut listener (Delete key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !editingTextId) {
        onDeleteAnnotation(selectedId);
        setSelectedId(null);
      } else if (e.key === 'Escape') {
        setSelectedId(null);
        setEditingTextId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, editingTextId, onDeleteAnnotation]);

  // Selected annotation helper
  const selectedAnnotation = annotations.find((a) => a.id === selectedId);

  const getAnnotationTypeLabel = (type: string) => {
    switch (type) {
      case 'redact': return 'Khối che phủ bảo mật';
      case 'erase': return 'Vùng bôi xóa';
      case 'text': return 'Văn bản';
      case 'draw': return 'Nét vẽ';
      case 'rectangle': return 'Khung vuông';
      case 'circle': return 'Hình tròn';
      case 'arrow': return 'Mũi tên';
      default: return 'Đối tượng';
    }
  };

  return (
    <div className="relative flex justify-center py-8 px-6 overflow-auto min-h-[calc(100vh-140px)] w-full studio-grid-light dark:studio-grid-dark">
      {/* Zoomable Container with realistic paper shadow */}
      <div
        className="relative transition-transform duration-100 ease-out origin-top rounded-sm bg-white shadow-[0_15px_35px_-5px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Layer 0: Document Base Canvas */}
        <canvas
          ref={baseCanvasRef}
          width={width}
          height={height}
          className="absolute inset-0 pointer-events-none rounded-sm"
        />

        {/* Layer 1: Interactive Overlay Canvas */}
        <canvas
          ref={overlayCanvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`absolute inset-0 rounded-sm ${
            activeTool === 'select'
              ? 'cursor-default'
              : activeTool === 'erase'
              ? 'cursor-crosshair'
              : activeTool === 'text'
              ? 'cursor-text'
              : 'cursor-crosshair'
          }`}
        />

        {/* Floating Quick Action for Selected Annotation */}
        {selectedAnnotation && (
          <div
            className="absolute z-30 flex items-center gap-2 bg-white dark:bg-dark-elevated rounded-xl shadow-xl border border-gray-200 dark:border-dark-border px-2.5 py-1.5 animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${selectedAnnotation.x}px`,
              top: `${Math.max(10, selectedAnnotation.y - 42)}px`,
            }}
          >
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 select-none">
              {getAnnotationTypeLabel(selectedAnnotation.type)}
            </span>
            <span className="w-px h-3.5 bg-gray-200 dark:bg-dark-border" />
            <button
              onClick={() => {
                onDeleteAnnotation(selectedAnnotation.id);
                setSelectedId(null);
              }}
              type="button"
              className="p-1 rounded-lg text-red-500 hover:text-white hover:bg-red-500 transition-colors"
              title="Xóa đối tượng (Delete)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Inline text editor modal/input when editing text annotation */}
        {editingTextId && selectedAnnotation && selectedAnnotation.type === 'text' && (
          <div
            className="absolute z-40"
            style={{
              left: `${selectedAnnotation.x}px`,
              top: `${selectedAnnotation.y}px`,
            }}
          >
            <input
              type="text"
              autoFocus
              value={editingTextValue}
              onChange={(e) => {
                setEditingTextValue(e.target.value);
                const updated: Annotation = {
                  ...selectedAnnotation,
                  text: e.target.value,
                  width: Math.max(100, e.target.value.length * ((selectedAnnotation.fontSize || 18) * 0.6)),
                };
                onUpdateAnnotation(updated);
              }}
              onBlur={() => setEditingTextId(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingTextId(null);
              }}
              style={{
                fontSize: `${selectedAnnotation.fontSize || 18}px`,
                color: selectedAnnotation.color,
              }}
              className="px-2 py-1 border-2 border-brand-500 rounded-lg bg-white text-gray-900 outline-none shadow-2xl font-sans"
            />
          </div>
        )}
      </div>
    </div>
  );
}
