import { StickerItem, FontItem, AdSettings } from '../src/types';

// Helper to generate SVG sticker data URIs
function makeSvgSticker(svgContent: string): string {
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">${svgContent}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
}

export const initialStickers: StickerItem[] = [
  {
    id: 'stk-1',
    slug: 'funny-laugh-cat-sticker',
    name: 'Tears of Joy Laughing Cat',
    category: 'Funny',
    tags: ['cat', 'meme', 'laugh', 'whatsapp', 'funny', 'tears'],
    description: 'The ultimate viral laughing cat sticker with dramatic crying laughing eyes and hilarious expression for WhatsApp and Telegram.',
    imageUrl: makeSvgSticker(`
      <defs>
        <radialGradient id="catGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FFD166"/>
          <stop offset="100%" stop-color="#F77F00"/>
        </radialGradient>
        <filter id="stickerShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <!-- Ears -->
      <polygon points="120,80 180,180 80,170" fill="#E85D04" stroke="#FFF" stroke-width="14" stroke-linejoin="round"/>
      <polygon points="130,100 170,170 100,165" fill="#FFAA00"/>
      <polygon points="392,80 332,180 432,170" fill="#E85D04" stroke="#FFF" stroke-width="14" stroke-linejoin="round"/>
      <polygon points="382,100 342,170 412,165" fill="#FFAA00"/>
      <!-- Face -->
      <circle cx="256" cy="270" r="180" fill="url(#catGrad)" stroke="#FFFFFF" stroke-width="16" filter="url(#stickerShadow)"/>
      <!-- Closed Squinting Laugh Eyes -->
      <path d="M 150 240 Q 185 190 220 240" fill="none" stroke="#222" stroke-width="16" stroke-linecap="round"/>
      <path d="M 292 240 Q 327 190 362 240" fill="none" stroke="#222" stroke-width="16" stroke-linecap="round"/>
      <!-- Tear Streams -->
      <path d="M 120 260 C 100 310, 90 360, 110 390 C 130 420, 160 380, 140 330 Z" fill="#00B4D8" stroke="#FFF" stroke-width="6"/>
      <path d="M 392 260 C 412 310, 422 360, 402 390 C 382 420, 352 380, 372 330 Z" fill="#00B4D8" stroke="#FFF" stroke-width="6"/>
      <!-- Pink Cute Nose -->
      <polygon points="256,275 240,260 272,260" fill="#D90429"/>
      <!-- Wide Open Laugh Mouth -->
      <path d="M 180 300 Q 256 420 332 300 Z" fill="#780000" stroke="#222" stroke-width="10"/>
      <!-- Tongue -->
      <path d="M 220 355 Q 256 310 292 355 Q 256 410 220 355 Z" fill="#FF4D6D"/>
      <rect x="236" y="300" width="40" height="20" rx="6" fill="#FFFFFF"/>
      <!-- Whiskers -->
      <line x1="80" y1="280" x2="160" y2="290" stroke="#FFF" stroke-width="10" stroke-linecap="round"/>
      <line x1="85" y1="315" x2="160" y2="310" stroke="#FFF" stroke-width="10" stroke-linecap="round"/>
      <line x1="432" y1="280" x2="352" y2="290" stroke="#FFF" stroke-width="10" stroke-linecap="round"/>
      <line x1="427" y1="315" x2="352" y2="310" stroke="#FFF" stroke-width="10" stroke-linecap="round"/>
    `),
    format: 'png',
    resolution: '512x512',
    fileSizeBytes: 84200,
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    downloadsCount: 14820,
    sharesCount: 5320,
    viewsCount: 28940,
    createdAt: '2026-03-01T10:00:00.000Z',
    author: 'FR Stickers Studio'
  },
  {
    id: 'stk-2',
    slug: 'attitude-boss-shades',
    name: 'Boss Attitude Neon Shades',
    category: 'Attitude',
    tags: ['attitude', 'shades', 'cool', 'swag', 'boss', 'gangsta'],
    description: 'Ultra sleek black pixel attitude emoji wearing futuristic reflective neon sunglasses with high swagger vibe.',
    imageUrl: makeSvgSticker(`
      <defs>
        <linearGradient id="shadesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7209B7"/>
          <stop offset="50%" stop-color="#4361EE"/>
          <stop offset="100%" stop-color="#4CC9F0"/>
        </linearGradient>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFDD00"/>
          <stop offset="100%" stop-color="#FF9E00"/>
        </linearGradient>
      </defs>
      <!-- Base Head -->
      <circle cx="256" cy="256" r="190" fill="url(#skinGrad)" stroke="#FFFFFF" stroke-width="16"/>
      <!-- Cool Smirk -->
      <path d="M 230 330 Q 300 370 340 320" fill="none" stroke="#1D1E2C" stroke-width="14" stroke-linecap="round"/>
      <circle cx="342" cy="318" r="4" fill="#1D1E2C"/>
      <!-- Gold Chain -->
      <path d="M 170 410 Q 256 460 342 410" fill="none" stroke="#FFB703" stroke-width="22" stroke-linecap="round"/>
      <path d="M 170 410 Q 256 460 342 410" fill="none" stroke="#FB8500" stroke-width="12" stroke-dasharray="14,14" stroke-linecap="round"/>
      <!-- Boss Sunglasses Frame -->
      <g filter="drop-shadow(0px 10px 15px rgba(0,0,0,0.5))">
        <!-- Bridge -->
        <rect x="230" y="195" width="52" height="18" rx="4" fill="#111827"/>
        <!-- Left Lens -->
        <path d="M 100 170 L 235 170 C 235 240, 205 275, 120 270 C 95 265, 88 230, 100 170 Z" fill="url(#shadesGrad)" stroke="#111827" stroke-width="14"/>
        <line x1="110" y1="185" x2="160" y2="255" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.6"/>
        <line x1="125" y1="185" x2="145" y2="215" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
        <!-- Right Lens -->
        <path d="M 412 170 L 277 170 C 277 240, 307 275, 392 270 C 417 265, 424 230, 412 170 Z" fill="url(#shadesGrad)" stroke="#111827" stroke-width="14"/>
        <line x1="290" y1="185" x2="340" y2="255" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.6"/>
        <line x1="305" y1="185" x2="325" y2="215" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
      </g>
    `),
    format: 'png',
    resolution: '512x512',
    fileSizeBytes: 91500,
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    downloadsCount: 22100,
    sharesCount: 8940,
    viewsCount: 41200,
    createdAt: '2026-03-02T14:20:00.000Z',
    author: 'FR Stickers Studio'
  },
  {
    id: 'stk-3',
    slug: 'ramadan-mubarak-crescent',
    name: 'Ramadan Mubarak Golden Crescent',
    category: 'Islamic',
    tags: ['islamic', 'ramadan', 'mubarak', 'crescent', 'lantern', 'gold', 'festival'],
    description: 'Majestic golden crescent moon with glowing decorative fanous lantern and stars, perfect for Islamic greetings on WhatsApp.',
    imageUrl: makeSvgSticker(`
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF3B0"/>
          <stop offset="40%" stop-color="#E09F3E"/>
          <stop offset="100%" stop-color="#9E2A2B"/>
        </linearGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFE49E" stop-opacity="1"/>
          <stop offset="100%" stop-color="#FFE49E" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Big Golden Crescent -->
      <path d="M 230 60 C 350 60 440 160 440 280 C 440 400 340 480 200 470 C 300 430 360 340 340 240 C 325 160 270 90 230 60 Z" 
            fill="url(#goldGrad)" stroke="#FFFFFF" stroke-width="12" stroke-linejoin="round"/>
      <!-- Hanging Lantern Chain -->
      <line x1="280" y1="120" x2="280" y2="230" stroke="#E09F3E" stroke-width="6" stroke-dasharray="6,4"/>
      <!-- Lantern (Fanous) -->
      <g transform="translate(245, 230)">
        <polygon points="35,0 15,20 55,20" fill="#9E2A2B"/>
        <rect x="15" y="20" width="40" height="50" rx="6" fill="#FFF3B0" stroke="#E09F3E" stroke-width="4"/>
        <circle cx="35" cy="45" r="16" fill="url(#glowGrad)"/>
        <polygon points="15,70 55,70 35,90" fill="#9E2A2B"/>
        <circle cx="35" cy="95" r="5" fill="#E09F3E"/>
      </g>
      <!-- Sparkle Stars -->
      <polygon points="150,140 155,155 170,160 155,165 150,180 145,165 130,160 145,155" fill="#FFF3B0" stroke="#FFF" stroke-width="2"/>
      <polygon points="380,100 384,115 400,118 384,122 380,138 376,122 360,118 376,115" fill="#FFF3B0" stroke="#FFF" stroke-width="2"/>
      <polygon points="130,320 134,330 145,333 134,337 130,348 126,337 115,333 126,330" fill="#FFF3B0" stroke="#FFF" stroke-width="2"/>
      <!-- Calligraphic Badge Text "Mubarak" -->
      <rect x="100" y="380" width="220" height="55" rx="28" fill="#1B4332" stroke="#D8F3DC" stroke-width="6"/>
      <text x="210" y="416" font-family="'Outfit', sans-serif" font-weight="bold" font-size="24" fill="#FFE3A8" text-anchor="middle">RAMADAN</text>
    `),
    format: 'webp',
    resolution: '512x512',
    fileSizeBytes: 76500,
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    downloadsCount: 18900,
    sharesCount: 7420,
    viewsCount: 35100,
    createdAt: '2026-03-01T08:00:00.000Z',
    author: 'FR Stickers Studio'
  },
  {
    id: 'stk-4',
    slug: 'love-heart-explosion',
    name: 'Neon Heart Love Explosion',
    category: 'Love',
    tags: ['love', 'heart', 'romance', 'couple', 'valentine', 'neon', 'pink'],
    description: 'Dynamic gradient 3D glossy heart with sparkling romantic wings and vibrant pink particles for lovers.',
    imageUrl: makeSvgSticker(`
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF4D6D"/>
          <stop offset="50%" stop-color="#C9184A"/>
          <stop offset="100%" stop-color="#590D22"/>
        </linearGradient>
      </defs>
      <!-- Angelic Wings -->
      <path d="M 120 200 C 60 140, 40 240, 100 290 C 70 290, 80 340, 150 320" fill="#FFF" stroke="#FF758F" stroke-width="8" opacity="0.9"/>
      <path d="M 392 200 C 452 140, 472 240, 412 290 C 442 290, 432 340, 362 320" fill="#FFF" stroke="#FF758F" stroke-width="8" opacity="0.9"/>
      <!-- Main Heart -->
      <path d="M 256 420 C 130 330, 80 230, 140 150 C 190 85, 256 160, 256 160 C 256 160, 322 85, 372 150 C 432 230, 382 330, 256 420 Z" 
            fill="url(#heartGrad)" stroke="#FFFFFF" stroke-width="14" stroke-linejoin="round"/>
      <!-- Gloss Highlight -->
      <path d="M 160 170 C 145 195, 145 230, 165 250 C 170 230, 175 190, 195 175 C 180 170, 168 170, 160 170 Z" fill="#FFFFFF" opacity="0.7"/>
      <!-- Little Floating Hearts -->
      <path d="M 390 120 C 370 100, 355 120, 370 135 L 378 145 L 386 135 C 401 120, 386 100, 390 120 Z" fill="#FF4D6D" stroke="#FFF" stroke-width="4"/>
      <path d="M 110 380 C 95 365, 85 380, 95 390 L 102 400 L 109 390 C 119 380, 109 365, 110 380 Z" fill="#FF758F" stroke="#FFF" stroke-width="4"/>
    `),
    format: 'png',
    resolution: '512x512',
    fileSizeBytes: 62400,
    isFeatured: false,
    isTrending: true,
    isPublished: true,
    downloadsCount: 16750,
    sharesCount: 6810,
    viewsCount: 31200,
    createdAt: '2026-02-28T16:00:00.000Z',
    author: 'FR Stickers Studio'
  },
  {
    id: 'stk-5',
    slug: 'gaming-level-up-controller',
    name: 'Cyberpunk Game Controller Level Up',
    category: 'Gaming',
    tags: ['gaming', 'gamer', 'controller', 'levelup', 'cyberpunk', 'esports', 'neon'],
    description: 'Vibrant neon gamepad sticker with D-pad, lightning bolts, and LEVEL UP banner for discord & whatsapp gamers.',
    imageUrl: makeSvgSticker(`
      <defs>
        <linearGradient id="gameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3A0CA3"/>
          <stop offset="50%" stop-color="#4361EE"/>
          <stop offset="100%" stop-color="#4CC9F0"/>
        </linearGradient>
      </defs>
      <!-- Lightning effects -->
      <polygon points="80,120 130,120 110,170 150,170 70,260 100,190 60,190" fill="#FFD166" stroke="#FFF" stroke-width="4"/>
      <polygon points="432,120 382,120 402,170 362,170 442,260 412,190 452,190" fill="#FFD166" stroke="#FFF" stroke-width="4"/>
      <!-- Controller Body -->
      <path d="M 140 200 C 160 170, 352 170, 372 200 C 430 220, 440 370, 390 390 C 350 400, 320 320, 290 320 C 270 320, 260 330, 256 330 C 252 330, 242 320, 222 320 C 192 320, 162 400, 122 390 C 72 370, 82 220, 140 200 Z" 
            fill="url(#gameGrad)" stroke="#FFFFFF" stroke-width="14" stroke-linejoin="round"/>
      <!-- D-Pad Left -->
      <rect x="150" y="245" width="45" height="15" rx="3" fill="#111827"/>
      <rect x="165" y="230" width="15" height="45" rx="3" fill="#111827"/>
      <!-- Action Buttons Right -->
      <circle cx="340" cy="235" r="10" fill="#F72585" stroke="#FFF" stroke-width="3"/>
      <circle cx="365" cy="255" r="10" fill="#4CC9F0" stroke="#FFF" stroke-width="3"/>
      <circle cx="315" cy="255" r="10" fill="#7209B7" stroke="#FFF" stroke-width="3"/>
      <circle cx="340" cy="275" r="10" fill="#4ADE80" stroke="#FFF" stroke-width="3"/>
      <!-- Joysticks -->
      <circle cx="210" cy="285" r="22" fill="#1E293B" stroke="#64748B" stroke-width="5"/>
      <circle cx="280" cy="285" r="22" fill="#1E293B" stroke="#64748B" stroke-width="5"/>
      <!-- Badge "LEVEL UP" -->
      <g transform="translate(130, 370)">
        <rect x="0" y="0" width="252" height="50" rx="14" fill="#F72585" stroke="#FFFFFF" stroke-width="8"/>
        <text x="126" y="34" font-family="'Outfit', sans-serif" font-weight="900" font-size="26" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">LEVEL UP!</text>
      </g>
    `),
    format: 'png',
    resolution: '512x512',
    fileSizeBytes: 89100,
    isFeatured: true,
    isTrending: false,
    isPublished: true,
    downloadsCount: 11400,
    sharesCount: 3950,
    viewsCount: 22800,
    createdAt: '2026-02-27T11:15:00.000Z',
    author: 'FR Stickers Studio'
  },
  {
    id: 'stk-6',
    slug: 'cute-chubby-panda-boba',
    name: 'Chubby Panda Drinking Boba Tea',
    category: 'Animals',
    tags: ['panda', 'animal', 'cute', 'boba', 'kawaii', 'bubbletea'],
    description: 'Super adorable kawaii chubby panda happily sipping brown sugar pearl boba milk tea.',
    imageUrl: makeSvgSticker(`
      <defs>
        <radialGradient id="pandaBody" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#E2E8F0"/>
        </radialGradient>
      </defs>
      <!-- Ears -->
      <circle cx="150" cy="140" r="45" fill="#1E293B" stroke="#FFF" stroke-width="10"/>
      <circle cx="362" cy="140" r="45" fill="#1E293B" stroke="#FFF" stroke-width="10"/>
      <!-- Body/Head Round Shape -->
      <ellipse cx="256" cy="270" rx="170" ry="160" fill="url(#pandaBody)" stroke="#1E293B" stroke-width="14"/>
      <!-- Black Eye Patches -->
      <ellipse cx="190" cy="230" rx="35" ry="42" fill="#1E293B" transform="rotate(-15, 190, 230)"/>
      <ellipse cx="322" cy="230" rx="35" ry="42" fill="#1E293B" transform="rotate(15, 322, 230)"/>
      <!-- Sparkling Anime Eyes -->
      <circle cx="195" cy="225" r="14" fill="#FFFFFF"/>
      <circle cx="190" cy="235" r="6" fill="#FFFFFF"/>
      <circle cx="317" cy="225" r="14" fill="#FFFFFF"/>
      <circle cx="322" cy="235" r="6" fill="#FFFFFF"/>
      <!-- Nose & Mouth -->
      <ellipse cx="256" cy="265" rx="14" ry="10" fill="#1E293B"/>
      <path d="M 245 275 Q 256 285 267 275" fill="none" stroke="#1E293B" stroke-width="6" stroke-linecap="round"/>
      <!-- Pink Blush -->
      <ellipse cx="145" cy="275" rx="20" ry="12" fill="#FF85A1" opacity="0.6"/>
      <ellipse cx="367" cy="275" rx="20" ry="12" fill="#FF85A1" opacity="0.6"/>
      <!-- Boba Cup -->
      <g transform="translate(210, 270)">
        <line x1="46" y1="-20" x2="46" y2="40" stroke="#780000" stroke-width="14" stroke-linecap="round"/>
        <path d="M 10 20 L 20 110 C 20 125, 72 125, 72 110 L 82 20 Z" fill="#E9D8A6" stroke="#1E293B" stroke-width="8"/>
        <!-- Boba Pearls -->
        <circle cx="35" cy="95" r="8" fill="#582F0E"/>
        <circle cx="55" cy="95" r="8" fill="#582F0E"/>
        <circle cx="45" cy="80" r="8" fill="#582F0E"/>
      </g>
    `),
    format: 'png',
    resolution: '512x512',
    fileSizeBytes: 71200,
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    downloadsCount: 9450,
    sharesCount: 3120,
    viewsCount: 19400,
    createdAt: '2026-02-26T09:00:00.000Z',
    author: 'FR Stickers Studio'
  },
  {
    id: 'stk-7',
    slug: 'eid-mubarak-celebration',
    name: 'Eid Mubarak Festive Fireworks',
    category: 'Festival',
    tags: ['eid', 'festival', 'celebration', 'fireworks', 'mubarak', 'party'],
    description: 'Festive Eid Mubarak celebration graphic with golden minaret silhouette and dazzling colorful fireworks.',
    imageUrl: makeSvgSticker(`
      <defs>
        <radialGradient id="skyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#03045E"/>
          <stop offset="100%" stop-color="#000814"/>
        </radialGradient>
      </defs>
      <!-- Night Dome Badge -->
      <circle cx="256" cy="256" r="185" fill="url(#skyGrad)" stroke="#FFD166" stroke-width="12"/>
      <!-- Fireworks Rays -->
      <g stroke-linecap="round" stroke-width="6">
        <line x1="256" y1="90" x2="256" y2="120" stroke="#FF595E"/>
        <line x1="220" y1="100" x2="235" y2="125" stroke="#FFCA3A"/>
        <line x1="292" y1="100" x2="277" y2="125" stroke="#8AC926"/>
        <line x1="140" y1="180" x2="165" y2="195" stroke="#1982C4"/>
        <line x1="372" y1="180" x2="347" y2="195" stroke="#6A4C93"/>
      </g>
      <!-- Mosque Skyline Silhouette -->
      <path d="M 120 380 L 120 310 L 135 310 L 135 270 L 145 250 L 155 270 L 155 310 L 170 310 L 170 380 Z" fill="#FFD166"/>
      <!-- Main Dome -->
      <path d="M 180 380 L 180 320 C 180 260, 332 260, 332 320 L 332 380 Z" fill="#FFD166"/>
      <polygon points="256,230 250,260 262,260" fill="#FFD166"/>
      <circle cx="256" cy="225" r="5" fill="#FFD166"/>
      <!-- Right Minaret -->
      <path d="M 342 380 L 342 310 L 357 310 L 357 270 L 367 250 L 377 270 L 377 310 L 392 310 L 392 380 Z" fill="#FFD166"/>
      <!-- Eid Mubarak Banner -->
      <rect x="90" y="375" width="332" height="60" rx="14" fill="#06D6A0" stroke="#FFF" stroke-width="6"/>
      <text x="256" y="415" font-family="'Outfit', sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF" text-anchor="middle">EID MUBARAK</text>
    `),
    format: 'webp',
    resolution: '512x512',
    fileSizeBytes: 78900,
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    downloadsCount: 15400,
    sharesCount: 6200,
    viewsCount: 29800,
    createdAt: '2026-02-25T14:00:00.000Z',
    author: 'FR Stickers Studio'
  },
  {
    id: 'stk-8',
    slug: 'viral-text-deal-with-it',
    name: 'DEAL WITH IT Pixel Text Sticker',
    category: 'Text Stickers',
    tags: ['text', 'typography', 'dealwithit', 'meme', 'pixel', 'sunglasses', 'funny'],
    description: 'Classic 8-bit aesthetic retro text sticker saying DEAL WITH IT with pixel shade accents.',
    imageUrl: makeSvgSticker(`
      <!-- Outer Sticker Outline Shape -->
      <rect x="40" y="150" width="432" height="212" rx="28" fill="#111827" stroke="#FFFFFF" stroke-width="16"/>
      <!-- Inner Accent Border -->
      <rect x="52" y="162" width="408" height="188" rx="20" fill="#0F172A" stroke="#38BDF8" stroke-width="4"/>
      <!-- Pixel Text -->
      <text x="256" y="245" font-family="'Space Mono', monospace" font-weight="900" font-size="44" fill="#FACC15" text-anchor="middle" letter-spacing="4">DEAL WITH IT</text>
      <!-- Pixel Sunglasses inside text banner -->
      <g transform="translate(180, 270) scale(1.4)">
        <rect x="0" y="0" width="45" height="16" fill="#FFFFFF"/>
        <rect x="65" y="0" width="45" height="16" fill="#FFFFFF"/>
        <rect x="45" y="0" width="20" height="6" fill="#FFFFFF"/>
        <!-- Black Lenses -->
        <rect x="4" y="4" width="37" height="10" fill="#000"/>
        <rect x="69" y="4" width="37" height="10" fill="#000"/>
        <!-- White Pixel Glints -->
        <rect x="8" y="6" width="6" height="6" fill="#FFF"/>
        <rect x="73" y="6" width="6" height="6" fill="#FFF"/>
      </g>
    `),
    format: 'png',
    resolution: '512x512',
    fileSizeBytes: 54100,
    isFeatured: false,
    isTrending: true,
    isPublished: true,
    downloadsCount: 13900,
    sharesCount: 5120,
    viewsCount: 26400,
    createdAt: '2026-02-24T18:30:00.000Z',
    author: 'FR Stickers Studio'
  }
];

