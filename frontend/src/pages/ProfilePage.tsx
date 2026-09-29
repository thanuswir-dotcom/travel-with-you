import React, { useState, useEffect } from 'react';
import { 
  User, Mail, School, MapPin, Heart, Compass, Camera, Wallet, 
  Sparkles, ShieldCheck, Check, LogOut, Award, ChevronRight 
} from 'lucide-react';
import type { ActiveTab, UserProfile } from '../types';
import { updateProfileBackend } from '../utils/api';

interface ProfilePageProps {
  user: UserProfile;
  savedCount: number;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

const AVAILABLE_VIBES = [
  { id: 'cafes', label: '☕ Cozy Cafes' },
  { id: 'study_spots', label: '📚 Study & Work' },
  { id: 'street_food', label: '🍕 Street Food' },
  { id: 'parks_nature', label: '🌳 Green Escapes' },
  { id: 'theatres', label: '🎬 Theatre & Movies' },
  { id: 'entertainment', label: '🎮 Gaming & Bowling' },
  { id: 'viewpoints', label: '🌅 Sunset Viewpoints' },
  { id: 'photo_spots', label: '📸 Aesthetic Photo Walks' },
  { id: 'weekend_trips', label: '🔥 Weekend Treks' },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  savedCount,
  setActiveTab,
  onLogout,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName || 'Student Traveler');
  const [collegeName, setCollegeName] = useState(user.collegeName || 'Campus University');
  const [city, setCity] = useState(user.city || 'All India');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(
    user.preferredVibe || ['cafes', 'study_spots', 'street_food', 'photo_spots']
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if user changes
  React.useEffect(() => {
    if (user.fullName) setFullName(user.fullName);
    if (user.collegeName) setCollegeName(user.collegeName);
    if (user.city) setCity(user.city);
    if (user.preferredVibe) setSelectedVibes(user.preferredVibe);
  }, [user]);

  const toggleVibe = (id: string) => {
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const updatedUser: UserProfile = {
      ...user,
      fullName: fullName.trim() || 'Student Traveler',
      collegeName: collegeName.trim() || 'Campus University',
      city: city.trim() || 'All India',
      preferredVibe: selectedVibes,
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    try {
      await updateProfileBackend({
        id: user.id,
        fullName: updatedUser.fullName,
        collegeName: updatedUser.collegeName,
        city: updatedUser.city,
        preferredVibe: updatedUser.preferredVibe,
        avatarUrl: user.avatarUrl
      });
    } catch (err) {
      console.warn('Profile save notice:', err);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Profile Header Card */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar with Badge */}
          <div className="relative">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold" title="Verified College Student">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{fullName}</h1>
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  {user.email || 'student@travelwithyou.com'}
                </p>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-amber-400" />
                {collegeName}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Campus Base: {city}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                Student Tier
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
          <div 
            onClick={() => setActiveTab('saved')}
            className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center hover:border-emerald-500/30 cursor-pointer transition-colors"
          >
            <div className="text-xl font-black text-rose-400">{savedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              Saved Places
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('planner')}
            className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center hover:border-emerald-500/30 cursor-pointer transition-colors"
          >
            <div className="text-xl font-black text-emerald-400">4</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
              <Compass className="w-3 h-3 text-emerald-400" />
              Trips Planned
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('memories')}
            className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center hover:border-emerald-500/30 cursor-pointer transition-colors"
          >
            <div className="text-xl font-black text-cyan-400">3</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
              <Camera className="w-3 h-3 text-cyan-400" />
              Memories Logged
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('budget')}
            className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center hover:border-emerald-500/30 cursor-pointer transition-colors"
          >
            <div className="text-xl font-black text-amber-400">₹850</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
              <Wallet className="w-3 h-3 text-amber-400" />
              Budget Saved
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-4 mb-8 animate-in fade-in">
          <h3 className="text-lg font-bold text-white mb-2">Update Student Profile</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">College / University Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Home / Campus City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {saveSuccess && (
        <div className="mb-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center">
          ✓ Profile updated successfully!
        </div>
      )}

      {/* Favorite Vibes & Preferences */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Your Travel & Hangout Preferences</h3>
          </div>
          <p className="text-xs text-slate-400">
            Travel With You personalizes suggestions on the homepage and AI planner based on these tags.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {AVAILABLE_VIBES.map((vibe) => {
            const isSelected = selectedVibes.includes(vibe.id);
            return (
              <button
                key={vibe.id}
                type="button"
                onClick={() => toggleVibe(vibe.id)}
                className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{vibe.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div 
          onClick={() => setActiveTab('saved')}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 flex items-center justify-between cursor-pointer group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                My Saved Wishlist
              </h4>
              <p className="text-xs text-slate-400">View and share your {savedCount} favorite spots</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </div>

        <div 
          onClick={() => setActiveTab('memories')}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 flex items-center justify-between cursor-pointer group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Travel Memories Gallery
              </h4>
              <p className="text-xs text-slate-400">Your college outings photo timeline</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

    </div>
  );
};
