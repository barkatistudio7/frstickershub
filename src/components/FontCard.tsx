import React from 'react';
import { Download, Share2, Heart, Eye } from 'lucide-react';
import { FontItem } from '../types';

interface FontCardProps {
  font: FontItem;
  customPreviewText: string;
  onOpenDetail: (font: FontItem) => void;
  onDownload: (e: React.MouseEvent, font: FontItem) => void;
  onShare: (e: React.MouseEvent, font: FontItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  isDarkMode?: boolean;
}

export const FontCard: React.FC<FontCardProps> = ({
  font,
  customPreviewText,
  onOpenDetail,
  onDownload,
  onShare,
  isFavorite,
  onToggleFavorite,
}) => {
  const displayText = customPreviewText.trim() || font.name;

  return (
    <div
      id={`font-card-${font.id}`}
      onClick={() => onOpenDetail(font)}
      className="group relative rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between bg-white border border-[#102A35]/8 shadow-[0_4px_18px_rgba(16,42,53,0.04)] hover:shadow-[0_10px_30px_rgba(16,42,53,0.08)] hover:-translate-y-0.5"
    >
      {/* Top Meta Badges */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCEFF2] text-[#102A35] border border-[#3F747C]/20 uppercase tracking-wide">
            {font.category}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F8F7F2] text-[#60747B] border border-[#102A35]/6 uppercase">
            {font.format}
          </span>
        </div>

        <button
          onClick={(e) => onToggleFavorite(e, font.id)}
          className={`p-1.5 rounded-full transition-colors ${
            isFavorite 
              ? 'text-rose-600 bg-rose-50' 
              : 'text-[#60747B] hover:text-rose-600 hover:bg-[#F8F7F2]'
          }`}
          title={isFavorite ? 'Remove favorite' : 'Add to favorites'}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Font Live Sample Rendering Area */}
      <div className="my-2 p-4 rounded-xl bg-[#F8F7F2] border border-[#102A35]/6 min-h-[110px] flex flex-col justify-center overflow-hidden group-hover:border-[#3F747C]/30 transition-colors">
        <p 
          style={{ fontFamily: font.fontFamily }} 
          className="text-xl sm:text-2xl text-[#102A35] tracking-wide break-words line-clamp-2"
        >
          {displayText}
        </p>
        <p 
          style={{ fontFamily: font.fontFamily }} 
          className="text-xs text-[#60747B] mt-2 line-clamp-1"
        >
          {font.sampleAlphabet.slice(0, 32)}...
        </p>
      </div>

      {/* Font Info */}
      <div className="mt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-[#102A35] group-hover:text-[#3F747C] transition-colors">
            {font.name}
          </h3>
          <span className="text-[11px] text-[#60747B] font-medium">
            {font.downloadsCount.toLocaleString()} downloads
          </span>
        </div>
        <p className="text-xs text-[#60747B] mt-0.5 line-clamp-1">
          {font.description}
        </p>
      </div>

      {/* Action Buttons: Preview, Download, Share */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#102A35]/6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(font);
          }}
          className="w-full flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl bg-[#F8F7F2] hover:bg-[#EBF5F7] text-[#102A35] text-xs font-semibold uppercase tracking-wider border border-[#102A35]/10 transition-all active:scale-95"
          title="Preview font"
        >
          <Eye className="w-3.5 h-3.5 text-[#3F747C]" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          id={`download-font-${font.id}`}
          onClick={(e) => onDownload(e, font)}
          className="w-full flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl bg-[#102A35] hover:bg-[#183E4E] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-95"
          title={`Download ${font.format} font`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>

        <button
          id={`share-font-${font.id}`}
          onClick={(e) => onShare(e, font)}
          className="w-full flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl bg-[#F8F7F2] hover:bg-[#EBF5F7] text-[#102A35] text-xs font-semibold uppercase tracking-wider border border-[#102A35]/10 transition-all active:scale-95"
          title="Share font"
        >
          <Share2 className="w-3.5 h-3.5 text-[#3F747C]" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
};
