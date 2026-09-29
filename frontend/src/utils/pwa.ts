// PWA Registration & Utility Hooks

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Global reference for install prompt
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const installListeners = new Set<(canInstall: boolean) => void>();

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('⚡ [PWA] Service Worker registered with scope:', reg.scope);

          // Check for worker updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 [PWA] New version available! Reloading for fresh experience.');
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('⚠️ [PWA] Service Worker registration failed:', err);
        });
    });

    // Capture install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      notifyInstallListeners(true);
    });

    // App installed event
    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      notifyInstallListeners(false);
      console.log('🎉 [PWA] Travel With You installed successfully!');
    });
  }
}

function notifyInstallListeners(canInstall: boolean) {
  installListeners.forEach((listener) => listener(canInstall));
}

export function subscribeToInstallPrompt(callback: (canInstall: boolean) => void) {
  installListeners.add(callback);
  callback(Boolean(deferredPrompt));
  return () => {
    installListeners.delete(callback);
  };
}

export async function promptPWAInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  notifyInstallListeners(false);
  return choice.outcome === 'accepted';
}

export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}
