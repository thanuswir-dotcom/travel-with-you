import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  X, 
  Compass, 
  Sparkles, 
  ChevronRight, 
  Building2, 
  Star,
  ArrowRight
} from 'lucide-react';
import { INITIAL_FEATURED_PLACES } from '../../utils/constants';
import { ALL_INDIAN_STATES_UTS } from '../../utils/indiaDestinations';
import type { Place } from '../../types';

interface DestinationSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: (query: string) => void;
  onSelectPlace?: (place: Place) => void;
  onSelectCity?: (city: string, state?: string) => void;
  placeholder?: string;
  className?: string;
  showSurpriseButton?: boolean;
  onSurpriseMeClick?: () => void;
}

// Common aliases for spelling variation & city nicknames in India
const CITY_ALIASES: Record<string, string> = {
  'bangalore': 'bengaluru',
  'bengaluru': 'bengaluru',
  'mysore': 'mysuru',
  'mysuru': 'mysuru',
  'kashi': 'varanasi',
  'banaras': 'varanasi',
  'benares': 'varanasi',
  'varanasi': 'varanasi',
  'vizag': 'visakhapatnam',
  'vishakapatnam': 'visakhapatnam',
  'visakhapatnam': 'visakhapatnam',
  'pondicherry': 'puducherry',
  'pondi': 'puducherry',
  'puducherry': 'puducherry',
  'calangut': 'calangute',
  'calangute': 'calangute',
  'munar': 'munnar',
  'munnar': 'munnar',
  'alappuzha': 'alleppey',
  'alleppy': 'alleppey',
  'alleppey': 'alleppey',
  'bombay': 'mumbai',
  'mumbai': 'mumbai',
  'madras': 'chennai',
  'chennai': 'chennai',
  'sambhajinagar': 'aurangabad',
  'aurangabad': 'chhatrapati sambhajinagar',
  'baroda': 'vadodara',
  'vadodara': 'vadodara',
  'trivandrum': 'thiruvananthapuram',
  'thiruvananthapuram': 'thiruvananthapuram',
  'cochin': 'kochi',
  'kochi': 'kochi',
  'ananthpur': 'anantapur',
  'anantapuram': 'anantapur',
  'anantapur': 'anantapur',
  'gorantla': 'gorantla',
  'ooty': 'ooty',
  'udhagamandalam': 'ooty',
  'gurgaon': 'gurugram',
  'gurugram': 'gurugram',
  'calcutta': 'kolkata',
  'kolkata': 'kolkata',
  'rishikesh': 'rishikesh',
  'haridwar': 'haridwar',
  'shimla': 'shimla',
  'simla': 'shimla',
  'manali': 'manali',
  'leh': 'leh',
  'ladakh': 'ladakh',
  'jaipur': 'jaipur',
  'udaipur': 'udaipur',
  'goa': 'goa',
};

const POPULAR_QUICK_PICKS = [
  'Goa',
  'Jaipur',
  'Munnar',
  'Ooty',
  'Leh',
  'Varanasi',
  'Araku Valley',
  'Visakhapatnam',
  'Rishikesh',
  'Hampi',
  'Shillong',
  'Kolkata'
];

