import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Heart, 
  Copy, 
  Check, 
  Type, 
  Send, 
  MessageCircle, 
  ExternalLink 
} from 'lucide-react';
import { FontItem, AdSettings } from '../types';
import { stylishConverters } from '../utils/unicodeFonts';
import { AdBanner } from './AdBanner';

interface FontDetailModalProps {
  font: FontItem | null;
  onClose: () => void;
  onDownload: (font: FontItem) => void;
  onTrackShare: (font: FontItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isDarkMode?: boolean;
  adSettings?: AdSettings | null;
}

export const FontDetailModal: React.FC<FontDetailModalProps> = ({
  font,
  onClose,
  onDownload,
  onTrackShare,
  isFavorite,
  onToggleFavorite,
  adSettings
}) => {
  const [customText, setCustomText] = useState('Write Your Text Here');
  const [fontSize, setFontSize] = useState(36);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTextIndex, setCopiedTextIndex] = useState<number | null>(null);

  if (!font) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/fonts/${font.slug}` : '';
  const shareText = `Check out the font "${font.name}" on FR Stickers Hub!`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      onTrackShare(font);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyConverted = (text: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedTextIndex(index);
      setTimeout(() => setCopiedTextIndex(null), 1800);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FR Stickers Hub - ${font.name}`,
          text: shareText,
          url: currentUrl,
        });
        onTrackShare(font);
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    onTrackShare(font);
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;
    window.open(waUrl, '_blank');
  };

  const handleTelegramShare = () => {
    onTrackShare(font);
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank');
  };

  const handleFacebookShare = () => {
    onTrackShare(font);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(fbUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#102A35]/50 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl rounded-3xl sm:rounded-[32px] border border-[#102A35]/10 shadow-[0_25px_70px_rgba(16,42,53,0.18)] bg-white text-[#102A35] overflow-hidden my-auto transition-all"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 sm:py-5 border-b border-[#102A35]/8 bg-[#F8F7F2]/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#DCEFF2] text-[#102A35] border border-[#3F747C]/20 uppercase tracking-wide">
              {font.category}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F8F7F2] text-[#60747B] border border-[#102A35]/6 uppercase">
              {font.format}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(font.id)}
              className={`p-2 rounded-xl transition-colors ${
                isFavorite 
                  ? 'text-rose-600 bg-rose-50' 
                  : 'text-[#60747B] hover:text-rose-600 hover:bg-white'
              }`}
              title="Save favorite"
            >
              <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#60747B] hover:text-[#102A35] hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Header Info */}
          <div>
            <span className="text-xs font-semibold text-[#3F747C] uppercase tracking-wider block mb-1">
              Typography Pack
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#102A35]">
              {font.name}
            </h2>
            <p className="text-sm text-[#60747B] mt-1 leading-relaxed">
              {font.description}
            </p>
          </div>

          {/* Interactive Live Testing Canvas */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#60747B] flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#3F747C]" />
                Interactive Preview & Test Box
              </label>

              <div className="flex items-center gap-2 text-xs text-[#60747B]">
                <span>Size:</span>
                <input
                  type="range"
                  min="20"
                  max="64"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24 accent-[#102A35]"
                />
                <span className="w-8 font-mono">{fontSize}px</span>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Write Your Text Here"
                className="w-full px-4 py-3 rounded-2xl bg-[#F8F7F2] border border-[#102A35]/10 text-[#102A35] text-sm focus:outline-none focus:border-[#102A35]"
              />
            </div>

            {/* Render sample in selected font */}
            <div className="p-6 rounded-2xl sm:rounded-3xl bg-[#F8F7F2] border border-[#102A35]/8 min-h-[130px] flex items-center justify-center text-center overflow-x-auto">
              <p 
                style={{ fontFamily: font.fontFamily, fontSize: `${fontSize}px` }} 
                className="text-[#102A35] tracking-wide break-words max-w-full"
              >
                {customText || font.name}
              </p>
            </div>
          </div>

          {/* Instant Fancy Unicode Generator */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#60747B]">
              Instant WhatsApp Fancy Styles (One-Tap Copy)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stylishConverters.map((conv, idx) => {
                const transformed = conv.transform(customText || 'FR Stickers Hub');
                const isJustCopied = copiedTextIndex === idx;
                return (
                  <div 
                    key={conv.name}
                    className="p-3 rounded-xl bg-white border border-[#102A35]/8 shadow-xs flex items-center justify-between"
                  >
                    <div className="overflow-hidden mr-2">
                      <span className="text-[10px] uppercase font-bold text-[#3F747C]">{conv.name}</span>
                      <p className="text-sm font-medium text-[#102A35] truncate mt-0.5">{transformed}</p>
                    </div>
                    <button
                      onClick={() => handleCopyConverted(transformed, idx)}
                      className="px-3 py-1.5 rounded-xl bg-[#F8F7F2] hover:bg-[#102A35] text-[#102A35] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                    >
                      {isJustCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button: Download Font */}
          <div className="pt-2">
            <button
              onClick={() => onDownload(font)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#102A35] hover:bg-[#183E4E] text-white font-bold text-sm uppercase tracking-wider shadow-md shadow-[#102A35]/15 transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Download Font File ({font.format})</span>
            </button>
          </div>

          {/* Social Share & Copy Link */}
          <div className="space-y-3 pt-4 border-t border-[#102A35]/8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#60747B]">
              Share Font Pack
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1e8f46] border border-[#25D366]/25 text-xs font-semibold transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleTelegramShare}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0077b5] border border-[#0088cc]/25 text-xs font-semibold transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </button>
              <button
                onClick={handleFacebookShare}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1877f2]/10 hover:bg-[#1877f2]/20 text-[#1565c0] border border-[#1877f2]/25 text-xs font-semibold transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Facebook</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F8F7F2] hover:bg-[#EBF5F7] text-[#102A35] border border-[#102A35]/10 text-xs font-semibold transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#60747B]" />}
                <span>{copiedLink ? 'Copied' : 'Link'}</span>
              </button>
            </div>
          </div>

          {/* Dedicated Google AdSense Placement - Strictly separated from download actions to prevent accidental clicks */}
          {adSettings?.placements?.detailModal?.enabled && (
            <div className="pt-4 border-t border-[#102A35]/8">
              <AdBanner 
                placementId="detailModal" 
                settings={adSettings} 
                variant="modal" 
                className="my-0"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
