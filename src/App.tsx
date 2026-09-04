import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Sparkles, 
  Layers, 
  Type, 
  Heart, 
  Search, 
  Download, 
  ArrowRight, 
  Grid, 
  SlidersHorizontal,
  X,
  Share2,
  Check
} from 'lucide-react';
import { StickerItem, FontItem, ActiveTab, CategoryMeta, AdSettings } from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StickerCard } from './components/StickerCard';
import { StickerDetailModal } from './components/StickerDetailModal';
import { FontCard } from './components/FontCard';
import { FontDetailModal } from './components/FontDetailModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdBanner } from './components/AdBanner';
import { StaticPages } from './components/StaticPages';
import { stylishConverters } from './utils/unicodeFonts';

const FAVORITES_STORAGE_KEY = 'fr_stickers_favorites';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Data states
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [fonts, setFonts] = useState<FontItem[]>([]);
  const [categories, setCategories] = useState<CategoryMeta[]>([]);
  const [adSettings, setAdSettings] = useState<AdSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Modals state
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(null);
  const [selectedFont, setSelectedFont] = useState<FontItem | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Interactive Live Font Preview Input Text
  const [customFontInput, setCustomFontInput] = useState('Write Your Text Here');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Check admin session on load
  useEffect(() => {
    api.adminVerify().then(valid => setIsAdminLoggedIn(valid));
  }, []);

  // Fetch initial content from API
  const loadContent = async () => {
    setIsLoading(true);
    try {
      const [stickersData, fontsData, catData, adsData] = await Promise.all([
        api.getStickers(),
        api.getFonts(),
        api.getCategories(),
        api.getAdSettings()
      ]);
      setStickers(stickersData);
      setFonts(fontsData);
      setCategories(catData.categories || []);
      setAdSettings(adsData);
    } catch (err) {
      console.error('Failed loading data from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Toggle favorite
  const handleToggleFavorite = (e: React.MouseEvent | string, id?: string) => {
    const targetId = typeof e === 'string' ? e : id;
    if (typeof e !== 'string') e.stopPropagation();
    if (!targetId) return;

    setFavorites(prev => 
      prev.includes(targetId) ? prev.filter(item => item !== targetId) : [...prev, targetId]
    );
  };

  // Download Action for Stickers
  const handleDownloadSticker = async (sticker: StickerItem) => {
    api.track('sticker', sticker.id, 'download');
    const link = document.createElement('a');
    link.href = sticker.imageUrl;
    link.download = `${sticker.slug || 'sticker'}.${sticker.format || 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, downloadsCount: s.downloadsCount + 1 } : s));
    if (selectedSticker && selectedSticker.id === sticker.id) {
      setSelectedSticker(prev => prev ? { ...prev, downloadsCount: prev.downloadsCount + 1 } : null);
    }
  };

  // Download Action for Fonts
  const handleDownloadFont = async (font: FontItem) => {
    api.track('font', font.id, 'download');
    const link = document.createElement('a');
    link.href = font.fontFileUrl;
    link.download = `${font.slug || 'font'}.${font.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFonts(prev => prev.map(f => f.id === font.id ? { ...f, downloadsCount: f.downloadsCount + 1 } : f));
    if (selectedFont && selectedFont.id === font.id) {
      setSelectedFont(prev => prev ? { ...prev, downloadsCount: prev.downloadsCount + 1 } : null);
    }
  };

  // Tracking share
  const handleTrackShare = (item: StickerItem | FontItem, type: 'sticker' | 'font') => {
    api.track(type, item.id, 'share');
    if (type === 'sticker') {
      setStickers(prev => prev.map(s => s.id === item.id ? { ...s, sharesCount: s.sharesCount + 1 } : s));
    } else {
      setFonts(prev => prev.map(f => f.id === item.id ? { ...f, sharesCount: f.sharesCount + 1 } : f));
    }
  };

  // Copy unicode font sample
  const handleCopyUnicode = (text: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1800);
    }
  };

  // Filtered Stickers
  const filteredStickers = useMemo(() => {
    return stickers.filter(item => {
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Trending') {
          if (!item.isTrending) return false;
        } else if (selectedCategory === 'Text') {
          if (item.category !== 'Text Stickers' && item.category !== 'Text') return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }
      if (selectedTag && !item.tags.includes(selectedTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchTag = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchCategory && !matchTag) return false;
      }
      if (activeTab === 'trending') return item.isTrending;
      if (activeTab === 'popular') return item.downloadsCount > 800;
      if (activeTab === 'favorites') return favorites.includes(item.id);
      return true;
    });
  }, [stickers, selectedCategory, selectedTag, searchQuery, activeTab, favorites]);

  // Filtered Fonts
  const filteredFonts = useMemo(() => {
    return fonts.filter(item => {
      if (selectedCategory !== 'All' && selectedCategory !== 'Stylish Fonts') {
        if (selectedCategory === 'Trending' && !item.isTrending) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchTag = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchCategory && !matchTag) return false;
      }
      if (activeTab === 'trending') return item.isTrending;
      if (activeTab === 'popular') return item.downloadsCount > 500;
      if (activeTab === 'favorites') return favorites.includes(item.id);
      return true;
    });
  }, [fonts, selectedCategory, searchQuery, activeTab, favorites]);

  // Category Pills defined per design specs
  const categoryPills = [
    { label: 'All', icon: '' },
    { label: 'Trending', icon: '🔥 ' },
    { label: 'Funny', icon: '😂 ' },
    { label: 'Love', icon: '❤️ ' },
    { label: 'Attitude', icon: '😎 ' },
    { label: 'Islamic', icon: '🕌 ' },
    { label: 'Festival', icon: '🎉 ' },
    { label: 'Gaming', icon: '🎮 ' },
    { label: 'Text', icon: '✨ ' },
    { label: 'Animals', icon: '🐱 ' },
  ];

  // Open Admin Portal
  const handleOpenAdminPortal = () => {
    if (isAdminLoggedIn) {
      setActiveTab('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Decorative Stickers for Hero section (top 3 trending or default)
  const decorativeStickers = useMemo(() => {
    return stickers.slice(0, 4);
  }, [stickers]);

  return (
    <div className="min-h-screen bg-[#DCEFF2] text-[#102A35] font-sans antialiased selection:bg-[#3F747C] selection:text-white p-0 sm:p-3 md:p-6 lg:p-8">
      
      {/* Surrounding canvas: The main website content sits inside an elegant, large white/off-white container */}
      <div className="max-w-[1440px] mx-auto bg-[#F8F7F2] rounded-none sm:rounded-[28px] md:rounded-[36px] shadow-[0_20px_60px_rgba(16,42,53,0.06)] border border-[#102A35]/6 overflow-hidden flex flex-col min-h-[calc(100vh-2rem)]">
        
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'search') {
              setSelectedCategory('All');
            }
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          favoritesCount={favorites.length}
          isDarkMode={false}
          setIsDarkMode={() => {}}
          isAdmin={isAdminLoggedIn}
          onOpenAdmin={handleOpenAdminPortal}
        />

        {/* Main Body */}
        <main className="flex-1 pb-16 md:pb-8">
          
          {/* VIEW 1: ADMIN DASHBOARD */}
          {activeTab === 'admin' && isAdminLoggedIn ? (
            <AdminDashboard
              isDarkMode={false}
              onLogout={async () => {
                await api.adminLogout();
                setIsAdminLoggedIn(false);
                setActiveTab('home');
                loadContent();
              }}
            />
          ) : ['about', 'contact', 'privacy', 'terms', 'dmca'].includes(activeTab) ? (
            /* VIEW 2: STATIC LEGAL / INFORMATIONAL PAGES */
            <StaticPages
              page={activeTab as any}
              isDarkMode={false}
              onBackToHome={() => setActiveTab('home')}
            />
          ) : (
            /* VIEW 3: MAIN HUB BROWSING VIEW */
            <div className="space-y-12 sm:space-y-16">
              
              {/* HERO SECTION */}
              {activeTab === 'home' && (
                <section className="relative overflow-hidden bg-[#DCEFF2] border-b border-[#102A35]/8 px-6 sm:px-12 py-16 sm:py-20 md:py-24 text-center">
                  
                  {/* Subtle decorative sticker previews around the hero */}
                  {decorativeStickers[0] && (
                    <div className="hidden lg:block absolute left-8 top-12 w-20 h-20 rounded-2xl bg-white/70 p-2 shadow-sm border border-[#102A35]/5 -rotate-6 transition-transform hover:rotate-0">
                      <img src={decorativeStickers[0].imageUrl} alt="Sticker preview" className="w-full h-full object-contain filter drop-shadow-xs" />
                    </div>
                  )}
                  {decorativeStickers[1] && (
                    <div className="hidden lg:block absolute right-10 top-16 w-22 h-22 rounded-2xl bg-white/70 p-2.5 shadow-sm border border-[#102A35]/5 rotate-6 transition-transform hover:rotate-0">
                      <img src={decorativeStickers[1].imageUrl} alt="Sticker preview" className="w-full h-full object-contain filter drop-shadow-xs" />
                    </div>
                  )}
                  {decorativeStickers[2] && (
                    <div className="hidden xl:block absolute left-16 bottom-10 w-18 h-18 rounded-2xl bg-white/70 p-2 shadow-sm border border-[#102A35]/5 rotate-3 transition-transform hover:rotate-0">
                      <img src={decorativeStickers[2].imageUrl} alt="Sticker preview" className="w-full h-full object-contain filter drop-shadow-xs" />
                    </div>
                  )}
                  {decorativeStickers[3] && (
                    <div className="hidden xl:block absolute right-20 bottom-12 w-20 h-20 rounded-2xl bg-white/70 p-2.5 shadow-sm border border-[#102A35]/5 -rotate-6 transition-transform hover:rotate-0">
                      <img src={decorativeStickers[3].imageUrl} alt="Sticker preview" className="w-full h-full object-contain filter drop-shadow-xs" />
                    </div>
                  )}

                  <div className="relative max-w-3xl mx-auto space-y-6">
                    {/* Small badge */}
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#102A35]/10 text-[#102A35] text-xs font-semibold tracking-wider uppercase shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#3F747C]" />
                      <span>FREE STICKERS & STYLISH FONTS</span>
                    </div>

                    {/* Main heading */}
                    <h1 className="font-serif-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#102A35] tracking-tight leading-tight">
                      FR Stickers Hub
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl text-[#60747B] max-w-xl mx-auto leading-relaxed">
                      Discover beautiful stickers and stylish fonts. Download, save and share them anywhere.
                    </p>

                    {/* Buttons: EXPLORE STICKERS and EXPLORE FONTS (Dark navy buttons with rounded corners) */}
                    <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                      <button
                        id="hero-explore-stickers-btn"
                        onClick={() => {
                          setActiveTab('stickers');
                          const el = document.getElementById('stickers-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-7 py-3.5 rounded-2xl bg-[#102A35] hover:bg-[#183E4E] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#102A35]/15 flex items-center gap-2 transition-all active:scale-95"
                      >
                        <Layers className="w-4 h-4" />
                        <span>EXPLORE STICKERS</span>
                      </button>

                      <button
                        id="hero-explore-fonts-btn"
                        onClick={() => {
                          setActiveTab('fonts');
                          const el = document.getElementById('fonts-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-7 py-3.5 rounded-2xl bg-[#102A35] hover:bg-[#183E4E] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#102A35]/15 flex items-center gap-2 transition-all active:scale-95"
                      >
                        <Type className="w-4 h-4" />
                        <span>EXPLORE FONTS</span>
                      </button>
                    </div>

                    {/* Large elegant search box underneath hero */}
                    <div className="pt-6 max-w-2xl mx-auto">
                      <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#60747B]" />
                        <input
                          id="hero-search-input"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search stickers, fonts, memes..."
                          className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white border border-[#102A35]/12 text-[#102A35] text-base placeholder-[#60747B] focus:outline-none focus:border-[#102A35] shadow-[0_4px_25px_rgba(16,42,53,0.06)]"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#60747B] hover:text-[#102A35]"
                            title="Clear search"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </section>
              )}

              {/* MAIN CONTENT WRAPPER WITH GENEROUS WHITESPACE */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
                
                {/* CATEGORIES PILLS BAR */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#60747B]">
                      Categories
                    </h2>
                    {selectedCategory !== 'All' && (
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className="text-xs font-semibold text-[#3F747C] hover:text-[#102A35] underline"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                    {categoryPills.map(cat => {
                      const isSelected = selectedCategory === cat.label;
                      return (
                        <button
                          key={cat.label}
                          id={`cat-pill-${cat.label.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => {
                            setSelectedCategory(cat.label);
                            if (cat.label === 'Stylish Fonts') {
                              setActiveTab('fonts');
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                            isSelected 
                              ? 'bg-[#102A35] text-white shadow-sm' 
                              : 'bg-white text-[#102A35] border border-[#102A35]/10 hover:border-[#102A35]/30'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* AD BANNER: TOP SLOT */}
                <AdBanner placementId="topBanner" settings={adSettings} />

                {/* ACTIVE TAB CONTEXT HEADER (When navigating via tabs) */}
                {activeTab !== 'home' && (
                  <div className="flex items-center justify-between border-b border-[#102A35]/8 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#3F747C]">Browse Collection</span>
                      <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#102A35] capitalize mt-0.5">
                        {activeTab === 'stickers' && 'Stickers Gallery'}
                        {activeTab === 'fonts' && 'Stylish Fonts Collection'}
                        {activeTab === 'trending' && 'Trending Stickers & Fonts'}
                        {activeTab === 'categories' && 'All Categories'}
                        {activeTab === 'favorites' && `Your Saved Favorites (${favorites.length})`}
                        {activeTab === 'search' && `Search Results for "${searchQuery}"`}
                      </h2>
                    </div>

                    <span className="text-xs font-medium text-[#60747B] bg-white px-3 py-1.5 rounded-xl border border-[#102A35]/8">
                      {activeTab === 'fonts' ? `${filteredFonts.length} fonts` : `${filteredStickers.length} stickers`}
                    </span>
                  </div>
                )}

                {/* CATEGORIES BENTO GRID VIEW (if activeTab === 'categories') */}
                {activeTab === 'categories' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        id={`cat-card-${cat.slug}`}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setActiveTab(cat.slug === 'stylish-fonts' ? 'fonts' : 'stickers');
                        }}
                        className="p-6 rounded-2xl bg-white border border-[#102A35]/8 hover:border-[#3F747C]/40 text-left transition-all shadow-[0_4px_18px_rgba(16,42,53,0.03)] hover:shadow-md flex flex-col justify-between min-h-[150px] group"
                      >
                        <div className="text-3xl mb-2">{cat.icon}</div>
                        <div>
                          <h3 className="font-bold text-base text-[#102A35] group-hover:text-[#3F747C] transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-[#60747B] mt-1 line-clamp-1">
                            {cat.description}
                          </p>
                          <span className="text-[11px] font-semibold text-[#3F747C] mt-2 block">
                            {cat.itemCount} items →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* STICKERS COLLECTION SECTION */}
                {activeTab !== 'fonts' && activeTab !== 'categories' && (
                  <section id="stickers-section" className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#102A35]">
                          {activeTab === 'favorites' ? 'Saved Stickers' : 'Stickers Collection'}
                        </h2>
                        <p className="text-sm text-[#60747B] mt-1">
                          Fresh stickers ready to download and share.
                        </p>
                      </div>

                      {activeTab === 'home' && (
                        <button
                          onClick={() => {
                            setActiveTab('stickers');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-xs font-semibold text-[#3F747C] hover:text-[#102A35] flex items-center gap-1 uppercase tracking-wider"
                        >
                          <span>View All ({stickers.length})</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Responsive AdSense Banner on Stickers Listing */}
                    {activeTab === 'stickers' && (
                      <AdBanner placementId="stickersListing" settings={adSettings} />
                    )}

                    {filteredStickers.length === 0 ? (
                      <div className="text-center py-16 rounded-3xl bg-white border border-[#102A35]/8 p-8 space-y-3">
                        <Layers className="w-10 h-10 text-[#60747B]/50 mx-auto" />
                        <h3 className="font-bold text-base text-[#102A35]">No stickers found</h3>
                        <p className="text-xs text-[#60747B] max-w-sm mx-auto">
                          {activeTab === 'favorites' 
                            ? "You haven't saved any stickers yet. Tap the heart icon on any sticker to keep it here!" 
                            : "Try searching with different keywords or resetting your category filter."}
                        </p>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="text-xs text-[#3F747C] font-semibold underline"
                          >
                            Clear search filter
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filteredStickers.map((sticker, index) => (
                          <React.Fragment key={sticker.id}>
                            {/* In-feed Native Google AdSense Card placement cleanly separated */}
                            {index === 4 && adSettings?.placements?.betweenGallery?.enabled && (
                              <div className="col-span-1 min-h-[280px]">
                                <AdBanner 
                                  placementId="betweenGallery" 
                                  settings={adSettings} 
                                  variant="card" 
                                  className="h-full my-0"
                                />
                              </div>
                            )}
                            <StickerCard
                              sticker={sticker}
                              onOpenDetail={(s) => setSelectedSticker(s)}
                              onDownload={(e, s) => {
                                e.stopPropagation();
                                handleDownloadSticker(s);
                              }}
                              onShare={(e, s) => {
                                e.stopPropagation();
                                setSelectedSticker(s);
                              }}
                              isFavorite={favorites.includes(sticker.id)}
                              onToggleFavorite={handleToggleFavorite}
                              isDarkMode={false}
                            />
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* FEATURED SECTION: "Made for Every Mood" */}
                {activeTab === 'home' && (
                  <section className="my-16 rounded-3xl bg-white border border-[#102A35]/8 shadow-[0_4px_25px_rgba(16,42,53,0.03)] p-8 sm:p-12 lg:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                      
                      {/* Left: Large sticker collage (3-4 stickers arranged nicely) */}
                      <div className="lg:col-span-6 relative">
                        <div className="w-full aspect-[4/3] rounded-2xl bg-[#DCEFF2]/60 p-6 flex items-center justify-center border border-[#102A35]/6 relative overflow-hidden">
                          {/* Collage of stickers */}
                          {stickers.slice(0, 4).map((stk, idx) => {
                            const positions = [
                              'top-4 left-6 -rotate-6 w-28 h-28 sm:w-36 sm:h-36',
                              'top-6 right-6 rotate-6 w-28 h-28 sm:w-36 sm:h-36',
                              'bottom-4 left-10 rotate-3 w-28 h-28 sm:w-36 sm:h-36',
                              'bottom-6 right-10 -rotate-3 w-28 h-28 sm:w-36 sm:h-36'
                            ];
                            return (
                              <div 
                                key={stk.id} 
                                onClick={() => setSelectedSticker(stk)}
                                className={`absolute ${positions[idx % positions.length]} p-3 rounded-2xl bg-white/90 shadow-md border border-[#102A35]/8 cursor-pointer hover:scale-110 transition-transform duration-300 flex items-center justify-center`}
                              >
                                <img src={stk.imageUrl} alt={stk.name} className="w-full h-full object-contain filter drop-shadow-sm" />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Heading, description, explore button */}
                      <div className="lg:col-span-6 space-y-5">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#3F747C]">
                          Made for Every Mood
                        </span>
                        <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-[#102A35] tracking-tight leading-tight">
                          Express Yourself with Every Message
                        </h2>
                        <p className="text-sm sm:text-base text-[#60747B] leading-relaxed">
                          Find high-quality PNG stickers for WhatsApp, Telegram and social media. Free, fast and easy to download. From funny memes to heartfelt celebrations, elevate your chats in seconds.
                        </p>
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setActiveTab('stickers');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-6 py-3.5 rounded-2xl bg-[#102A35] hover:bg-[#183E4E] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#102A35]/15 transition-all inline-flex items-center gap-2"
                          >
                            <span>EXPLORE ALL STICKERS</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </section>
                )}

                {/* AD BANNER: BETWEEN SECTIONS */}
                <AdBanner placementId="betweenSections" settings={adSettings} />

                {/* FONTS SECTION */}
                {(activeTab === 'home' || activeTab === 'fonts' || activeTab === 'trending' || activeTab === 'favorites') && (
                  <section id="fonts-section" className="space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#102A35]">
                          {activeTab === 'favorites' ? 'Saved Fonts' : 'Stylish Fonts'}
                        </h2>
                        <p className="text-sm text-[#60747B] mt-1">
                          Find the perfect style for your next post, message or design.
                        </p>
                      </div>

                      {activeTab === 'home' && (
                        <button
                          onClick={() => {
                            setActiveTab('fonts');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-xs font-semibold text-[#3F747C] hover:text-[#102A35] flex items-center gap-1 uppercase tracking-wider"
                        >
                          <span>Explore All Fonts ({fonts.length})</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Responsive AdSense Banner on Fonts Listing */}
                    {activeTab === 'fonts' && (
                      <AdBanner placementId="fontsListing" settings={adSettings} />
                    )}

                    {/* Interactive Font Preview Box: "Write Your Text Here" */}
                    <div className="rounded-3xl bg-white border border-[#102A35]/8 p-6 sm:p-8 shadow-[0_4px_25px_rgba(16,42,53,0.03)] space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#102A35]/8 pb-4">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#3F747C] flex items-center gap-1.5">
                            <Type className="w-3.5 h-3.5" />
                            Interactive Font Preview
                          </span>
                          <h3 className="font-serif-heading font-bold text-lg text-[#102A35] mt-0.5">
                            Write Your Text Here
                          </h3>
                        </div>

                        <div className="w-full sm:w-80">
                          <input
                            type="text"
                            value={customFontInput}
                            onChange={(e) => setCustomFontInput(e.target.value)}
                            placeholder="Write Your Text Here"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#F8F7F2] border border-[#102A35]/12 text-[#102A35] text-sm focus:outline-none focus:border-[#102A35]"
                          />
                        </div>
                      </div>

                      {/* Instant WhatsApp Unicode Styles with one-click copy */}
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#60747B]">
                          Instant WhatsApp & Bio Styles (Tap to Copy)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {stylishConverters.slice(0, 6).map((conv, idx) => {
                            const sample = conv.transform(customFontInput || 'FR Stickers Hub');
                            const isJustCopied = copiedIndex === idx;
                            return (
                              <div
                                key={conv.name}
                                className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#102A35]/6 flex items-center justify-between gap-2"
                              >
                                <div className="overflow-hidden">
                                  <span className="text-[10px] font-bold uppercase text-[#3F747C]">{conv.name}</span>
                                  <p className="text-sm font-medium text-[#102A35] truncate mt-0.5">{sample}</p>
                                </div>
                                <button
                                  onClick={() => handleCopyUnicode(sample, idx)}
                                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#102A35] text-[#102A35] hover:text-white border border-[#102A35]/10 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                                >
                                  {isJustCopied ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Font Cards Grid */}
                    {filteredFonts.length === 0 ? (
                      <div className="text-center py-16 rounded-3xl bg-white border border-[#102A35]/8 p-8 space-y-3">
                        <Type className="w-10 h-10 text-[#60747B]/50 mx-auto" />
                        <h3 className="font-bold text-base text-[#102A35]">No fonts found</h3>
                        <p className="text-xs text-[#60747B] max-w-sm mx-auto">
                          Try searching for a different font family or style keyword.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFonts.map((font) => (
                          <FontCard
                            key={font.id}
                            font={font}
                            customPreviewText={customFontInput}
                            onOpenDetail={(f) => setSelectedFont(f)}
                            onDownload={(e, f) => {
                              e.stopPropagation();
                              handleDownloadFont(f);
                            }}
                            onShare={(e, f) => {
                              e.stopPropagation();
                              setSelectedFont(f);
                            }}
                            isFavorite={favorites.includes(font.id)}
                            onToggleFavorite={handleToggleFavorite}
                            isDarkMode={false}
                          />
                        ))}
                      </div>
                    )}

                  </section>
                )}

                {/* AD BANNER: BOTTOM MOBILE / DESKTOP */}
                <AdBanner placementId="bottomMobile" settings={adSettings} />

              </div>
            </div>
          )}

        </main>

        {/* STICKER DETAIL MODAL */}
        <StickerDetailModal
          sticker={selectedSticker}
          onClose={() => setSelectedSticker(null)}
          onDownload={handleDownloadSticker}
          onTrackShare={(s) => handleTrackShare(s, 'sticker')}
          isFavorite={selectedSticker ? favorites.includes(selectedSticker.id) : false}
          onToggleFavorite={handleToggleFavorite}
          isDarkMode={false}
          adSettings={adSettings}
        />

        {/* FONT DETAIL MODAL */}
        <FontDetailModal
          font={selectedFont}
          onClose={() => setSelectedFont(null)}
          onDownload={handleDownloadFont}
          onTrackShare={(f) => handleTrackShare(f, 'font')}
          isFavorite={selectedFont ? favorites.includes(selectedFont.id) : false}
          onToggleFavorite={handleToggleFavorite}
          isDarkMode={false}
          adSettings={adSettings}
        />

        {/* ADMIN LOGIN MODAL */}
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            setActiveTab('admin');
          }}
          isDarkMode={false}
        />

        {/* FOOTER */}
        <Footer
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdmin={handleOpenAdminPortal}
          isDarkMode={false}
        />

      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDarkMode={false}
      />

    </div>
  );
}
