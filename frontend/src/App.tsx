import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HackathonDemoBanner } from './components/HackathonDemoBanner';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { SurpriseMeModal } from './components/SurpriseMeModal';
import { CitySelectorModal } from './components/CitySelectorModal';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { PWAInstallBanner } from './components/PWAInstallBanner';

import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { MapPage } from './pages/MapPage';
import { PlannerPage } from './pages/PlannerPage';
import { BudgetPage } from './pages/BudgetPage';
import { SavedPage } from './pages/SavedPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { ProfilePage } from './pages/ProfilePage';

import { User } from 'lucide-react';
import { INITIAL_FEATURED_PLACES } from './utils/constants';
import { toggleSavePlaceBackend } from './utils/api';
import { detectLiveLocation } from './utils/location';
import type { ActiveTab, AuthMode, LocationState, Place, UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [isDemoMode] = useState(true);

  // Authenticated Student User state (Defaults to stored session or null so Log In is always available)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('twy_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Saved places IDs persisted in localStorage
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('twy_saved_places');
      return stored ? JSON.parse(stored) : ['p-1', 'p-2', 'p-13'];
    } catch {
      return ['p-1', 'p-2', 'p-13'];
    }
  });

  // Current Location State (Defaults to stored location or Bengaluru Student District)
  const [location, setLocation] = useState<LocationState>(() => {
    try {
      const stored = localStorage.getItem('twy_location');
      return stored ? JSON.parse(stored) : {
        city: 'Bengaluru',
        area: 'Church Street & Central',
        latitude: 12.9749,
        longitude: 77.6082,
        isDetected: false,
      };
    } catch {
      return {
        city: 'Bengaluru',
        area: 'Church Street & Central',
        latitude: 12.9749,
        longitude: 77.6082,
        isDetected: false,
      };
    }
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationNotification, setLocationNotification] = useState<string | null>(null);

  // Modals state
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [surprisePlace, setSurprisePlace] = useState<Place | null>(null);

  // Sync saved places with localStorage & backend
  useEffect(() => {
    try {
      localStorage.setItem('twy_saved_places', JSON.stringify(savedPlaceIds));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [savedPlaceIds]);

  const handleToggleSave = (placeId: string) => {
    setSavedPlaceIds((prev) => {
      const exists = prev.includes(placeId);
      const next = exists ? prev.filter((id) => id !== placeId) : [...prev, placeId];
      toggleSavePlaceBackend(placeId, user?.id || 'usr-1');
      return next;
    });
  };

  // Surprise Me logic
  const handleTriggerSurprise = () => {
    const cityPlaces = INITIAL_FEATURED_PLACES.filter(
      p => p.city.toLowerCase() === location.city.toLowerCase()
    );
    const pool = cityPlaces.length > 0 ? cityPlaces : INITIAL_FEATURED_PLACES;
    const randomPick = pool[Math.floor(Math.random() * pool.length)];
    setSurprisePlace(randomPick);
    setIsSurpriseModalOpen(true);
  };

  // Browser Geolocation Detection with Live Reverse Geocoding
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationNotification('🛰️ Requesting live GPS location from your device...');

    try {
      const liveLoc = await detectLiveLocation();
      setLocation(liveLoc);
      setLocationNotification(`📍 Live location updated: ${liveLoc.area}, ${liveLoc.city}!`);
      setTimeout(() => setLocationNotification(null), 4000);
    } catch (err: any) {
      console.warn('Geolocation error:', err);
      setLocationNotification(`⚠️ ${err.message || 'Could not fetch live location.'}`);
      setTimeout(() => setLocationNotification(null), 4500);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Auto-detect location on load if permission is granted or on initial visit
  useEffect(() => {
    const hasStoredLocation = localStorage.getItem('twy_location');
    if (!hasStoredLocation && typeof navigator !== 'undefined' && navigator.geolocation) {
      handleDetectLocation();
    } else if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        if (status.state === 'granted') {
          handleDetectLocation();
        }
      }).catch(() => {});
    }
  }, []);

  // Auth Handlers (save session to localStorage)
  const handleAuthSuccess = (u: UserProfile) => {
    setUser(u);
    try {
      localStorage.setItem('twy_user', JSON.stringify(u));
    } catch {}
    setAuthMode(null);
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('twy_user');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Hackathon 3-Minute Demo Banner */}
      <HackathonDemoBanner
        setActiveTab={setActiveTab}
        onTriggerSurprise={handleTriggerSurprise}
      />

      {/* Location Toast Notification */}
      {locationNotification && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          {locationNotification}
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        location={location}
        onDetectLocation={handleDetectLocation}
        onOpenAuth={(mode) => setAuthMode(mode)}
        onOpenCitySelector={() => setIsCitySelectorOpen(true)}
        isDemoMode={isDemoMode}
        user={user}
        onLogout={handleLogout}
        isDetectingLocation={isDetectingLocation}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeTab === 'home' && (
          <LandingPage
            location={location}
            setActiveTab={setActiveTab}
            savedPlaceIds={savedPlaceIds}
            onToggleSave={handleToggleSave}
            onViewPlaceDetails={(p) => setSelectedPlace(p)}
            onTriggerSurprise={handleTriggerSurprise}
          />
        )}

        {activeTab === 'explore' && (
          <ExplorePage
            savedPlaceIds={savedPlaceIds}
            onToggleSave={handleToggleSave}
            setActiveTab={setActiveTab}
            onViewPlaceDetails={(p) => setSelectedPlace(p)}
            currentCity={location.city}
          />
        )}

        {activeTab === 'map' && (
          <MapPage
            savedPlaceIds={savedPlaceIds}
            onToggleSave={handleToggleSave}
            onViewPlaceDetails={(p) => setSelectedPlace(p)}
            userLat={location.latitude}
            userLng={location.longitude}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerPage
            city={location.city}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPage />
        )}

        {activeTab === 'saved' && (
          <SavedPage
            savedPlaceIds={savedPlaceIds}
            onToggleSave={handleToggleSave}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'memories' && (
          <MemoriesPage />
        )}

        {activeTab === 'profile' && (
          user ? (
            <ProfilePage
              user={user}
              savedCount={savedPlaceIds.length}
              setActiveTab={setActiveTab}
              onLogout={handleLogout}
            />
          ) : (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Student Profile & Wishlist</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Log in with your Mobile number (OTP) or Gmail ID to manage saved spots, track student squad budgets, and upload memories.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setAuthMode('login')}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    Log In with Mobile / Gmail
                  </button>
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Create New Account
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPlaceIds.length}
        user={user}
        onOpenAuth={(mode) => setAuthMode(mode)}
      />

      {/* Global Floating AI Assistant */}
      <FloatingAIAssistant
        currentCity={location.city}
        onOpenPlanner={() => setActiveTab('planner')}
      />

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isSaved={selectedPlace ? savedPlaceIds.includes(selectedPlace.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Surprise Me Modal */}
      <SurpriseMeModal
        isOpen={isSurpriseModalOpen}
        onClose={() => setIsSurpriseModalOpen(false)}
        place={surprisePlace}
        onReroll={handleTriggerSurprise}
        onSelectPlace={(p) => setSelectedPlace(p)}
      />

      {/* Campus Hub / City Selector Modal */}
      <CitySelectorModal
        isOpen={isCitySelectorOpen}
        onClose={() => setIsCitySelectorOpen(false)}
        currentLocation={location}
        onSelectLocation={(loc) => setLocation(loc)}
        onDetectGPS={handleDetectLocation}
      />

      {/* Authentication Modals */}
      {authMode === 'login' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignup={() => setAuthMode('signup')}
            onClose={() => setAuthMode(null)}
          />
        </div>
      )}

      {authMode === 'signup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <SignupForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setAuthMode('login')}
            onClose={() => setAuthMode(null)}
          />
        </div>
      )}

      {/* Progressive Web App Install & Offline Notification */}
      <PWAInstallBanner />

    </div>
  );
}
