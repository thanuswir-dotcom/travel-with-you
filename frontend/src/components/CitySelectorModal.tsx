import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, X, Check, School, Search, Compass, Building2 } from 'lucide-react';
import type { LocationState } from '../types';
import { ALL_INDIAN_STATES_UTS } from '../utils/indiaDestinations';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationState;
  onSelectLocation: (loc: LocationState) => void;
  onDetectGPS: () => void;
}

const PRIMARY_STUDENT_HUBS = [
  {
    city: 'Bengaluru',
    area: 'Church Street & Central',
    state: 'Karnataka',
    colleges: 'Christ, St. Joseph\'s, Mount Carmel, RVCE',
    lat: 12.9749,
    lng: 77.6082,
    emoji: '🌿'
  },
  {
    city: 'Bengaluru',
    area: 'Koramangala 5th Block',
    state: 'Karnataka',
    colleges: 'Christ University, Jyoti Nivas College',
    lat: 12.9352,
    lng: 77.6245,
    emoji: '☕'
  },
  {
    city: 'Anantapur',
    area: 'Gorantla & JNTU Hub',
    state: 'Andhra Pradesh',
    colleges: 'JNTUA, Sri Krishnadevaraya University, Lepakshi Heritage',
    lat: 13.985,
    lng: 77.772,
    emoji: '🏛️'
  },
  {
    city: 'Visakhapatnam',
    area: 'Rushikonda & Beach Road',
    state: 'Andhra Pradesh',
    colleges: 'Andhra University, GITAM',
    lat: 17.7818,
    lng: 83.3857,
    emoji: '🏖️'
  },
  {
    city: 'Hyderabad',
    area: 'Gachibowli & Cybercity',
    state: 'Telangana',
    colleges: 'IIIT Hyderabad, HCU, ISB',
    lat: 17.4474,
    lng: 78.3582,
    emoji: '⚡'
  },
  {
    city: 'Delhi',
    area: 'North Campus & Hudson Lane',
    state: 'Delhi',
    colleges: 'SRCC, Stephen\'s, Hindu, Hansraj, Miranda',
    lat: 28.6942,
    lng: 77.2065,
    emoji: '🏛️'
  },
  {
    city: 'Mumbai',
    area: 'Bandra & Marine Drive',
    state: 'Maharashtra',
    colleges: 'St. Xavier\'s, Jai Hind, Mithibai, HR College',
    lat: 18.9438,
    lng: 72.8234,
    emoji: '🌊'
  },
  {
    city: 'Pune',
    area: 'FC Road & Shivajinagar',
    state: 'Maharashtra',
    colleges: 'Fergusson College, COEP, Symbiosis',
    lat: 18.5204,
    lng: 73.8427,
    emoji: '🎓'
  },
  {
    city: 'Chennai',
    area: 'Besant Nagar & Adyar',
    state: 'Tamil Nadu',
    colleges: 'IIT Madras, Loyola, Stella Maris',
    lat: 13.0001,
    lng: 80.2667,
    emoji: '🏖️'
  },
  {
    city: 'Goa',
    area: 'Panaji & North Coast',
    state: 'Goa',
    colleges: 'Goa University, BITS Pilani Goa',
    lat: 15.4909,
    lng: 73.8278,
    emoji: '🌴'
  },
  {
    city: 'Jaipur',
    area: 'Pink City & Malviya Nagar',
    state: 'Rajasthan',
    colleges: 'MNIT Jaipur, University of Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    emoji: '🏰'
  },
  {
    city: 'Kolkata',
    area: 'Park Street & College Street',
    state: 'West Bengal',
    colleges: 'Presidency University, St. Xavier\'s, Jadavpur',
    lat: 22.5726,
    lng: 88.3639,
    emoji: '🎨'
  },
  {
    city: 'Kochi',
    area: 'Fort Kochi & Marine Drive',
    state: 'Kerala',
    colleges: 'CUSAT, Rajagiri, St. Teresa\'s',
    lat: 9.9312,
    lng: 76.2673,
    emoji: '🛶'
  }
];

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onDetectGPS,
}) => {
  const [search, setSearch] = useState('');

  // Expand all cities across India
  const allDestinations = useMemo(() => {
    const list = [...PRIMARY_STUDENT_HUBS];
    ALL_INDIAN_STATES_UTS.forEach(item => {
      item.popularCities.forEach(cityName => {
        if (!list.some(h => h.city.toLowerCase() === cityName.toLowerCase())) {
          list.push({
            city: cityName,
            area: `${cityName} Center`,
            state: item.state,
            colleges: `Top tourist destination in ${item.state}`,
            lat: 20.5937,
            lng: 78.9629,
            emoji: item.emoji
          });
        }
      });
    });
    return list;
  }, []);

  const filteredHubs = useMemo(() => {
    if (!search.trim()) return allDestinations;
    const q = search.toLowerCase().trim();
    return allDestinations.filter(h => 
      h.city.toLowerCase().includes(q) ||
      h.area.toLowerCase().includes(q) ||
      h.state.toLowerCase().includes(q) ||
      h.colleges.toLowerCase().includes(q)
    );
  }, [search, allDestinations]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100 max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Choose City / Destination Hub</h3>
              <p className="text-xs text-slate-400">Select any tourist spot across all 36 Indian States & UTs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GPS Button */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800/80">
          <button
            onClick={() => {
              onDetectGPS();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-emerald-400 animate-spin [animation-duration:10s]" />
            <span>Detect Current Location via GPS (Auto-detect)</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city or state (e.g. Kerala, Jaipur, Araku, Gorantla)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Hubs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredHubs.length > 0 ? (
            filteredHubs.map((hub) => {
              const isSelected = 
                currentLocation.city.toLowerCase() === hub.city.toLowerCase() &&
                currentLocation.area.toLowerCase() === hub.area.toLowerCase();

              return (
                <div
                  key={`${hub.city}-${hub.area}`}
                  onClick={() => {
                    onSelectLocation({
                      city: hub.city,
                      area: hub.area,
                      latitude: hub.lat,
                      longitude: hub.lng,
                      isDetected: false,
                    });
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{hub.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{hub.city}</span>
                        <span className="text-xs text-emerald-400 font-medium">({hub.area})</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {hub.state}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <School className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate max-w-[280px] sm:max-w-sm">{hub.colleges}</span>
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 rounded-full bg-emerald-500 text-slate-950 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching destinations found for "{search}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
