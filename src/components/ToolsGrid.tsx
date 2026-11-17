'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TOOLS_DATA, TOOLS_CATEGORIES } from '@/lib/tools-data';
import { ToolIcon } from './ToolIcon';
import { ArrowRight, Search, Sparkles, Filter } from 'lucide-react';

export function ToolsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = TOOLS_DATA.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {TOOLS_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? TOOLS_DATA.length 
              : TOOLS_DATA.filter((t) => t.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                    : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-elevated border border-gray-200/80 dark:border-dark-border'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-200/70 dark:bg-dark-elevated text-gray-600 dark:text-dark-muted'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input with sleek glass design */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm công cụ PDF, Word, Ảnh..."
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-2xl border border-gray-200/90 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-subtle focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Tools (1 to 6 columns responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
        {filteredTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.targetUrl}
            className="group relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 bg-white dark:bg-dark-card border-gray-200/90 dark:border-dark-border hover:border-gray-800 dark:hover:border-brand-500 hover:shadow-card-hover dark:hover:shadow-card-dark-hover hover:-translate-y-1.5"
          >
            <div>
              {/* Badge if present */}
              {tool.badge && (
                <span className="absolute top-4 right-4 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/40 shadow-xs">
                  {tool.badge}
                </span>
              )}

              {/* Icon Container with subtle background tint & 1.1x hover zoom */}
              <div 
                className="w-13 h-13 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-xs"
                style={{ 
                  backgroundColor: `${tool.color}15`,
                  color: tool.color,
                  width: '52px',
                  height: '52px'
                }}
              >
                <ToolIcon name={tool.iconName} className="w-6 h-6" color={tool.color} />
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-gray-950 dark:text-white mb-2 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors leading-snug">
                {tool.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted line-clamp-3 leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Bottom action indicator */}
            <div className="mt-6 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border/60 text-[11px] font-bold text-gray-400 dark:text-dark-muted group-hover:text-brand-500 transition-colors">
              <span>{tool.categoryLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5 text-gray-400 group-hover:text-brand-500" />
            </div>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-gray-200 dark:border-dark-border my-6">
          <p className="text-gray-500 dark:text-dark-muted text-base font-medium">
            Không tìm thấy công cụ nào khớp với từ khóa "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-700 shadow-md transition-all"
          >
            Xem lại tất cả 31 công cụ
          </button>
        </div>
      )}
    </section>
  );
}
