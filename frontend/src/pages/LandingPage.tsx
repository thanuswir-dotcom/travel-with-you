import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { PlaceCard } from '../components/PlaceCard';
import { INITIAL_FEATURED_PLACES, CATEGORIES } from '../utils/constants';
import type { Place, PlaceCategory, ActiveTab, LocationState } from '../types';
import { 
  MapPin, ArrowRight, Sparkles, GraduationCap, DollarSign, Clock, Users,
  Sun, CloudRain, Heart, Compass, Camera, Utensils, Flame, Calendar,
  CheckCircle2, Send, Tag, ChevronRight, ShieldCheck, Dice5
} from 'lucide-react';
import { fetchWeather, sendAIChat, type WeatherData } from '../utils/api';
import { getPlacesWithLiveDistance } from '../utils/location';

interface LandingPageProps {
  location: LocationState;
  setActiveTab: (tab: ActiveTab) => void;
  savedPlaceIds: string[];
  onToggleSave: (placeId: string) => void;
  onViewPlaceDetails: (place: Place) => void;
  onTriggerSurprise: () => void;
  onUpdateLocation?: (loc: LocationState) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  location,
  setActiveTab,
  savedPlaceIds,
  onToggleSave,
  onViewPlaceDetails,
  onTriggerSurprise,
  onUpdateLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  
  // AI recommendation preview state
  const [aiPrompt, setAiPrompt] = useState('Suggest a place to hang out with 4 friends under ₹500');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Budget Filter for Section 6
  const [budgetFilter, setBudgetFilter] = useState<number>(250);

  // Food Filter for Section 8
  const [foodCategory, setFoodCategory] = useState<string>('all');

  // 1. Calculate live geographical distance for all places based on user's live latitude & longitude
  const placesWithDistance = React.useMemo(() => {
    return getPlacesWithLiveDistance(INITIAL_FEATURED_PLACES, location.latitude, location.longitude);
  }, [location.latitude, location.longitude]);

  // 2. Sort all places by true physical proximity to user's live geo coordinates
  const placesSortedByProximity = React.useMemo(() => {
    return [...placesWithDistance].sort((a, b) => {
      return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
    });
  }, [placesWithDistance]);

  // 3. Dynamic AI initial greeting based on nearby spots
  useEffect(() => {
    const nearby = placesSortedByProximity.slice(0, 3);
    if (nearby.length > 0) {
      const suggestions = nearby.map(p => `• **${p.name}** (${p.area || p.city}, ${p.approxCostForOne === 0 ? 'Free' : `₹${p.approxCostForOne}/head`}${p.distanceKm !== undefined ? `, ${p.distanceKm} km away` : ''})`).join('\n');
      setAiResponse(`Here are top student favorites near you in ${location.city} (${location.area}):\n${suggestions}`);
    }
  }, [location.city, location.area, placesSortedByProximity]);

  useEffect(() => {
    fetchWeather(location.city).then((data) => {
      if (data) setWeather(data);
    });
  }, [location.city]);

