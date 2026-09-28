import React, { useState } from 'react';
import { 
  Search, 
  Compass, 
  Sun, 
  ArrowRight, 
  TrendingUp, 
  Dice5, 
  GraduationCap 
} from 'lucide-react';
import { POPULAR_SEARCH_QUERIES } from '../utils/constants';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
  onExploreClick: () => void;
  onStudentModeClick: () => void;
  onSurpriseMeClick: () => void;
  currentCity: string;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onExploreClick,
  onStudentModeClick,
  onSurpriseMeClick,
  currentCity,
}) => {
  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localInput.trim()) {
      onSearch(localInput);
    }
  };

  const handleChipClick = (query: string) => {
    setLocalInput(query);
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Floating Pill: Weather & Student Hackathon Status */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-8 shadow-inner">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Sun className="w-3.5 h-3.5 animate-[spin_10s_linear_infinite]" />
            <span>27°C Sunny</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">
            Ideal for exploring outdoor spots & cafés in <strong className="text-white">{currentCity}</strong>
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          <span className="block">Travel With You</span>
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            “Discover more. Spend less. Make memories.”
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Your smart AI companion tailored for college students. Discover cafés with Wi-Fi, 
          budget theaters, street food hubs, and plan group outings under ₹500.
        </p>

        {/* Search Bar Form */}
        <div className="max-w-3xl mx-auto mb-8">
          <form 
            onSubmit={handleSubmit}
            className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-0">
              <Search className="w-5 h-5 text-emerald-400 shrink-0" />
              <input
                type="text"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder="Where do you want to go? e.g. Cheap food near me, Cafés under ₹200..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onSurpriseMeClick}
                title="Roll the dice for a random student adventure!"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all cursor-pointer"
              >
                <Dice5 className="w-4 h-4 text-teal-400" />
                <span className="hidden md:inline">Surprise Me</span>
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Search Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-xs text-slate-400">
            <span className="text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Popular:
            </span>
            {POPULAR_SEARCH_QUERIES.slice(0, 4).map((query, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleChipClick(query)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Student Mode & Explore Nearby */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStudentModeClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 text-slate-950" />
            <span>Launch Student Mode (AI Planner)</span>
          </button>

          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-white font-semibold text-base border border-slate-800 shadow-md hover:border-slate-700 transition-all cursor-pointer"
          >
            <Compass className="w-5 h-5 text-teal-400" />
            <span>Explore 12 Categories</span>
          </button>
        </div>

      </div>
    </section>
  );
};