export const initialFonts: FontItem[] = [
  {
    id: 'fnt-1',
    slug: 'cyber-glitch-display',
    name: 'Cyber Glitch Display',
    category: 'Gaming',
    tags: ['cyberpunk', 'glitch', 'display', 'modern', 'futuristic', 'gaming', 'bold'],
    description: 'An aggressive, angular techno font engineered for high-energy esports, gaming graphics, and futuristic headlines.',
    fontFileUrl: '/downloads/fonts/cyber-glitch-display.otf',
    fontFamily: "'Space Mono', monospace",
    format: 'OTF',
    fileSizeBytes: 184500,
    sampleAlphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$',
    cssStyle: "font-family: 'Space Mono', monospace; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;",
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    downloadsCount: 17800,
    sharesCount: 6420,
    viewsCount: 34100,
    createdAt: '2026-03-01T12:00:00.000Z',
    author: 'FR Typography Labs'
  },
  {
    id: 'fnt-2',
    slug: 'royal-signature-script',
    name: 'Royal Signature Script',
    category: 'Stylish Fonts',
    tags: ['signature', 'cursive', 'luxury', 'wedding', 'calligraphy', 'elegant'],
    description: 'Ultra luxurious, flowing handwritten signature typeface with organic flourish ligatures and high romantic aesthetic.',
    fontFileUrl: '/downloads/fonts/royal-signature-script.ttf',
    fontFamily: "'Playfair Display', cursive, serif",
    format: 'TTF',
    fileSizeBytes: 242000,
    sampleAlphabet: 'The quick brown fox jumps over the lazy dog & 1234567890',
    cssStyle: "font-family: 'Playfair Display', serif; font-style: italic; font-weight: 600; letter-spacing: 0.5px;",
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    downloadsCount: 24100,
    sharesCount: 9800,
    viewsCount: 48900,
    createdAt: '2026-03-02T15:30:00.000Z',
    author: 'FR Typography Labs'
  },
  {
    id: 'fnt-3',
    slug: 'neo-brutalist-black',
    name: 'Neo Brutalist Ultra Black',
    category: 'Attitude',
    tags: ['brutalist', 'heavy', 'poster', 'bold', 'punchy', 'branding', 'black'],
    description: 'High-impact, heavyweight modern grotesque headline font designed to scream off the canvas with immense presence.',
    fontFileUrl: '/downloads/fonts/neo-brutalist-black.woff2',
    fontFamily: "'Outfit', sans-serif",
    format: 'WOFF2',
    fileSizeBytes: 145000,
    sampleAlphabet: 'BOLD VISUALS FOR UNCOMPROMISING DIGITAL CREATIVES',
    cssStyle: "font-family: 'Outfit', sans-serif; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;",
    isFeatured: true,
    isTrending: false,
    isPublished: true,
    downloadsCount: 12900,
    sharesCount: 4300,
    viewsCount: 27500,
    createdAt: '2026-02-28T09:10:00.000Z',
    author: 'FR Typography Labs'
  },
  {
    id: 'fnt-4',
    slug: 'islamic-thuluth-harmony',
    name: 'Thuluth Harmony Islamic Calligraphy',
    category: 'Islamic',
    tags: ['islamic', 'arabic', 'calligraphy', 'thuluth', 'mubarak', 'sacred', 'curved'],
    description: 'Harmonious Islamic display font inspired by classical Ottoman and Andalusian Thuluth architectural inscriptions.',
    fontFileUrl: '/downloads/fonts/islamic-thuluth-harmony.otf',
    fontFamily: "'Playfair Display', serif",
    format: 'OTF',
    fileSizeBytes: 310000,
    sampleAlphabet: 'Bismillah Ar-Rahman Ar-Rahim • Ramadan Kareem • Eid Mubarak',
    cssStyle: "font-family: 'Playfair Display', serif; font-weight: 700; letter-spacing: 1.5px;",
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    downloadsCount: 19500,
    sharesCount: 8250,
    viewsCount: 39000,
    createdAt: '2026-03-01T07:20:00.000Z',
    author: 'FR Typography Labs'
  },
  {
    id: 'fnt-5',
    slug: 'kawaii-bubble-pop',
    name: 'Kawaii Bubble Pop Rounded',
    category: 'Funny',
    tags: ['bubble', 'rounded', 'cute', 'kawaii', 'fun', 'cartoon', 'kids'],
    description: 'Deliciously puffy, marshmallow-soft rounded cartoon font filled with playful bounce and cheerful energy.',
    fontFileUrl: '/downloads/fonts/kawaii-bubble-pop.ttf',
    fontFamily: "'Outfit', cursive, sans-serif",
    format: 'TTF',
    fileSizeBytes: 168000,
    sampleAlphabet: 'Super Cute & Sweet Marshmallow Vibes 1234567890 !?',
    cssStyle: "font-family: 'Outfit', sans-serif; font-weight: 800; letter-spacing: 1px;",
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    downloadsCount: 10400,
    sharesCount: 3450,
    viewsCount: 21300,
    createdAt: '2026-02-25T14:40:00.000Z',
    author: 'FR Typography Labs'
  }
];

