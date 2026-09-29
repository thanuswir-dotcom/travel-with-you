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

import { INITIAL_FEATURED_PLACES } from './utils/constants';
import { toggleSavePlaceBackend } from './utils/api';
import type { ActiveTab, AuthMode, LocationState, Place, UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [isDemoMode] = useState(true);

  // Authenticated Student User state (Defaults to verified student for seamless hackathon demo)
  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr-student-1',
    email: 'pooja.student@rvce.edu',
    fullName: 'Pooja Sharma',
    collegeName: 'RV College of Engineering',
    city: 'Bengaluru',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    preferredVibe: ['cafes', 'study_spots', 'street_food', 'photo_spots'],
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

  // Current Location State (Default: Bengaluru Student District)
  const [location, setLocation] = useState<LocationState>({
    city: 'Bengaluru',
    area: 'Church Street & Central',
    latitude: 12.9749,
    longitude: 77.6082,
    isDetected: false,
  });

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

  // Browser Geolocation Detection with safe error handling
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotification('Geolocation is not supported by your browser. Using Bengaluru student hub.');
      setTimeout(() => setLocationNotification(null), 4000);
      return;
    }

    setLocationNotification('Detecting your current location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          city: 'Bengaluru',
          area: 'Nearby Campus Area',
          latitude,
          longitude,
          isDetected: true,
        });
        setLocationNotification('✓ Location detected! Showing student places near you.');
        setTimeout(() => setLocationNotification(null), 3000);
      },
      (error) => {
        console.warn('Geolocation denied or unavailable:', error.message);
        setLocationNotification('Location access was denied. Showing Bengaluru student hub.');
        setTimeout(() => setLocationNotification(null), 4000);
      },
      { timeout: 8000 }
    );
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

        {activeTab === 'profile' && user && (
          <ProfilePage
            user={user}
            savedCount={savedPlaceIds.length}
            setActiveTab={setActiveTab}
            onLogout={() => setUser(null)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPlaceIds.length}
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
            onSuccess={(u) => {
              setUser(u);
              setAuthMode(null);
            }}
            onSwitchToSignup={() => setAuthMode('signup')}
            onClose={() => setAuthMode(null)}
          />
        </div>
      )}

      {authMode === 'signup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <SignupForm
            onSuccess={(u) => {
              setUser(u);
              setAuthMode(null);
            }}
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
