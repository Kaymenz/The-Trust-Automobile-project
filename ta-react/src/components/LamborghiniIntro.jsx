import { useEffect, useState } from "react";

function LamborghiniSVG() {
  return (
    <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" width="720" height="200" aria-hidden="true">
      <defs>
        <linearGradient id="svjBody" x1="60" y1="20" x2="660" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE082" /><stop offset="0.25" stopColor="#F5C842" />
          <stop offset="0.5" stopColor="#E8A828" /><stop offset="0.75" stopColor="#C48A10" />
          <stop offset="1" stopColor="#F0C040" />
        </linearGradient>
        <linearGradient id="svjLower" x1="60" y1="120" x2="660" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8A5A08" /><stop offset="0.5" stopColor="#B07B12" /><stop offset="1" stopColor="#6B4205" />
        </linearGradient>
        <linearGradient id="svjGlass" x1="180" y1="25" x2="400" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1A3A5C" /><stop offset="0.4" stopColor="#0D1F35" /><stop offset="1" stopColor="#060F1C" />
        </linearGradient>
        <linearGradient id="svjRearGlass" x1="400" y1="30" x2="480" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0F1A2C" /><stop offset="1" stopColor="#060C18" />
        </linearGradient>
        <radialGradient id="svjHeadlight" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.3" stopColor="#FFFDE8" stopOpacity="0.9" />
          <stop offset="0.7" stopColor="#FFE082" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFE082" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="svjRim" cx="50%" cy="48%" r="50%">
          <stop offset="0" stopColor="#8A8A8A" /><stop offset="0.35" stopColor="#4A4A4A" />
          <stop offset="0.7" stopColor="#1A1A1A" /><stop offset="1" stopColor="#0A0A0A" />
        </radialGradient>
        <radialGradient id="svjBrake" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#E53935" /><stop offset="1" stopColor="#B71C1C" />
        </radialGradient>
        <pattern id="svjCarbon" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#1A1A1A" />
          <rect width="2" height="2" fill="#222" />
          <rect x="2" y="2" width="2" height="2" fill="#222" />
        </pattern>
        <filter id="svjShadow" x="-10%" y="-20%" width="120%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="6" result="offsetblur" />
          <feComponentTransfer><feFuncA type="linear" slope="0.4" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="svjGlow">
          <feGaussianBlur stdDeviation="6" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="360" cy="178" rx="290" ry="14" fill="#020812" opacity="0.45" />
      <ellipse cx="360" cy="172" rx="230" ry="6" fill="#000" opacity="0.25" />
      <g filter="url(#svjShadow)">
        <path d="M62 128 C65 114 72 102 82 92 L105 76 L135 60 L172 44 L218 30 L280 22 L350 20 L420 22 L470 32 L510 48 L548 68 L580 86 L615 104 L638 118 C648 125 650 133 644 140 L620 148 L575 150 C570 124 548 108 520 108 C492 108 470 124 466 150 L248 150 C243 124 222 108 194 108 C166 108 144 124 140 150 L82 150 C66 146 58 138 62 128Z" fill="url(#svjBody)"/>
        <path d="M78 120 L120 110 L210 106 L340 105 L480 108 L570 116 L636 130 C644 136 642 142 634 146 L572 152 C566 130 546 116 520 116 C494 116 475 130 468 152 L246 152 C240 130 220 116 194 116 C168 116 148 130 142 152 L78 150 C64 144 62 134 78 120Z" fill="url(#svjLower)" opacity="0.85"/>
        <path d="M160 58 L220 32 L290 24 L280 68 L195 76 L140 82 Z" fill="url(#svjGlass)"/>
        <path d="M292 24 L360 22 L428 28 L460 46 L440 62 L282 68 Z" fill="url(#svjGlass)"/>
        <path d="M430 28 L472 42 L498 58 L462 48 Z" fill="url(#svjRearGlass)"/>
        <path d="M282 24 L274 76" stroke="#9A6A10" strokeWidth="2.5" opacity="0.6"/>
        <path d="M58 134 L30 132 L24 124 L48 118 L96 106 L142 98 L135 108 L70 126 Z" fill="url(#svjCarbon)"/>
        <path d="M88 106 L130 94 L172 92 L160 104 L120 108 Z" fill="#0A0A0A" opacity="0.9"/>
        <path d="M172 92 L220 88 L260 90 L252 100 L195 102 Z" fill="#0A0A0A" opacity="0.85"/>
        <path d="M280 86 L380 84 L440 76 L456 84 L420 94 L350 96 L270 98 Z" fill="#0A0A0A" opacity="0.7"/>
        <path d="M448 30 L430 18 L410 14 L460 8 L534 12 L552 18 L520 30 L490 34 Z" fill="url(#svjCarbon)"/>
        <path d="M445 30 L450 46" stroke="#222" strokeWidth="3"/>
        <path d="M495 32 L498 48" stroke="#222" strokeWidth="3"/>
        <path d="M96 86 L200 78 L340 76 L480 80 L560 92" stroke="#FFE88A" strokeWidth="1.8" fill="none" opacity="0.5"/>
        <path d="M570 82 L638 112 L648 124 L628 120 L590 100 Z" fill="#FFFDE8" opacity="0.95"/>
        <path d="M578 86 L625 108 L635 118" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.85"/>
        <circle cx="630" cy="114" r="12" fill="url(#svjHeadlight)" filter="url(#svjGlow)" opacity="0.6"/>
        <path d="M62 102 L88 94 L98 106 L76 112 L56 114 Z" fill="#CC1020" opacity="0.95"/>
        <path d="M66 104 L82 98" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        <path d="M46 144 L100 140 L130 150 L42 150 Z" fill="url(#svjCarbon)"/>
        <rect x="58" y="142" width="14" height="6" rx="2" fill="#2A2A2A"/>
        <rect x="78" y="142" width="14" height="6" rx="2" fill="#2A2A2A"/>
        <ellipse cx="65" cy="145" rx="3" ry="1.5" fill="#FF6B3D" opacity="0.4"/>
        <ellipse cx="85" cy="145" rx="3" ry="1.5" fill="#FF6B3D" opacity="0.4"/>
        <path d="M240 48 L280 38 L310 36 L300 50 L260 54 Z" fill="#0A0A0A" opacity="0.6"/>
        <path d="M310 36 L350 34 L380 36 L365 48 L302 50 Z" fill="#0A0A0A" opacity="0.55"/>
      </g>
      {[{ cx: 194, cy: 150 }, { cx: 520, cy: 150 }].map(({ cx, cy }) => (
        <g key={`wheel-${cx}`}>
          <circle cx={cx} cy={cy} r="38" fill="#080808"/>
          <circle cx={cx} cy={cy} r="36" fill="#111"/>
          <circle cx={cx} cy={cy} r="28" fill="url(#svjRim)"/>
          <circle cx={cx} cy={cy} r="26" fill="#161616"/>
          {[0, 72, 144, 216, 288].map(angle => {
            const rad = (angle * Math.PI) / 180;
            const innerR = 7, outerR = 24, splay = 12;
            const rad2a = ((angle - splay) * Math.PI) / 180;
            const rad2b = ((angle + splay) * Math.PI) / 180;
            return (
              <path key={angle}
                d={`M ${cx + innerR * Math.cos(rad)} ${cy + innerR * Math.sin(rad)} L ${cx + outerR * Math.cos(rad2a)} ${cy + outerR * Math.sin(rad2a)} A ${outerR} ${outerR} 0 0 1 ${cx + outerR * Math.cos(rad2b)} ${cy + outerR * Math.sin(rad2b)} Z`}
                fill="#3A3A3A" stroke="#555" strokeWidth="0.5" opacity="0.85"
              />
            );
          })}
          <circle cx={cx} cy={cy} r="12" fill="#1E1E1E"/>
          <rect x={cx - 9} y={cy - 5} width="8" height="10" rx="2" fill="url(#svjBrake)" opacity="0.65"/>
          <circle cx={cx} cy={cy} r="7" fill="#D4960E"/>
          <circle cx={cx} cy={cy} r="5.5" fill="#C48A0E"/>
          <circle cx={cx} cy={cy} r="2.5" fill="#1A1A1A"/>
        </g>
      ))}
    </svg>
  );
}

