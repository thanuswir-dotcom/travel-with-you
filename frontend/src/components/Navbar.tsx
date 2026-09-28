import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Menu, 
  X, 
  Navigation,
  User,
  ChevronDown
} from 'lucide-react';
import type { LocationState, ActiveTab, AuthMode, UserProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  location: LocationState;
  onDetectLocation: () => void;
  onOpenAuth: (mode: AuthMode) => void;
  onOpenCitySelector?: () => void;
  isDemoMode: boolean;
  user?: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  location,
  onDetectLocation,
  onOpenAuth,
  onOpenCitySelector,
  isDemoMode,
  user,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home' },
    { id: 'explore' as ActiveTab, label: 'Explore' },
    { id: 'map' as ActiveTab, label: 'Live Map' },
    { id: 'planner' as ActiveTab, label: 'Student Mode' },
    { id: 'budget' as ActiveTab, label: 'Budget' },
    { id: 'saved' as ActiveTab, label: 'Saved' },
    { id: 'memories' as ActiveTab, label: 'Memories' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 text-slate-950 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Travel With You
                </span>
                {isDemoMode && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Judge Demo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Smart Student Travel & Discovery
              </p>
            </div>
          </div>

          {/* Location Detector Pill */}
          <div 
            onClick={onOpenCitySelector}
            className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:border-emerald-500/40 cursor-pointer transition-all"
            title="Click to change campus hub"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Exploring:</span>
            <strong className="text-white font-semibold">{location.area}, {location.city}</strong>
            <ChevronDown className="w-3 h-3 text-slate-500 ml-0.5" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetectLocation();
              }}
              title="Detect Current GPS Location"
              className="ml-1 p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-emerald-300 transition-colors"
            >
              <Navigation className="w-3 h-3" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {user ? (
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.fullName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-bold">{user.fullName.split(' ')[0]}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenCitySelector}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1 text-xs"
              title="Change City"
            >
              <MapPin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2">
          <div 
            onClick={onOpenCitySelector}
            className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80 text-xs text-slate-300 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{location.area}, {location.city}</span>
            </div>
            <span className="text-emerald-400 font-semibold text-[11px]">Change City ▾</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setActiveTab('profile');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              Profile
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex gap-2">
            <button
              onClick={() => {
                onOpenAuth('login');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 text-center text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-xl"
            >
              Log In
            </button>
            <button
              onClick={() => {
                onOpenAuth('signup');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-950 bg-emerald-400 rounded-xl"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
