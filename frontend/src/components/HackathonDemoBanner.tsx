import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, ChevronRight, X, Compass, DollarSign, MapPin, Camera } from 'lucide-react';
import type { ActiveTab } from '../types';

interface HackathonDemoBannerProps {
  setActiveTab: (tab: ActiveTab) => void;
  onTriggerSurprise: () => void;
}

const DEMO_STEPS = [
  { step: 1, tab: 'home' as ActiveTab, title: 'Landing & Location', desc: 'Auto-detected student hub with real-time weather & 12 categories' },
  { step: 2, tab: 'explore' as ActiveTab, title: 'Explore & Smart Filters', desc: 'Discover cafes, street food, theatres with budget under ₹150' },
  { step: 3, tab: 'planner' as ActiveTab, title: 'Student Mode & AI Plan', desc: '₹500 for 3 friends in 4 hours — generates itemized itinerary' },
  { step: 4, tab: 'map' as ActiveTab, title: 'Interactive Map', desc: 'Live hotspot markers, walking radii & instant directions' },
  { step: 5, tab: 'budget' as ActiveTab, title: 'Budget & Split Bill', desc: 'Track spend, calculate per-person share & Budget Guardian' },
  { step: 6, tab: 'memories' as ActiveTab, title: 'Travel Photo Journal', desc: 'Hostel squad memories, uploaded photos and college timeline' },
];

export const HackathonDemoBanner: React.FC<HackathonDemoBannerProps> = ({
  setActiveTab,
  onTriggerSurprise,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleNextStep = () => {
    const next = currentStep < DEMO_STEPS.length ? currentStep + 1 : 1;
    setCurrentStep(next);
    setActiveTab(DEMO_STEPS[next - 1].tab);
  };

  const handleJumpStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    setActiveTab(DEMO_STEPS[stepNumber - 1].tab);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/30 text-xs py-2 px-4 shadow-lg sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        
        {/* Left Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold text-emerald-300">
            🏆 Hackathon Demo Mode:
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Step {currentStep} of {DEMO_STEPS.length} — <strong className="text-white">{DEMO_STEPS[currentStep - 1].title}</strong>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerSurprise}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Surprise Me 🎲</span>
          </button>

          <button
            onClick={handleNextStep}
            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <span>Next Flow Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
          >
            {isExpanded ? 'Hide Steps' : 'View 3-Min Script'}
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Dismiss Demo Banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Script / Flow Drawer */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800 max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 animate-in fade-in">
          {DEMO_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => handleJumpStep(s.step)}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                currentStep === s.step
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-white ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-extrabold text-[10px] text-emerald-400">Step {s.step}</span>
                {currentStep === s.step && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
              <p className="font-bold text-[11px] truncate text-slate-200">{s.title}</p>
              <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
