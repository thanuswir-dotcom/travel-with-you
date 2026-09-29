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
import { DestinationSearchBar } from './common/DestinationSearchBar';
import type { Place } from '../types';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
  onExploreClick: () => void;
  onStudentModeClick: () => void;
  onSurpriseMeClick: () => void;
  onSelectPlace?: (place: Place) => void;
  currentCity: string;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onExploreClick,
  onStudentModeClick,
  onSurpriseMeClick,
  onSelectPlace,
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

        {/* Search Bar with Pan-India Autocomplete */}
        <div className="max-w-3xl mx-auto mb-8">
          <DestinationSearchBar
            value={localInput}
            onChange={(val) => {
              setLocalInput(val);
              setSearchQuery(val);
            }}
            onSearch={(q) => {
              onSearch(q);
            }}
            onSelectPlace={(p) => {
              if (onSelectPlace) onSelectPlace(p);
              else onSearch(p.name);
            }}
            onSelectCity={(city) => {
              setLocalInput(city);
              setSearchQuery(city);
              onSearch(city);
            }}
            showSurpriseButton={true}
            onSurpriseMeClick={onSurpriseMeClick}
            placeholder="Search tourist spot, city, or state (e.g. Kerala, Jaipur, Borra Caves, Munnar)..."
          />

          {/* Quick Search Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-xs text-slate-400">
            <span className="text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Popular:
            </span>
            {POPULAR_SEARCH_QUERIES.slice(0, 5).map((query, index) => (
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
