'use client';

import React from 'react';
import { DocumentPage } from '@/types';
import { FileText, Layers, CheckCircle } from 'lucide-react';

interface PageThumbnailsProps {
  pages: DocumentPage[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  annotationsCountByPage: Record<number, number>;
}

export function PageThumbnails({
  pages,
  currentPageIndex,
  onSelectPage,
  annotationsCountByPage,
}: PageThumbnailsProps) {
  if (pages.length <= 1) return null;

  return (
    <aside className="w-52 sm:w-60 flex-shrink-0 bg-white dark:bg-dark-card border-r border-gray-200/90 dark:border-dark-border p-3.5 flex flex-col h-[calc(100vh-125px)] overflow-y-auto select-none transition-colors duration-200">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-dark-border/60 text-xs font-extrabold text-gray-500 dark:text-dark-muted">
        <span className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500" />
          <span className="tracking-wide">DANH SÁCH TRANG</span>
        </span>
        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-elevated text-gray-800 dark:text-gray-200 font-bold text-[11px]">
          {pages.length} trang
        </span>
      </div>

      <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
        {pages.map((page, idx) => {
          const isSelected = currentPageIndex === idx;
          const editCount = annotationsCountByPage[idx] || 0;

          return (
            <button
              key={page.index}
              onClick={() => onSelectPage(idx)}
              type="button"
              className={`w-full group text-left rounded-2xl p-2.5 transition-all duration-200 flex flex-col items-center border ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/25 shadow-md shadow-brand-500/10 ring-2 ring-brand-500/40 scale-[1.01]'
                  : 'border-gray-200/80 dark:border-dark-border bg-gray-50/60 dark:bg-dark-bg/60 hover:border-gray-300 dark:hover:border-dark-borderHover hover:shadow-xs'
              }`}
            >
              {/* Thumbnail Container with paper shadow */}
              <div className="w-full aspect-[3/4] bg-white rounded-xl border border-gray-200/90 shadow-paper overflow-hidden flex items-center justify-center relative">
                {page.thumbnailDataUrl ? (
                  <img
                    src={page.thumbnailDataUrl}
                    alt={`Trang ${idx + 1}`}
                    className="w-full h-full object-contain pointer-events-none transition-transform duration-200 group-hover:scale-102"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-1.5 p-4 text-center">
                    <FileText className="w-8 h-8 text-gray-300 animate-pulse" />
                    <span className="text-[10px] font-bold">Đang tải trang {idx + 1}...</span>
                  </div>
                )}

                {/* Edit Count Badge */}
                {editCount > 0 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-500 text-white shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{editCount} sửa</span>
                  </span>
                )}

                {/* Active Indicator Check Icon */}
                {isSelected && (
                  <span className="absolute bottom-2 left-2 p-1 rounded-full bg-brand-500 text-white shadow-sm">
                    <CheckCircle className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Label & Details */}
              <div className="w-full flex items-center justify-between mt-2.5 px-1 text-xs">
                <span className={`font-bold ${isSelected ? 'text-brand-500 dark:text-brand-400' : 'text-gray-800 dark:text-gray-200'}`}>
                  Trang {idx + 1}
                </span>
                <span className="text-[10px] font-mono text-gray-400 dark:text-dark-subtle">
                  {Math.round(page.width)} × {Math.round(page.height)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
