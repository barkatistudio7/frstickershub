import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Heart, 
  Copy, 
  Check, 
  Send, 
  ExternalLink,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { StickerItem, AdSettings } from '../types';
import { AdBanner } from './AdBanner';

interface StickerDetailModalProps {
  sticker: StickerItem | null;
  onClose: () => void;
  onDownload: (sticker: StickerItem) => void;
  onTrackShare: (sticker: StickerItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isDarkMode?: boolean;
  adSettings?: AdSettings | null;
}

export const StickerDetailModal: React.FC<StickerDetailModalProps> = ({
  sticker,
  onClose,
  onDownload,
  onTrackShare,
  isFavorite,
  onToggleFavorite,
  adSettings
}) => {
  const [copied, setCopied] = useState(false);
  const [previewBg, setPreviewBg] = useState<'checker-mist' | 'checker-light' | 'checker-dark' | 'whatsapp'>('checker-mist');
  const [showWhatsAppHelp, setShowWhatsAppHelp] = useState(false);

  if (!sticker) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/stickers/${sticker.slug}` : '';
  const shareText = `Check out "${sticker.name}" transparent sticker on FR Stickers Hub!`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      onTrackShare(sticker);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FR Stickers Hub - ${sticker.name}`,
          text: shareText,
          url: currentUrl,
        });
        onTrackShare(sticker);
      } catch (err) {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    onTrackShare(sticker);
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;
    window.open(waUrl, '_blank');
  };

  const handleTelegramShare = () => {
    onTrackShare(sticker);
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank');
  };

  const handleFacebookShare = () => {
    onTrackShare(sticker);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(fbUrl, '_blank');
  };

  const handleXShare = () => {
    onTrackShare(sticker);
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(xUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#102A35]/50 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl rounded-3xl sm:rounded-[32px] border border-[#102A35]/10 shadow-[0_25px_70px_rgba(16,42,53,0.18)] bg-white text-[#102A35] overflow-hidden my-auto transition-all"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 sm:py-5 border-b border-[#102A35]/8 bg-[#F8F7F2]/60">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#DCEFF2] text-[#102A35] border border-[#3F747C]/20 uppercase tracking-wide">
              {sticker.category}
            </span>
            <span className="text-xs text-[#60747B]">
              {sticker.downloadsCount.toLocaleString()} downloads
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(sticker.id)}
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
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split layout on desktop, stacked on mobile */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Large Sticker Preview */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-3">
            <div className={`relative w-full aspect-square rounded-2xl sm:rounded-3xl flex items-center justify-center p-8 border border-[#102A35]/8 transition-colors ${
              previewBg === 'checker-mist' ? 'bg-checkerboard-mist' :
              previewBg === 'checker-light' ? 'bg-checkerboard-light' :
              previewBg === 'checker-dark' ? 'bg-checkerboard-dark' :
              'bg-whatsapp-preview'
            }`}>
              <img
                src={sticker.imageUrl}
                alt={sticker.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-md"
              />

              {/* Background Style Switcher */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full p-1 border border-[#102A35]/10 shadow-xs">
                <button
                  onClick={() => setPreviewBg('checker-mist')}
                  className={`w-5 h-5 rounded-full border ${previewBg === 'checker-mist' ? 'border-[#102A35] scale-110 shadow-xs' : 'border-transparent opacity-70'} bg-[#DCEFF2]`}
                  title="Soft Mist Blue Pattern"
                />
                <button
                  onClick={() => setPreviewBg('checker-light')}
                  className={`w-5 h-5 rounded-full border ${previewBg === 'checker-light' ? 'border-[#102A35] scale-110 shadow-xs' : 'border-transparent opacity-70'} bg-[#FAF9F6]`}
                  title="Ivory Checkerboard"
                />
                <button
                  onClick={() => setPreviewBg('checker-dark')}
                  className={`w-5 h-5 rounded-full border ${previewBg === 'checker-dark' ? 'border-[#102A35] scale-110 shadow-xs' : 'border-transparent opacity-70'} bg-[#102A35]`}
                  title="Navy Checkerboard"
                />
                <button
                  onClick={() => setPreviewBg('whatsapp')}
                  className={`w-5 h-5 rounded-full border ${previewBg === 'whatsapp' ? 'border-[#102A35] scale-110 shadow-xs' : 'border-transparent opacity-70'} bg-[#EFEAE2]`}
                  title="WhatsApp Chat Background"
                />
              </div>
            </div>

            {/* Sticker specs */}
            <div className="flex items-center justify-between text-xs text-[#60747B] px-1 py-1">
              <span>Format: <strong className="text-[#102A35] uppercase">{sticker.format}</strong></span>
              <span>Resolution: <strong className="text-[#102A35]">{sticker.resolution}</strong></span>
              <span>Alpha Transparency: <strong className="text-[#3F747C]">Yes</strong></span>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#3F747C] uppercase tracking-wider block mb-1">
                  {sticker.category} Sticker Pack
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#102A35] tracking-tight">
                  {sticker.name}
                </h2>
              </div>

              <p className="text-sm text-[#60747B] leading-relaxed">
                {sticker.description}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {sticker.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[#F8F7F2] text-[#60747B] border border-[#102A35]/6">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Action Button: Download Sticker */}
            <div className="space-y-3 pt-2">
              <button
                id="modal-download-sticker-btn"
                onClick={() => onDownload(sticker)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#102A35] hover:bg-[#183E4E] text-white font-bold text-sm uppercase tracking-wider shadow-md shadow-[#102A35]/15 transition-all active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Download Sticker</span>
              </button>

              {/* Native share & Copy link */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="native-mobile-share-btn"
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F8F7F2] hover:bg-[#EBF5F7] text-[#102A35] text-xs font-semibold uppercase tracking-wider border border-[#102A35]/10 transition-all active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#3F747C]" />
                  <span>Share</span>
                </button>

                <button
                  id="copy-sticker-link-btn"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F8F7F2] hover:bg-[#EBF5F7] text-[#102A35] text-xs font-semibold uppercase tracking-wider border border-[#102A35]/10 transition-all active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#60747B]" />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="space-y-3 pt-4 border-t border-[#102A35]/8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#60747B]">
                  Direct Share
                </span>
                <button
                  onClick={() => setShowWhatsAppHelp(!showWhatsAppHelp)}
                  className="text-xs text-[#3F747C] hover:underline flex items-center gap-1 font-medium"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  How to use in WhatsApp?
                </button>
              </div>

              {/* WhatsApp Guide Accordion */}
              {showWhatsAppHelp && (
                <div className="p-3.5 rounded-2xl bg-[#EBF5F7] border border-[#3F747C]/20 text-[#102A35] text-xs leading-relaxed space-y-1">
                  <p className="font-semibold text-[#102A35]">💡 Quick WhatsApp Tip:</p>
                  <p>1. Tap <strong>Download Sticker</strong> to save this PNG with transparent background to your photos.</p>
                  <p>2. Open WhatsApp, open any chat, and tap the Sticker menu to send or add to your favorites!</p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                <button
                  id="share-whatsapp-btn"
                  onClick={handleWhatsAppShare}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1e8f46] border border-[#25D366]/25 text-xs font-semibold transition-all active:scale-95"
                  title="Share to WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                <button
                  id="share-telegram-btn"
                  onClick={handleTelegramShare}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0077b5] border border-[#0088cc]/25 text-xs font-semibold transition-all active:scale-95"
                  title="Share to Telegram"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Telegram</span>
                </button>

                <button
                  id="share-facebook-btn"
                  onClick={handleFacebookShare}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#1877f2]/10 hover:bg-[#1877f2]/20 text-[#1565c0] border border-[#1877f2]/25 text-xs font-semibold transition-all active:scale-95"
                  title="Share to Facebook"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Facebook</span>
                </button>

                <button
                  id="share-x-btn"
                  onClick={handleXShare}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#F8F7F2] hover:bg-[#EBF5F7] text-[#102A35] border border-[#102A35]/10 text-xs font-semibold transition-all active:scale-95"
                  title="Share to 𝕏"
                >
                  <span>𝕏</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Dedicated Google AdSense Placement - Strictly separated from download actions to prevent accidental clicks */}
        {adSettings?.placements?.detailModal?.enabled && (
          <div className="px-6 sm:px-8 pb-6 pt-2 bg-[#F8F7F2]/40 border-t border-[#102A35]/8">
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
  );
};
