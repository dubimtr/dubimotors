/**
 * DubiMotors Category Icons
 * Inline SVG icons for all 7 listing categories.
 * Each function returns an SVG string.
 */

const DM_ICONS = {

  cars: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" fill="none">
    <!-- Body -->
    <rect x="4" y="16" width="56" height="18" rx="4" fill="#E8450A"/>
    <!-- Cabin -->
    <path d="M16 16 L22 6 L42 6 L48 16 Z" fill="#C73A08"/>
    <!-- Windows -->
    <path d="M23 8 L20 16 L32 16 L32 8 Z" fill="#B8E0F7" opacity="0.9"/>
    <path d="M33 8 L33 16 L44 16 L41 8 Z" fill="#B8E0F7" opacity="0.9"/>
    <!-- Wheels -->
    <circle cx="16" cy="34" r="6" fill="#1A1A1A"/>
    <circle cx="16" cy="34" r="3" fill="#888"/>
    <circle cx="48" cy="34" r="6" fill="#1A1A1A"/>
    <circle cx="48" cy="34" r="3" fill="#888"/>
    <!-- Headlight -->
    <rect x="56" y="20" width="4" height="5" rx="1" fill="#FFE066"/>
    <!-- Taillight -->
    <rect x="4" y="20" width="3" height="5" rx="1" fill="#FF4444"/>
  </svg>`,

  boats: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 48" fill="none">
    <!-- Water -->
    <path d="M2 38 Q16 34 32 38 Q48 42 62 38 L62 46 Q48 50 32 46 Q16 42 2 46 Z" fill="#2196F3" opacity="0.3"/>
    <!-- Hull -->
    <path d="M8 36 L12 22 L52 22 L56 36 Z" fill="#E8450A"/>
    <!-- Deck -->
    <rect x="14" y="18" width="36" height="5" rx="2" fill="#C73A08"/>
    <!-- Cabin -->
    <rect x="22" y="10" width="20" height="10" rx="2" fill="#fff"/>
    <rect x="24" y="12" width="7" height="6" rx="1" fill="#B8E0F7" opacity="0.9"/>
    <rect x="33" y="12" width="7" height="6" rx="1" fill="#B8E0F7" opacity="0.9"/>
    <!-- Mast -->
    <line x1="32" y1="2" x2="32" y2="18" stroke="#555" stroke-width="1.5"/>
    <!-- Flag -->
    <path d="M32 2 L40 6 L32 10 Z" fill="#E8450A"/>
  </svg>`,

  bikes: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 48" fill="none">
    <!-- Rear wheel -->
    <circle cx="14" cy="34" r="12" stroke="#1A1A1A" stroke-width="3" fill="none"/>
    <circle cx="14" cy="34" r="5" fill="#888"/>
    <!-- Front wheel -->
    <circle cx="50" cy="34" r="12" stroke="#1A1A1A" stroke-width="3" fill="none"/>
    <circle cx="50" cy="34" r="5" fill="#888"/>
    <!-- Frame -->
    <line x1="14" y1="34" x2="30" y2="18" stroke="#E8450A" stroke-width="3" stroke-linecap="round"/>
    <line x1="30" y1="18" x2="50" y2="34" stroke="#E8450A" stroke-width="3" stroke-linecap="round"/>
    <line x1="30" y1="18" x2="36" y2="34" stroke="#C73A08" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Seat -->
    <path d="M22 18 Q30 14 38 18" stroke="#1A1A1A" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Handlebar -->
    <line x1="44" y1="16" x2="56" y2="18" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="50" y1="14" x2="50" y2="22" stroke="#555" stroke-width="2" stroke-linecap="round"/>
    <!-- Engine block -->
    <rect x="26" y="22" width="14" height="10" rx="2" fill="#C73A08"/>
  </svg>`,

  jetski: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44" fill="none">
    <!-- Water spray -->
    <path d="M54 32 Q58 26 62 28 Q60 34 56 36 Z" fill="#B8E0F7" opacity="0.7"/>
    <!-- Hull -->
    <path d="M4 30 Q8 22 20 20 L52 20 Q58 20 60 28 L8 36 Z" fill="#E8450A"/>
    <!-- Top deck -->
    <path d="M18 20 Q22 12 40 12 L50 20 Z" fill="#C73A08"/>
    <!-- Windshield -->
    <path d="M24 20 Q26 14 36 14 L42 20 Z" fill="#B8E0F7" opacity="0.8"/>
    <!-- Seat -->
    <path d="M20 20 Q28 16 42 16 L44 20 Z" fill="#1A1A1A"/>
    <!-- Water line -->
    <path d="M4 32 Q16 28 32 32 Q48 36 60 30" stroke="#2196F3" stroke-width="2" fill="none" opacity="0.5"/>
  </svg>`,

  heavy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 44" fill="none">
    <!-- Trailer -->
    <rect x="22" y="10" width="46" height="24" rx="3" fill="#607D8B"/>
    <!-- Cab -->
    <rect x="4" y="14" width="22" height="20" rx="3" fill="#E8450A"/>
    <!-- Cab window -->
    <rect x="7" y="17" width="14" height="9" rx="2" fill="#B8E0F7" opacity="0.9"/>
    <!-- Cab door line -->
    <line x1="16" y1="17" x2="16" y2="34" stroke="#C73A08" stroke-width="1"/>
    <!-- Exhaust -->
    <rect x="5" y="8" width="3" height="8" rx="1" fill="#555"/>
    <!-- Wheels cab -->
    <circle cx="10" cy="36" r="6" fill="#1A1A1A"/>
    <circle cx="10" cy="36" r="2.5" fill="#888"/>
    <circle cx="22" cy="36" r="6" fill="#1A1A1A"/>
    <circle cx="22" cy="36" r="2.5" fill="#888"/>
    <!-- Wheels trailer -->
    <circle cx="42" cy="36" r="6" fill="#1A1A1A"/>
    <circle cx="42" cy="36" r="2.5" fill="#888"/>
    <circle cx="56" cy="36" r="6" fill="#1A1A1A"/>
    <circle cx="56" cy="36" r="2.5" fill="#888"/>
    <!-- Headlight -->
    <rect x="2" y="20" width="3" height="5" rx="1" fill="#FFE066"/>
  </svg>`,

  plates: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" fill="none">
    <!-- Plate background -->
    <rect x="4" y="4" width="56" height="32" rx="5" fill="#fff" stroke="#DDD" stroke-width="1.5"/>
    <!-- UAE flag stripe left -->
    <rect x="4" y="4" width="8" height="32" rx="5" fill="#00732F"/>
    <rect x="4" y="4" width="8" height="11" fill="#00732F"/>
    <rect x="4" y="15" width="8" height="10" fill="#fff"/>
    <rect x="4" y="25" width="8" height="11" fill="#000"/>
    <rect x="4" y="4" width="8" height="32" rx="0" fill="none"/>
    <!-- Red bar -->
    <rect x="4" y="4" width="8" height="32" rx="0" fill="none"/>
    <rect x="4" y="4" width="5" height="32" rx="5" fill="#EF3340"/>
    <!-- Plate number -->
    <text x="36" y="26" font-family="Arial Black, sans-serif" font-size="16" font-weight="900" fill="#1A1A1A" text-anchor="middle" letter-spacing="2">A 7</text>
    <!-- Dubai text -->
    <text x="36" y="13" font-family="Arial, sans-serif" font-size="6" fill="#888" text-anchor="middle" letter-spacing="1">DUBAI</text>
  </svg>`,

  accessories: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    <!-- Wrench -->
    <path d="M44 8 C50 8 56 14 54 22 L36 40 L28 48 C26 50 22 50 20 48 C18 46 18 42 20 40 L28 32 L46 14 C44 10 44 8 44 8 Z" fill="#607D8B"/>
    <circle cx="24" cy="44" r="4" fill="#455A64"/>
    <!-- Wrench head -->
    <path d="M44 8 C50 6 58 10 58 18 C58 22 56 26 52 28 L46 22 C48 20 50 16 48 14 C46 12 44 12 44 8 Z" fill="#E8450A"/>
    <!-- Bolt/nut -->
    <polygon points="16,16 22,12 28,16 28,24 22,28 16,24" fill="#FFB300" opacity="0.9"/>
    <polygon points="16,16 22,12 28,16 28,24 22,28 16,24" fill="none" stroke="#E65100" stroke-width="1"/>
    <circle cx="22" cy="20" r="4" fill="#E65100"/>
  </svg>`,

};

// Make available globally
if (typeof window !== 'undefined') window.DM_ICONS = DM_ICONS;
if (typeof module !== 'undefined') module.exports = DM_ICONS;
