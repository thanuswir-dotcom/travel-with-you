import React from 'react';
import type { Place } from '../types';
import { Dice5, Sparkles, MapPin, X, ArrowRight, Navigation2, Sun, CloudRain } from 'lucide-react';

interface SurpriseMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | null;
  onReroll: () => void;
  onSelectPlace: (place: Place) => void;
}

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({
  isOpen,
  onClose,
  place,
  onReroll,
  onSelectPlace,
}) => {
  if (!isOpen || !place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-cyan-500/10 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
              <Dice5 className="w-6 h-6 animate-spin [animation-duration:8s]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  AI Surprise Generator
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h3 className="text-lg font-extrabold text-white">
                Your Mini Adventure Awaits!
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Place Card Preview */}
        <div className="p-6 space-y-4">
          <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-800">
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-white">
                {place.category.replace('_', ' ')}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
                {place.approxCostForOne === 0 ? 'Free Entry' : `₹${place.approxCostForOne} / person`}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-extrabold text-white">{place.name}</h4>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {place.area}, {place.city} • ⭐ {place.rating} ({place.reviewCount} reviews)
            </p>
          </div>

          {/* AI Reasoning Pill */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
            <p className="font-bold mb-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Why this place right now?
            </p>
            <p className="text-slate-300">
              Matches your student budget perfectly and is rated top-tier for unwinding after lectures. Grab 2 friends and enjoy the evening!
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 pt-0 flex items-center gap-3">
          <button
            onClick={onReroll}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Dice5 className="w-4 h-4 text-emerald-400" />
            Roll Another
          </button>
          <button
            onClick={() => {
              onSelectPlace(place);
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <span>View Full Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
