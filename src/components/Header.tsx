import React, { useState } from 'react';
import { 
  Search, 
  Moon, 
  Sun, 
  Heart, 
  ShieldCheck, 
  DownloadCloud, 
  Sparkles, 
  Layers, 
  Flame, 
  Type, 
  Grid,
  X,
  Menu
} from 'lucide-react';
import { ActiveTab } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  isDarkMode,
  setIsDarkMode,
  isAdmin,
  onOpenAdmin,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors bg-white/95 border-b border-[#102A35]/10 shadow-[0_2px_12px_rgba(16,42,53,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          
          {/* Brand Logo & Name */}
          <button 
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none shrink-0"
          >
            {/* FR inside minimal rounded-square icon */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#102A35] flex items-center justify-center shadow-md shadow-[#102A35]/15 group-hover:bg-[#183E4E] transition-colors">
              <span className="font-extrabold text-white text-base tracking-wider font-sans">
                FR
              </span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#3F747C] border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-heading font-bold text-xl sm:text-2xl tracking-tight text-[#102A35]">
                  FR Stickers <span className="font-sans font-light text-[#3F747C]">Hub</span>
                </span>
              </div>
              <p className="text-[11px] text-[#60747B] hidden sm:block font-medium tracking-wide">
                Stickers & Stylish Fonts
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'home' 
                  ? 'bg-[#102A35] text-white shadow-sm' 
                  : 'text-[#60747B] hover:text-[#102A35] hover:bg-[#F8F7F2]'
              }`}
            >
              Home
            </button>

            <button
              id="nav-stickers"
              onClick={() => handleNavClick('stickers')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'stickers' 
                  ? 'bg-[#102A35] text-white shadow-sm' 
                  : 'text-[#60747B] hover:text-[#102A35] hover:bg-[#F8F7F2]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Stickers</span>
            </button>

            <button
              id="nav-fonts"
              onClick={() => handleNavClick('fonts')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'fonts' 
                  ? 'bg-[#102A35] text-white shadow-sm' 
                  : 'text-[#60747B] hover:text-[#102A35] hover:bg-[#F8F7F2]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Fonts</span>
            </button>

            <button
              id="nav-trending"
              onClick={() => handleNavClick('trending')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'trending' 
                  ? 'bg-[#102A35] text-white shadow-sm' 
                  : 'text-[#60747B] hover:text-[#102A35] hover:bg-[#F8F7F2]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Trending</span>
            </button>

            <button
              id="nav-categories"
              onClick={() => handleNavClick('categories')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'categories' 
                  ? 'bg-[#102A35] text-white shadow-sm' 
                  : 'text-[#60747B] hover:text-[#102A35] hover:bg-[#F8F7F2]'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#3F747C]" />
              <span>Categories</span>
            </button>
          </nav>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Search icon trigger for Mobile/Tablet */}
            <button
              id="mobile-search-btn"
              onClick={() => handleNavClick('search')}
              className="p-2 rounded-xl text-[#60747B] hover:text-[#102A35] hover:bg-[#F8F7F2] transition-colors focus:outline-none"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Favorites Icon */}
            <button
              id="favorites-btn"
              onClick={() => handleNavClick('favorites')}
              className={`relative p-2 rounded-xl transition-colors focus:outline-none ${
                activeTab === 'favorites' 
                  ? 'text-rose-600 bg-rose-50' 
                  : 'text-[#60747B] hover:text-rose-600 hover:bg-[#F8F7F2]'
              }`}
              title="Your Saved Favorites"
              aria-label="Favorites"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={favoritesCount > 0 ? 'currentColor' : 'none'} />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#102A35] text-[9px] font-bold text-white flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* PWA Install Button */}
            {!isInstalled && isInstallable && (
              <button
                id="pwa-install-header-btn"
                onClick={install}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#102A35] text-white text-xs font-semibold shadow hover:bg-[#183E4E] transition-colors"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-[#DCEFF2]" />
                <span>Install</span>
              </button>
            )}

            {!isInstalled && isIOS && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#102A35]/15 text-[#102A35] text-xs font-medium hover:bg-[#F8F7F2]"
              >
                iOS App
              </button>
            )}

            {/* Admin Portal Toggle */}
            <button
              id="admin-portal-header-btn"
              onClick={onOpenAdmin}
              className={`p-2 rounded-xl transition-colors focus:outline-none flex items-center gap-1 text-xs font-medium ${
                isAdmin 
                  ? 'bg-[#102A35] text-white shadow-sm' 
                  : 'text-[#60747B] hover:text-[#102A35] hover:bg-[#F8F7F2]'
              }`}
              title={isAdmin ? 'Admin Dashboard' : 'Admin Login'}
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xl:inline">{isAdmin ? 'Admin' : 'Owner'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#60747B] hover:text-[#102A35] hover:bg-[#F8F7F2] md:hidden focus:outline-none"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-2 bg-[#F8F7F2] border-b border-[#102A35]/10 text-[#102A35]">
          <div className="pb-3 border-b border-[#102A35]/10">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60747B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setActiveTab('search');
                }}
                placeholder="Search stickers, fonts, memes..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white rounded-xl border border-[#102A35]/15 text-[#102A35] placeholder-[#60747B] focus:outline-none focus:border-[#102A35]"
              />
            </div>
          </div>

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              activeTab === 'home' ? 'bg-[#102A35] text-white font-semibold' : 'hover:bg-white text-[#102A35]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('stickers')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              activeTab === 'stickers' ? 'bg-[#102A35] text-white font-semibold' : 'hover:bg-white text-[#102A35]'
            }`}
          >
            Stickers Gallery
          </button>
          <button
            onClick={() => handleNavClick('fonts')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              activeTab === 'fonts' ? 'bg-[#102A35] text-white font-semibold' : 'hover:bg-white text-[#102A35]'
            }`}
          >
            Stylish Fonts
          </button>
          <button
            onClick={() => handleNavClick('trending')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              activeTab === 'trending' ? 'bg-[#102A35] text-white font-semibold' : 'hover:bg-white text-[#102A35]'
            }`}
          >
            Trending Stickers
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              activeTab === 'categories' ? 'bg-[#102A35] text-white font-semibold' : 'hover:bg-white text-[#102A35]'
            }`}
          >
            All Categories
          </button>

          {isInstallable && (
            <button
              onClick={() => {
                install();
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#102A35] text-white font-semibold text-sm shadow-md"
            >
              <DownloadCloud className="w-4 h-4 text-[#DCEFF2]" />
              Install FR Stickers App
            </button>
          )}
        </div>
      )}

      {/* iOS Install Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#102A35]/10 text-[#102A35]">
            <h3 className="text-lg font-serif-heading font-bold text-[#102A35] mb-2">Install on iPhone / iPad</h3>
            <p className="text-sm text-[#60747B] leading-relaxed">
              1. Tap the <strong className="text-[#102A35]">Share</strong> button in Safari.<br />
              2. Scroll down and tap <strong className="text-[#3F747C]">Add to Home Screen</strong>.<br />
              3. Enjoy FR Stickers Hub anytime as a standalone app!
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#102A35] py-2.5 text-sm font-semibold text-white hover:bg-[#183E4E]"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
