import React, { useState, useMemo } from 'react';
import { PlaceCard } from '../components/PlaceCard';
import { INITIAL_FEATURED_PLACES, CATEGORIES } from '../utils/constants';
import type { Place, PlaceCategory, ActiveTab, LocationState } from '../types';
import {
  Search, X, MapPin, Star, Wifi, Zap, Trees, Filter,
  ChevronDown, RotateCcw, Sparkles, Map as MapIcon, List,
  DollarSign, Compass, Clock, Users, Camera, BookOpen, Utensils, Music
} from 'lucide-react';
import { MapPage } from './MapPage';
import { DestinationSearchBar } from '../components/common/DestinationSearchBar';
import { getPlacesWithLiveDistance, calculateDistanceKm } from '../utils/location';
import { fetchLiveMapPlaces } from '../utils/mapPlacesService';

interface ExplorePageProps {
  savedPlaceIds: string[];
  onToggleSave: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onViewPlaceDetails: (place: Place) => void;
  currentCity?: string;
  userLat?: number;
  userLng?: number;
  onUpdateLocation?: (loc: LocationState) => void;
}

type SortOption = 'distance' | 'rating' | 'cost_asc' | 'cost_desc' | 'reviews';
type MoodOption = 'all' | 'friends' | 'solo' | 'study' | 'food' | 'photography' | 'relaxing' | 'entertainment' | 'adventure';

interface Filters {
  category: PlaceCategory | 'all';
  maxCost: number;
  minRating: number;
  maxDistance: number;
  mood: MoodOption;
  hasWifi: boolean;
  hasCharging: boolean;
  isOutdoor: boolean;
  isFree: boolean;
}

const defaultFilters: Filters = {
  category: 'all',
  maxCost: 1000,
  minRating: 0,
  maxDistance: 150,
  mood: 'all',
  hasWifi: false,
  hasCharging: false,
  isOutdoor: false,
  isFree: false,
};

