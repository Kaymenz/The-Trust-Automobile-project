import { useEffect, useState } from 'react';

function LamborghiniSVG() {
  return (
    <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" width="720" height="200" aria-hidden="true">
      <defs>
        {/* Body paint — rich gold metallic */}
        <linearGradient id="svjBody" x1="60" y1="20" x2="660" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE082" />
          <stop offset="0.25" stopColor="#F5C842" />
          <stop offset="0.5" stopColor="#E8A828" />
          <stop offset="0.75" stopColor="#C48A10" />
          <stop offset="1" stopColor="#F0C040" />
        </linearGradient>
        {/* Lower body — dark gold shadow */}
        <linearGradient id="svjLower" x1="60" y1="120" x2="660" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8A5A08" />
          <stop offset="0.5" stopColor="#B07B12" />
          <stop offset="1" stopColor="#6B4205" />
        </linearGradient>
        {/* Windshield glass */}
        <linearGradient id="svjGlass" x1="180" y1="25" x2="400" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1A3A5C" />
          <stop offset="0.4" stopColor="#0D1F35" />
          <stop offset="1" stopColor="#060F1C" />
        </linearGradient>
        {/* Rear glass */}
        <linearGradient id="svjRearGlass" x1="400" y1="30" x2="480" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0F1A2C" />
          <stop offset="1" stopColor="#060C18" />
        </linearGradient>
        {/* Headlight glow */}
        <radialGradient id="svjHeadlight" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.3" stopColor="#FFFDE8" stopOpacity="0.9" />
          <stop offset="0.7" stopColor="#FFE082" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFE082" stopOpacity="0" />
        </radialGradient>
        {/* Rim gradient */}
        <radialGradient id="svjRim" cx="50%" cy="48%" r="50%">
          <stop offset="0" stopColor="#8A8A8A" />
          <stop offset="0.35" stopColor="#4A4A4A" />
          <stop offset="0.7" stopColor="#1A1A1A" />
          <stop offset="1" stopColor="#0A0A0A" />
        </radialGradient>
        {/* Brake caliper */}
        <radialGradient id="svjBrake" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#E53935" />
          <stop offset="1" stopColor="#B71C1C" />
        </radialGradient>
        {/* Carbon fiber texture */}
        <pattern id="svjCarbon" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#1A1A1A" />
          <rect width="2" height="2" fill="#222" />
          <rect x="2" y="2" width="2" height="2" fill="#222" />
        </pattern>
        {/* Shadow filter */}
        <filter id="svjShadow" x="-10%" y="-20%" width="120%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="6" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Glow filter for headlight */}
        <filter id="svjGlow">
          <feGaussianBlur stdDeviation="6" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="360" cy="178" rx="290" ry="14" fill="#020812" opacity="0.45" />
      <ellipse cx="360" cy="172" rx="230" ry="6" fill="#000" opacity="0.25" />

      <g filter="url(#svjShadow)">
        {/* ── MAIN BODY SHELL ── */}
        {/* Upper body — the aggressive SVJ wedge shape */}
        <path
          d="M62 128 C65 114 72 102 82 92 L105 76 L135 60 L172 44 L218 30 L280 22 L350 20 L420 22 L470 32 L510 48 L548 68 L580 86 L615 104 L638 118 C648 125 650 133 644 140 L620 148 L575 150
             C570 124 548 108 520 108 C492 108 470 124 466 150 L248 150
             C243 124 222 108 194 108 C166 108 144 124 140 150 L82 150
             C66 146 58 138 62 128Z"
          fill="url(#svjBody)"
        />

        {/* Lower body — side sill and rocker panel */}
        <path
          d="M78 120 L120 110 L210 106 L340 105 L480 108 L570 116 L636 130
             C644 136 642 142 634 146 L572 152
             C566 130 546 116 520 116 C494 116 475 130 468 152 L246 152
             C240 130 220 116 194 116 C168 116 148 130 142 152 L78 150
             C64 144 62 134 78 120Z"
          fill="url(#svjLower)"
          opacity="0.85"
        />

        {/* ── WINDSHIELD & WINDOWS ── */}
        {/* Front windshield */}
        <path d="M160 58 L220 32 L290 24 L280 68 L195 76 L140 82 Z"
          fill="url(#svjGlass)" />
        {/* Roof panel */}
        <path d="M292 24 L360 22 L428 28 L460 46 L440 62 L282 68 Z"
          fill="url(#svjGlass)" />
        {/* Rear quarter glass */}
        <path d="M430 28 L472 42 L498 58 L462 48 Z"
          fill="url(#svjRearGlass)" />
        {/* Window divider pillar */}
        <path d="M282 24 L274 76" stroke="#9A6A10" strokeWidth="2.5" opacity="0.6" />

        {/* ── SVJ AGGRESSIVE DETAILS ── */}
        {/* Front splitter — aggressive chin */}
        <path d="M58 134 L30 132 L24 124 L48 118 L96 106 L142 98 L135 108 L70 126 Z"
          fill="url(#svjCarbon)" />
        {/* Front air intakes */}
        <path d="M88 106 L130 94 L172 92 L160 104 L120 108 Z"
          fill="#0A0A0A" opacity="0.9" />
        <path d="M172 92 L220 88 L260 90 L252 100 L195 102 Z"
          fill="#0A0A0A" opacity="0.85" />

        {/* Side air intake — SVJ signature Y-shape */}
        <path d="M280 86 L380 84 L440 76 L456 84 L420 94 L350 96 L270 98 Z"
          fill="#0A0A0A" opacity="0.7" />
        <path d="M300 88 L370 87 L410 82 L395 91 L330 93 Z"
          fill="url(#svjCarbon)" opacity="0.8" />

        {/* Rear engine vents — louvered */}
        <path d="M456 58 L490 52 L510 54 L502 66 L472 68 Z"
          fill="#0D0D0D" opacity="0.85" />
        <path d="M460 60 L485 55" stroke="#3A3A3A" strokeWidth="1" opacity="0.5" />
        <path d="M462 63 L488 58" stroke="#3A3A3A" strokeWidth="1" opacity="0.5" />
        <path d="M464 66 L490 61" stroke="#3A3A3A" strokeWidth="1" opacity="0.5" />

        {/* ── REAR WING — big SVJ wing ── */}
        <path d="M448 30 L430 18 L410 14 L460 8 L534 12 L552 18 L520 30 L490 34 Z"
          fill="url(#svjCarbon)" />
        {/* Wing endplates */}
        <path d="M410 14 L415 26 L430 30 L448 30 L430 18 Z"
          fill="#1A1A1A" opacity="0.9" />
        <path d="M534 12 L530 24 L520 30 L504 32 L520 18 Z"
          fill="#1A1A1A" opacity="0.9" />
        {/* Wing pillars */}
        <path d="M445 30 L450 46" stroke="#222" strokeWidth="3" />
        <path d="M495 32 L498 48" stroke="#222" strokeWidth="3" />
        {/* Wing edge highlight */}
        <path d="M418 14 L530 14" stroke="#FFE082" strokeWidth="0.8" opacity="0.3" />

        {/* ── BODY LINES ── */}
        {/* Upper body crease line */}
        <path d="M96 86 L200 78 L340 76 L480 80 L560 92"
          stroke="#FFE88A" strokeWidth="1.8" fill="none" opacity="0.5" />
        {/* Door seam */}
        <path d="M340 76 L328 148" stroke="#9A6A10" strokeWidth="1.5" opacity="0.4" />
        {/* Fender line */}
        <path d="M120 96 L108 148" stroke="#B8820E" strokeWidth="1.2" opacity="0.35" />
        {/* Rear fender line */}
        <path d="M500 82 L505 148" stroke="#B8820E" strokeWidth="1.2" opacity="0.35" />

        {/* ── SIDE SKIRT DETAIL ── */}
        <path d="M148 126 L310 120 L460 122 L530 128"
          stroke="#7A5208" strokeWidth="1.5" fill="none" opacity="0.45" />

        {/* ── HEADLIGHTS (Y-shape Lambo style) ── */}
        <path d="M570 82 L638 112 L648 124 L628 120 L590 100 Z"
          fill="#FFFDE8" opacity="0.95" />
        <path d="M578 86 L625 108 L635 118"
          stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
        {/* DRL strip */}
        <path d="M560 92 L580 86 L620 102"
          stroke="#FFE082" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
        {/* Headlight glow */}
        <circle cx="630" cy="114" r="12" fill="url(#svjHeadlight)" filter="url(#svjGlow)" opacity="0.6" />

        {/* ── TAILLIGHTS ── */}
        <path d="M62 102 L88 94 L98 106 L76 112 L56 114 Z"
          fill="#CC1020" opacity="0.95" />
        <path d="M66 104 L82 98" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <path d="M60 108 L78 104" stroke="#FF4444" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

        {/* ── REAR DIFFUSER ── */}
        <path d="M46 144 L100 140 L130 150 L42 150 Z"
          fill="url(#svjCarbon)" />
        {/* Exhaust tips */}
        <rect x="58" y="142" width="14" height="6" rx="2" fill="#2A2A2A" />
        <rect x="78" y="142" width="14" height="6" rx="2" fill="#2A2A2A" />
        <rect x="60" y="143" width="10" height="4" rx="1.5" fill="#444" opacity="0.7" />
        <rect x="80" y="143" width="10" height="4" rx="1.5" fill="#444" opacity="0.7" />
        {/* Heat glow from exhausts */}
        <ellipse cx="65" cy="145" rx="3" ry="1.5" fill="#FF6B3D" opacity="0.4" />
        <ellipse cx="85" cy="145" rx="3" ry="1.5" fill="#FF6B3D" opacity="0.4" />

        {/* ── FRONT BUMPER DETAIL ── */}
        <path d="M614 126 L662 128 L656 142 L620 148 L608 144 Z"
          fill="url(#svjCarbon)" />

        {/* ── HOOD VENTS ── */}
        <path d="M240 48 L280 38 L310 36 L300 50 L260 54 Z"
          fill="#0A0A0A" opacity="0.6" />
        <path d="M310 36 L350 34 L380 36 L365 48 L302 50 Z"
          fill="#0A0A0A" opacity="0.55" />

        {/* Roof highlight */}
        <path d="M296 26 L360 24 L420 30"
          stroke="#FFF8E0" strokeWidth="1.2" fill="none" opacity="0.35" />
      </g>

      {/* ── WHEELS ── */}
      {[
        { cx: 194, cy: 150 },
        { cx: 520, cy: 150 },
      ].map(({ cx, cy }) => (
        <g key={`wheel-${cx}`}>
          {/* Tyre */}
          <circle cx={cx} cy={cy} r="38" fill="#080808" />
          <circle cx={cx} cy={cy} r="36" fill="#111" />
          {/* Tyre sidewall detail */}
          <circle cx={cx} cy={cy} r="34" fill="none" stroke="#1E1E1E" strokeWidth="2" />

          {/* Rim */}
          <circle cx={cx} cy={cy} r="28" fill="url(#svjRim)" />
          <circle cx={cx} cy={cy} r="26" fill="#161616" />

          {/* 5-spoke Y-spoke pattern (SVJ Leirion wheels) */}
          {[0, 72, 144, 216, 288].map(angle => {
            const rad = (angle * Math.PI) / 180;
            const innerR = 7;
            const outerR = 24;
            const splay = 12;
            const rad2a = ((angle - splay) * Math.PI) / 180;
            const rad2b = ((angle + splay) * Math.PI) / 180;
            return (
              <path
                key={angle}
                d={`M ${cx + innerR * Math.cos(rad)} ${cy + innerR * Math.sin(rad)}
                    L ${cx + outerR * Math.cos(rad2a)} ${cy + outerR * Math.sin(rad2a)}
                    A ${outerR} ${outerR} 0 0 1 ${cx + outerR * Math.cos(rad2b)} ${cy + outerR * Math.sin(rad2b)}
                    Z`}
                fill="#3A3A3A"
                stroke="#555"
                strokeWidth="0.5"
                opacity="0.85"
              />
            );
          })}

          {/* Inner ring */}
          <circle cx={cx} cy={cy} r="12" fill="#1E1E1E" />

          {/* Brake disc visible through spokes */}
          <circle cx={cx} cy={cy} r="18" fill="none" stroke="#333" strokeWidth="1.5" opacity="0.4" />
          {/* Drilled brake rotor dots */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
            <circle
              key={`brake-${a}`}
              cx={cx + 16 * Math.cos((a * Math.PI) / 180)}
              cy={cy + 16 * Math.sin((a * Math.PI) / 180)}
              r="1"
              fill="#444"
              opacity="0.5"
            />
          ))}

          {/* Brake caliper */}
          <rect
            x={cx - 9} y={cy - 5}
            width="8" height="10" rx="2"
            fill="url(#svjBrake)"
            opacity="0.65"
          />

          {/* Center cap — Lambo bull logo area */}
          <circle cx={cx} cy={cy} r="7" fill="#D4960E" />
          <circle cx={cx} cy={cy} r="5.5" fill="#C48A0E" />
          <circle cx={cx} cy={cy} r="2.5" fill="#1A1A1A" />

          {/* Wheel highlight */}
          <circle cx={cx - 12} cy={cy - 12} r="4" fill="#FFF8E0" opacity="0.12" />
        </g>
      ))}
    </svg>
  );
}

