import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  Smartphone, 
  Mail, 
  CheckCircle2 
} from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import type { UserProfile } from '../../types';

interface AuthPageProps {
  onSuccess: (user: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Top Simple Brand Header */}
      <header className="w-full border-b border-slate-900 bg-slate-950/60 backdrop-blur-xl px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400/40 shadow-lg shadow-amber-500/20 bg-[#fcf9f2] flex items-center justify-center shrink-0">
            <img 
              src="/logo.png" 
              alt="Travel With You Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
              Travel With You
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              India Edition
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="hidden sm:inline">Secure Student Authentication</span>
        </div>
      </header>

      {/* Main Center Content Box */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 z-10">
        <div className="w-full max-w-lg">
          
          {/* Headline and Welcome */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-3 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Explore All 28 States & 8 Union Territories</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {authMode === 'login' ? 'Welcome to Travel With You' : 'Create Student Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
              {authMode === 'login' 
                ? 'Sign in to unlock destination search, budget itineraries, live student maps, and AI trip planning.'
                : 'Join fellow students discovering budget spots, cafes with Wi-Fi, and weekend squad trips.'}
            </p>
          </div>

          {/* Card Container */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-2xl">
            {/* Top Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Active Form */}
            {authMode === 'login' ? (
              <LoginForm
                onSuccess={onSuccess}
                onSwitchToSignup={() => setAuthMode('signup')}
                onClose={() => {}}
              />
            ) : (
              <SignupForm
                onSuccess={onSuccess}
                onSwitchToLogin={() => setAuthMode('login')}
                onClose={() => {}}
              />
            )}
          </div>

          {/* Features Highlights Below Box */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 text-center text-[11px] text-slate-400">
            <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/50 flex flex-col items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pan-India Coverage</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/50 flex flex-col items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
              <span>Student Budgets</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/50 flex flex-col items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Spots</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>Travel With Me • Student Travel & Discovery Engine • 28 States & 8 UTs</p>
      </footer>
    </div>
  );
};
