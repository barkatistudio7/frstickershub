import React from 'react';
import { ActiveTab } from '../types';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenAdmin: () => void;
  isDarkMode?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  return (
    <footer className="mt-20 border-t border-[#102A35]/8 bg-[#F8F7F2] text-[#60747B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#102A35] flex items-center justify-center shadow-sm">
                <span className="font-extrabold text-white text-sm font-sans tracking-wide">FR</span>
              </div>
              <span className="font-serif-heading font-bold text-2xl tracking-tight text-[#102A35]">
                FR Stickers <span className="font-sans font-light text-[#3F747C]">Hub</span>
              </span>
            </div>

            <p className="text-sm text-[#60747B] max-w-sm leading-relaxed">
              Beautiful stickers and stylish fonts, all in one place. Handcrafted for WhatsApp, Instagram, Telegram, and creators worldwide.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-[#60747B]">
              <span className="px-2.5 py-1 rounded-full bg-white border border-[#102A35]/8 text-[11px] font-medium">Free PNG Downloads</span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-[#102A35]/8 text-[11px] font-medium">Google Fonts Ready</span>
            </div>
          </div>

          {/* Explore Column */}
          <div className="space-y-4 md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102A35]">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('stickers')} 
                  className="hover:text-[#102A35] transition-colors"
                >
                  Stickers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('fonts')} 
                  className="hover:text-[#102A35] transition-colors"
                >
                  Fonts
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('trending')} 
                  className="hover:text-[#102A35] transition-colors"
                >
                  Trending
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('categories')} 
                  className="hover:text-[#102A35] transition-colors"
                >
                  Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal Column */}
          <div className="space-y-4 md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102A35]">Support & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-[#102A35] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-[#102A35] transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('privacy')} 
                  className="hover:text-[#102A35] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('terms')} 
                  className="hover:text-[#102A35] transition-colors"
                >
                  Terms
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dmca')} 
                  className="hover:text-[#102A35] transition-colors"
                >
                  DMCA
                </button>
              </li>
              <li className="pt-2">
                <button 
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F747C] hover:text-[#102A35] transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-14 pt-8 border-t border-[#102A35]/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#60747B]">
          <p>© 2026 FR Stickers Hub. All rights reserved.</p>
          <p className="text-[11px] text-[#60747B] text-center sm:text-right">
            Independent creative platform. WhatsApp is a registered trademark of WhatsApp LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};
