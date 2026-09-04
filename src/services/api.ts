import { StickerItem, FontItem, AdSettings, AdminStats } from '../types';

const ADMIN_TOKEN_KEY = 'fr_stickers_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function removeAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Public
  async getStickers(params?: { search?: string; category?: string; tag?: string; filter?: string }): Promise<StickerItem[]> {
    const q = new URLSearchParams();
    if (params?.search) q.set('search', params.search);
    if (params?.category) q.set('category', params.category);
    if (params?.tag) q.set('tag', params.tag);
    if (params?.filter) q.set('filter', params.filter);
    
    const res = await fetch(`/api/stickers?${q.toString()}`);
    const data = await handleResponse<{ stickers: StickerItem[] }>(res);
    return data.stickers;
  },

  async getSticker(slugOrId: string): Promise<StickerItem> {
    const res = await fetch(`/api/stickers/${slugOrId}`);
    const data = await handleResponse<{ sticker: StickerItem }>(res);
    return data.sticker;
  },

  async getFonts(params?: { search?: string; category?: string; tag?: string; filter?: string }): Promise<FontItem[]> {
    const q = new URLSearchParams();
    if (params?.search) q.set('search', params.search);
    if (params?.category) q.set('category', params.category);
    if (params?.tag) q.set('tag', params.tag);
    if (params?.filter) q.set('filter', params.filter);

    const res = await fetch(`/api/fonts?${q.toString()}`);
    const data = await handleResponse<{ fonts: FontItem[] }>(res);
    return data.fonts;
  },

  async getFont(slugOrId: string): Promise<FontItem> {
    const res = await fetch(`/api/fonts/${slugOrId}`);
    const data = await handleResponse<{ font: FontItem }>(res);
    return data.font;
  },

  async getCategories() {
    const res = await fetch('/api/categories');
    return handleResponse<{ categories: any[] }>(res);
  },

  async track(type: 'sticker' | 'font', id: string, metric: 'download' | 'share' | 'view') {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, metric })
      });
    } catch (e) {
      // Non-blocking telemetry
      console.warn('Track failed:', e);
    }
  },

  async getAdSettings(): Promise<AdSettings> {
    const res = await fetch('/api/settings/ads');
    const data = await handleResponse<{ ads: AdSettings }>(res);
    return data.ads;
  },

  // Admin
  async adminLogin(username: string, password: string): Promise<{ token: string; username: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await handleResponse<{ success: boolean; token: string; username: string }>(res);
    setAdminToken(data.token);
    return data;
  },

  async adminVerify(): Promise<boolean> {
    const token = getAdminToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async adminLogout() {
    const token = getAdminToken();
    if (token) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    removeAdminToken();
  },

  async adminChangePassword(currentPassword: string, newPassword: string) {
    const token = getAdminToken();
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async adminGetStats(): Promise<AdminStats> {
    const token = getAdminToken();
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await handleResponse<{ stats: AdminStats }>(res);
    return data.stats;
  },

  async adminGetStickers(): Promise<StickerItem[]> {
    const token = getAdminToken();
    const res = await fetch('/api/admin/stickers', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await handleResponse<{ stickers: StickerItem[] }>(res);
    return data.stickers;
  },

  async adminGetFonts(): Promise<FontItem[]> {
    const token = getAdminToken();
    const res = await fetch('/api/admin/fonts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await handleResponse<{ fonts: FontItem[] }>(res);
    return data.fonts;
  },

  async adminUploadFile(fileName: string, fileData: string, fileType: string) {
    const token = getAdminToken();
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ fileName, fileData, fileType })
    });
    return handleResponse<{ success: boolean; url: string; sizeBytes: number; format: string }>(res);
  },

  async adminCreateSticker(stickerData: Partial<StickerItem>) {
    const token = getAdminToken();
    const res = await fetch('/api/admin/stickers', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(stickerData)
    });
    return handleResponse<{ success: boolean; sticker: StickerItem }>(res);
  },

  async adminUpdateSticker(id: string, updates: Partial<StickerItem>) {
    const token = getAdminToken();
    const res = await fetch(`/api/admin/stickers/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(updates)
    });
    return handleResponse<{ success: boolean; sticker: StickerItem }>(res);
  },

  async adminDeleteSticker(id: string) {
    const token = getAdminToken();
    const res = await fetch(`/api/admin/stickers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async adminCreateFont(fontData: Partial<FontItem>) {
    const token = getAdminToken();
    const res = await fetch('/api/admin/fonts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(fontData)
    });
    return handleResponse<{ success: boolean; font: FontItem }>(res);
  },

  async adminUpdateFont(id: string, updates: Partial<FontItem>) {
    const token = getAdminToken();
    const res = await fetch(`/api/admin/fonts/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(updates)
    });
    return handleResponse<{ success: boolean; font: FontItem }>(res);
  },

  async adminDeleteFont(id: string) {
    const token = getAdminToken();
    const res = await fetch(`/api/admin/fonts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async adminUpdateAdSettings(ads: Partial<AdSettings>) {
    const token = getAdminToken();
    const res = await fetch('/api/admin/settings/ads', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(ads)
    });
    return handleResponse<{ success: boolean; ads: AdSettings }>(res);
  }
};
