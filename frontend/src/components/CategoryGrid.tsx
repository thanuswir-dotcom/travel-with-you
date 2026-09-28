import React from 'react';
import { CATEGORIES } from '../utils/constants';
import type { PlaceCategory } from '../types';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface CategoryGridProps {
  selectedCategory: PlaceCategory | 'all';
  onSelectCategory: (category: PlaceCategory | 'all') => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated For Students</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore Near You
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Pick a category tailored for college budgets, study sessions, and weekend adventures.
          </p>
        </div>

        {/* 'Show All' filter button */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          View All Categories
        </button>
      </div>

      {/* Grid of 12 Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between min-h-[140px] ${
                isSelected
                  ? 'bg-slate-900/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Top Row: Emoji & Action Arrow */}
              <div className="flex items-start justify-between">
                <span className="text-2xl sm:text-3xl select-none group-hover:scale-110 transition-transform duration-200">
                  {cat.emoji}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                  {cat.tagline}
                </span>
              </div>

              {/* Bottom Row: Name & Description */}
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
