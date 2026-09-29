import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, WifiOff, Share, CheckCircle2 } from 'lucide-react';
import { subscribeToInstallPrompt, promptPWAInstall, isAppInstalled, isIOS } from '../utils/pwa';

export const PWAInstallBanner: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [showIosTip, setShowIosTip] = useState(false);

  useEffect(() => {
    // Check if dismissed before
    const dismissed = localStorage.getItem('twy_pwa_dismissed');
    if (dismissed && Date.now() - Number(dismissed) < 1000 * 60 * 60 * 24 * 3) {
      setIsDismissed(true);
    }

    setInstalled(isAppInstalled());

    // Subscribe to install prompt
    const unsubscribe = subscribeToInstallPrompt((available) => {
      setCanInstall(available);
    });

    // Check iOS prompt
    if (isIOS() && !isAppInstalled() && !dismissed) {
      setShowIosTip(true);
    }

    // Online / Offline listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    const success = await promptPWAInstall();
    if (success) {
      setInstalled(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('twy_pwa_dismissed', String(Date.now()));
  };

  return (
    <>
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/95 backdrop-blur-md text-slate-950 font-medium px-4 py-2 text-center text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition-all animate-in slide-in-from-top duration-300">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
          <span>You are currently offline. Showing cached student spots and saved trips.</span>
          <button 
            onClick={() => window.location.reload()} 
            className="ml-2 px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-semibold text-xs hover:bg-slate-900 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Android / Desktop / Chrome Install Banner */}
      {!installed && !isDismissed && canInstall && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-slate-900/95 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/40 shadow-lg shadow-amber-500/20 bg-[#fcf9f2] shrink-0">
              <img 
                src="/logo.png" 
                alt="Travel With You Logo" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-semibold text-sm text-white">Install Travel With You</h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FREE APP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Add to your home screen for 1-tap access and offline travel exploration!
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install App
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium hover:bg-slate-800 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Tip Banner */}
      {!installed && !isDismissed && showIosTip && !canInstall && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40 bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Share className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-xs text-white">Install on iPhone / iPad</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Tap the <span className="font-semibold text-cyan-300">Share</span> button at the bottom of Safari, then select <span className="font-semibold text-white">"Add to Home Screen"</span>.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Installed Confirmation Notification */}
      {installed && (
        <div className="fixed bottom-4 right-4 z-40 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs shadow-lg backdrop-blur-md">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>App installed & ready offline</span>
        </div>
      )}
    </>
  );
};
