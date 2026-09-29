import React, { useState, useCallback } from 'react';
import { INITIAL_FEATURED_PLACES } from '../utils/constants';
import { calculateDistanceKm } from '../utils/location';
import { MapPin, Navigation2, Info, X, Layers, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { DestinationSearchBar } from '../components/common/DestinationSearchBar';
import type { Place, LocationState } from '../types';

// Simple SVG-based interactive map without external dependencies
// Each place is rendered as a pin on a stylized map background

interface MapPageProps {
  savedPlaceIds: string[];
  onToggleSave: (id: string) => void;
  onViewPlaceDetails?: (place: Place) => void;
  userLat?: number;
  userLng?: number;
  currentCity?: string;
  currentArea?: string;
  onUpdateLocation?: (loc: LocationState) => void;
}

// Default bounding box fallback
const DEFAULT_MAP_BOUNDS = {
  minLat: 12.89,
  maxLat: 13.03,
  minLng: 77.54,
  maxLng: 77.65,
};

const CATEGORY_COLORS: Record<string, string> = {
  cafes: '#f59e0b',
  study_spots: '#3b82f6',
  street_food: '#ef4444',
  theatres: '#a855f7',
  parks_nature: '#10b981',
  restaurants: '#f59e0b',
  entertainment: '#8b5cf6',
  viewpoints: '#f97316',
  cultural_temples: '#d97706',
  shopping: '#ec4899',
  photo_spots: '#06b6d4',
  weekend_trips: '#14b8a6',
};

const CATEGORY_EMOJI: Record<string, string> = {
  cafes: '☕',
  study_spots: '📚',
  street_food: '🍕',
  theatres: '🎬',
  parks_nature: '🌳',
  restaurants: '🍔',
  entertainment: '🎮',
  viewpoints: '🌅',
  cultural_temples: '🛕',
  shopping: '🛍️',
  photo_spots: '📸',
  weekend_trips: '🔥',
};

export const MapPage: React.FC<MapPageProps> = ({
  savedPlaceIds,
  onToggleSave,
  onViewPlaceDetails,
  userLat,
  userLng,
  currentCity = 'Bengaluru',
  currentArea,
  onUpdateLocation,
}) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [zoom, setZoom] = useState(1);
  const [mapSearch, setMapSearch] = useState('');

  // Filter to places closest to user's live geo coordinates
  const cityPlaces = React.useMemo(() => {
    // 1. If user coordinates exist, calculate live distance and show nearby places!
    if (userLat !== undefined && userLng !== undefined && !isNaN(userLat) && !isNaN(userLng)) {
      const placesWithDist = INITIAL_FEATURED_PLACES.map(p => ({
        ...p,
        liveDist: calculateDistanceKm(userLat, userLng, p.latitude, p.longitude)
      })).sort((a, b) => a.liveDist - b.liveDist);

      // Spots within 150km of the user
      const nearby = placesWithDist.filter(p => p.liveDist <= 150);
      if (nearby.length > 0) return nearby;

      // If user is farther away from current spots, return the 15 closest places
      return placesWithDist.slice(0, 15);
    }

    if (currentCity && currentCity.toLowerCase() !== 'all') {
      const matched = INITIAL_FEATURED_PLACES.filter(
        (p) => p.city.toLowerCase() === currentCity.toLowerCase() || (p.area && p.area.toLowerCase().includes(currentCity.toLowerCase()))
      );
      if (matched.length > 0) return matched;
    }

    return INITIAL_FEATURED_PLACES.slice(0, 15);
  }, [userLat, userLng, currentCity]);

  // Dynamically compute map bounds based on places + user coordinates
  const currentBounds = React.useMemo(() => {
    const points: { lat: number; lng: number }[] = cityPlaces.map((p) => ({
      lat: p.latitude,
      lng: p.longitude,
    }));
    if (userLat && userLng) {
      points.push({ lat: userLat, lng: userLng });
    }
    if (points.length === 0) return DEFAULT_MAP_BOUNDS;
    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const minLat = Math.min(...lats) - 0.03;
    const maxLat = Math.max(...lats) + 0.03;
    const minLng = Math.min(...lngs) - 0.03;
    const maxLng = Math.max(...lngs) + 0.03;
    return { minLat, maxLat, minLng, maxLng };
  }, [cityPlaces, userLat, userLng]);

  const latLngToPercent = useCallback(
    (lat: number, lng: number) => {
      const spanLng = currentBounds.maxLng - currentBounds.minLng || 0.08;
      const spanLat = currentBounds.maxLat - currentBounds.minLat || 0.08;
      const x = ((lng - currentBounds.minLng) / spanLng) * 100;
      const y = ((currentBounds.maxLat - lat) / spanLat) * 100;
      return { x: Math.min(Math.max(x, 5), 95), y: Math.min(Math.max(y, 5), 95) };
    },
    [currentBounds]
  );

  const visiblePlaces = activeCategory === 'all'
    ? cityPlaces
    : cityPlaces.filter((p) => p.category === activeCategory);

  const availableCategories = [...new Set(cityPlaces.map((p) => p.category))];

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.25, 2.5)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.25, 0.6)), []);

  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>Interactive Student Map — {currentCity}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Live Hotspot Map
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {currentArea ? `Exploring near ${currentArea}, ${currentCity}. ` : ''}
          {cityPlaces.length} student-rated places pinned on the live map. Tap any pin for details.
        </p>
      </div>

      {/* Real-time Map Destination & Location Search */}
      <div className="mb-6 max-w-2xl">
        <DestinationSearchBar
          value={mapSearch}
          onChange={(val) => setMapSearch(val)}
          onSearch={(q) => setMapSearch(q)}
          onSelectLocation={(loc) => {
            if (onUpdateLocation) {
              onUpdateLocation({
                city: loc.city || loc.name,
                area: loc.name,
                latitude: loc.latitude,
                longitude: loc.longitude,
                isDetected: true,
              });
            }
            setMapSearch(loc.name);
          }}
          onSelectPlace={(p) => {
            setSelectedPlace(p);
            if (onViewPlaceDetails) onViewPlaceDetails(p);
          }}
          userLat={userLat}
          userLng={userLng}
          placeholder="Search and center any exact place on the map (e.g. Gorantla, Tirupati, Ooty, Taj Mahal)..."
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 border-emerald-500'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          🗺️ All ({cityPlaces.length})
        </button>
        {availableCategories.map((cat) => {
          const count = cityPlaces.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'text-slate-950 border-transparent'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              style={activeCategory === cat ? { backgroundColor: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] } : {}}
            >
              {CATEGORY_EMOJI[cat]} {cat.replace('_', ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl" style={{ height: '520px' }}>
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-slate-950/90 border border-slate-800 text-white flex items-center justify-center hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-slate-950/90 border border-slate-800 text-white flex items-center justify-center hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Layers info */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>{visiblePlaces.length} places visible</span>
        </div>

        {/* Map Background — Stylized City Grid */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0b0f19 0%, #0f1729 50%, #0b0f19 100%)',
          }}
        >
          {/* Grid streets pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
          >
            {/* Horizontal streets */}
            {Array.from({ length: 20 }, (_, i) => (
              <line key={`h${i}`} x1="0%" y1={`${i * 5 + 2}%`} x2="100%" y2={`${i * 5 + 2}%`} stroke="#1e293b" strokeWidth="1.5" />
            ))}
            {/* Vertical streets */}
            {Array.from({ length: 20 }, (_, i) => (
              <line key={`v${i}`} x1={`${i * 5 + 2}%`} y1="0%" x2={`${i * 5 + 2}%`} y2="100%" stroke="#1e293b" strokeWidth="1.5" />
            ))}
            {/* Major roads */}
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#334155" strokeWidth="3" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#334155" strokeWidth="3" />
            <line x1="0%" y1="30%" x2="100%" y2="30%" stroke="#1e293b" strokeWidth="2" />
            <line x1="0%" y1="70%" x2="100%" y2="70%" stroke="#1e293b" strokeWidth="2" />
            <line x1="30%" y1="0%" x2="30%" y2="100%" stroke="#1e293b" strokeWidth="2" />
            <line x1="70%" y1="0%" x2="70%" y2="100%" stroke="#1e293b" strokeWidth="2" />

            {/* Park/green areas */}
            <rect x="38%" y="18%" width="14%" height="12%" rx="6" fill="#10b98110" stroke="#10b98130" strokeWidth="1" />
            <rect x="20%" y="55%" width="10%" height="8%" rx="4" fill="#10b98108" stroke="#10b98120" strokeWidth="1" />

            {/* Water body */}
            <ellipse cx="70%" cy="25%" rx="6%" ry="4%" fill="#3b82f610" stroke="#3b82f620" strokeWidth="1" />
          </svg>

          {/* Compass Rose */}
          <div className="absolute bottom-4 left-4 text-[11px] text-slate-600 font-bold">
            <span className="block text-center">N↑</span>
          </div>

          {/* Place Pins */}
          <div
            className="absolute inset-0"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
          >
            {visiblePlaces.map((place) => {
              const { x, y } = latLngToPercent(place.latitude, place.longitude);
              const color = CATEGORY_COLORS[place.category] || '#10b981';
              const emoji = CATEGORY_EMOJI[place.category] || '📍';
              const isSelected = selectedPlace?.id === place.id;
              const isHovered = hoveredId === place.id;
              const isSaved = savedPlaceIds.includes(place.id);

              return (
                <div
                  key={place.id}
                  className="absolute cursor-pointer transition-all duration-150"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -100%) scale(${isSelected || isHovered ? 1.3 : 1})`,
                    zIndex: isSelected ? 30 : isHovered ? 20 : 10,
                  }}
                  onClick={() => setSelectedPlace(place)}
                  onMouseEnter={() => setHoveredId(place.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Pin */}
                  <div
                    className="relative flex flex-col items-center"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-base shadow-lg border-2 border-white/20"
                      style={{ backgroundColor: color + 'dd', boxShadow: `0 4px 12px ${color}50` }}
                    >
                      <span className="text-xs">{emoji}</span>
                    </div>
                    {/* Saved indicator */}
                    {isSaved && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border border-white/20 flex items-center justify-center">
                        <span className="text-[6px] text-white">♥</span>
                      </div>
                    )}
                    {/* Pin tail */}
                    <div
                      className="w-0.5 h-2"
                      style={{ backgroundColor: color + '80' }}
                    />
                    {/* Dot at bottom */}
                    <div
                      className="w-1.5 h-1.5 rounded-full opacity-50"
                      style={{ backgroundColor: color }}
                    />
                  </div>

                  {/* Hover tooltip */}
                  {isHovered && !isSelected && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-40 w-40 px-3 py-2 rounded-xl bg-slate-950/95 border border-slate-800 shadow-xl backdrop-blur-xl pointer-events-none">
                      <div className="text-[11px] font-bold text-white line-clamp-1">{place.name}</div>
                      <div className="text-[10px] text-slate-400">⭐ {place.rating} • {place.approxCostForOne === 0 ? 'Free' : `₹${place.approxCostForOne}`}</div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* User Location Pin */}
            {userLat && userLng && (
              <div
                className="absolute"
                style={{
                  left: `${latLngToPercent(userLat, userLng).x}%`,
                  top: `${latLngToPercent(userLat, userLng).y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 40,
                }}
              >
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500/50 animate-pulse" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-blue-500/30 animate-ping" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Place Detail Sidebar (appears on pin click) */}
        {selectedPlace && (
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-slate-950/95 border-l border-slate-800 backdrop-blur-xl overflow-y-auto z-30 animate-in slide-in-from-right duration-200">
            <div className="relative h-40">
              <img
                src={selectedPlace.imageUrl}
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/70 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {CATEGORY_EMOJI[selectedPlace.category]} {selectedPlace.category.replace('_', ' ')}
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">{selectedPlace.name}</h3>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">{selectedPlace.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 mb-1">COST</div>
                  <div className="font-bold text-emerald-400">
                    {selectedPlace.approxCostForOne === 0 ? 'Free' : `₹${selectedPlace.approxCostForOne}`}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 mb-1">RATING</div>
                  <div className="font-bold text-amber-400">⭐ {selectedPlace.rating}</div>
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{selectedPlace.address}</span>
              </div>

              {selectedPlace.studentPerks?.length > 0 && (
                <div className="space-y-1">
                  {selectedPlace.studentPerks.slice(0, 2).map((perk, i) => (
                    <div key={i} className="text-[11px] text-emerald-400">✓ {perk}</div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                {onViewPlaceDetails && (
                  <button
                    onClick={() => onViewPlaceDetails(selectedPlace)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                  >
                    View Details
                  </button>
                )}
                <button
                  onClick={() => {
                    const q = encodeURIComponent(`${selectedPlace.name} ${selectedPlace.city}`);
                    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation2 className="w-3.5 h-3.5" />
                  Directions
                </button>
                <button
                  onClick={() => onToggleSave(selectedPlace.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    savedPlaceIds.includes(selectedPlace.id)
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {savedPlaceIds.includes(selectedPlace.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {availableCategories.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-slate-400">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[cat] || '#10b981' }}
            />
            <span>{CATEGORY_EMOJI[cat]} {cat.replace('_', ' ')}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>📍 Your Location</span>
        </div>
      </div>
    </div>
  );
};