function SpeedStreaks() {
  const lines = [
    { y: 52, w: 200, opacity: 0.20, h: 1.5 }, { y: 64, w: 380, opacity: 0.50, h: 2 },
    { y: 74, w: 520, opacity: 0.55, h: 2.5 }, { y: 82, w: 440, opacity: 0.45, h: 2 },
    { y: 90, w: 600, opacity: 0.40, h: 2 },   { y: 98, w: 300, opacity: 0.35, h: 1.5 },
    { y: 105, w: 480, opacity: 0.30, h: 2 },  { y: 112, w: 220, opacity: 0.20, h: 1.5 },
    { y: 118, w: 400, opacity: 0.25, h: 1.5 },
  ];
  return (
    <svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg" width="640" height="150" aria-hidden="true">
      <defs>
        <linearGradient id="streakFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E8A828" stopOpacity="0"/>
          <stop offset="0.2" stopColor="#E8A828" stopOpacity="1"/>
          <stop offset="1" stopColor="#E8A828" stopOpacity="0.8"/>
        </linearGradient>
      </defs>
      {lines.map((l, i) => (
        <rect key={i} x={0} y={l.y} width={l.w} height={l.h} rx="1" fill="url(#streakFade)" opacity={l.opacity}/>
      ))}
    </svg>
  );
}

