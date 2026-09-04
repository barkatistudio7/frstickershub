import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { storage } from './server/storage';

dotenv.config();

const app = express();
const PORT = 3000;
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Body parsers with generous limits for file uploads
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Admin authentication middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.substring(7).trim();
  if (!storage.validateSession(token)) {
    return res.status(401).json({ error: 'Unauthorized: Session invalid or expired' });
  }
  next();
}

// ==================== PUBLIC API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'FR Stickers Hub', time: new Date().toISOString() });
});

// Get Categories
app.get('/api/categories', (req, res) => {
  const stickers = storage.getStickers();
  const fonts = storage.getFonts();

  const categories = [
    { id: 'trending', name: 'Trending', icon: '🔥', count: stickers.filter(s => s.isTrending).length + fonts.filter(f => f.isTrending).length, color: 'from-amber-500 to-rose-500', description: 'Hot stickers & viral fonts burning up WhatsApp right now' },
    { id: 'funny', name: 'Funny', icon: '😂', count: stickers.filter(s => s.category.toLowerCase() === 'funny').length, color: 'from-yellow-400 to-amber-500', description: 'Laughing memes, cats, reaction faces and comedy packs' },
    { id: 'love', name: 'Love', icon: '❤️', count: stickers.filter(s => s.category.toLowerCase() === 'love').length, color: 'from-pink-500 to-rose-600', description: 'Romantic couple stickers, heart emojis and sweet gestures' },
    { id: 'attitude', name: 'Attitude', icon: '😎', count: stickers.filter(s => s.category.toLowerCase() === 'attitude').length, color: 'from-purple-500 to-indigo-600', description: 'Swag, cool sunglasses, boss vibes and stylish bold quotes' },
    { id: 'islamic', name: 'Islamic', icon: '🕌', count: stickers.filter(s => s.category.toLowerCase() === 'islamic').length + fonts.filter(f => f.category.toLowerCase() === 'islamic').length, color: 'from-emerald-500 to-teal-600', description: 'Ramadan Mubarak, Eid celebrations, calligraphy and blessings' },
    { id: 'festival', name: 'Festival', icon: '🎉', count: stickers.filter(s => s.category.toLowerCase() === 'festival').length, color: 'from-violet-500 to-fuchsia-600', description: 'Celebrations, fireworks, party stickers and special events' },
    { id: 'animals', name: 'Animals', icon: '🐱', count: stickers.filter(s => s.category.toLowerCase() === 'animals').length, color: 'from-orange-400 to-amber-600', description: 'Cute pandas, cats, puppies and lovely animal animations' },
    { id: 'gaming', name: 'Gaming', icon: '🎮', count: stickers.filter(s => s.category.toLowerCase() === 'gaming').length + fonts.filter(f => f.category.toLowerCase() === 'gaming').length, color: 'from-cyan-500 to-blue-600', description: 'Gamer icons, pixel art, esports fonts and level up memes' },
    { id: 'text-stickers', name: 'Text Stickers', icon: '💬', count: stickers.filter(s => s.category.toLowerCase().includes('text')).length, color: 'from-blue-500 to-indigo-500', description: 'Catchphrases, neon badges, slang words and witty quotes' },
    { id: 'stylish-fonts', name: 'Stylish Fonts', icon: '✨', count: fonts.length, color: 'from-fuchsia-500 to-pink-500', description: 'Cyberpunk, cursive signatures, brutals and calligraphic packs' }
  ];

  res.json({ categories });
});

// Get Stickers
app.get('/api/stickers', (req, res) => {
  const { search, category, tag, filter } = req.query;
  const stickers = storage.getStickers({
    search: search ? String(search) : undefined,
    category: category ? String(category) : undefined,
    tag: tag ? String(tag) : undefined,
    filter: filter as any,
    includeUnpublished: false
  });
  res.json({ stickers });
});

// Get Single Sticker
app.get('/api/stickers/:slugOrId', (req, res) => {
  const sticker = storage.getStickerByIdOrSlug(req.params.slugOrId);
  if (!sticker) {
    return res.status(404).json({ error: 'Sticker not found' });
  }
  // Increment view count
  storage.incrementStats('sticker', sticker.id, 'view');
  res.json({ sticker });
});

// Get Fonts
app.get('/api/fonts', (req, res) => {
  const { search, category, tag, filter } = req.query;
  const fonts = storage.getFonts({
    search: search ? String(search) : undefined,
    category: category ? String(category) : undefined,
    tag: tag ? String(tag) : undefined,
    filter: filter as any,
    includeUnpublished: false
  });
  res.json({ fonts });
});

// Get Single Font
app.get('/api/fonts/:slugOrId', (req, res) => {
  const font = storage.getFontByIdOrSlug(req.params.slugOrId);
  if (!font) {
    return res.status(404).json({ error: 'Font not found' });
  }
  storage.incrementStats('font', font.id, 'view');
  res.json({ font });
});

