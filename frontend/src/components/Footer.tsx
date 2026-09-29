import React from 'react';
import { Compass, Heart, Sparkles } from 'lucide-react';
import type { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 sm:py-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-400/40 shadow-lg shadow-amber-500/20 bg-[#fcf9f2] flex items-center justify-center shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Travel With You Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Travel With You
                </span>
                <p className="text-[10px] text-amber-200/80 font-bold tracking-wider uppercase">
                  Explore • Discover • Experience
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-sm font-medium">
              “Discover more. Spend less. Make memories.”
            </p>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              An intelligent, budget-first travel and hangout companion built for college students, hostelers, and friend circles. Powered by modern AI and student-curated local data.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart AI Travel & Hangout Companion • All-India Edition</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore & Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-emerald-400 transition-colors">
                  Explore Nearby Hotspots
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('planner')} className="hover:text-emerald-400 transition-colors">
                  Student Mode (AI Planner)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-emerald-400 transition-colors">
                  Interactive Live Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('budget')} className="hover:text-emerald-400 transition-colors">
                  Trip Budget & Expense Splitter
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('memories')} className="hover:text-emerald-400 transition-colors">
                  Travel Memory Journal
                </button>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Full-Stack Architecture
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">React 19</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">TypeScript</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Tailwind CSS</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Vite</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Node.js</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Express</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Supabase</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">PostgreSQL</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 border-emerald-500/30">Google Gemini AI</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Leaflet Maps</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Travel With You. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>by student innovators for young explorers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