function RpmBars({ active }) {
  const heights = [3, 5, 8, 12, 9, 14, 11, 7, 10, 13, 8, 6, 11, 9, 14, 10, 7, 12];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28, opacity: active ? 1 : 0, transition: "opacity 0.3s" }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 4, height: h, borderRadius: 2,
          background: `hsl(${42 + i * 3}, 85%, ${50 + i}%)`,
          animation: active ? `rpmPulse ${0.3 + (i % 4) * 0.1}s ease-in-out ${i * 0.04}s infinite alternate` : "none",
        }}/>
      ))}
    </div>
  );
}

export default function LamborghiniIntro({ onComplete }) {
  const [phase, setPhase] = useState("running");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tReveal = setTimeout(() => setPhase("reveal"), 1300);
    const tExit   = setTimeout(() => setPhase("exiting"), 2600);
    const tDone   = setTimeout(() => { setPhase("done"); onComplete?.(); }, 3150);

    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + (p < 60 ? 4 : p < 85 ? 2 : 1));
      setProgress(p);
      if (p >= 100) clearInterval(tick);
    }, 30);

    return () => { clearTimeout(tReveal); clearTimeout(tExit); clearTimeout(tDone); clearInterval(tick); };
  }, [onComplete]);

  if (phase === "done") return null;

  const isReveal = phase === "reveal" || phase === "exiting";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "@keyframes rpmPulse{from{transform:scaleY(0.6)}to{transform:scaleY(1.15)}} @keyframes fadeSlideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes taglineFade{0%{opacity:0;letter-spacing:0.3em}100%{opacity:1;letter-spacing:0.14em}}" }} />
      <div className={`lambo-intro${phase === "exiting" ? " lambo-intro-exit" : ""}`}>
        <div className="lambo-road"><div className="lambo-road-line"/></div>
        <div className="lambo-scene">
          <div className="lambo-streaks" style={{ position: "absolute", bottom: 28, left: "-60px" }}>
            <SpeedStreaks/>
          </div>
          <div className="lambo-car"><LamborghiniSVG/></div>
        </div>

        <div className="lambo-logo" style={{ opacity: isReveal ? 1 : 0, transition: "opacity 0.5s" }}>
          <div className="lambo-logo-mark" style={{ background: "transparent", padding: 0, boxShadow: "none", width: 64, height: 72 }}>
            <svg viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="72">
              <defs>
                <radialGradient id="shieldGlow" cx="50%" cy="30%" r="60%">
                  <stop offset="0" stopColor="#D4AF37" stopOpacity="0.35"/>
                  <stop offset="1" stopColor="#D4AF37" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <path d="M32 4L58 14V34C58 50 46 62 32 68C18 62 6 50 6 34V14L32 4Z" fill="#0B1220" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.55"/>
              <path d="M32 4L58 14V34C58 50 46 62 32 68C18 62 6 50 6 34V14L32 4Z" fill="url(#shieldGlow)"/>
              <path d="M13 48L16 38L22 33H42L48 38L51 48H13Z" fill="#D4AF37"/>
              <path d="M22 33L25 26H39L42 33H22Z" fill="#D4AF37" opacity="0.6"/>
              <circle cx="20" cy="48" r="6" fill="#0B1220" stroke="#D4AF37" strokeWidth="1.5"/>
              <circle cx="20" cy="48" r="2.5" fill="#D4AF37" opacity="0.5"/>
              <circle cx="44" cy="48" r="6" fill="#0B1220" stroke="#D4AF37" strokeWidth="1.5"/>
              <circle cx="44" cy="48" r="2.5" fill="#D4AF37" opacity="0.5"/>
              <path d="M10 44H54" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.3"/>
            </svg>
          </div>

          <div style={{ animation: isReveal ? "fadeSlideUp 0.45s ease forwards" : "none", animationDelay: "0.1s", opacity: 0 }}>
            <div className="lambo-logo-name" style={{ fontSize: 26, letterSpacing: "-0.02em", marginBottom: 4 }}>
              Trust Automobile
            </div>
          </div>

          <div style={{ animation: isReveal ? "taglineFade 0.6s ease forwards" : "none", animationDelay: "0.3s", opacity: 0 }}>
            <div className="lambo-logo-sub" style={{ marginBottom: 16 }}>
              Ghana&apos;s #1 Verified Car Marketplace
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <RpmBars active={isReveal}/>
            <div style={{ width: 180, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 9999, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: "linear-gradient(90deg, #C48A10, #F5C842)",
                borderRadius: 9999, transition: "width 0.05s linear",
                boxShadow: "0 0 8px rgba(212,175,55,0.6)",
              }}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}