export const ExplorePage: React.FC<ExplorePageProps> = ({
  savedPlaceIds,
  onToggleSave,
  setActiveTab,
  onViewPlaceDetails,
  currentCity = 'Bengaluru',
  userLat,
  userLng,
  onUpdateLocation,
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>('distance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.maxCost < 1000) count++;
    if (filters.minRating > 0) count++;
    if (filters.maxDistance < 20) count++;
    if (filters.mood !== 'all') count++;
    if (filters.hasWifi) count++;
    if (filters.hasCharging) count++;
    if (filters.isOutdoor) count++;
    if (filters.isFree) count++;
    return count;
  }, [filters]);

  // Live Map Places from OpenStreetMap when searching any town/city on maps
  const [liveMapPlaces, setLiveMapPlaces] = useState<Place[]>([]);
  const [isSearchingLiveMap, setIsSearchingLiveMap] = useState(false);

  // 1. Calculate live geographical distance for all places based on userLat & userLng
  const placesWithLiveDistance = useMemo(() => {
    return getPlacesWithLiveDistance(INITIAL_FEATURED_PLACES, userLat, userLng);
  }, [userLat, userLng]);

  // Query live OpenStreetMap POIs if local search yields fewer than 4 matches
  React.useEffect(() => {
    const q = query.trim();
    if (!q || q.length < 2) {
      setLiveMapPlaces([]);
      return;
    }

    const localMatches = placesWithLiveDistance.filter(p => 
      p.name.toLowerCase().includes(q.toLowerCase()) || 
      p.city.toLowerCase().includes(q.toLowerCase()) || 
      (p.area && p.area.toLowerCase().includes(q.toLowerCase()))
    );

    if (localMatches.length < 4) {
      setIsSearchingLiveMap(true);
      fetchLiveMapPlaces(q, userLat, userLng).then((osmPlaces) => {
        setLiveMapPlaces(osmPlaces);
        setIsSearchingLiveMap(false);
      }).catch(() => setIsSearchingLiveMap(false));
    } else {
      setLiveMapPlaces([]);
    }
  }, [query, userLat, userLng, placesWithLiveDistance]);

  const filteredPlaces = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Base filter function
    const matchesGeneralFilters = (p: Place, isSearchedItem = false) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (p.approxCostForOne > filters.maxCost) return false;
      if (p.rating < filters.minRating) return false;
      // Do not discard explicitly searched places for distance
      if (!isSearchedItem && p.distanceKm !== undefined && p.distanceKm > filters.maxDistance) return false;
      if (filters.hasWifi && !p.hasWifi) return false;
      if (filters.hasCharging && !p.hasCharging) return false;
      if (filters.isOutdoor && !p.isOutdoor) return false;
      if (filters.isFree && p.approxCostForOne !== 0) return false;

      // Mood match
      if (filters.mood !== 'all') {
        if (filters.mood === 'study' && p.category !== 'study_spots' && !p.isQuiet) return false;
        if (filters.mood === 'food' && p.category !== 'street_food' && p.category !== 'restaurants' && p.category !== 'cafes') return false;
        if (filters.mood === 'relaxing' && p.category !== 'parks_nature' && p.category !== 'viewpoints') return false;
        if (filters.mood === 'photography' && p.category !== 'photo_spots' && p.category !== 'viewpoints') return false;
        if (filters.mood === 'entertainment' && p.category !== 'entertainment' && p.category !== 'theatres') return false;
        if (filters.mood === 'adventure' && p.category !== 'weekend_trips' && p.category !== 'viewpoints') return false;
      }
      return true;
    };

    if (!q) {
      let places = placesWithLiveDistance.filter((p) => matchesGeneralFilters(p, false));
      places = [...places].sort((a, b) => {
        switch (sort) {
          case 'distance': return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
          case 'rating': return b.rating - a.rating;
          case 'cost_asc': return a.approxCostForOne - b.approxCostForOne;
          case 'cost_desc': return b.approxCostForOne - a.approxCostForOne;
          case 'reviews': return b.reviewCount - a.reviewCount;
          default: return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
        }
      });
      return places;
    }

    // 1. Direct / Exact matches for query
    const directMatches: Place[] = [];
    const directIds = new Set<string>();

    for (const p of placesWithLiveDistance) {
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const areaMatch = p.area && p.area.toLowerCase().includes(q);
      const cityMatch = p.city && p.city.toLowerCase().includes(q);
      const stateMatch = p.state && p.state.toLowerCase().includes(q);
      const catMatch = p.category.toLowerCase().includes(q) || (q.includes('temple') && p.category === 'cultural_temples');
      const perksMatch = p.studentPerks && p.studentPerks.some((pk) => pk.toLowerCase().includes(q));

      if (nameMatch || descMatch || areaMatch || cityMatch || stateMatch || catMatch || perksMatch) {
        if (matchesGeneralFilters(p, true)) {
          directMatches.push(p);
          directIds.add(p.id);
        }
      }
    }

    // Rank exact matches at the top
    directMatches.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aExact = aName === q ? 4 : (aName.startsWith(q) ? 3 : (a.city.toLowerCase() === q ? 2 : 1));
      const bExact = bName === q ? 4 : (bName.startsWith(q) ? 3 : (b.city.toLowerCase() === q ? 2 : 1));
      if (bExact !== aExact) return bExact - aExact;
      return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
    });

    // 2. Discover near places around the searched location (~90 km radius)
    const nearPlaces: Place[] = [];
    if (directMatches.length > 0) {
      const targetAnchor = directMatches[0];
      const targetLat = targetAnchor.latitude;
      const targetLng = targetAnchor.longitude;

      if (targetLat && targetLng) {
        for (const p of placesWithLiveDistance) {
          if (directIds.has(p.id)) continue;
          if (!matchesGeneralFilters(p, false)) continue;

          const distToSearched = calculateDistanceKm(targetLat, targetLng, p.latitude, p.longitude);
          if (distToSearched <= 90) {
            nearPlaces.push({
              ...p,
              distanceKm: Math.round(distToSearched * 10) / 10
            });
          }
        }

        nearPlaces.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
      }
    }

    const allFound = [...directMatches, ...liveMapPlaces.filter(p => matchesGeneralFilters(p, true))];
    const uniqueIds = new Set<string>();
    const deduplicatedMatches: Place[] = [];
    for (const p of allFound) {
      if (!uniqueIds.has(p.id) && !uniqueIds.has(p.name.toLowerCase())) {
        uniqueIds.add(p.id);
        uniqueIds.add(p.name.toLowerCase());
        deduplicatedMatches.push(p);
      }
    }

    return [...deduplicatedMatches, ...nearPlaces];
  }, [placesWithLiveDistance, filters, query, sort, liveMapPlaces]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setQuery('');
    setSort('distance');
  };

  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover & Filter Campus Spots</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Near You
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Filter by distance, budget, mood, and student-friendly amenities around {currentCity}.
          </p>
        </div>

        {/* View Mode Switcher: List View | Map View */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-inner">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Map View if selected */}
      {viewMode === 'map' ? (
        <MapPage
          savedPlaceIds={savedPlaceIds}
          onToggleSave={onToggleSave}
          onViewPlaceDetails={onViewPlaceDetails}
          userLat={userLat}
          userLng={userLng}
          currentCity={currentCity}
          onUpdateLocation={onUpdateLocation}
        />
      ) : (
        <>
          {/* Search Bar & Filter Controls */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <DestinationSearchBar
                value={query}
                onChange={(val) => setQuery(val)}
                onSearch={(q) => setQuery(q)}
                onSelectPlace={(p) => {
                  setQuery(p.name);
                  onViewPlaceDetails(p);
                }}
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
                  setQuery(loc.name);
                }}
                onSelectCity={(city) => {
                  setQuery(city);
                }}
                userLat={userLat}
                userLng={userLng}
                placeholder="Search tourist spot, city, or state across all India (e.g. Kerala, Jaipur, Borra Caves, Munnar)..."
              />
            </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeFilterCount > 0 || filtersOpen
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Smart Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="px-3 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium outline-none cursor-pointer"
                >
                  <option value="distance">Nearest Distance 📍</option>
                  <option value="rating">Top Rated ⭐</option>
                  <option value="cost_asc">Cost: Low to High 💰</option>
                  <option value="cost_desc">Cost: High to Low</option>
                  <option value="reviews">Most Reviewed 💬</option>
                </select>
              </div>
            </div>

            {/* Category Quick Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setFilters(f => ({ ...f, category: 'all' }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  filters.category === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Categories ({INITIAL_FEATURED_PLACES.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters(f => ({ ...f, category: cat.id }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    filters.category === cat.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Expanded Smart Filters Drawer */}
            {filtersOpen && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in">
                {/* Mood Filter */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Mood & Activity
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'Any Mood' },
                      { id: 'friends', label: '👥 Hangout with Friends' },
                      { id: 'study', label: '📚 Study & Code' },
                      { id: 'food', label: '🍕 Food Crawl' },
                      { id: 'relaxing', label: '🍃 Peaceful & Chill' },
                      { id: 'entertainment', label: '🎮 Fun & Gaming' },
                      { id: 'photography', label: '📸 Photo Walk' },
                      { id: 'adventure', label: '🔥 Adventure & Trek' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setFilters(f => ({ ...f, mood: m.id as MoodOption }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          filters.mood === m.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Distance & Budget Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2">
                      Max Distance: <span className="text-emerald-400 font-bold">{filters.maxDistance} km</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={filters.maxDistance}
                      onChange={(e) => setFilters(f => ({ ...f, maxDistance: Number(e.target.value) }))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>&lt; 1 km</span>
                      <span>5 km</span>
                      <span>15 km</span>
                      <span>30 km</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2">
                      Max Budget: <span className="text-emerald-400 font-bold">₹{filters.maxCost}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={filters.maxCost}
                      onChange={(e) => setFilters(f => ({ ...f, maxCost: Number(e.target.value) }))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Free</span>
                      <span>₹250</span>
                      <span>₹500</span>
                      <span>₹1000+</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2">
                      Minimum Rating: <span className="text-amber-400 font-bold">⭐ {filters.minRating}+</span>
                    </label>
                    <div className="flex gap-2">
                      {[0, 4.0, 4.5, 4.8].map((rt) => (
                        <button
                          key={rt}
                          onClick={() => setFilters(f => ({ ...f, minRating: rt }))}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            filters.minRating === rt
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {rt === 0 ? 'All' : `${rt}+`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Amenity Toggles */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Student Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'hasWifi', label: '📶 High Speed Wi-Fi' },
                      { key: 'hasCharging', label: '⚡ Charging Ports' },
                      { key: 'isOutdoor', label: '🌳 Outdoor Space' },
                      { key: 'isFree', label: '🎟️ Free Admission' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setFilters(f => ({ ...f, [key]: !f[key as keyof Filters] }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          filters[key as keyof Filters]
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-400">
              Showing <strong className="text-white">{filteredPlaces.length}</strong> spots in {currentCity}
            </p>
            <span className="text-xs text-emerald-400 font-semibold">
              ✓ Verified for Student Affordability
            </span>
          </div>

          {/* Places Grid */}
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isSaved={savedPlaceIds.includes(place.id)}
                  onToggleSave={onToggleSave}
                  onViewDetails={onViewPlaceDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-3xl">
                🧭
              </div>
              <h3 className="text-xl font-bold text-white">
                {query ? `No destinations found for "${query}"` : 'No spots found matching your filter'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                {query 
                  ? 'We couldn\'t find any tourist places matching your search. Try searching for an Indian state, major city, or pick from popular destinations below.' 
                  : 'Try widening your budget, selecting another category, or resetting all filters.'}
              </p>

              {/* Quick suggestions if query not found */}
              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-2">
                  Popular Indian Destinations:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto">
                  {['Goa', 'Jaipur', 'Munnar', 'Ooty', 'Leh', 'Varanasi', 'Araku Valley', 'Hampi', 'Rishikesh', 'Kolkata'].map((pick) => (
                    <button
                      key={pick}
                      onClick={() => setQuery(pick)}
                      className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40 border border-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer"
                    >
                      {pick}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
