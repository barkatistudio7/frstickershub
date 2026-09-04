export type ContentType = 'sticker' | 'font';

export interface StickerItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  imageUrl: string;
  format: 'png' | 'webp';
  resolution: string;
  fileSizeBytes: number;
  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;
  downloadsCount: number;
  sharesCount: number;
  viewsCount: number;
  createdAt: string;
  author: string;
}

export interface FontItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  fontFileUrl: string;
  previewImageUrl?: string;
  fontFamily: string;
  format: 'TTF' | 'OTF' | 'WOFF' | 'WOFF2';
  fileSizeBytes: number;
  sampleAlphabet: string;
  cssStyle?: string;
  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;
  downloadsCount: number;
  sharesCount: number;
  viewsCount: number;
  createdAt: string;
  author: string;
}

export type AdPlacementId = 
  | 'topBanner' 
  | 'betweenSections' 
  | 'sidebarDesktop' 
  | 'betweenGallery' 
  | 'stickersListing' 
  | 'fontsListing' 
  | 'detailModal' 
  | 'bottomMobile';

export interface AdPlacementConfig {
  id: AdPlacementId;
  label: string;
  description: string;
  enabled: boolean;
  adSlotId: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  customHtml?: string;
}

export interface AdSettings {
  adSenseClientId: string;
  isTestMode: boolean;
  placements: Record<string, AdPlacementConfig>;
}

export interface AdminStats {
  totalStickers: number;
  totalFonts: number;
  totalDownloads: number;
  totalShares: number;
  totalViews: number;
  popularContent: Array<{
    id: string;
    type: 'sticker' | 'font';
    name: string;
    category: string;
    downloads: number;
    shares: number;
  }>;
  recentUploads: Array<{
    id: string;
    type: 'sticker' | 'font';
    name: string;
    category: string;
    createdAt: string;
    published: boolean;
  }>;
}

export type ActiveTab = 
  | 'home'
  | 'stickers'
  | 'fonts'
  | 'categories'
  | 'trending'
  | 'popular'
  | 'favorites'
  | 'recent'
  | 'search'
  | 'sticker-detail'
  | 'font-detail'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'dmca'
  | 'admin'
  | 'admin-login'
  | 'admin-dashboard';

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  description: string;
  gradient: string;
}

export interface CategoryMeta {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
  description: string;
}
