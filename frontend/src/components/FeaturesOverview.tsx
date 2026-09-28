import React from 'react';
import { 
  GraduationCap, 
  CloudSun, 
  Wallet, 
  Camera, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';

interface FeaturesOverviewProps {
  onLaunchStudentMode: () => void;
  onExploreBudget: () => void;
  onOpenMemories: () => void;
}

export const FeaturesOverview: React.FC<FeaturesOverviewProps> = ({
  onLaunchStudentMode,
  onExploreBudget,
  onOpenMemories,
}) => {
  return (
    <section className="py-16 sm:py-24 border-t border-slate-800/80 bg-slate-950/60 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built Specifically For College Life</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Why Students Choose <span className="text-emerald-400">Travel With You</span>
          </h2>
          <p className="text-base text-slate-400 mt-4 leading-relaxed">
            Existing travel apps cater to luxury holidays and expensive dining. 
            We built an AI engine focused 100% on student affordability, transit convenience, and real campus hangouts.
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1: Student Mode */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">🎓 Student Mode (AI Planner)</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Enter your total budget (e.g. ₹500), number of friends, and free hours. The AI builds a multi-stop plan with estimated food, tickets, and travel.
              </p>
            </div>
            <button 
              onClick={onLaunchStudentMode}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <span>Try Student Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 2: Weather Smart */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-105 transition-transform">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">🌦️ Weather-Aware Engine</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Raining outside? The AI instantly pivots to indoor arcades, cozy bookstores, and study cafés. Clear and pleasant? It suggests parks and hill viewpoints.
              </p>
            </div>
            <span className="mt-6 text-xs font-semibold text-teal-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Live Climate Sensing
            </span>
          </div>

          {/* Feature 3: Budget Guardian & Splitter */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">💰 Budget Guardian</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Prevents awkward money surprises. Automatically splits group bills between friends and alerts you before your day exceeds your daily budget.
              </p>
            </div>
            <button 
              onClick={onExploreBudget}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <span>Explore Budget Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 4: Memory Journal */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-pink-500/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-5 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">📸 Travel Memories</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Upload photos with your hostel mates, tag visited places, and save a chronological visual timeline of your college escapades.
              </p>
            </div>
            <button 
              onClick={onOpenMemories}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
            >
              <span>View Memory Journal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
