import React from 'react';
import { Download, Share2, Heart, Flame, Sparkles } from 'lucide-react';
import { StickerItem } from '../types';

interface StickerCardProps {
  sticker: StickerItem;
  onOpenDetail: (sticker: StickerItem) => void;
  onDownload: (e: React.MouseEvent, sticker: StickerItem) => void;
  onShare: (e: React.MouseEvent, sticker: StickerItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  isDarkMode?: boolean;
}

export const StickerCard: React.FC<StickerCardProps> = ({
  sticker,
  onOpenDetail,
  onDownload,
  onShare,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div 
      id={`sticker-card-${sticker.id}`}
      onClick={() => onOpenDetail(sticker)}
      className="group relative rounded-2xl p-3 sm:p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between bg-white border border-[#102A35]/8 shadow-[0_4px_18px_rgba(16,42,53,0.04)] hover:shadow-[0_10px_30px_rgba(16,42,53,0.08)] hover:-translate-y-0.5"
    >
      {/* Top Badges and Favorite Heart */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {sticker.isTrending && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCEFF2] text-[#102A35] border border-[#3F747C]/20">
              <Flame className="w-3 h-3 text-amber-600" />
              Trending
            </span>
          )}
          {sticker.isFeatured && !sticker.isTrending && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F7F2] text-[#3F747C] border border-[#3F747C]/20">
              <Sparkles className="w-3 h-3 text-[#3F747C]" />
              Featured
            </span>
          )}
          <span className="text-[11px] font-medium text-[#60747B] px-2 py-0.5 rounded-full bg-[#F8F7F2] border border-[#102A35]/6">
            {sticker.category}
          </span>
        </div>

        {/* Favorite Toggle Button */}
        <button
          onClick={(e) => onToggleFavorite(e, sticker.id)}
          className={`p-1.5 rounded-full transition-colors ${
            isFavorite 
              ? 'text-rose-600 bg-rose-50' 
              : 'text-[#60747B] hover:text-rose-600 hover:bg-[#F8F7F2]'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Transparent Preview Area with Soft Mist Blue Checkerboard */}
      <div className="relative w-full aspect-square my-2 rounded-xl overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-checkerboard-mist border border-[#102A35]/6 group-hover:border-[#3F747C]/30 transition-colors">
        <img
          src={sticker.imageUrl}
          alt={sticker.name}
          loading="lazy"
          className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-108 transition-transform duration-300"
        />
        <span className="absolute bottom-1.5 right-1.5 text-[9px] font-semibold text-[#60747B] uppercase px-1.5 py-0.5 rounded bg-white/90 shadow-xs border border-[#102A35]/5">
          {sticker.format}
        </span>
      </div>

      {/* Info & Meta */}
      <div className="mt-1">
        <h3 className="font-bold text-sm sm:text-base text-[#102A35] group-hover:text-[#3F747C] transition-colors line-clamp-1">
          {sticker.name}
        </h3>
        <p className="text-[12px] text-[#60747B] mt-0.5 line-clamp-1">
          {sticker.tags.slice(0, 3).map(t => `#${t}`).join(' ')}
        </p>
      </div>

      {/* Action Buttons: DOWNLOAD & SHARE */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#102A35]/6">
        <button
          id={`download-btn-${sticker.id}`}
          onClick={(e) => onDownload(e, sticker)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#102A35] hover:bg-[#183E4E] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-95"
          title="Download sticker"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>

        <button
          id={`share-btn-${sticker.id}`}
          onClick={(e) => onShare(e, sticker)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#F8F7F2] hover:bg-[#EBF5F7] text-[#102A35] text-xs font-semibold uppercase tracking-wider border border-[#102A35]/10 transition-all active:scale-95"
          title="Share sticker"
        >
          <Share2 className="w-3.5 h-3.5 text-[#3F747C]" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
