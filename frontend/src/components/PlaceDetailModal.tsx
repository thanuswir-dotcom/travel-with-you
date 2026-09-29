import React, { useState } from 'react';
import type { Place } from '../types';
import { 
  X, Star, MapPin, Clock, Wifi, Zap, VolumeX, Heart, 
  Navigation2, Share2, ShieldCheck, Tag, ThumbsUp, MessageSquare
} from 'lucide-react';
import { submitPlaceReview } from '../utils/api';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  isSaved = false,
  onToggleSave,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  const [rating, setRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [valueForMoney, setValueForMoney] = useState(5);
  const [studentFriendliness, setStudentFriendliness] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedReview, setSubmittedReview] = useState(false);
  const [userReviews, setUserReviews] = useState<Array<{
    userName: string;
    rating: number;
    cleanliness: number;
    valueForMoney: number;
    studentFriendliness: number;
    comment: string;
    createdAt: string;
  }>>([
    {
      userName: 'Karthik Rao (Engineering \'27)',
      rating: 5,
      cleanliness: 5,
      valueForMoney: 5,
      studentFriendliness: 5,
      comment: 'Best student hangout spot! The prices are super reasonable, staff never rushes you, and you can comfortably study with friends for hours.',
      createdAt: '2 days ago'
    },
    {
      userName: 'Aanya Sen (Design \'26)',
      rating: 4,
      cleanliness: 4,
      valueForMoney: 5,
      studentFriendliness: 5,
      comment: 'Very aesthetic vibe, lots of college groups on weekends. Pro-tip: get here before 4 PM to grab the corner booth with the power outlets.',
      createdAt: 'Last week'
    }
  ]);

  if (!place) return null;

  const handleDirections = () => {
    const query = encodeURIComponent(`${place.name} ${place.address} ${place.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: `Check out ${place.name} on Travel With You!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${place.name} - ${place.address}`);
      alert(`Copied "${place.name}" link to clipboard!`);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev = {
      userName: 'You (Student Verified)',
      rating,
      cleanliness,
      valueForMoney,
      studentFriendliness,
      comment,
      createdAt: 'Just now'
    };

    setUserReviews(prev => [newRev, ...prev]);
    setSubmittedReview(true);
    setComment('');

    await submitPlaceReview(place.id, {
      rating,
      cleanliness,
      valueForMoney,
      studentFriendliness,
      comment
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-800 shrink-0">
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-amber-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {place.rating.toFixed(1)} ({place.reviewCount} reviews)
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-xs font-bold text-emerald-300">
              {place.approxCostForOne === 0 ? 'Free Entry' : `₹${place.approxCostForOne} for one`}
            </span>
          </div>

          {/* Title & Area Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              {place.category.replace('_', ' ')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {place.name}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {place.address}, {place.area}
            </p>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-slate-900/90 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDirections}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Navigation2 className="w-3.5 h-3.5" />
              Get Directions
            </button>
            <button
              onClick={() => onToggleSave?.(place.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isSaved 
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'info' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'reviews' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Reviews ({userReviews.length})
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'info' ? (
            <>
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About This Spot</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {place.description}
                </p>
              </div>

              {/* Student Perks */}
              {place.studentPerks && place.studentPerks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Student Perks & Combos
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {place.studentPerks.map((perk, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                        ✨ {perk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Practical Info & Hours */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Opening Hours</span>
                  </div>
                  <p className="text-xs font-bold text-white">
                    {place.openingTime} — {place.closingTime}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>Distance</span>
                  </div>
                  <p className="text-xs font-bold text-white">
                    {place.distanceKm ? `${place.distanceKm} km from campus` : 'Nearby'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Budget Index</span>
                  </div>
                  <p className="text-xs font-bold text-white">
                    {place.priceLevel === 0 ? 'Free Admission' : place.priceLevel === 1 ? 'Under ₹150 (Budget)' : 'Moderate ₹150–350'}
                  </p>
                </div>
              </div>

              {/* Amenities Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Amenities & Vibe</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    place.hasWifi ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <Wifi className="w-4 h-4" />
                    <span>{place.hasWifi ? 'High Speed Wi-Fi' : 'No Wi-Fi'}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    place.hasCharging ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <Zap className="w-4 h-4" />
                    <span>{place.hasCharging ? 'Power Plugs' : 'No Charging'}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    place.isQuiet ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <VolumeX className="w-4 h-4" />
                    <span>{place.isQuiet ? 'Quiet Study Zone' : 'Lively Bustle'}</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    place.isStudentFriendly ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Student Friendly</span>
                  </div>
                </div>
              </div>

              {/* Safety & Practical Facts */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Practical Student & Safety Notes</span>
                </div>
                <p className="text-slate-300">
                  {place.safetyNotes || 'Well-lit college neighborhood, easily accessible via public transit and metro feeder buses. Safe for evening visits with friends.'}
                </p>
              </div>
            </>
          ) : (
            /* Reviews Tab */
            <div className="space-y-6">
              {/* Add Review Form */}
              <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    Rate & Review As Student
                  </h4>
                  {submittedReview && (
                    <span className="text-[11px] text-emerald-400 font-semibold">✓ Review posted!</span>
                  )}
                </div>

                {/* Rating Sliders */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Overall Rating: {rating} ⭐</label>
                    <input 
                      type="range" min="1" max="5" value={rating} 
                      onChange={(e) => setRating(Number(e.target.value))} 
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Value For Money: {valueForMoney} / 5</label>
                    <input 
                      type="range" min="1" max="5" value={valueForMoney} 
                      onChange={(e) => setValueForMoney(Number(e.target.value))} 
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Cleanliness: {cleanliness} / 5</label>
                    <input 
                      type="range" min="1" max="5" value={cleanliness} 
                      onChange={(e) => setCleanliness(Number(e.target.value))} 
                      className="w-full accent-blue-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Student Friendliness: {studentFriendliness} / 5</label>
                    <input 
                      type="range" min="1" max="5" value={studentFriendliness} 
                      onChange={(e) => setStudentFriendliness(Number(e.target.value))} 
                      className="w-full accent-purple-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share honest tips for other students (pricing, Wi-Fi speed, best dishes, crowd timings)..."
                    rows={3}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Submit Student Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {userReviews.map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{rev.userName}</span>
                      <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-amber-400 font-bold">⭐ {rev.rating}/5</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-emerald-400 text-[11px]">Value: {rev.valueForMoney}/5</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-purple-400 text-[11px]">Student Vibe: {rev.studentFriendliness}/5</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
