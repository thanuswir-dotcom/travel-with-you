import React from 'react';
import { INITIAL_FEATURED_PLACES } from '../utils/constants';
import { PlaceCard } from '../components/PlaceCard';
import { Heart, MapPin, Navigation2, Share2, Sparkles } from 'lucide-react';
import type { ActiveTab } from '../types';

interface SavedPageProps {
  savedPlaceIds: string[];
  onToggleSave: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({
  savedPlaceIds,
  onToggleSave,
  setActiveTab,
}) => {
  const savedPlaces = INITIAL_FEATURED_PLACES.filter((p) => savedPlaceIds.includes(p.id));
  const totalFree = savedPlaces.filter((p) => p.approxCostForOne === 0).length;
  const avgCost = savedPlaces.length > 0
    ? Math.round(savedPlaces.reduce((s, p) => s + p.approxCostForOne, 0) / savedPlaces.length)
    : 0;
  const avgRating = savedPlaces.length > 0
    ? (savedPlaces.reduce((s, p) => s + p.rating, 0) / savedPlaces.length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Your Saved Wishlist</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
          Places You Love ❤️
        </h1>
        <p className="text-slate-400 text-sm">Your personal collection of student-approved spots to revisit anytime.</p>
      </div>

      {savedPlaces.length > 0 ? (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-white">{savedPlaces.length}</div>
              <div className="text-xs text-slate-400 mt-1">Places Saved</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-emerald-400">₹{avgCost}</div>
              <div className="text-xs text-slate-400 mt-1">Avg Cost/Person</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-amber-400">⭐ {avgRating}</div>
              <div className="text-xs text-slate-400 mt-1">Avg Rating</div>
            </div>
          </div>

          {/* Share Wishlist Button */}
          <div className="flex justify-end mb-5">
            <button
              onClick={() => {
                const names = savedPlaces.map((p) => p.name).join(', ');
                if (navigator.share) {
                  navigator.share({ title: 'My Travel With You Wishlist', text: `Check out my favourite spots: ${names}` });
                } else {
                  navigator.clipboard.writeText(`My Travel With You spots: ${names}`);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Wishlist
            </button>
          </div>

          {/* Place Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isSaved={true}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>

          {/* Quick Day Trip Planner hint */}
          <div className="mt-8 p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Plan a trip using your saved places!</span>
                </div>
                <p className="text-xs text-slate-400">
                  Use the AI Student Mode to build an itinerary that visits your favourite spots in one day.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('planner')}
                className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Open AI Planner →
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-20 rounded-3xl border border-slate-800 border-dashed">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No saved places yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
            Tap the ❤️ heart icon on any place card to add it to your personal wishlist. Build your dream student bucket list!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveTab('home')}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Explore Home
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs cursor-pointer"
            >
              Open Full Explorer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
