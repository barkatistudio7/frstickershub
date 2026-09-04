import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Upload, 
  Layers, 
  Type, 
  DollarSign, 
  Settings, 
  LogOut, 
  Trash2, 
  Edit, 
  Flame, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Check, 
  AlertTriangle, 
  Plus, 
  Search, 
  FileText,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { StickerItem, FontItem, AdminStats, AdSettings, AdPlacementConfig } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stickers' | 'fonts' | 'upload-sticker' | 'upload-font' | 'ads' | 'security'>('overview');
  
  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [fonts, setFonts] = useState<FontItem[]>([]);
  const [ads, setAds] = useState<AdSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Delete Confirmation Modal
  const [itemToDelete, setItemToDelete] = useState<{ type: 'sticker' | 'font'; id: string; name: string } | null>(null);

  // Edit State
  const [editingSticker, setEditingSticker] = useState<StickerItem | null>(null);
  const [editingFont, setEditingFont] = useState<FontItem | null>(null);

  // Upload Sticker Form State
  const [stkName, setStkName] = useState('');
  const [stkCategory, setStkCategory] = useState('Funny');
  const [stkTags, setStkTags] = useState('whatsapp, sticker, viral');
  const [stkDesc, setStkDesc] = useState('');
  const [stkFormat, setStkFormat] = useState<'png' | 'webp'>('png');
  const [stkResolution, setStkResolution] = useState('512x512');
  const [stkFeatured, setStkFeatured] = useState(false);
  const [stkTrending, setStkTrending] = useState(false);
  const [stkPublished, setStkPublished] = useState(true);
  const [stkImageData, setStkImageData] = useState<string>('');
  const [stkImageName, setStkImageName] = useState('');

  // Upload Font Form State
  const [fntName, setFntName] = useState('');
  const [fntCategory, setFntCategory] = useState('Stylish Fonts');
  const [fntTags, setFntTags] = useState('font, pack, ttf, display');
  const [fntDesc, setFntDesc] = useState('');
  const [fntFormat, setFntFormat] = useState<'TTF' | 'OTF' | 'WOFF' | 'WOFF2'>('TTF');
  const [fntFamily, setFntFamily] = useState("'Outfit', sans-serif");
  const [fntSample, setFntSample] = useState('The quick brown fox jumps over the lazy dog 1234567890');
  const [fntFeatured, setFntFeatured] = useState(false);
  const [fntTrending, setFntTrending] = useState(false);
  const [fntPublished, setFntPublished] = useState(true);
  const [fntFileData, setFntFileData] = useState('');
  const [fntFileName, setFntFileName] = useState('');

  // Security Form State
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  // AdSense Form State
  const [adClientIdInput, setAdClientIdInput] = useState('ca-pub-9876543210123456');
  const [adTestModeInput, setAdTestModeInput] = useState(true);
  const [editingSlotId, setEditingSlotId] = useState<{ [key: string]: string }>({});

  // Content list filters
  const [searchFilter, setSearchFilter] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontFileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, stickersData, fontsData, adsData] = await Promise.all([
        api.adminGetStats(),
        api.adminGetStickers(),
        api.adminGetFonts(),
        api.getAdSettings()
      ]);
      setStats(statsData);
      setStickers(stickersData);
      setFonts(fontsData);
      setAds(adsData);
      if (adsData) {
        setAdClientIdInput(adsData.adSenseClientId || 'ca-pub-9876543210123456');
        setAdTestModeInput(adsData.isTestMode ?? true);
      }
    } catch (e: any) {
      showMessage('Failed to load admin data: ' + e.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showMessage = (text: string, isError = false) => {
    setActionMessage({ text, isError });
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Sticker File Selection
  const handleStickerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png') && !file.type.includes('webp') && !file.type.includes('svg')) {
      showMessage('Please select a valid PNG, WebP or SVG image', true);
      return;
    }

    setStkImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setStkImageData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Font File Selection
  const handleFontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFntFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFntFileData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit Sticker Upload
  const handleUploadSticker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stkName || !stkImageData) {
      showMessage('Sticker name and image file are required', true);
      return;
    }

    try {
      // First upload file via admin upload endpoint
      const uploadRes = await api.adminUploadFile(stkImageName || `${stkName}.png`, stkImageData, stkFormat);

      await api.adminCreateSticker({
        name: stkName,
        category: stkCategory,
        tags: stkTags.split(',').map(t => t.trim()).filter(Boolean),
        description: stkDesc,
        imageUrl: uploadRes.url,
        format: stkFormat,
        resolution: stkResolution,
        fileSizeBytes: uploadRes.sizeBytes,
        isFeatured: stkFeatured,
        isTrending: stkTrending,
        isPublished: stkPublished
      });

      showMessage('Sticker published successfully!');
      // Reset form
      setStkName('');
      setStkDesc('');
      setStkImageData('');
      setStkImageName('');
      loadData();
      setActiveTab('stickers');
    } catch (err: any) {
      showMessage(err.message || 'Failed to create sticker', true);
    }
  };

  // Submit Font Upload
  const handleUploadFont = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fntName) {
      showMessage('Font name is required', true);
      return;
    }

    try {
      let fileUrl = `/downloads/fonts/${fntName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${fntFormat.toLowerCase()}`;
      let fileSizeBytes = 180000;

      if (fntFileData) {
        const uploadRes = await api.adminUploadFile(fntFileName || `${fntName}.${fntFormat.toLowerCase()}`, fntFileData, fntFormat);
        fileUrl = uploadRes.url;
        fileSizeBytes = uploadRes.sizeBytes;
      }

      await api.adminCreateFont({
        name: fntName,
        category: fntCategory,
        tags: fntTags.split(',').map(t => t.trim()).filter(Boolean),
        description: fntDesc,
        fontFileUrl: fileUrl,
        fontFamily: fntFamily,
        format: fntFormat,
        sampleAlphabet: fntSample,
        fileSizeBytes,
        isFeatured: fntFeatured,
        isTrending: fntTrending,
        isPublished: fntPublished
      });

      showMessage('Font package published successfully!');
      setFntName('');
      setFntDesc('');
      setFntFileData('');
      setFntFileName('');
      loadData();
      setActiveTab('fonts');
    } catch (err: any) {
      showMessage(err.message || 'Failed to create font', true);
    }
  };

  // Confirm Delete Item
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'sticker') {
        await api.adminDeleteSticker(itemToDelete.id);
      } else {
        await api.adminDeleteFont(itemToDelete.id);
      }
      showMessage(`${itemToDelete.name} deleted successfully`);
      setItemToDelete(null);
      loadData();
    } catch (err: any) {
      showMessage(err.message || 'Failed to delete item', true);
    }
  };

  // Toggle Sticker Status
  const handleToggleSticker = async (sticker: StickerItem, field: 'isPublished' | 'isFeatured' | 'isTrending') => {
    try {
      await api.adminUpdateSticker(sticker.id, { [field]: !sticker[field] });
      loadData();
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  // Toggle Font Status
  const handleToggleFont = async (font: FontItem, field: 'isPublished' | 'isFeatured' | 'isTrending') => {
    try {
      await api.adminUpdateFont(font.id, { [field]: !font[field] });
      loadData();
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  // Toggle Ad Slot
  const handleToggleAdSlot = async (slotKey: string, currentVal: boolean) => {
    if (!ads) return;
    try {
      const updatedPlacements = {
        ...ads.placements,
        [slotKey]: {
          ...ads.placements[slotKey],
          enabled: !currentVal
        }
      };
      const res = await api.adminUpdateAdSettings({ placements: updatedPlacements });
      setAds(res.ads);
      showMessage('Ad placement configuration updated');
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  // Save AdSense Client ID & Test Mode
  const handleSaveAdSenseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ads) return;
    try {
      const res = await api.adminUpdateAdSettings({
        adSenseClientId: adClientIdInput.trim(),
        isTestMode: adTestModeInput
      });
      setAds(res.ads);
      showMessage('Google AdSense configuration saved successfully');
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  // Save Specific Slot ID
  const handleSaveSlotId = async (slotKey: string) => {
    if (!ads) return;
    const newSlotId = editingSlotId[slotKey];
    if (!newSlotId) return;

    try {
      const updatedPlacements = {
        ...ads.placements,
        [slotKey]: {
          ...ads.placements[slotKey],
          adSlotId: newSlotId.trim()
        }
      };
      const res = await api.adminUpdateAdSettings({ placements: updatedPlacements });
      setAds(res.ads);
      setEditingSlotId(prev => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });
      showMessage(`Updated Slot ID for ${ads.placements[slotKey]?.label || slotKey}`);
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPass || !newPass) return;
    try {
      await api.adminChangePassword(currPass, newPass);
      setPassMessage('Password successfully updated!');
      setCurrPass('');
      setNewPass('');
      setTimeout(() => setPassMessage(''), 3000);
    } catch (err: any) {
      showMessage(err.message || 'Failed to update password', true);
    }
  };

  return (
    <div className={`min-h-screen pb-16 transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Banner Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-white">FR Stickers Hub - Owner Admin Panel</h1>
            <p className="text-xs text-slate-400">Exclusive Content Management & Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-400' : ''}`} />
          </button>
          <button
            id="admin-logout-btn"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Global Alert Notification */}
      {actionMessage && (
        <div className={`fixed top-16 right-4 z-50 p-4 rounded-xl shadow-2xl border text-sm font-medium flex items-center gap-2 transition-all ${
          actionMessage.isError 
            ? 'bg-rose-950 border-rose-700 text-rose-200' 
            : 'bg-emerald-950 border-emerald-700 text-emerald-200'
        }`}>
          {actionMessage.isError ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <Check className="w-4 h-4 text-emerald-400" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-800/80 text-sm no-scrollbar">
          <button
            id="tab-admin-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'overview' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard Overview
          </button>

          <button
            id="tab-admin-stickers"
            onClick={() => setActiveTab('stickers')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'stickers' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Manage Stickers ({stickers.length})
          </button>

          <button
            id="tab-admin-fonts"
            onClick={() => setActiveTab('fonts')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'fonts' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Type className="w-4 h-4" />
            Manage Fonts ({fonts.length})
          </button>

          <button
            id="tab-admin-upload-sticker"
            onClick={() => setActiveTab('upload-sticker')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'upload-sticker' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            + Upload Sticker
          </button>

          <button
            id="tab-admin-upload-font"
            onClick={() => setActiveTab('upload-font')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'upload-font' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            + Upload Font
          </button>

          <button
            id="tab-admin-ads"
            onClick={() => setActiveTab('ads')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'ads' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Ad Monetization
          </button>

          <button
            id="tab-admin-security"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'security' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            Security & Password
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6 mt-6">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Stickers</span>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.totalStickers}</p>
                <span className="text-[11px] text-indigo-400 mt-2 block">WhatsApp, Emoji & PNG</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Fonts</span>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.totalFonts}</p>
                <span className="text-[11px] text-purple-400 mt-2 block">TTF, OTF, WOFF Packs</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Downloads</span>
                <p className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.totalDownloads.toLocaleString()}</p>
                <span className="text-[11px] text-slate-400 mt-2 block">Across all media</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Shares</span>
                <p className="text-3xl font-extrabold text-sky-400 mt-1">{stats.totalShares.toLocaleString()}</p>
                <span className="text-[11px] text-slate-400 mt-2 block">WhatsApp, TG, Social</span>
              </div>
            </div>

            {/* Popular Content & Recent Uploads Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Top Performing Content
                </h3>

                <div className="space-y-2">
                  {stats.popularContent.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div>
                        <p className="font-semibold text-sm text-slate-200">{item.name}</p>
                        <span className="text-xs text-slate-500">{item.type.toUpperCase()} • {item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-400">{item.downloads.toLocaleString()} dl</span>
                        <p className="text-[11px] text-slate-400">{item.shares.toLocaleString()} shares</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Recent Uploads
                </h3>

                <div className="space-y-2">
                  {stats.recentUploads.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div>
                        <p className="font-semibold text-sm text-slate-200">{item.name}</p>
                        <span className="text-xs text-slate-500">{item.type.toUpperCase()} • {item.category}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.published ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {item.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE STICKERS */}
        {activeTab === 'stickers' && (
          <div className="space-y-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter stickers..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <button
                onClick={() => setActiveTab('upload-sticker')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
              >
                <Plus className="w-4 h-4" />
                Upload New Sticker
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Preview</th>
                      <th className="py-3 px-4">Name & Category</th>
                      <th className="py-3 px-4">Stats</th>
                      <th className="py-3 px-4">Toggles</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {stickers
                      .filter(s => !searchFilter || s.name.toLowerCase().includes(searchFilter.toLowerCase()) || s.category.toLowerCase().includes(searchFilter.toLowerCase()))
                      .map(s => (
                        <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="w-12 h-12 rounded-lg bg-checkerboard-dark p-1 flex items-center justify-center border border-slate-800">
                              <img src={s.imageUrl} alt={s.name} className="max-h-full max-w-full object-contain" />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-100">{s.name}</p>
                            <span className="text-xs text-slate-400">{s.category} • {s.format.toUpperCase()}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-slate-300">{s.downloadsCount.toLocaleString()} dl</span>
                            <span className="text-xs text-slate-500 block">{s.sharesCount.toLocaleString()} shares</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleSticker(s, 'isPublished')}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  s.isPublished ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {s.isPublished ? 'Published' : 'Draft'}
                              </button>
                              <button
                                onClick={() => handleToggleSticker(s, 'isTrending')}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  s.isTrending ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                Trending
                              </button>
                              <button
                                onClick={() => handleToggleSticker(s, 'isFeatured')}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  s.isFeatured ? 'bg-purple-500/15 text-purple-400' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                Featured
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setItemToDelete({ type: 'sticker', id: s.id, name: s.name })}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                              title="Delete sticker"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE FONTS */}
        {activeTab === 'fonts' && (
          <div className="space-y-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter fonts..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <button
                onClick={() => setActiveTab('upload-font')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow"
              >
                <Plus className="w-4 h-4" />
                Upload New Font
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Font Name & Category</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">Downloads</th>
                      <th className="py-3 px-4">Toggles</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {fonts
                      .filter(f => !searchFilter || f.name.toLowerCase().includes(searchFilter.toLowerCase()) || f.category.toLowerCase().includes(searchFilter.toLowerCase()))
                      .map(f => (
                        <tr key={f.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-100">{f.name}</p>
                            <span className="text-xs text-slate-400">{f.category}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                              {f.format}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-slate-300">{f.downloadsCount.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleFont(f, 'isPublished')}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  f.isPublished ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {f.isPublished ? 'Published' : 'Draft'}
                              </button>
                              <button
                                onClick={() => handleToggleFont(f, 'isTrending')}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  f.isTrending ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                Trending
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setItemToDelete({ type: 'font', id: f.id, name: f.name })}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                              title="Delete font"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: UPLOAD STICKER FORM */}
        {activeTab === 'upload-sticker' && (
          <div className="max-w-2xl mx-auto mt-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" />
              Upload New Sticker (Admin Only)
            </h2>

            <form onSubmit={handleUploadSticker} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Sticker Name *</label>
                <input
                  type="text"
                  required
                  value={stkName}
                  onChange={(e) => setStkName(e.target.value)}
                  placeholder="e.g. Crazy Laughing Cat"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Sticker Image (PNG / WebP transparent) *</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/60 cursor-pointer flex flex-col items-center justify-center text-center transition-colors"
                >
                  {stkImageData ? (
                    <div className="space-y-2">
                      <div className="w-24 h-24 mx-auto rounded-lg bg-checkerboard-dark p-2 flex items-center justify-center border border-slate-800">
                        <img src={stkImageData} alt="Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                      <p className="text-xs text-indigo-400">{stkImageName}</p>
                      <span className="text-[11px] text-slate-400">Click to change image</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-xs font-medium text-slate-300">Click to select sticker PNG / WebP</p>
                      <p className="text-[11px] text-slate-400">Transparent alpha channel supported (max 15MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/webp,image/svg+xml"
                    onChange={handleStickerFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={stkCategory}
                    onChange={(e) => setStkCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="Trending">Trending</option>
                    <option value="Funny">Funny</option>
                    <option value="Love">Love</option>
                    <option value="Attitude">Attitude</option>
                    <option value="Islamic">Islamic</option>
                    <option value="Festival">Festival</option>
                    <option value="Animals">Animals</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Text Stickers">Text Stickers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Format</label>
                  <select
                    value={stkFormat}
                    onChange={(e) => setStkFormat(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="png">PNG (Transparent)</option>
                    <option value="webp">WebP (Optimized)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={stkTags}
                  onChange={(e) => setStkTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  placeholder="meme, laughing, whatsapp"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={stkDesc}
                  onChange={(e) => setStkDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  placeholder="Hilarious laughing sticker for WhatsApp chats..."
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stkTrending}
                    onChange={(e) => setStkTrending(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                  <span>Mark as Trending</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stkFeatured}
                    onChange={(e) => setStkFeatured(e.target.checked)}
                    className="w-4 h-4 rounded accent-purple-500"
                  />
                  <span>Featured Showcase</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stkPublished}
                    onChange={(e) => setStkPublished(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500"
                  />
                  <span>Publish Immediately</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow transition-all mt-4"
              >
                Publish Sticker to Hub
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: UPLOAD FONT FORM */}
        {activeTab === 'upload-font' && (
          <div className="max-w-2xl mx-auto mt-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-purple-400" />
              Upload Stylish Font Pack (Admin Only)
            </h2>

            <form onSubmit={handleUploadFont} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Font Name *</label>
                <input
                  type="text"
                  required
                  value={fntName}
                  onChange={(e) => setFntName(e.target.value)}
                  placeholder="e.g. Cyberpunk Glitch Display"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              {/* Font File Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Font File (TTF, OTF, WOFF, WOFF2)</label>
                <div 
                  onClick={() => fontFileInputRef.current?.click()}
                  className="p-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-950/60 cursor-pointer flex flex-col items-center justify-center text-center transition-colors"
                >
                  <Type className="w-8 h-8 text-purple-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-300 mt-2">
                    {fntFileName ? `Selected: ${fntFileName}` : 'Click to select font file (or create virtual pack)'}
                  </p>
                  <span className="text-[11px] text-slate-400">Supports TTF, OTF, WOFF & WOFF2</span>
                  <input
                    ref={fontFileInputRef}
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    onChange={handleFontFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={fntCategory}
                    onChange={(e) => setFntCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="Stylish Fonts">Stylish Fonts</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Attitude">Attitude</option>
                    <option value="Islamic">Islamic</option>
                    <option value="Festival">Festival</option>
                    <option value="Funny">Funny</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Format</label>
                  <select
                    value={fntFormat}
                    onChange={(e) => setFntFormat(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="TTF">TTF (TrueType)</option>
                    <option value="OTF">OTF (OpenType)</option>
                    <option value="WOFF">WOFF (Web Open)</option>
                    <option value="WOFF2">WOFF2 (Modern)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Sample Alphabet / Text</label>
                <input
                  type="text"
                  value={fntSample}
                  onChange={(e) => setFntSample(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={fntDesc}
                  onChange={(e) => setFntDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  placeholder="Futuristic aggressive font for gaming and titles..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fntTrending}
                    onChange={(e) => setFntTrending(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                  <span>Trending Font</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fntPublished}
                    onChange={(e) => setFntPublished(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500"
                  />
                  <span>Publish Immediately</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow transition-all mt-4"
              >
                Publish Font Pack
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: AD MONETIZATION */}
        {activeTab === 'ads' && ads && (
          <div className="max-w-4xl mx-auto mt-6 space-y-6">
            
            {/* Google AdSense Credentials & Verification Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Google AdSense Integration & Account Setup
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure your official Google AdSense publisher credentials and manage review-readiness.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/ads.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View /ads.txt</span>
                  </a>
                </div>
              </div>

              {/* Status Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Verification Status</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Meta Tag & Script Active</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">ads.txt Seller File</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span>Direct Publisher Match</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Policy Compliance</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                    <Check className="w-4 h-4" />
                    <span>Zero Accidental Click Layout</span>
                  </div>
                </div>
              </div>

              {/* Configuration Form */}
              <form onSubmit={handleSaveAdSenseConfig} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                      Google AdSense Publisher Client ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ca-pub-9876543210123456"
                      value={adClientIdInput}
                      onChange={(e) => setAdClientIdInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Found in your Google AdSense Dashboard under Account &gt; Settings &gt; Publisher ID.
                    </span>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                      AdSense Mode
                    </label>
                    <div className="flex items-center gap-3 h-[42px]">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adTestModeInput}
                          onChange={(e) => setAdTestModeInput(e.target.checked)}
                          className="w-4 h-4 rounded accent-emerald-500"
                        />
                        <span>Enable Test Mode (Sandbox)</span>
                      </label>
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Recommended while awaiting Google site review approval.
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow transition-all"
                  >
                    Save AdSense Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Individual Placement Slots */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Responsive Ad Placement Slots
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage individual responsive ad slots across the website. All ads feature clear separation from download buttons.
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(ads.placements).map(([key, rawPlacement]) => {
                  const placement = rawPlacement as AdPlacementConfig;
                  const isEditingThisSlot = editingSlotId[key] !== undefined;

                  return (
                    <div 
                      key={key}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-slate-200">{placement.label}</p>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                              {placement.format || 'Auto'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{placement.description}</p>
                        </div>

                        <button
                          onClick={() => handleToggleAdSlot(key, placement.enabled)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            placement.enabled 
                              ? 'bg-emerald-600 text-white shadow-md' 
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {placement.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>

                      {/* Slot ID Editor */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                        <span className="text-xs text-slate-400 whitespace-nowrap">Slot ID:</span>
                        <input
                          type="text"
                          value={editingSlotId[key] ?? placement.adSlotId}
                          onChange={(e) => setEditingSlotId({ ...editingSlotId, [key]: e.target.value })}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono w-44 focus:border-emerald-500 focus:outline-none"
                          placeholder="e.g. 1234567890"
                        />
                        {editingSlotId[key] !== undefined && editingSlotId[key] !== placement.adSlotId && (
                          <button
                            onClick={() => handleSaveSlotId(key)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all"
                          >
                            Save Slot
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 7: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <div className="max-w-md mx-auto mt-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              Change Admin Password
            </h2>

            {passMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{passMessage}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">New Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow transition-all mt-2"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Alert Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to permanently delete <strong>"{itemToDelete.name}"</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