// Download Resource
app.get('/api/download/:type/:id', (req, res) => {
  const { type, id } = req.params;
  
  if (type === 'sticker') {
    const sticker = storage.getStickerByIdOrSlug(id);
    if (!sticker) return res.status(404).send('Sticker not found');
    
    storage.incrementStats('sticker', sticker.id, 'download');

    // If imageUrl is data uri or local file
    if (sticker.imageUrl.startsWith('data:image/svg+xml')) {
      const svgData = decodeURIComponent(sticker.imageUrl.replace('data:image/svg+xml;utf8,', ''));
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `attachment; filename="${sticker.slug}.svg"`);
      return res.send(svgData);
    } else if (sticker.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), sticker.imageUrl);
      if (fs.existsSync(filePath)) {
        return res.download(filePath, `${sticker.slug}.${sticker.format}`);
      }
    }
    // Fallback: send response with image URL
    return res.redirect(sticker.imageUrl);
  } else if (type === 'font') {
    const font = storage.getFontByIdOrSlug(id);
    if (!font) return res.status(404).send('Font not found');

    storage.incrementStats('font', font.id, 'download');

    // If local uploaded file
    if (font.fontFileUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), font.fontFileUrl);
      if (fs.existsSync(filePath)) {
        return res.download(filePath, `${font.slug}.${font.format.toLowerCase()}`);
      }
    }

    // Generate a downloadable README / font package file bundle if virtual font
    const host = req.get('host');
    const baseUrl = process.env.APP_URL || (host ? `${req.protocol}://${host}` : 'https://fr-stickers-hub.app');
    const content = `FR Stickers Hub - Premium Typography Pack
Font: ${font.name}
Format: ${font.format}
Category: ${font.category}
Author: ${font.author}
License: Free for personal and social media use. Attribution to FR Stickers Hub appreciated!

Sample Glyphs:
${font.sampleAlphabet}

Visit: ${baseUrl}
`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${font.slug}-font-pack.txt"`);
    return res.send(content);
  }

  res.status(400).send('Invalid resource type');
});

// Track share or download
app.post('/api/track', (req, res) => {
  const { type, id, metric } = req.body;
  if (!type || !id || !['download', 'share', 'view'].includes(metric)) {
    return res.status(400).json({ error: 'Invalid tracking payload' });
  }
  storage.incrementStats(type, id, metric);
  res.json({ success: true });
});

// Ad Settings
app.get('/api/settings/ads', (req, res) => {
  res.json({ ads: storage.getAdSettings() });
});

// Dynamic Sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host');
  const baseUrl = process.env.APP_URL || (host ? `${req.protocol}://${host}` : 'https://fr-stickers-hub.app');
  const stickers = storage.getStickers();
  const fonts = storage.getFonts();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/stickers</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/fonts</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/categories</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/trending</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/popular</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${baseUrl}/privacy</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>${baseUrl}/terms</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>${baseUrl}/dmca</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
`;

  stickers.forEach(s => {
    xml += `  <url><loc>${baseUrl}/stickers/${s.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  });

  fonts.forEach(f => {
    xml += `  <url><loc>${baseUrl}/fonts/${f.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  });

  xml += `</urlset>`;
  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  const host = req.get('host');
  const baseUrl = process.env.APP_URL || (host ? `${req.protocol}://${host}` : 'https://fr-stickers-hub.app');
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.send(robots);
});

// ==================== ADMIN API ROUTES ====================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // Admin username check
  if (username.trim().toLowerCase() !== 'admin') {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const isValid = storage.verifyAdminPassword(password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = storage.createSession('admin');
  res.json({ success: true, token, username: 'admin' });
});

// Admin Verify Session
app.get('/api/admin/me', requireAdminAuth, (req, res) => {
  res.json({ authenticated: true, username: 'admin' });
});

// Admin Logout
app.post('/api/admin/logout', requireAdminAuth, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.substring(7).trim();
    storage.revokeSession(token);
  }
  res.json({ success: true });
});

// Admin Change Password
app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  if (!storage.verifyAdminPassword(currentPassword)) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
  storage.changeAdminPassword(newPassword);
  res.json({ success: true, message: 'Admin password updated successfully' });
});

// Admin Dashboard Stats
app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
  res.json({ stats: storage.getAdminStats() });
});

// Admin List All Stickers (including unpublished)
app.get('/api/admin/stickers', requireAdminAuth, (req, res) => {
  const stickers = storage.getStickers({ includeUnpublished: true });
  res.json({ stickers });
});

// Admin List All Fonts (including unpublished)
app.get('/api/admin/fonts', requireAdminAuth, (req, res) => {
  const fonts = storage.getFonts({ includeUnpublished: true });
  res.json({ fonts });
});

