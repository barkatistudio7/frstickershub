import React, { useEffect, useRef } from 'react';
import { AdPlacementId, AdPlacementConfig, AdSettings } from '../types';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface AdBannerProps {
  placementId: AdPlacementId;
  settings?: AdSettings | null;
  className?: string;
  variant?: 'banner' | 'card' | 'modal' | 'mobile-anchor';
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  placementId, 
  settings, 
  className = '',
  variant
}) => {
  // Unconditionally call all hooks at the very top of the component
  const adRef = useRef<HTMLModElement>(null);
  const isPushed = useRef(false);

  const placement: AdPlacementConfig | undefined = settings?.placements?.[placementId];
  const clientId = settings?.adSenseClientId || 'ca-pub-9876543210123456';
  const slotId = placement?.adSlotId || '1010101010';
  const isTestMode = settings?.isTestMode ?? true;
  const isPlaceholderClient = !clientId || clientId === 'ca-pub-9876543210123456';
  const isEnabled = Boolean(settings && placement && placement.enabled);

  // Initialize AdSense push only in live production mode with a verified publisher ID
  useEffect(() => {
    if (!isEnabled || isTestMode || isPlaceholderClient || isPushed.current) return;

    try {
      // Ensure AdSense library script is loaded dynamically when a real publisher ID is supplied
      if (typeof window !== 'undefined' && !document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Check if element has already been processed to prevent React StrictMode TagError
      if (adRef.current && !adRef.current.getAttribute('data-adsbygoogle-status')) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      }
    } catch (e) {
      // Gracefully catch adblocker or runtime constraints
      console.warn('AdSense slot initialization bypassed:', e);
    }
  }, [isEnabled, placementId, slotId, clientId, isTestMode, isPlaceholderClient]);

  // If no settings provided, or slot disabled by admin, render nothing (AFTER all hooks have been invoked)
  if (!settings || !placement || !placement.enabled) {
    return null;
  }

  // Determine layout styling by placement and variant
  let containerStyles = 'w-full my-6 mx-auto rounded-2xl sm:rounded-3xl border border-[#102A35]/8 bg-[#F8F7F2] p-4 sm:p-5 text-center shadow-[0_4px_18px_rgba(16,42,53,0.02)]';
  let slotMinHeight = 'min-h-[85px] sm:min-h-[95px]';
  let formatAttr = placement.format || 'auto';

  if (placementId === 'betweenGallery' || variant === 'card') {
    containerStyles = 'w-full h-full min-h-[300px] rounded-2xl bg-[#F8F7F2] border border-[#102A35]/10 p-5 flex flex-col justify-between items-center text-center shadow-xs';
    slotMinHeight = 'min-h-[220px]';
    formatAttr = 'rectangle';
  } else if (placementId === 'detailModal' || variant === 'modal') {
    containerStyles = 'w-full mt-6 pt-4 border-t border-[#102A35]/8 bg-[#F8F7F2]/60 rounded-2xl p-4 text-center';
    slotMinHeight = 'min-h-[80px]';
    formatAttr = 'horizontal';
  } else if (placementId === 'bottomMobile' || variant === 'mobile-anchor') {
    containerStyles = 'w-full my-4 mx-auto rounded-xl border border-[#102A35]/10 bg-white p-3 text-center shadow-xs';
    slotMinHeight = 'min-h-[50px] sm:min-h-[60px]';
  }

  return (
    <aside 
      aria-label="Google AdSense Advertisement"
      className={`relative overflow-hidden transition-all ${containerStyles} ${className}`}
    >
      {/* Official AdSense Compliance Label */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-[#60747B] mb-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3F747C]"></span>
        <span>ADVERTISEMENT</span>
        <span className="text-[#60747B]/40">•</span>
        <span className="text-[9px] font-medium tracking-normal text-[#60747B]/70">Google AdSense</span>
      </div>

      {/* If admin specified custom embed HTML, render that; otherwise standard Google AdSense tag or Sandbox Preview */}
      {placement.customHtml ? (
        <div 
          className="w-full flex items-center justify-center overflow-hidden" 
          dangerouslySetInnerHTML={{ __html: placement.customHtml }} 
        />
      ) : (
        <div className={`w-full flex flex-col items-center justify-center ${slotMinHeight}`}>
          
          {/* Active Live Mode: Real Google AdSense Responsive Tag */}
          {!isTestMode && !isPlaceholderClient ? (
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: '60px' }}
              data-ad-client={clientId}
              data-ad-slot={slotId}
              data-ad-format={formatAttr}
              data-full-width-responsive="true"
            />
          ) : (
            /* Test Mode / Verification Sandbox Display (No external errors, perfectly styled for review) */
            <div className="w-full py-3 px-4 rounded-xl bg-white/80 border border-[#102A35]/8 text-[11px] text-[#60747B] flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#DCEFF2] text-[#3F747C] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <p className="font-semibold text-xs text-[#102A35]">
                    AdSense Verified Slot: <span className="font-mono text-[11px] text-[#3F747C]">{placement.label || placementId}</span>
                  </p>
                  <p className="text-[10px] text-[#60747B]">
                    Format: <span className="font-medium uppercase">{formatAttr}</span> • Slot ID: <span className="font-mono">{slotId}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#3F747C] bg-[#DCEFF2]/60 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                <span>Sandbox Review Active</span>
              </div>
            </div>
          )}

        </div>
      )}
    </aside>
  );
};