export const defaultAdSettings: AdSettings = {
  adSenseClientId: process.env.GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-9876543210123456',
  isTestMode: true,
  placements: {
    topBanner: {
      id: 'topBanner',
      label: 'Homepage Top Header Banner (Responsive)',
      description: 'Clean responsive banner placed beneath navigation on homepage and main views.',
      enabled: true,
      adSlotId: '1010101010',
      format: 'auto'
    },
    betweenSections: {
      id: 'betweenSections',
      label: 'Between Sections Banner (728x90 / Responsive)',
      description: 'Separates categories and featured mood showcase with ample negative space.',
      enabled: true,
      adSlotId: '2020202020',
      format: 'auto'
    },
    stickersListing: {
      id: 'stickersListing',
      label: 'Sticker Gallery Listing Header Banner',
      description: 'Displayed at the top of the stickers catalog view.',
      enabled: true,
      adSlotId: '2525252525',
      format: 'auto'
    },
    betweenGallery: {
      id: 'betweenGallery',
      label: 'In-Feed Native Card Ad (Sticker Grid)',
      description: 'Placed naturally among sticker cards without interfering with clicks.',
      enabled: true,
      adSlotId: '4040404040',
      format: 'rectangle'
    },
    fontsListing: {
      id: 'fontsListing',
      label: 'Fonts Page Showcase Banner',
      description: 'Prominently placed above the stylish fonts catalog and interactive tester.',
      enabled: true,
      adSlotId: '3535353535',
      format: 'auto'
    },
    detailModal: {
      id: 'detailModal',
      label: 'Individual Content Detail Ad (Strictly Separated from Download)',
      description: 'Dedicated ad placement inside sticker & font detail pages, strictly spaced apart from download controls.',
      enabled: true,
      adSlotId: '4545454545',
      format: 'horizontal'
    },
    bottomMobile: {
      id: 'bottomMobile',
      label: 'Mobile & Tablet Footer Anchor Banner',
      description: 'Positioned cleanly above bottom navigation for mobile viewports.',
      enabled: true,
      adSlotId: '5050505050',
      format: 'auto'
    },
    sidebarDesktop: {
      id: 'sidebarDesktop',
      label: 'Desktop Sidebar Ad (300x600)',
      description: 'Optional vertical skyscraper banner on wide desktop screens.',
      enabled: false,
      adSlotId: '3030303030',
      format: 'vertical'
    }
  }
};