// Admin Upload File (PNG/WebP/TTF/OTF/WOFF)
app.post('/api/admin/upload', requireAdminAuth, (req, res) => {
  const { fileName, fileData, fileType } = req.body;
  if (!fileName || !fileData) {
    return res.status(400).json({ error: 'Missing file data' });
  }

  // Validate file extension
  const ext = path.extname(fileName).toLowerCase().replace('.', '');
  const allowedExts = ['png', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2', 'jpg', 'jpeg'];
  if (!allowedExts.includes(ext)) {
    return res.status(400).json({ error: `File type .${ext} is not supported. Allowed: ${allowedExts.join(', ')}` });
  }

  try {
    // Strip data URI header if present
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // 15MB limit
    if (buffer.length > 15 * 1024 * 1024) {
      return res.status(400).json({ error: 'File exceeds 15MB size limit' });
    }

    const uniqueId = crypto.randomBytes(8).toString('hex');
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const targetFilename = `${uniqueId}_${sanitizedName}`;
    const targetPath = path.join(UPLOADS_DIR, targetFilename);

    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${targetFilename}`;
    res.json({
      success: true,
      url: publicUrl,
      sizeBytes: buffer.length,
      format: ext
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to process file upload: ' + err.message });
  }
});

// Admin Create Sticker
app.post('/api/admin/stickers', requireAdminAuth, (req, res) => {
  const { name, category, tags, description, imageUrl, format, resolution, isFeatured, isTrending, isPublished } = req.body;
  
  if (!name || !category || !imageUrl) {
    return res.status(400).json({ error: 'Name, category and sticker image are required' });
  }

  const newSticker = storage.addSticker({
    name: name.trim(),
    slug: '',
    category: category.trim(),
    tags: Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean),
    description: description ? description.trim() : '',
    imageUrl,
    format: format === 'webp' ? 'webp' : 'png',
    resolution: resolution || '512x512',
    fileSizeBytes: req.body.fileSizeBytes || 65000,
    isFeatured: !!isFeatured,
    isTrending: !!isTrending,
    isPublished: isPublished !== undefined ? !!isPublished : true,
    author: 'Admin'
  });

  res.status(201).json({ success: true, sticker: newSticker });
});

// Admin Update Sticker
app.put('/api/admin/stickers/:id', requireAdminAuth, (req, res) => {
  const updated = storage.updateSticker(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Sticker not found' });
  }
  res.json({ success: true, sticker: updated });
});

// Admin Delete Sticker
app.delete('/api/admin/stickers/:id', requireAdminAuth, (req, res) => {
  const success = storage.deleteSticker(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Sticker not found' });
  }
  res.json({ success: true, message: 'Sticker deleted successfully' });
});

// Admin Create Font
app.post('/api/admin/fonts', requireAdminAuth, (req, res) => {
  const { name, category, tags, description, fontFileUrl, previewImageUrl, fontFamily, format, sampleAlphabet, isFeatured, isTrending, isPublished } = req.body;
  
  if (!name || !category || !fontFileUrl) {
    return res.status(400).json({ error: 'Name, category and font file URL are required' });
  }

  const newFont = storage.addFont({
    name: name.trim(),
    slug: '',
    category: category.trim(),
    tags: Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean),
    description: description ? description.trim() : '',
    fontFileUrl,
    previewImageUrl: previewImageUrl || '',
    fontFamily: fontFamily || "'Outfit', sans-serif",
    format: (format || 'TTF').toUpperCase() as any,
    fileSizeBytes: req.body.fileSizeBytes || 120000,
    sampleAlphabet: sampleAlphabet || 'The quick brown fox jumps over the lazy dog 1234567890',
    cssStyle: req.body.cssStyle || "font-weight: 700;",
    isFeatured: !!isFeatured,
    isTrending: !!isTrending,
    isPublished: isPublished !== undefined ? !!isPublished : true,
    author: 'Admin'
  });

  res.status(201).json({ success: true, font: newFont });
});

// Admin Update Font
app.put('/api/admin/fonts/:id', requireAdminAuth, (req, res) => {
  const updated = storage.updateFont(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Font not found' });
  }
  res.json({ success: true, font: updated });
});

// Admin Delete Font
app.delete('/api/admin/fonts/:id', requireAdminAuth, (req, res) => {
  const success = storage.deleteFont(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Font not found' });
  }
  res.json({ success: true, message: 'Font deleted successfully' });
});

// Admin Update Ad Settings
app.put('/api/admin/settings/ads', requireAdminAuth, (req, res) => {
  const updated = storage.updateAdSettings(req.body);
  res.json({ success: true, ads: updated });
});

// Google AdSense ads.txt verification endpoint
app.get('/ads.txt', (req, res) => {
  try {
    const adSettings = storage.getAdSettings();
    const rawId = adSettings.adSenseClientId || process.env.GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-9876543210123456';
    const pubId = rawId.replace(/^ca-/, '');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(`# Google AdSense Authorized Digital Sellers (ads.txt)\n# Domain: FR Stickers Hub\ngoogle.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`);
  } catch (err) {
    res.type('text/plain').send('google.com, pub-9876543210123456, DIRECT, f08c47fec0942fa0\n');
  }
});

// ==================== VITE SPA / STATIC HANDLER ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FR Stickers Hub] Server live on http://localhost:${PORT}`);
  });
}

startServer();