export const DestinationSearchBar: React.FC<DestinationSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onSelectPlace,
  onSelectCity,
  placeholder = 'Search by place, city, or state (e.g. Kerala, Jaipur, Borra Caves, Munnar)...',
  className = '',
  showSurpriseButton = false,
  onSurpriseMeClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = useMemo(() => {
    return value.trim().toLowerCase();
  }, [value]);

  // Matching suggestions computed dynamically
  const suggestions = useMemo(() => {
    if (!normalizedQuery || normalizedQuery.length < 1) {
      return { places: [], cities: [], states: [] };
    }

    const q = normalizedQuery;
    const resolvedAlias = CITY_ALIASES[q] || q;

    // 1. Match States & UTs
    const matchingStates = ALL_INDIAN_STATES_UTS.filter(item => {
      const stateMatch = item.state.toLowerCase().includes(q);
      const capMatch = item.capital.toLowerCase().includes(q);
      const cityListMatch = item.popularCities.some(c => c.toLowerCase().includes(q) || c.toLowerCase().includes(resolvedAlias));
      return stateMatch || capMatch || cityListMatch;
    }).slice(0, 4);

    // 2. Match Cities
    const citySet = new Map<string, { city: string; state: string }>();
    INITIAL_FEATURED_PLACES.forEach(p => {
      const cityLower = p.city.toLowerCase();
      const stateLower = (p.state || '').toLowerCase();
      if (cityLower.includes(q) || cityLower.includes(resolvedAlias) || stateLower.includes(q)) {
        if (!citySet.has(p.city)) {
          citySet.set(p.city, { city: p.city, state: p.state || '' });
        }
      }
    });

    ALL_INDIAN_STATES_UTS.forEach(s => {
      s.popularCities.forEach(c => {
        const cLower = c.toLowerCase();
        if (cLower.includes(q) || cLower.includes(resolvedAlias)) {
          if (!citySet.has(c)) {
            citySet.set(c, { city: c, state: s.state });
          }
        }
      });
    });

    const matchingCities = Array.from(citySet.values()).slice(0, 5);

    // 3. Match Places
    const matchingPlaces = INITIAL_FEATURED_PLACES.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const areaMatch = p.area.toLowerCase().includes(q);
      const cityMatch = p.city.toLowerCase().includes(q) || p.city.toLowerCase().includes(resolvedAlias);
      const stateMatch = p.state ? p.state.toLowerCase().includes(q) : false;
      const perksMatch = p.studentPerks ? p.studentPerks.some(pk => pk.toLowerCase().includes(q)) : false;

      return nameMatch || descMatch || areaMatch || cityMatch || stateMatch || perksMatch;
    }).slice(0, 6);

    return {
      places: matchingPlaces,
      cities: matchingCities,
      states: matchingStates,
    };
  }, [normalizedQuery]);

  const totalResults = suggestions.places.length + suggestions.cities.length + suggestions.states.length;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handlePickCity = (city: string, state?: string) => {
    onChange(city);
    setIsOpen(false);
    if (onSelectCity) {
      onSelectCity(city, state);
    } else if (onSearch) {
      onSearch(city);
    }
  };

  const handlePickState = (stateName: string) => {
    onChange(stateName);
    setIsOpen(false);
    if (onSearch) {
      onSearch(stateName);
    }
  };

  const handlePickPlace = (place: Place) => {
    onChange(place.name);
    setIsOpen(false);
    if (onSelectPlace) {
      onSelectPlace(place);
    } else if (onSearch) {
      onSearch(place.name);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <form 
        onSubmit={handleFormSubmit}
        className="p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex items-center gap-2 transition-all focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30"
      >
        <div className="flex items-center gap-3 w-full px-3 py-1.5 sm:py-1">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={value}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm md:text-base outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="p-1 text-slate-500 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 pr-1">
          {showSurpriseButton && onSurpriseMeClick && (
            <button
              type="button"
              onClick={onSurpriseMeClick}
              title="Surprise me with a random destination"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Surprise</span>
            </button>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && normalizedQuery.length >= 1 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden max-h-[460px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {totalResults > 0 ? (
            <div className="p-3 space-y-4">
              
              {/* States & Union Territories Section */}
              {suggestions.states.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      States & Union Territories
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      All India (28 States + 8 UTs)
                    </span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {suggestions.states.map((st) => (
                      <button
                        key={st.state}
                        type="button"
                        onClick={() => handlePickState(st.state)}
                        className="w-full p-2.5 rounded-2xl hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{st.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                                {st.state}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                                {st.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Capital: <strong className="text-slate-300">{st.capital}</strong> • Top Hubs: {st.popularCities.slice(0, 3).join(', ')}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cities Section */}
              {suggestions.cities.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-400" />
                    Tourist Cities & Hubs
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                    {suggestions.cities.map((c) => (
                      <button
                        key={`${c.city}-${c.state}`}
                        type="button"
                        onClick={() => handlePickCity(c.city, c.state)}
                        className="p-2.5 rounded-2xl hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                              {c.city}
                            </span>
                            {c.state && (
                              <span className="text-xs text-slate-400 ml-1.5">
                                • {c.state}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tourist Sights & Places Section */}
              {suggestions.places.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Tourist Destinations & Sights
                  </div>
                  <div className="space-y-1 mt-1">
                    {suggestions.places.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => handlePickPlace(place)}
                        className="w-full p-2.5 rounded-2xl hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={place.imageUrl}
                            alt={place.name}
                            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-800"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                                {place.name}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate">
                              {place.city}{place.state ? `, ${place.state}` : ''} • {place.approxCostForOne === 0 ? 'Free Entry' : `~₹${place.approxCostForOne}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {place.rating}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Friendly "No destinations found" fallback */
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center mx-auto text-2xl">
                🧭
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  No destinations found for "{value}"
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                  We couldn't find an exact match. Try searching by state (e.g. <em>Kerala</em> or <em>Rajasthan</em>), 
                  city (e.g. <em>Munnar</em>, <em>Jaipur</em>, <em>Ooty</em>, <em>Leh</em>), or popular landmark.
                </p>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-2">
                  Popular Indian Destinations:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {POPULAR_QUICK_PICKS.map((pick) => (
                    <button
                      key={pick}
                      type="button"
                      onClick={() => handlePickCity(pick)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40 border border-slate-700/70 text-slate-300 text-xs font-medium transition-all cursor-pointer"
                    >
                      {pick}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
