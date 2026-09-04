import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StickerItem, FontItem, AdSettings, AdminStats } from '../src/types';
import { initialStickers, initialFonts, defaultAdSettings } from './seedData';

interface DatabaseSchema {
  stickers: StickerItem[];
  fonts: FontItem[];
  adSettings: AdSettings;
  adminPasswordHash: string;
  adminSalt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to hash password with salt
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// In-memory active tokens set for admin session
const activeSessions = new Map<string, { username: string; createdAt: number }>();

class StorageManager {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          stickers: parsed.stickers || initialStickers,
          fonts: parsed.fonts || initialFonts,
          adSettings: parsed.adSettings || defaultAdSettings,
          adminPasswordHash: parsed.adminPasswordHash || '',
          adminSalt: parsed.adminSalt || ''
        };
      }
    } catch (e) {
      console.error('Error loading db.json, using defaults:', e);
    }

    // Default init
    const salt = crypto.randomBytes(16).toString('hex');
    const defaultPassword = process.env.ADMIN_PASSWORD || 'frstickers2026';
    const initialHash = hashPassword(defaultPassword, salt);

    const initialDb: DatabaseSchema = {
      stickers: initialStickers,
      fonts: initialFonts,
      adSettings: defaultAdSettings,
      adminPasswordHash: initialHash,
      adminSalt: salt
    };

    this.saveToFile(initialDb);
    return initialDb;
  }

  private saveToFile(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public save() {
    this.saveToFile(this.db);
  }

  // Admin Auth
  public verifyAdminPassword(password: string): boolean {
    if (!this.db.adminPasswordHash || !this.db.adminSalt) {
      const salt = crypto.randomBytes(16).toString('hex');
      this.db.adminSalt = salt;
      this.db.adminPasswordHash = hashPassword('frstickers2026', salt);
      this.save();
    }
    const checkHash = hashPassword(password, this.db.adminSalt);
    return crypto.timingSafeEqual(Buffer.from(checkHash), Buffer.from(this.db.adminPasswordHash));
  }

  public changeAdminPassword(newPass: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    this.db.adminSalt = salt;
    this.db.adminPasswordHash = hashPassword(newPass, salt);
    this.save();
  }

  public createSession(username: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.set(token, { username, createdAt: Date.now() });
    return token;
  }

  public validateSession(token: string): boolean {
    if (!token) return false;
    const session = activeSessions.get(token);
    if (!session) return false;
    // 7 days expiration
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - session.createdAt > maxAge) {
      activeSessions.delete(token);
      return false;
    }
    return true;
  }

  public revokeSession(token: string) {
    activeSessions.delete(token);
  }

  // Stickers
  public getStickers(options?: {
    search?: string;
    category?: string;
    tag?: string;
    filter?: 'trending' | 'new' | 'popular' | 'featured' | 'all';
    includeUnpublished?: boolean;
  }): StickerItem[] {
    let list = this.db.stickers;
    if (!options?.includeUnpublished) {
      list = list.filter(s => s.isPublished);
    }

    if (options?.category && options.category.toLowerCase() !== 'all') {
      const catLower = options.category.toLowerCase();
      list = list.filter(s => s.category.toLowerCase() === catLower);
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q)
      );
    }

    if (options?.tag) {
      const tagLower = options.tag.toLowerCase();
      list = list.filter(s => s.tags.some(t => t.toLowerCase() === tagLower));
    }

    if (options?.filter === 'trending') {
      list = list.filter(s => s.isTrending || s.sharesCount > 4000);
      list.sort((a, b) => b.sharesCount - a.sharesCount);
    } else if (options?.filter === 'popular') {
      list.sort((a, b) => b.downloadsCount - a.downloadsCount);
    } else if (options?.filter === 'new') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (options?.filter === 'featured') {
      list = list.filter(s => s.isFeatured);
    }

    return list;
  }

  public getStickerByIdOrSlug(idOrSlug: string, includeUnpublished = false): StickerItem | undefined {
    return this.db.stickers.find(s => 
      (s.id === idOrSlug || s.slug === idOrSlug) && (includeUnpublished || s.isPublished)
    );
  }

  public addSticker(sticker: Omit<StickerItem, 'id' | 'createdAt' | 'downloadsCount' | 'sharesCount' | 'viewsCount'>): StickerItem {
    const id = 'stk-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newSticker: StickerItem = {
      ...sticker,
      id,
      slug: sticker.slug || this.generateSlug(sticker.name),
      downloadsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      createdAt: new Date().toISOString()
    };
    this.db.stickers.unshift(newSticker);
    this.save();
    return newSticker;
  }

  public updateSticker(id: string, updates: Partial<StickerItem>): StickerItem | null {
    const index = this.db.stickers.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.db.stickers[index] = {
      ...this.db.stickers[index],
      ...updates,
      id // preserve ID
    };
    this.save();
    return this.db.stickers[index];
  }

  public deleteSticker(id: string): boolean {
    const initialLen = this.db.stickers.length;
    this.db.stickers = this.db.stickers.filter(s => s.id !== id);
    if (this.db.stickers.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Fonts
  public getFonts(options?: {
    search?: string;
    category?: string;
    tag?: string;
    filter?: 'trending' | 'new' | 'popular' | 'featured' | 'all';
    includeUnpublished?: boolean;
  }): FontItem[] {
    let list = this.db.fonts;
    if (!options?.includeUnpublished) {
      list = list.filter(f => f.isPublished);
    }

    if (options?.category && options.category.toLowerCase() !== 'all') {
      const catLower = options.category.toLowerCase();
      list = list.filter(f => f.category.toLowerCase() === catLower);
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(f => 
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q)) ||
        f.description.toLowerCase().includes(q)
      );
    }

    if (options?.tag) {
      const tagLower = options.tag.toLowerCase();
      list = list.filter(f => f.tags.some(t => t.toLowerCase() === tagLower));
    }

    if (options?.filter === 'trending') {
      list = list.filter(f => f.isTrending || f.sharesCount > 4000);
      list.sort((a, b) => b.sharesCount - a.sharesCount);
    } else if (options?.filter === 'popular') {
      list.sort((a, b) => b.downloadsCount - a.downloadsCount);
    } else if (options?.filter === 'new') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (options?.filter === 'featured') {
      list = list.filter(f => f.isFeatured);
    }

    return list;
  }

  public getFontByIdOrSlug(idOrSlug: string, includeUnpublished = false): FontItem | undefined {
    return this.db.fonts.find(f => 
      (f.id === idOrSlug || f.slug === idOrSlug) && (includeUnpublished || f.isPublished)
    );
  }

  public addFont(font: Omit<FontItem, 'id' | 'createdAt' | 'downloadsCount' | 'sharesCount' | 'viewsCount'>): FontItem {
    const id = 'fnt-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newFont: FontItem = {
      ...font,
      id,
      slug: font.slug || this.generateSlug(font.name),
      downloadsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      createdAt: new Date().toISOString()
    };
    this.db.fonts.unshift(newFont);
    this.save();
    return newFont;
  }

  public updateFont(id: string, updates: Partial<FontItem>): FontItem | null {
    const index = this.db.fonts.findIndex(f => f.id === id);
    if (index === -1) return null;
    this.db.fonts[index] = {
      ...this.db.fonts[index],
      ...updates,
      id
    };
    this.save();
    return this.db.fonts[index];
  }

  public deleteFont(id: string): boolean {
    const initialLen = this.db.fonts.length;
    this.db.fonts = this.db.fonts.filter(f => f.id !== id);
    if (this.db.fonts.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Analytics
  public incrementStats(type: 'sticker' | 'font', id: string, metric: 'download' | 'share' | 'view') {
    if (type === 'sticker') {
      const item = this.db.stickers.find(s => s.id === id || s.slug === id);
      if (item) {
        if (metric === 'download') item.downloadsCount++;
        else if (metric === 'share') item.sharesCount++;
        else if (metric === 'view') item.viewsCount++;
        this.save();
      }
    } else {
      const item = this.db.fonts.find(f => f.id === id || f.slug === id);
      if (item) {
        if (metric === 'download') item.downloadsCount++;
        else if (metric === 'share') item.sharesCount++;
        else if (metric === 'view') item.viewsCount++;
        this.save();
      }
    }
  }

  public getAdminStats(): AdminStats {
    const totalStickers = this.db.stickers.length;
    const totalFonts = this.db.fonts.length;

    const totalDownloads = 
      this.db.stickers.reduce((acc, s) => acc + s.downloadsCount, 0) +
      this.db.fonts.reduce((acc, f) => acc + f.downloadsCount, 0);

    const totalShares = 
      this.db.stickers.reduce((acc, s) => acc + s.sharesCount, 0) +
      this.db.fonts.reduce((acc, f) => acc + f.sharesCount, 0);

    const totalViews = 
      this.db.stickers.reduce((acc, s) => acc + s.viewsCount, 0) +
      this.db.fonts.reduce((acc, f) => acc + f.viewsCount, 0);

    // Popular items
    const combined = [
      ...this.db.stickers.map(s => ({
        id: s.id,
        type: 'sticker' as const,
        name: s.name,
        category: s.category,
        downloads: s.downloadsCount,
        shares: s.sharesCount
      })),
      ...this.db.fonts.map(f => ({
        id: f.id,
        type: 'font' as const,
        name: f.name,
        category: f.category,
        downloads: f.downloadsCount,
        shares: f.sharesCount
      }))
    ];
    combined.sort((a, b) => b.downloads - a.downloads);
    const popularContent = combined.slice(0, 8);

    // Recent uploads
    const recentCombined = [
      ...this.db.stickers.map(s => ({
        id: s.id,
        type: 'sticker' as const,
        name: s.name,
        category: s.category,
        createdAt: s.createdAt,
        published: s.isPublished
      })),
      ...this.db.fonts.map(f => ({
        id: f.id,
        type: 'font' as const,
        name: f.name,
        category: f.category,
        createdAt: f.createdAt,
        published: f.isPublished
      }))
    ];
    recentCombined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentUploads = recentCombined.slice(0, 8);

    return {
      totalStickers,
      totalFonts,
      totalDownloads,
      totalShares,
      totalViews,
      popularContent,
      recentUploads
    };
  }

  // Ad Settings
  public getAdSettings(): AdSettings {
    return this.db.adSettings;
  }

  public updateAdSettings(updates: Partial<AdSettings>): AdSettings {
    this.db.adSettings = {
      ...this.db.adSettings,
      ...updates
    };
    this.save();
    return this.db.adSettings;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

export const storage = new StorageManager();
