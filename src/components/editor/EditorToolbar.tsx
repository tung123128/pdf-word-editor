'use client';

import React from 'react';
import { ToolType } from '@/types';
import { 
  MousePointer, 
  Eraser, 
  EyeOff, 
  Type, 
  PenTool, 
  Square, 
  Circle, 
  ArrowUpRight, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  Trash2, 
  RotateCcw,
  UploadCloud,
  Palette,
  Sliders,
  Check
} from 'lucide-react';

interface EditorToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  zoom: number;
  setZoom: (z: number | ((prev: number) => number)) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClearPage: () => void;
  onExport: () => void;
  onNewFile: () => void;
  fileName: string;
  fileType: string;
  isProcessing: boolean;
}

export function EditorToolbar({
  activeTool,
  setActiveTool,
  currentColor,
  setCurrentColor,
  strokeWidth,
  setStrokeWidth,
  fontSize,
  setFontSize,
  zoom,
  setZoom,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClearPage,
  onExport,
  onNewFile,
  fileName,
  fileType,
  isProcessing,
}: EditorToolbarProps) {
  interface ToolConfig {
    id: ToolType;
    label: string;
    icon: React.ElementType;
    badge?: string;
    shortcut?: string;
  }

  const tools: ToolConfig[] = [
    { id: 'select', label: 'Chọn & Di chuyển', icon: MousePointer, shortcut: 'V' },
    { id: 'redact', label: 'Che phủ bảo mật', icon: EyeOff, badge: 'Mật', shortcut: 'R' },
    { id: 'erase', label: 'Bút bôi xóa', icon: Eraser, shortcut: 'E' },
    { id: 'text', label: 'Thêm văn bản', icon: Type, shortcut: 'T' },
    { id: 'draw', label: 'Bút vẽ tay', icon: PenTool, shortcut: 'P' },
    { id: 'rectangle', label: 'Khung vuông', icon: Square },
    { id: 'circle', label: 'Hình tròn', icon: Circle },
    { id: 'arrow', label: 'Mũi tên', icon: ArrowUpRight },
  ];

  const colorPalette = [
    { name: 'Đen', hex: '#000000' },
    { name: 'Trắng', hex: '#ffffff' },
    { name: 'Đỏ Chủ Đạo', hex: '#e5322d' },
    { name: 'Xanh dương', hex: '#008ee9' },
    { name: 'Xanh lá', hex: '#4acd86' },
    { name: 'Cam / Vàng', hex: '#ffc233' },
    { name: 'Tím đậm', hex: '#7253e2' },
  ];

  return (
    <div className="w-full bg-white dark:bg-dark-card border-b border-gray-200/90 dark:border-dark-border px-4 py-2.5 shadow-sm transition-colors duration-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: File details & Switch file */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNewFile}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-dark-elevated hover:bg-gray-200 dark:hover:bg-dark-borderHover border border-gray-200/60 dark:border-dark-border transition-all active:scale-95"
            title="Đổi tệp tài liệu khác"
          >
            <UploadCloud className="w-3.5 h-3.5 text-brand-500" />
            <span className="hidden sm:inline">Mở tệp khác</span>
          </button>

          <div className="max-w-[140px] sm:max-w-xs truncate text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-elevated/50 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-dark-border/60">
            <span className="text-gray-400 dark:text-dark-muted font-normal mr-1">Tệp:</span>
            <span className="font-bold text-gray-950 dark:text-white">{fileName}</span>
          </div>
        </div>

        {/* Center: Main Studio Tool buttons (Figma / Canva style) */}
        <div className="flex items-center bg-gray-100/90 dark:bg-dark-bg p-1 rounded-2xl border border-gray-200/80 dark:border-dark-border shadow-inner overflow-x-auto scrollbar-none">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id as ToolType)}
                type="button"
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 whitespace-nowrap group ${
                  isActive
                    ? 'bg-white dark:bg-dark-card text-brand-500 shadow-md shadow-brand-500/10 ring-1 ring-brand-500/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-dark-elevated/50'
                }`}
                title={`${t.label}${t.shortcut ? ` (${t.shortcut})` : ''}`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110 text-brand-500' : 'group-hover:scale-105'}`} />
                <span className="hidden md:inline">{t.label}</span>
                {t.badge && (
                  <span className="hidden lg:inline text-[9px] px-1.5 py-0.2 rounded-full bg-brand-500 text-white font-bold">
                    {t.badge}
                  </span>
                )}
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Actions (Undo/Redo, Zoom, Export) */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center bg-gray-100 dark:bg-dark-bg rounded-xl p-1 border border-gray-200/80 dark:border-dark-border">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              type="button"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-card disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Hoàn tác (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              type="button"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-card disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Làm lại (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-dark-bg rounded-xl p-1 border border-gray-200/80 dark:border-dark-border text-xs font-bold">
            <button
              onClick={() => setZoom((prev) => Math.max(0.4, Number((prev - 0.1).toFixed(1))))}
              type="button"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-card transition-colors"
              title="Thu nhỏ (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-gray-800 dark:text-gray-200 min-w-[48px] text-center select-none font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((prev) => Math.min(2.5, Number((prev + 0.1).toFixed(1))))}
              type="button"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-card transition-colors"
              title="Phóng to (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1.0)}
              type="button"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-card border-l border-gray-200 dark:border-dark-border transition-colors"
              title="Khôi phục kích thước 100%"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clear page annotations */}
          <button
            onClick={onClearPage}
            type="button"
            className="p-2 rounded-xl text-gray-500 dark:text-dark-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900/40 transition-colors"
            title="Xóa tất cả chỉnh sửa trên trang hiện tại"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Big Red Export Button */}
          <button
            onClick={onExport}
            disabled={isProcessing}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-brand-500/25 hover:shadow-glow-red transition-all duration-200 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isProcessing ? 'Đang xuất tệp...' : 'Xuất & Tải về'}</span>
          </button>
        </div>
      </div>

      {/* Sub-toolbar for Active Tool options (Color, Size, Tool guidance) */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-gray-100 dark:border-dark-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Color Palette (for redact, text, draw, shapes) */}
          {activeTool !== 'select' && activeTool !== 'erase' && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-dark-muted font-bold flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                <span>Màu:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {colorPalette.map((c) => {
                  const isCurrent = currentColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      onClick={() => setCurrentColor(c.hex)}
                      type="button"
                      className={`relative w-5 h-5 rounded-full border transition-transform duration-150 flex items-center justify-center ${
                        isCurrent
                          ? 'scale-125 ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-dark-card shadow-sm'
                          : 'border-gray-300 dark:border-gray-600 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.hex})`}
                    >
                      {isCurrent && (
                        <Check className={`w-3 h-3 ${c.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Brush Size for Erase or Draw */}
          {(activeTool === 'erase' || activeTool === 'draw') && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-dark-muted font-bold flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>{activeTool === 'erase' ? 'Cọ tẩy:' : 'Độ dày nét:'}</span>
              </span>
              <div className="flex items-center gap-1">
                {[4, 10, 20, 35, 50].map((size) => (
                  <button
                    key={size}
                    onClick={() => setStrokeWidth(size)}
                    type="button"
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                      strokeWidth === size
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-dark-elevated text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-borderHover'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Font Size for Text Tool */}
          {activeTool === 'text' && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-dark-muted font-bold">Cỡ chữ:</span>
              <div className="flex items-center gap-1">
                {[14, 18, 24, 32, 48].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    type="button"
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                      fontSize === size
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-dark-elevated text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-borderHover'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Guidance tip right side */}
        <div className="text-xs font-semibold">
          {activeTool === 'redact' && (
            <span className="text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5" />
              Kéo chuột trên trang để tạo hộp đen che phủ vĩnh viễn thông tin nhạy cảm.
            </span>
          )}

          {activeTool === 'erase' && (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Eraser className="w-3.5 h-3.5" />
              Quét cọ trên tài liệu để tẩy xóa các vết mờ hoặc chi tiết thừa.
            </span>
          )}

          {activeTool === 'select' && (
            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <MousePointer className="w-3.5 h-3.5" />
              Bấm chọn đối tượng để di chuyển hoặc nhấn phím Delete để xóa.
            </span>
          )}

          {activeTool === 'text' && (
            <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              Bấm vào bất kỳ vị trí nào trên trang để chèn văn bản mới.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
