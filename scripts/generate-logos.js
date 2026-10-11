import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// ═══ 1. ULTRA-STYLISH HORIZONTAL LOGO (DARK THEME - WEBSITE HEADER & FOOTER) ═══
const svgHorizontalDark = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 120" width="540" height="120" fill="none">
  <defs>
    <!-- Sphere Gradient for Globe -->
    <radialGradient id="hDarkGlobe" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="45%" stop-color="#0284c7"/>
      <stop offset="85%" stop-color="#075985"/>
      <stop offset="100%" stop-color="#0c2d48"/>
    </radialGradient>

    <!-- Rich Luxury Gold Gradient -->
    <linearGradient id="hDarkGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="25%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>

    <!-- Electric Cyan Gradient for Swoosh -->
    <linearGradient id="hDarkCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#00f5d4"/>
    </linearGradient>

    <!-- Ambient Glow Filter -->
    <filter id="hDarkGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <!-- Drop Shadow for Aircraft -->
    <filter id="hDarkDrop" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- ═══ EMBLEM (Globe + Compass + Jet Swoosh) ═══ -->
  <g transform="translate(10, 6)">
    <!-- Ambient Backlight Aura -->
    <circle cx="60" cy="54" r="48" fill="#0284c7" opacity="0.12" filter="url(#hDarkGlow)"/>

    <!-- Outer Compass Ring with Metallic Gold -->
    <circle cx="60" cy="54" r="45" stroke="url(#hDarkGold)" stroke-width="4.5" fill="none" opacity="0.95"/>
    <circle cx="60" cy="54" r="49" stroke="url(#hDarkGold)" stroke-width="1" stroke-dasharray="2 6" fill="none" opacity="0.6"/>

    <!-- Compass Cardinal Ticks (N, S, E, W) -->
    <line x1="60" y1="5" x2="60" y2="12" stroke="url(#hDarkGold)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="60" y1="96" x2="60" y2="103" stroke="url(#hDarkGold)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="11" y1="54" x2="18" y2="54" stroke="url(#hDarkGold)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="102" y1="54" x2="109" y2="54" stroke="url(#hDarkGold)" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Compass North Needle (Faceted 3D) -->
    <path d="M 60 5 L 67 18 L 60 15 Z" fill="#fef08a"/>
    <path d="M 60 5 L 53 18 L 60 15 Z" fill="#d97706"/>

    <!-- Globe Sphere -->
    <circle cx="60" cy="54" r="38" fill="url(#hDarkGlobe)"/>

    <!-- Luminous Coordinate Grid Lines -->
    <ellipse cx="60" cy="54" rx="22" ry="38" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.35" fill="none"/>
    <ellipse cx="60" cy="54" rx="38" ry="16" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.35" fill="none"/>
    <line x1="22" y1="54" x2="98" y2="54" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.35"/>
    <line x1="60" y1="16" x2="60" y2="92" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.35"/>

    <!-- Stylized Continents on Globe with Subtle Glow -->
    <path d="M 41 34 Q 45 28 54 31 Q 57 37 53 42 Q 46 45 41 34 Z" fill="#ffffff" fill-opacity="0.75"/>
    <path d="M 64 31 Q 75 28 79 35 Q 82 43 75 47 Q 69 44 64 37 Z" fill="#ffffff" fill-opacity="0.75"/>
    <path d="M 45 53 Q 51 49 55 55 Q 53 65 47 63 Q 43 59 45 53 Z" fill="#ffffff" fill-opacity="0.75"/>
    <path d="M 67 51 Q 76 50 78 57 Q 75 66 68 62 Q 64 57 67 51 Z" fill="#ffffff" fill-opacity="0.75"/>

    <!-- Stylized 'F' Lower Wing Bar (Cyan Electric Accent) -->
    <path d="M 43 67 C 54 67 70 66 84 64 C 82 68 74 72 59 73 C 47 74 41 70 43 67 Z" fill="url(#hDarkCyan)"/>

    <!-- Dynamic Main Jet Swoosh Trail (Upper Bar of 'F' Arc) -->
    <path d="M 26 87 C 28 73 37 59 51 49 C 65 39 84 31 107 19 C 91 28 71 39 57 52 C 43 65 35 77 32 86 Z" fill="#ffffff" opacity="0.95"/>

    <!-- Climbing Jet Aircraft in Radiant Gold with Wing Highlights -->
    <g transform="translate(107, 16) rotate(-35) scale(0.92)">
      <!-- Jet Body -->
      <path d="M 0 -20 C 1.4 -20 2.4 -18 2.6 -13 L 3.2 0 L 16 7 L 16 9.8 L 3.2 6.8 L 2.8 14.5 L 6.8 17.8 L 6.8 20 L 0 18.2 L -6.8 20 L -6.8 17.8 L -2.8 14.5 L -3.2 6.8 L -16 9.8 L -16 7 L -3.2 0 L -2.6 -13 C -2.4 -18 -1.4 -20 0 -20 Z"
        fill="url(#hDarkGold)" filter="url(#hDarkDrop)"/>
      <!-- Fuselage Cockpit / Shimmer -->
      <path d="M 0 -18 L 1.2 -11 L -1.2 -11 Z" fill="#ffffff" opacity="0.8"/>
    </g>
  </g>

  <!-- ═══ TYPOGRAPHY ═══ -->
  <g transform="translate(142, 22)">
    <!-- Brand Title: FIRST in Pristine White + FLY in Gradient Sky Cyan -->
    <text x="0" y="52" font-family="'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="900" font-size="49" letter-spacing="-0.8">
      <tspan fill="#ffffff">FIRST</tspan><tspan fill="#38bdf8">FLY</tspan>
    </text>

    <!-- Luxury Subtitle: ―― ✦ TOURS & TRAVELS ✦ ―― -->
    <g transform="translate(2, 75)">
      <!-- Left Gold Line with Diamond Accent -->
      <line x1="0" y1="-5" x2="34" y2="-5" stroke="url(#hDarkGold)" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="39,-5 42,-8 45,-5 42,-2" fill="url(#hDarkGold)"/>

      <!-- Text: TOURS & TRAVELS -->
      <text x="56" y="0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="13.5" fill="#fcd34d" letter-spacing="3.8">
        TOURS &amp; TRAVELS
      </text>

      <!-- Right Diamond & Gold Line Accent -->
      <polygon points="262,-5 265,-8 268,-5 265,-2" fill="url(#hDarkGold)"/>
      <line x1="274" y1="-5" x2="308" y2="-5" stroke="url(#hDarkGold)" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  </g>
</svg>
`;

// ═══ 2. HORIZONTAL LOGO (LIGHT THEME - INVOICE / PRINT / LIGHT MODE) ═══
const svgHorizontalLight = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 120" width="540" height="120" fill="none">
  <defs>
    <radialGradient id="hLightGlobe" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </radialGradient>

    <linearGradient id="hLightGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>

    <linearGradient id="hLightCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#00a8e8"/>
    </linearGradient>

    <filter id="hLightDrop" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#0a2540" flood-opacity="0.3"/>
    </filter>
  </defs>

  <g transform="translate(10, 6)">
    <!-- Compass Ring -->
    <circle cx="60" cy="54" r="45" stroke="url(#hLightGold)" stroke-width="4.5" fill="none" opacity="0.95"/>
    <circle cx="60" cy="54" r="49" stroke="url(#hLightGold)" stroke-width="1" stroke-dasharray="2 6" fill="none" opacity="0.6"/>

    <!-- Compass Cardinal Ticks -->
    <line x1="60" y1="5" x2="60" y2="12" stroke="url(#hLightGold)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="60" y1="96" x2="60" y2="103" stroke="url(#hLightGold)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="11" y1="54" x2="18" y2="54" stroke="url(#hLightGold)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="102" y1="54" x2="109" y2="54" stroke="url(#hLightGold)" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Compass Needle -->
    <path d="M 60 5 L 67 18 L 60 15 Z" fill="#fbbf24"/>
    <path d="M 60 5 L 53 18 L 60 15 Z" fill="#d97706"/>

    <!-- Globe Sphere -->
    <circle cx="60" cy="54" r="38" fill="url(#hLightGlobe)"/>

    <!-- Coordinate Lines -->
    <ellipse cx="60" cy="54" rx="22" ry="38" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.4" fill="none"/>
    <ellipse cx="60" cy="54" rx="38" ry="16" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.4" fill="none"/>
    <line x1="22" y1="54" x2="98" y2="54" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.4"/>
    <line x1="60" y1="16" x2="60" y2="92" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.4"/>

    <!-- Continents -->
    <path d="M 41 34 Q 45 28 54 31 Q 57 37 53 42 Q 46 45 41 34 Z" fill="#ffffff" fill-opacity="0.75"/>
    <path d="M 64 31 Q 75 28 79 35 Q 82 43 75 47 Q 69 44 64 37 Z" fill="#ffffff" fill-opacity="0.75"/>
    <path d="M 45 53 Q 51 49 55 55 Q 53 65 47 63 Q 43 59 45 53 Z" fill="#ffffff" fill-opacity="0.75"/>
    <path d="M 67 51 Q 76 50 78 57 Q 75 66 68 62 Q 64 57 67 51 Z" fill="#ffffff" fill-opacity="0.75"/>

    <!-- Lower Wing Bar in Cyan -->
    <path d="M 43 67 C 54 67 70 66 84 64 C 82 68 74 72 59 73 C 47 74 41 70 43 67 Z" fill="url(#hLightCyan)"/>

    <!-- Main Arc in Deep Navy -->
    <path d="M 26 87 C 28 73 37 59 51 49 C 65 39 84 31 107 19 C 91 28 71 39 57 52 C 43 65 35 77 32 86 Z" fill="#0f2852"/>

    <!-- Navy Jet Climbing -->
    <g transform="translate(107, 16) rotate(-35) scale(0.92)">
      <path d="M 0 -20 C 1.4 -20 2.4 -18 2.6 -13 L 3.2 0 L 16 7 L 16 9.8 L 3.2 6.8 L 2.8 14.5 L 6.8 17.8 L 6.8 20 L 0 18.2 L -6.8 20 L -6.8 17.8 L -2.8 14.5 L -3.2 6.8 L -16 9.8 L -16 7 L -3.2 0 L -2.6 -13 C -2.4 -18 -1.4 -20 0 -20 Z"
        fill="#0f2852" filter="url(#hLightDrop)"/>
    </g>
  </g>

  <!-- Typography -->
  <g transform="translate(142, 22)">
    <text x="0" y="52" font-family="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="49" letter-spacing="-0.8">
      <tspan fill="#0a2540">FIRST</tspan><tspan fill="#00a8e8">FLY</tspan>
    </text>

    <g transform="translate(2, 75)">
      <line x1="0" y1="-5" x2="34" y2="-5" stroke="url(#hLightGold)" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="39,-5 42,-8 45,-5 42,-2" fill="url(#hLightGold)"/>

      <text x="56" y="0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="13.5" fill="#0a2540" letter-spacing="3.8">
        TOURS &amp; TRAVELS
      </text>

      <polygon points="262,-5 265,-8 268,-5 265,-2" fill="url(#hLightGold)"/>
      <line x1="274" y1="-5" x2="308" y2="-5" stroke="url(#hLightGold)" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  </g>
</svg>
`;

// ═══ 3. SQUIRCLE LUXURY APP BADGE (512x512) ═══
const svgAppBadge = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <defs>
    <linearGradient id="sqBg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00a8e8"/>
      <stop offset="40%" stop-color="#0284c7"/>
      <stop offset="85%" stop-color="#0f2852"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <radialGradient id="sqGlobe" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#075985"/>
    </radialGradient>

    <linearGradient id="sqGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#f59e0b"/>
      <stop offset="75%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>

    <filter id="sqShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Luxury Squircle Card -->
  <rect x="24" y="24" width="464" height="464" rx="112" fill="url(#sqBg)" filter="url(#sqShadow)"/>
  <rect x="24" y="24" width="464" height="464" rx="112" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.3"/>

  <!-- Compass Ring -->
  <circle cx="256" cy="270" r="162" stroke="url(#sqGold)" stroke-width="15" fill="none"/>
  <circle cx="256" cy="270" r="176" stroke="url(#sqGold)" stroke-width="3" stroke-dasharray="6 18" fill="none" opacity="0.6"/>

  <!-- Compass Cardinal Ticks -->
  <line x1="256" y1="96" x2="256" y2="116" stroke="url(#sqGold)" stroke-width="8" stroke-linecap="round"/>
  <line x1="256" y1="424" x2="256" y2="444" stroke="url(#sqGold)" stroke-width="8" stroke-linecap="round"/>
  <line x1="82" y1="270" x2="102" y2="270" stroke="url(#sqGold)" stroke-width="8" stroke-linecap="round"/>
  <line x1="410" y1="270" x2="430" y2="270" stroke="url(#sqGold)" stroke-width="8" stroke-linecap="round"/>

  <!-- Compass Pointer -->
  <path d="M 256 80 L 278 124 L 256 114 Z" fill="#fef08a"/>
  <path d="M 256 80 L 234 124 L 256 114 Z" fill="#d97706"/>

  <!-- Globe Body -->
  <circle cx="256" cy="270" r="142" fill="url(#sqGlobe)"/>

  <!-- Globe Coordinates -->
  <ellipse cx="256" cy="270" rx="84" ry="142" stroke="#ffffff" stroke-width="4.5" stroke-opacity="0.4" fill="none"/>
  <ellipse cx="256" cy="270" rx="142" ry="62" stroke="#ffffff" stroke-width="4.5" stroke-opacity="0.4" fill="none"/>
  <line x1="114" y1="270" x2="398" y2="270" stroke="#ffffff" stroke-width="4.5" stroke-opacity="0.4"/>
  <line x1="256" y1="128" x2="256" y2="412" stroke="#ffffff" stroke-width="4.5" stroke-opacity="0.4"/>

  <!-- Continents -->
  <path d="M 180 190 Q 200 166 238 180 Q 248 200 232 220 Q 202 230 180 190 Z" fill="#ffffff" fill-opacity="0.75"/>
  <path d="M 268 180 Q 312 166 328 194 Q 340 226 312 242 Q 288 230 268 204 Z" fill="#ffffff" fill-opacity="0.75"/>
  <path d="M 196 266 Q 220 250 236 274 Q 228 314 204 306 Q 188 290 196 266 Z" fill="#ffffff" fill-opacity="0.75"/>
  <path d="M 278 258 Q 314 254 322 282 Q 310 318 282 302 Q 266 282 278 258 Z" fill="#ffffff" fill-opacity="0.75"/>

  <!-- Lower Wing Bar in White/Cyan -->
  <path d="M 194 324 C 234 324 290 320 346 312 C 338 328 306 344 250 348 C 206 352 186 336 194 324 Z" fill="#ffffff" fill-opacity="0.95"/>

  <!-- Swooshing Jet Trail Arc -->
  <path d="M 128 402 C 136 348 172 294 228 254 C 284 214 360 182 452 134 C 388 170 308 214 252 266 C 196 318 164 366 152 400 Z" fill="#ffffff"/>

  <!-- Climbing Gold Airplane -->
  <g transform="translate(442, 126) rotate(-35) scale(3.3)">
    <path d="M 0 -20 C 1.4 -20 2.4 -18 2.6 -13 L 3.2 0 L 16 7 L 16 9.8 L 3.2 6.8 L 2.8 14.5 L 6.8 17.8 L 6.8 20 L 0 18.2 L -6.8 20 L -6.8 17.8 L -2.8 14.5 L -3.2 6.8 L -16 9.8 L -16 7 L -3.2 0 L -2.6 -13 C -2.4 -18 -1.4 -20 0 -20 Z"
      fill="url(#sqGold)"/>
  </g>
</svg>
`;

// ═══ 4. EMBLEM ONLY (128x128) ═══
const svgEmblem = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="130" height="130" fill="none">
  <defs>
    <radialGradient id="embGlobe" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="45%" stop-color="#0284c7"/>
      <stop offset="85%" stop-color="#075985"/>
      <stop offset="100%" stop-color="#0c2d48"/>
    </radialGradient>
    <linearGradient id="embGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="25%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="embCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#00f5d4"/>
    </linearGradient>
  </defs>

  <g transform="translate(5, 5)">
    <circle cx="60" cy="60" r="45" stroke="url(#embGold)" stroke-width="4.5" fill="none" opacity="0.95"/>
    <circle cx="60" cy="60" r="49" stroke="url(#embGold)" stroke-width="1" stroke-dasharray="2 6" fill="none" opacity="0.6"/>

    <line x1="60" y1="11" x2="60" y2="18" stroke="url(#embGold)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="60" y1="102" x2="60" y2="109" stroke="url(#embGold)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="11" y1="60" x2="18" y2="60" stroke="url(#embGold)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="102" y1="60" x2="109" y2="60" stroke="url(#embGold)" stroke-width="2.5" stroke-linecap="round"/>

    <path d="M 60 11 L 67 24 L 60 21 Z" fill="#fef08a"/>
    <path d="M 60 11 L 53 24 L 60 21 Z" fill="#d97706"/>

    <circle cx="60" cy="60" r="38" fill="url(#embGlobe)"/>

    <ellipse cx="60" cy="60" rx="22" ry="38" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.35" fill="none"/>
    <ellipse cx="60" cy="60" rx="38" ry="16" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.35" fill="none"/>
    <line x1="22" y1="60" x2="98" y2="60" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.35"/>
    <line x1="60" y1="22" x2="60" y2="98" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.35"/>

    <path d="M 41 40 Q 45 34 54 37 Q 57 43 53 48 Q 46 51 41 40 Z" fill="#ffffff" fill-opacity="0.75"/>
    <path d="M 64 37 Q 75 34 79 41 Q 82 49 75 53 Q 69 50 64 43 Z" fill="#ffffff" fill-opacity="0.75"/>
    <path d="M 45 59 Q 51 55 55 61 Q 53 71 47 69 Q 43 65 45 59 Z" fill="#ffffff" fill-opacity="0.75"/>
    <path d="M 67 57 Q 76 56 78 63 Q 75 72 68 68 Q 64 63 67 57 Z" fill="#ffffff" fill-opacity="0.75"/>

    <path d="M 43 73 C 54 73 70 72 84 70 C 82 74 74 78 59 79 C 47 80 41 76 43 73 Z" fill="url(#embCyan)"/>

    <path d="M 26 93 C 28 79 37 65 51 55 C 65 45 84 37 107 25 C 91 34 71 45 57 58 C 43 71 35 83 32 92 Z" fill="#ffffff"/>

    <g transform="translate(107, 22) rotate(-35) scale(0.92)">
      <path d="M 0 -20 C 1.4 -20 2.4 -18 2.6 -13 L 3.2 0 L 16 7 L 16 9.8 L 3.2 6.8 L 2.8 14.5 L 6.8 17.8 L 6.8 20 L 0 18.2 L -6.8 20 L -6.8 17.8 L -2.8 14.5 L -3.2 6.8 L -16 9.8 L -16 7 L -3.2 0 L -2.6 -13 C -2.4 -18 -1.4 -20 0 -20 Z"
        fill="url(#embGold)"/>
    </g>
  </g>
</svg>
`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write SVGs
  fs.writeFileSync(path.join(publicDir, 'logo-horizontal-dark.svg'), svgHorizontalDark.trim());
  fs.writeFileSync(path.join(publicDir, 'logo-horizontal-light.svg'), svgHorizontalLight.trim());
  fs.writeFileSync(path.join(publicDir, 'logo-horizontal.svg'), svgHorizontalDark.trim()); // default
  fs.writeFileSync(path.join(publicDir, 'logo-badge.svg'), svgAppBadge.trim());
  fs.writeFileSync(path.join(publicDir, 'logo-emblem.svg'), svgEmblem.trim());
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgEmblem.trim());

  console.log('SVG files generated successfully.');

  // 2. Generate PNGs using sharp
  try {
    // App Icon PNG (512x512)
    await sharp(Buffer.from(svgAppBadge))
      .resize(512, 512)
      .png({ quality: 100 })
      .toFile(path.join(publicDir, 'logo-badge-512.png'));

    // App Icon PNG (192x192)
    await sharp(Buffer.from(svgAppBadge))
      .resize(192, 192)
      .png({ quality: 100 })
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // Favicon PNG 32x32 & 48x48
    await sharp(Buffer.from(svgEmblem))
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32.png'));

    await sharp(Buffer.from(svgEmblem))
      .resize(48, 48)
      .png()
      .toFile(path.join(publicDir, 'favicon-48.png'));

    // High-Res Horizontal Logo (1080px wide)
    await sharp(Buffer.from(svgHorizontalDark))
      .resize(1080, 240)
      .png()
      .toFile(path.join(publicDir, 'logo-horizontal-1080.png'));

    await sharp(Buffer.from(svgHorizontalLight))
      .resize(1080, 240)
      .png()
      .toFile(path.join(publicDir, 'logo-horizontal-light-1080.png'));

    console.log('PNG files generated successfully.');
  } catch (err) {
    console.error('Error rasterizing with sharp:', err);
  }
}

main();
