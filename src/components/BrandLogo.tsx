import React from 'react';

export interface BrandLogoProps {
  variant?: 'horizontal' | 'badge' | 'icon' | 'stacked';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  clickable?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title?: string;
}

/**
 * Official FirstFly Tours & Travels Brandmark
 * Designed to match the luxury dark slate + burnished amber-gold + electric cyan theme.
 * Features:
 * - Clickable with smooth scroll to top & optional custom navigation
 * - Compass ring in warm burnished gold with cardinal ticks & faceted 3D North pointer
 * - Luminous 3D ocean-blue globe with continent landmasses & coordinate arcs
 * - Dynamic "F" supersonic flight swoosh with ascending passenger jet
 * - Modern typography: "FIRST" in crisp white, "FLY" in electric sky cyan
 * - Elegant gold diamond-flanked "TOURS & TRAVELS" subline
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  theme = 'dark',
  className = '',
  showSubtitle = true,
  size = 'md',
  clickable,
  href,
  onClick,
  title,
}) => {
  const isLight = theme === 'light';

  // Smart default: clickable is true for header/stacked/footer variants or when href/onClick provided
  const isClickable =
    clickable !== undefined
      ? clickable
      : href !== undefined || onClick !== undefined || variant === 'horizontal' || variant === 'stacked';

  // Sizing definitions
  const sizeConfig = {
    sm: {
      emblem: 'w-8 h-8 sm:w-9 sm:h-9',
      title: 'text-lg sm:text-xl',
      sub: 'text-[9px] tracking-[0.24em]',
      line: 'w-3.5',
      badge: 'w-9 h-9',
    },
    md: {
      emblem: 'w-10 h-10 sm:w-11 sm:h-11',
      title: 'text-xl sm:text-2xl',
      sub: 'text-[9.5px] sm:text-[10px] tracking-[0.26em]',
      line: 'w-5',
      badge: 'w-11 h-11',
    },
    lg: {
      emblem: 'w-13 h-13 sm:w-14 sm:h-14',
      title: 'text-2xl sm:text-3xl',
      sub: 'text-[11px] sm:text-[12px] tracking-[0.28em]',
      line: 'w-7',
      badge: 'w-14 h-14',
    },
    xl: {
      emblem: 'w-16 h-16 sm:w-20 sm:h-20',
      title: 'text-3xl sm:text-4xl',
      sub: 'text-[13px] sm:text-[14px] tracking-[0.3em]',
      line: 'w-9',
      badge: 'w-20 h-20',
    },
    custom: {
      emblem: 'w-full h-full',
      title: 'text-xl',
      sub: 'text-[10px] tracking-[0.26em]',
      line: 'w-5',
      badge: 'w-full h-full',
    },
  }[size];

  // Default smooth scroll to top click handler
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }

    // Default action: if on admin or another route, go home; then scroll smoothly to top
    const targetHref = href || '#';
    if (targetHref === '#' || targetHref === '/' || targetHref === '#top') {
      e.preventDefault();
      if (typeof window !== 'undefined') {
        if (window.location.pathname !== '/') {
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // ═══ SVG EMBLEM ARTWORK (VECTOR, INSTANT, RETINA-SHARP) ═══
  const renderEmblem = (emblemSizeClass: string) => (
    <div className={`relative shrink-0 flex items-center justify-center select-none ${emblemSizeClass}`}>
      {/* Subtle Ambient Glow on Hover */}
      <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <svg
        viewBox="0 0 130 130"
        className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(2,132,199,0.25)] group-hover:scale-105 group-hover:drop-shadow-[0_4px_16px_rgba(245,158,11,0.4)] transition-all duration-300 relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial 3D Sphere for Ocean Globe */}
          <radialGradient id="ffGlobe" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="42%" stopColor="#0284c7" />
            <stop offset="80%" stopColor="#075985" />
            <stop offset="100%" stopColor="#0c2d48" />
          </radialGradient>

          {/* Luxury Burnished Gold Metallic */}
          <linearGradient id="ffGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Supersonic Wing Cyan Glow */}
          <linearGradient id="ffCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="55%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#00f5d4" />
          </linearGradient>

          {/* Soft Shadow Filter for Aircraft */}
          <filter id="ffPlaneShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Ambient Backlight Halo */}
        <circle cx="65" cy="65" r="54" fill="#0284c7" opacity="0.1" />

        {/* Outer Golden Compass Ring */}
        <circle cx="65" cy="65" r="47" stroke="url(#ffGold)" strokeWidth="4.5" fill="none" opacity="0.95" />
        <circle cx="65" cy="65" r="52" stroke="url(#ffGold)" strokeWidth="1" strokeDasharray="2 6" fill="none" opacity="0.65" />

        {/* Cardinal Direction Ticks (N, S, E, W) */}
        <line x1="65" y1="12" x2="65" y2="19" stroke="url(#ffGold)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="65" y1="111" x2="65" y2="118" stroke="url(#ffGold)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="12" y1="65" x2="19" y2="65" stroke="url(#ffGold)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="111" y1="65" x2="118" y2="65" stroke="url(#ffGold)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Diagonal Micro Ticks (NE, NW, SE, SW) */}
        <line x1="28" y1="28" x2="33" y2="33" stroke="url(#ffGold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="102" y1="28" x2="97" y2="33" stroke="url(#ffGold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="28" y1="102" x2="33" y2="97" stroke="url(#ffGold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="102" y1="102" x2="97" y2="97" stroke="url(#ffGold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

        {/* Faceted 3D North Needle Pointer */}
        <path d="M 65 12 L 72 26 L 65 23 Z" fill="#fef08a" />
        <path d="M 65 12 L 58 26 L 65 23 Z" fill="#d97706" />

        {/* Deep Ocean Globe */}
        <circle cx="65" cy="65" r="40" fill="url(#ffGlobe)" />

        {/* Luminous Coordinate Lines */}
        <ellipse cx="65" cy="65" rx="24" ry="40" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.38" fill="none" />
        <ellipse cx="65" cy="65" rx="40" ry="17" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.38" fill="none" />
        <line x1="25" y1="65" x2="105" y2="65" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.38" />
        <line x1="65" y1="25" x2="65" y2="105" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.38" />

        {/* Continents Outline */}
        <path d="M 45 44 Q 49 38 58 41 Q 62 47 57 52 Q 50 55 45 44 Z" fill="#ffffff" fillOpacity="0.75" />
        <path d="M 69 41 Q 81 38 85 45 Q 88 54 81 58 Q 74 55 69 48 Z" fill="#ffffff" fillOpacity="0.75" />
        <path d="M 49 64 Q 55 60 60 67 Q 57 77 51 75 Q 47 70 49 64 Z" fill="#ffffff" fillOpacity="0.75" />
        <path d="M 72 62 Q 82 61 84 69 Q 81 79 73 74 Q 69 68 72 62 Z" fill="#ffffff" fillOpacity="0.75" />

        {/* Stylized 'F' Lower Wing Bar (Cyan Accent) */}
        <path d="M 47 79 C 58 79 74 78 89 76 C 87 80 79 84 63 85 C 51 86 45 82 47 79 Z" fill="url(#ffCyan)" />

        {/* Dynamic Flight Trail Swoosh (Upper Bar of 'F') */}
        <path
          d="M 28 100 C 30 85 40 70 55 59 C 70 48 91 39 116 26 C 99 36 78 48 63 62 C 48 76 39 89 35 99 Z"
          fill={isLight ? '#0f2852' : '#ffffff'}
          opacity="0.95"
        />

        {/* Sleek Ascending Passenger Jet in Radiant Gold with Hover Lift Animation */}
        <g
          transform="translate(116, 23) rotate(-35) scale(0.96)"
          className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:translate-x-1"
        >
          <path
            d="M 0 -20 C 1.4 -20 2.4 -18 2.6 -13 L 3.2 0 L 16 7 L 16 9.8 L 3.2 6.8 L 2.8 14.5 L 6.8 17.8 L 6.8 20 L 0 18.2 L -6.8 20 L -6.8 17.8 L -2.8 14.5 L -3.2 6.8 L -16 9.8 L -16 7 L -3.2 0 L -2.6 -13 C -2.4 -18 -1.4 -20 0 -20 Z"
            fill={isLight ? '#0f2852' : 'url(#ffGold)'}
            filter="url(#ffPlaneShadow)"
          />
          {/* Cockpit Canopy Shimmer */}
          <path d="M 0 -18 L 1.2 -11 L -1.2 -11 Z" fill="#ffffff" opacity="0.85" />
        </g>
      </svg>
    </div>
  );

  // Render Inner Body based on variant
  const renderBody = () => {
    // ═══ 1. COMPACT / SQUIRCLE LUXURY BADGE ═══
    if (variant === 'badge') {
      return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeConfig.badge} ${className}`}>
          <img
            src="/logo-badge.svg"
            alt="FirstFly Tours & Travels Brand Badge"
            className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            loading="eager"
          />
        </div>
      );
    }

    // ═══ 2. CIRCULAR EMBLEM ONLY ═══
    if (variant === 'icon') {
      return (
        <div className={`inline-flex items-center justify-center ${className}`}>
          {renderEmblem(sizeConfig.emblem)}
        </div>
      );
    }

    // ═══ 3. CENTERED STACKED VARIANT ═══
    if (variant === 'stacked') {
      return (
        <div className={`inline-flex flex-col items-center text-center select-none ${className}`}>
          {renderEmblem(sizeConfig.emblem)}
          <div className="mt-2.5 flex flex-col items-center">
            <div className="flex items-center leading-none">
              <span
                className={`font-black font-heading ${sizeConfig.title} tracking-tight ${
                  isLight ? 'text-[#0a2540]' : 'text-white'
                }`}
              >
                FIRST
              </span>
              <span className={`font-black font-heading ${sizeConfig.title} tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent group-hover:brightness-110 transition-all`}>
                FLY
              </span>
            </div>

            {showSubtitle && (
              <div className="flex items-center gap-2 mt-1">
                <span className={`h-[1.5px] ${sizeConfig.line} bg-gradient-to-r from-transparent to-amber-500 rounded-full`}></span>
                <span className="text-amber-400 text-[8px]">✦</span>
                <span
                  className={`${sizeConfig.sub} font-black uppercase whitespace-nowrap text-amber-400/90 font-heading`}
                >
                  TOURS &amp; TRAVELS
                </span>
                <span className="text-amber-400 text-[8px]">✦</span>
                <span className={`h-[1.5px] ${sizeConfig.line} bg-gradient-to-l from-transparent to-amber-500 rounded-full`}></span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ═══ 4. SIGNATURE HORIZONTAL LOGO (FOR NAVBAR, FOOTER, HEADER) ═══
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        {/* Dynamic Emblem */}
        {renderEmblem(sizeConfig.emblem)}

        {/* Brand Typography: FIRST in pure white/navy + FLY in electric cyan + Subtitle */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center leading-none">
            <span
              className={`font-black font-heading ${sizeConfig.title} tracking-tight transition-colors ${
                isLight ? 'text-[#0a2540]' : 'text-white group-hover:text-amber-50'
              }`}
            >
              FIRST
            </span>
            <span
              className={`font-black font-heading ${sizeConfig.title} tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-300 bg-clip-text text-transparent group-hover:brightness-110 transition-all`}
            >
              FLY
            </span>
          </div>

          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-1">
              {/* Left Gold Tapered Accent Line */}
              <span className={`h-[1.5px] ${sizeConfig.line} bg-gradient-to-r from-transparent via-amber-400 to-amber-500 rounded-full shrink-0`}></span>
              <span className="text-amber-400 text-[7px] shrink-0">✦</span>

              {/* Subtitle Text */}
              <span
                className={`${sizeConfig.sub} font-black uppercase whitespace-nowrap transition-colors ${
                  isLight ? 'text-amber-700' : 'text-amber-400/95 group-hover:text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                }`}
              >
                TOURS &amp; TRAVELS
              </span>

              {/* Right Gold Tapered Accent Line */}
              <span className="text-amber-400 text-[7px] shrink-0">✦</span>
              <span className={`h-[1.5px] ${sizeConfig.line} bg-gradient-to-l from-transparent via-amber-400 to-amber-500 rounded-full shrink-0`}></span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const accessibleTitle = title || 'FirstFly Tours & Travels - Return to home';

  // If clickable is disabled, return plain non-interactive element
  if (!isClickable) {
    return (
      <div className="inline-flex items-center group">
        {renderBody()}
      </div>
    );
  }

  // Interactive Clickable Brand Anchor
  return (
    <a
      href={href || '#'}
      onClick={handleClick}
      title={accessibleTitle}
      aria-label={accessibleTitle}
      className="inline-flex items-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      {renderBody()}
    </a>
  );
};
