import React from 'react';
import { MapPin, Navigation, X, Check, School } from 'lucide-react';
import type { LocationState } from '../types';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationState;
  onSelectLocation: (loc: LocationState) => void;
  onDetectGPS: () => void;
}

const STUDENT_HUBS = [
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
    city: 'Delhi',
    area: 'North Campus & Hudson Lane',
    state: 'Delhi NCR',
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
    city: 'Hyderabad',
    area: 'Gachibowli & Cybercity',
    state: 'Telangana',
    colleges: 'IIIT Hyderabad, HCU, ISB',
    lat: 17.4474,
    lng: 78.3582,
    emoji: '⚡'
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
];

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onDetectGPS,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-extrabold text-white">Choose Your Campus Hub</h3>
              <p className="text-xs text-slate-400">Discover places tailored to students in your area</p>
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
        <div className="p-4 bg-slate-950 border-b border-slate-800/80">
          <button
            onClick={() => {
              onDetectGPS();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4 animate-spin [animation-duration:10s]" />
            <span>Detect Current Location via GPS (Auto-detect)</span>
          </button>
        </div>

        {/* Hubs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-96">
          {STUDENT_HUBS.map((hub) => {
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
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{hub.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{hub.city}</span>
                      <span className="text-xs text-emerald-400 font-medium">({hub.area})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <School className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{hub.colleges}</span>
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1 rounded-full bg-emerald-500 text-slate-950">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