function SpeedStreaks() {
  const lines = [
    { y: 52, w: 200, opacity: 0.20, h: 1.5 },
    { y: 64, w: 380, opacity: 0.50, h: 2 },
    { y: 74, w: 520, opacity: 0.55, h: 2.5 },
    { y: 82, w: 440, opacity: 0.45, h: 2 },
    { y: 90, w: 600, opacity: 0.40, h: 2 },
    { y: 98, w: 300, opacity: 0.35, h: 1.5 },
    { y: 105, w: 480, opacity: 0.30, h: 2 },
    { y: 112, w: 220, opacity: 0.20, h: 1.5 },
    { y: 118, w: 400, opacity: 0.25, h: 1.5 },
  ];
  return (
    <svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg" width="640" height="150" aria-hidden="true">
      <defs>
        <linearGradient id="streakFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E8A828" stopOpacity="0" />
          <stop offset="0.2" stopColor="#E8A828" stopOpacity="1" />
          <stop offset="1" stopColor="#E8A828" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {lines.map((l, i) => (
        <rect key={i} x={0} y={l.y} width={l.w} height={l.h} rx="1"
          fill="url(#streakFade)" opacity={l.opacity} />
      ))}
    </svg>
  );
}

export default function LamborghiniIntro({ onComplete }) {
  const [phase, setPhase] = useState('running');

  useEffect(() => {
    // car sweeps in 1.2s → brief logo show → fade out
    const tExit = setTimeout(() => setPhase('exiting'), 1700);
    const tDone = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 2280);
    return () => { clearTimeout(tExit); clearTimeout(tDone); };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div className={`lambo-intro${phase === 'exiting' ? ' lambo-intro-exit' : ''}`}>
      {/* Road */}
      <div className="lambo-road">
        <div className="lambo-road-line" />
      </div>

      {/* Scene */}
      <div className="lambo-scene">
        {/* Speed streaks */}
        <div className="lambo-streaks" style={{ position: 'absolute', bottom: 28, left: '-60px' }}>
          <SpeedStreaks />
        </div>
        {/* Car */}
        <div className="lambo-car">
          <LamborghiniSVG />
        </div>
      </div>

      {/* Logo — fades in after car passes */}
      <div className="lambo-logo">
        <div className="lambo-logo-mark">TA</div>
        <div className="lambo-logo-name">Trust Automobile</div>
        <div className="lambo-logo-sub">Ghana's #1 Car Marketplace</div>
      </div>
    </div>
  );
}
