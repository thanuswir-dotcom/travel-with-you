import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, School, MapPin, Heart, Compass, Camera, Wallet, 
  Sparkles, ShieldCheck, Check, LogOut, Award, ChevronRight, Upload, Trash2 
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
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl || '');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(
    user.preferredVibe || ['cafes', 'study_spots', 'street_food', 'photo_spots']
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic user stats initialized to 0 for new accounts
  const [tripsPlannedCount, setTripsPlannedCount] = useState<number>(0);
  const [memoriesCount, setMemoriesCount] = useState<number>(0);
  const [budgetSaved, setBudgetSaved] = useState<number>(0);

  useEffect(() => {
    // 1. Calculate memories count for this user
    try {
      const storedMem = localStorage.getItem('twy_memories');
      if (storedMem) {
        const parsed = JSON.parse(storedMem);
        if (Array.isArray(parsed)) {
          const userOnly = parsed.filter(
            (m: any) =>
              m &&
              !['m1', 'm2', 'm3', 'm4', 'm5', 'mem-1', 'mem-2', 'mem-3', 'mem-4'].includes(m.id) &&
              (m.userId === user?.id || m.userName === user?.fullName || m.isUserUploaded)
          );
          setMemoriesCount(userOnly.length);
        } else {
          setMemoriesCount(0);
        }
      } else {
        setMemoriesCount(0);
      }
    } catch {
      setMemoriesCount(0);
    }

    // 2. Calculate trips planned count
    try {
      const storedTrips = localStorage.getItem('twy_trips');
      if (storedTrips) {
        const parsed = JSON.parse(storedTrips);
        if (Array.isArray(parsed)) {
          setTripsPlannedCount(parsed.length);
        } else {
          setTripsPlannedCount(0);
        }
      } else {
        setTripsPlannedCount(0);
      }
    } catch {
      setTripsPlannedCount(0);
    }

    // 3. Calculate budget saved
    try {
      const totalBudget = Number(localStorage.getItem('twy_total_budget') || '0');
      const storedExpenses = localStorage.getItem('twy_budget_expenses');
      let spent = 0;
      if (storedExpenses) {
        const parsed = JSON.parse(storedExpenses);
        if (Array.isArray(parsed)) {
          spent = parsed.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
        }
      }
      if (totalBudget > 0) {
        setBudgetSaved(Math.max(0, totalBudget - spent));
      } else {
        const directSaved = Number(localStorage.getItem('twy_budget_saved') || '0');
        setBudgetSaved(directSaved);
      }
    } catch {
      setBudgetSaved(0);
    }
  }, [user]);

  // Sync state if user changes
  React.useEffect(() => {
    if (user.fullName) setFullName(user.fullName);
    if (user.collegeName) setCollegeName(user.collegeName);
    if (user.city) setCity(user.city);
    if (user.preferredVibe) setSelectedVibes(user.preferredVibe);
    setAvatarUrl(user.avatarUrl || '');
  }, [user]);

  const toggleVibe = (id: string) => {
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Please choose an image under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setAvatarUrl(dataUrl);

        // Instant save if outside full edit mode
        if (!isEditing) {
          const updatedUser: UserProfile = {
            ...user,
            avatarUrl: dataUrl,
          };
          if (onUpdateUser) onUpdateUser(updatedUser);
          updateProfileBackend({
            id: user.id,
            fullName: updatedUser.fullName,
            collegeName: updatedUser.collegeName,
            city: updatedUser.city,
            preferredVibe: updatedUser.preferredVibe,
            avatarUrl: dataUrl,
          }).catch(() => {});
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    if (!isEditing) {
      const updatedUser: UserProfile = {
        ...user,
        avatarUrl: undefined,
      };
      if (onUpdateUser) onUpdateUser(updatedUser);
      updateProfileBackend({
        id: user.id,
        fullName: updatedUser.fullName,
        collegeName: updatedUser.collegeName,
        city: updatedUser.city,
        preferredVibe: updatedUser.preferredVibe,
        avatarUrl: undefined,
      }).catch(() => {});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
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
      avatarUrl: avatarUrl ? avatarUrl.trim() : undefined,
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
        avatarUrl: updatedUser.avatarUrl,
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
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Avatar: uploaded photo OR initials gradient */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-xl"
              />
            ) : (
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl ring-4 ring-emerald-500/30 shadow-xl flex items-center justify-center text-4xl sm:text-5xl font-black text-white select-none"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #0d9488 50%, #0891b2 100%)' }}
              >
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Camera upload button overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -left-2 p-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all cursor-pointer shadow-lg"
              title="Upload profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>

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
            <div className="text-xl font-black text-emerald-400">{tripsPlannedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
              <Compass className="w-3 h-3 text-emerald-400" />
              Trips Planned
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('memories')}
            className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center hover:border-emerald-500/30 cursor-pointer transition-colors"
          >
            <div className="text-xl font-black text-cyan-400">{memoriesCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
              <Camera className="w-3 h-3 text-cyan-400" />
              Memories Logged
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('budget')}
            className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center hover:border-emerald-500/30 cursor-pointer transition-colors"
          >
            <div className="text-xl font-black text-amber-400">₹{budgetSaved}</div>
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

          {/* Profile Photo Section */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/40"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white ring-2 ring-emerald-500/40"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #0d9488 50%, #0891b2 100%)' }}
                >
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold text-white mb-1">Profile Photo</p>
              <p className="text-[11px] text-slate-400 mb-3">
                {avatarUrl ? 'Your photo is set. You can change or remove it.' : 'No photo set yet. Upload a picture from your device.'}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/25 transition-colors cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  Upload Picture
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-semibold hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

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
              {isSaving ? 'Saving...' : 'Save Changes'}
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
