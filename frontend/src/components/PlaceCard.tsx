import React from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Wifi, 
  Zap, 
  VolumeX, 
  Heart, 
  Navigation2, 
  Share2,
  Tag
} from 'lucide-react';
import type { Place } from '../types';

interface PlaceCardProps {
  place: Place;
  isSaved?: boolean;
  onToggleSave?: (placeId: string) => void;
  onViewDetails?: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isSaved = false,
  onToggleSave,
  onViewDetails,
}) => {
  const formatPrice = (cost: number) => {
    if (cost === 0) return 'Free';
    return `₹${cost} for one`;
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(`${place.name} ${place.address} ${place.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: `Check out ${place.name} on Travel With You!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${place.name} - ${place.address}`);
      alert(`Copied "${place.name}" to clipboard!`);
    }
  };

  return (
    <div 
      onClick={() => onViewDetails?.(place)}
      className="group relative rounded-3xl bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-emerald-500/5 cursor-pointer"
    >
      {/* Top Image & Floating Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-800">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{place.rating.toFixed(1)}</span>
          <span className="text-slate-400 font-normal text-[11px]">({place.reviewCount})</span>
        </div>

        {/* Save Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.(place.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
            isSaved 
              ? 'bg-rose-500/90 border-rose-400 text-white' 
              : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:text-rose-400'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save place'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Distance & Area Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{place.distanceKm ? `${place.distanceKm} km away` : place.area}</span>
        </div>

        {/* Approx Cost */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-xs font-bold text-emerald-300">
          {formatPrice(place.approxCostForOne)}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Amenities */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
              {place.name}
            </h3>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {place.description}
          </p>

          {/* Student Perks */}
          {place.studentPerks && place.studentPerks.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {place.studentPerks.map((perk, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400"
                >
                  <Tag className="w-2.5 h-2.5" />
                  <span>{perk}</span>
                </span>
              ))}
            </div>
          )}

          {/* Amenities & Open Hours */}
          <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              {place.hasWifi && (
                <span title="Free Wi-Fi available" className="p-1 rounded bg-slate-800 text-blue-400">
                  <Wifi className="w-3.5 h-3.5" />
                </span>
              )}
              {place.hasCharging && (
                <span title="Charging sockets available" className="p-1 rounded bg-slate-800 text-amber-400">
                  <Zap className="w-3.5 h-3.5" />
                </span>
              )}
              {place.isQuiet && (
                <span title="Quiet study atmosphere" className="p-1 rounded bg-slate-800 text-emerald-400">
                  <VolumeX className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Open until {place.closingTime.slice(0, 5)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => onViewDetails?.(place)}
            className="py-2 text-center text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-750 rounded-xl transition-colors cursor-pointer"
          >
            Details
          </button>
          
          <button
            onClick={handleDirections}
            className="py-2 inline-flex items-center justify-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer"
          >
            <Navigation2 className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2 inline-flex items-center justify-center gap-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

      </div>
    </div>
  );
};
