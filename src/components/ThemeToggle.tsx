'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 active:scale-95 shadow-sm group ${
        isDark
          ? 'bg-dark-card border-dark-border text-yellow-400 hover:border-yellow-400/50 hover:shadow-[0_0_15px_-3px_rgba(250,204,21,0.25)]'
          : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300 hover:text-brand-500 hover:shadow-[0_0_15px_-3px_rgba(229,50,45,0.2)]'
      } ${className}`}
      aria-label="Chuyển đổi giao diện Sáng / Tối"
      title={isDark ? 'Chuyển sang Giao diện Sáng (Light Mode)' : 'Chuyển sang Giao diện Tối (Dark Mode)'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-yellow-400 transition-transform duration-500 rotate-0 group-hover:rotate-90 group-hover:scale-110" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 transition-transform duration-500 rotate-0 group-hover:-rotate-45 group-hover:scale-110" />
        )}
      </div>

      <span className="text-xs font-semibold tracking-wide select-none hidden sm:inline">
        {isDark ? 'Tối' : 'Sáng'}
      </span>
    </button>
  );
}
