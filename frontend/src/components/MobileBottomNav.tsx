import React from 'react';
import { Home, Compass, Map, GraduationCap, Heart, Camera } from 'lucide-react';
import type { ActiveTab } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
}) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'explore' as ActiveTab, label: 'Explore', icon: Compass },
    { id: 'map' as ActiveTab, label: 'Map', icon: Map },
    { id: 'planner' as ActiveTab, label: 'Student', icon: GraduationCap },
    { id: 'saved' as ActiveTab, label: 'Saved', icon: Heart, count: savedCount },
    { id: 'memories' as ActiveTab, label: 'Memories', icon: Camera },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 ${
              isActive 
                ? 'text-emerald-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
            <span className="text-[10px] mt-0.5">{tab.label}</span>

            {tab.count !== undefined && tab.count > 0 && (
              <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
