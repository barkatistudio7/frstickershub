import React from 'react';
import { Home, Flame, Layers, Type, MoreHorizontal } from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'trending' as ActiveTab, label: 'Trending', icon: Flame },
    { id: 'stickers' as ActiveTab, label: 'Stickers', icon: Layers },
    { id: 'fonts' as ActiveTab, label: 'Fonts', icon: Type },
    { id: 'categories' as ActiveTab, label: 'More', icon: MoreHorizontal },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#102A35]/10 backdrop-blur-xl bg-white/95 text-[#60747B] shadow-[0_-4px_20px_rgba(16,42,53,0.06)]">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all relative ${
                isActive 
                  ? 'text-[#102A35] font-bold' 
                  : 'hover:text-[#102A35]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#102A35]' : 'text-[#60747B]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3F747C]" />
                )}
              </div>
              <span className="text-[10px] mt-1 font-semibold uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