  const handleAskAI = async (promptText: string) => {
    setAiPrompt(promptText);
    setIsAiLoading(true);
    try {
      const reply = await sendAIChat(promptText, location.city);
      setAiResponse(reply);
    } catch {
      const topPick = placesSortedByProximity[0];
      setAiResponse(`In ${location.city}, check out ${topPick?.name || 'local campus cafes'} (${topPick?.area || location.area}) for great student vibes under ₹200!`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filter places based on search query and category (sorted by true proximity)
  const filteredPlaces = React.useMemo(() => {
    return placesSortedByProximity.filter((place) => {
      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = q === '' || 
        place.name.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q) ||
        place.area.toLowerCase().includes(q) ||
        (place.city && place.city.toLowerCase().includes(q)) ||
        (place.state && place.state.toLowerCase().includes(q)) ||
        place.studentPerks.some((p) => p.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [placesSortedByProximity, selectedCategory, searchQuery]);

  // Section 6: Student Budget Picks (<₹100, <₹250, <₹500, Free) sorted by proximity
  const budgetPicks = React.useMemo(() => {
    return placesSortedByProximity.filter(p => {
      if (budgetFilter === 0) return p.approxCostForOne === 0;
      return p.approxCostForOne <= budgetFilter;
    }).slice(0, 4);
  }, [placesSortedByProximity, budgetFilter]);

  // Section 8: Food Explorer Places sorted by proximity
  const foodPlaces = React.useMemo(() => {
    return placesSortedByProximity.filter(p => {
      if (p.category !== 'street_food' && p.category !== 'restaurants' && p.category !== 'cafes') return false;
      if (foodCategory === 'street') return p.category === 'street_food';
      if (foodCategory === 'cafe') return p.category === 'cafes';
      if (foodCategory === 'under100') return p.approxCostForOne <= 100;
      return true;
    }).slice(0, 4);
  }, [placesSortedByProximity, foodCategory]);

  // Section 9: Weekend Explorer Places sorted by proximity
  const weekendPlaces = React.useMemo(() => {
    return placesSortedByProximity.filter(p => 
      p.category === 'weekend_trips' || p.category === 'viewpoints'
    ).slice(0, 3);
  }, [placesSortedByProximity]);

  return (
    <div className="min-h-screen text-slate-100">
      
      {/* ── SECTION 1: HERO SECTION ─────────────────────────────────────────── */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={(query) => {
          setSearchQuery(query);
          const element = document.getElementById('popular-places');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreClick={() => {
          const element = document.getElementById('explore-categories');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        onStudentModeClick={() => setActiveTab('planner')}
        onSurpriseMeClick={onTriggerSurprise}
        onSelectPlace={onViewPlaceDetails}
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
          setSearchQuery(loc.name);
          const element = document.getElementById('popular-places');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        currentCity={location.city}
        userLat={location.latitude}
        userLng={location.longitude}
      />

      {/* ── ACTIVE TARGET LOCATION NOTICE ─────────────────────────────────── */}
      {location.isDetected && location.latitude && location.longitude && (
        <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900/80 to-teal-950/50 border-y border-emerald-500/20 py-2.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                Active Target: <strong className="text-white">{location.area}</strong>, {location.city}
              </span>
              <span className="hidden sm:inline-block font-mono text-[11px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
              </span>
              <span className="text-slate-400 hidden md:inline">
                • Real-time distance and nearby places recalculated
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('map')}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 2: SEARCH QUICK PILLS ──────────────────────────────────── */}
      <section className="py-4 border-y border-slate-800/80 bg-slate-950/60 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Quick Searches:
          </span>
          {[
            'Restaurants near me 🍔',
            'Best theatre near me 🎬',
            'Places to visit this weekend 🏔️',
            'Cheap food near me 🍕',
            'Best places for friends 👥',
            'Peaceful places to visit 🍃',
            'Places under ₹500 💰',
          ].map((pill, i) => (
            <button
              key={i}
              onClick={() => {
                const clean = pill.split(' ')[0] + ' ' + (pill.split(' ')[1] || '');
                setSearchQuery(clean);
                const element = document.getElementById('popular-places');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
            >
              {pill}
            </button>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: EXPLORE NEAR YOU (12 CATEGORIES) ────────────────────── */}
      <div id="explore-categories">
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const element = document.getElementById('popular-places');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* ── SECTION 4: AI RECOMMENDATION ENGINE PREVIEW ─────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Input & Prompts */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Travel With You AI Assistant</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Tell AI what you want to do
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our recommendation engine understands student budgets, free hours, and group sizes in {location.city}. No generic search — genuine student plans.
              </p>

              {/* Sample Prompts Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'Suggest a place to hang out with 4 friends under ₹500',
                  'I have 3 hours free today',
                  'I want a peaceful place',
                  'Plan a cheap evening with my friends',
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskAI(sample)}
                    className="text-left px-3 py-1.5 rounded-xl bg-slate-950/70 hover:bg-purple-900/40 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    “{sample}”
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (aiPrompt.trim()) handleAskAI(aiPrompt);
                }}
                className="flex items-center gap-2 pt-2"
              >
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask Travel With You AI..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-purple-500/30 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  disabled={isAiLoading}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>

            {/* Right: AI Output Mockup / Card */}
            <div className="lg:col-span-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-3 font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold">
                      AI
                    </div>
                    <span className="text-xs font-bold text-white">Live AI Recommendation</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                    ✓ Verified Student Places
                  </span>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed min-h-[90px] whitespace-pre-line">
                  {isAiLoading ? (
                    <div className="flex items-center gap-2 text-slate-400 py-6">
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      <span>AI is crunching nearby student options...</span>
                    </div>
                  ) : (
                    aiResponse
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Want a complete multi-stop schedule?</span>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="text-purple-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch AI Day Planner</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: POPULAR NEARBY (PLACE CARDS) ─────────────────────────── */}
      <section id="popular-places" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Campus Hotspots in {location.area}, {location.city}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {searchQuery ? `Results for "${searchQuery}"` : selectedCategory !== 'all' ? `Category: ${selectedCategory.replace('_', ' ')}` : 'Top Student Picks Nearby'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Affordable, tested, and loved by college students in {location.city}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={() => setActiveTab('explore')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-emerald-400 border border-slate-800 transition-colors cursor-pointer"
            >
              <span>View All Places</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Place Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.slice(0, 6).map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isSaved={savedPlaceIds.includes(place.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewPlaceDetails}
            />
          ))}
        </div>
      </section>

      {/* ── SECTION 6: STUDENT BUDGET PICKS ─────────────────────────────────── */}
      <section className="py-12 bg-slate-950/80 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Pocket-Friendly Pocket Champions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Student Budget Picks 🎓
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Zero broke moments. Curated spots that cost less than your campus canteen bill.
              </p>
            </div>

            {/* Budget Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              {[
                { label: 'Free Spots', val: 0 },
                { label: '< ₹100', val: 100 },
                { label: '< ₹250', val: 250 },
                { label: '< ₹500', val: 500 },
              ].map((btn) => (
                <button
                  key={btn.val}
                  onClick={() => setBudgetFilter(btn.val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    budgetFilter === btn.val
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {budgetPicks.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isSaved={savedPlaceIds.includes(place.id)}
                onToggleSave={onToggleSave}
                onViewDetails={onViewPlaceDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: THINGS TO DO TODAY (WEATHER-SMART) ────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Weather-Aware Recommendations</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Things To Do Today in {location.city}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {weather?.advice || '☀️ 27°C Sunny — Ideal for checking out Cubbon Park lawns, sunset viewpoints, and evening street food with friends!'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTriggerSurprise}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Dice5 className="w-4 h-4 text-emerald-400" />
              <span>Surprise Me 🎲</span>
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-colors"
            >
              <span>Explore Today's Best</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: FOOD EXPLORER ────────────────────────────────────────── */}
      <section className="py-12 bg-slate-950/80 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-2">
                <Utensils className="w-3.5 h-3.5" />
                <span>Student Foodie Headquarters</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Food Explorer 🍴
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                From crispy butter masala dosas to late-night shawarma and study coffee.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Eats' },
                { id: 'street', label: 'Street Food' },
                { id: 'cafe', label: 'Cafés' },
                { id: 'under100', label: 'Under ₹100' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFoodCategory(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    foodCategory === f.id
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {foodPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isSaved={savedPlaceIds.includes(place.id)}
                onToggleSave={onToggleSave}
                onViewDetails={onViewPlaceDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: WEEKEND EXPLORER ─────────────────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Saturday & Sunday Adventures</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Weekend Explorer 🔥
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Short getaways, day-trip treks, and nature view points without expensive bookings.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 cursor-pointer"
          >
            <span>See all weekend destinations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weekendPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isSaved={savedPlaceIds.includes(place.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewPlaceDetails}
            />
          ))}
        </div>
      </section>

      {/* ── SECTION 10: AI TRIP PLANNER ("PLAN MY DAY") ─────────────────────── */}
      <section className="py-12 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>Interactive Student Mode</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Plan An Entire Day for ₹500
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Enter your budget, headcount, and hours. AI divides expenses between food, transit, and activities with a live Budget Guardian warning.
          </p>

          {/* Sample Interactive Itinerary Mock */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-left max-w-2xl mx-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-extrabold text-sm text-white">One-Day Student Adventure</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                Est. ₹240 / person
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="font-mono text-purple-400 font-bold shrink-0">10:00 AM</span>
                <div>
                  <strong className="text-white">Blossom Book House & Filter Coffee</strong>
                  <p className="text-slate-400 text-[11px]">Second-hand book browsing on Church Street (₹60)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-purple-400 font-bold shrink-0">12:30 PM</span>
                <div>
                  <strong className="text-white">Koshy's Heritage Lunch</strong>
                  <p className="text-slate-400 text-[11px]">Appam stew and iced tea with the squad (₹110)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-purple-400 font-bold shrink-0">03:00 PM</span>
                <div>
                  <strong className="text-white">Cubbon Park Bamboo Grove Walk</strong>
                  <p className="text-slate-400 text-[11px]">Frisbee and guitar session under the canopy (Free)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-purple-400 font-bold shrink-0">06:00 PM</span>
                <div>
                  <strong className="text-white">VV Puram Street Food Feast</strong>
                  <p className="text-slate-400 text-[11px]">Paddle dosas and rabdi jalebi finish (₹70)</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-xs">Total Group: ₹720 for 3 friends</span>
              <button
                onClick={() => setActiveTab('planner')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
              >
                Customize Your Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 11 & 12: TRAVEL MEMORIES JOURNAL ────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Campus Diaries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Student Travel Memories 📸
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Save photos, hostel friend tags, and capture the story of your college years.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('memories')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-cyan-400 border border-slate-800 transition-colors cursor-pointer"
          >
            <span>Open Memories Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Sunrise at Nandi Hills 🌅',
              place: 'Nandi Hills',
              date: 'Sep 15, 2026',
              note: '4 AM bike ride with 5 hostel mates. Rolling cloud mist was insane!',
              img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
              tags: ['#sunrise', '#squad', '#nandi']
            },
            {
              title: 'VV Puram Food Challenge 🍕',
              place: 'Food Street',
              date: 'Sep 18, 2026',
              note: 'Ate 4 dosas and rabdi jalebi. ₹130 per person and 100% full!',
              img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
              tags: ['#foodie', '#budgetwin']
            },
            {
              title: 'Library Hunt at Blossom 📚',
              place: 'Church Street',
              date: 'Sep 22, 2026',
              note: 'Got 3 textbooks for ₹300 total with student ID discount.',
              img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
              tags: ['#books', '#churchstreet']
            },
          ].map((mem, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab('memories')}
              className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-slate-800">
                <img
                  src={mem.img}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-white">
                  {mem.place}
                </span>
                <span className="absolute bottom-3 right-3 text-[11px] text-slate-300">
                  {mem.date}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  {mem.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {mem.note}
                </p>
                <div className="flex gap-2 pt-1">
                  {mem.tags.map((t, i) => (
                    <span key={i} className="text-[10px] text-cyan-400 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
