import { useEffect, useState } from 'react';

function LamborghiniSVG() {
  return (
    <svg viewBox="0 0 580 130" xmlns="http://www.w3.org/2000/svg" width="580" height="130" aria-hidden="true">
      {/* Ground shadow */}
      <ellipse cx="290" cy="126" rx="235" ry="7" fill="rgba(0,0,0,0.25)" />

      {/* Main body — Lamborghini Huracán wedge silhouette, car faces right */}
      <path
        d="M 62,105
           L 42,105 L 30,96 L 24,84 L 30,70 L 48,55
           L 78,37 L 126,22 L 198,14 L 294,12
           L 388,14 L 444,22 L 490,36
           L 520,52 L 540,68 L 546,82 L 542,98 L 538,105
           L 496,105
           A 22,22 0 0 0 452,105
           L 168,105
           A 22,22 0 0 0 124,105
           Z"
        fill="#E8A828"
      />

      {/* Lower body panel — darker gold accent */}
      <path
        d="M 62,105 L 124,105 A 22,22 0 0 1 168,105 L 452,105 A 22,22 0 0 1 496,105 L 538,105 L 542,98 L 62,98 Z"
        fill="#C48B18"
        opacity="0.55"
      />

      {/* Rear window (leftmost) */}
      <path d="M 78,37 L 126,22 L 124,58 L 92,62 Z" fill="#0B1D35" opacity="0.85" />

      {/* Main side window */}
      <path d="M 126,22 L 198,14 L 294,12 L 290,50 L 124,58 Z" fill="#0B1D35" opacity="0.72" />

      {/* Front window / A-pillar */}
      <path d="M 294,12 L 388,14 L 444,22 L 438,48 L 290,50 Z" fill="#0B1D35" opacity="0.78" />

      {/* Windscreen (steep angle) */}
      <path d="M 444,22 L 490,36 L 484,52 L 438,48 Z" fill="#0B1D35" opacity="0.9" />

      {/* Door seam */}
      <line x1="290" y1="12" x2="276" y2="104" stroke="#C48B18" strokeWidth="1.5" opacity="0.5" />

      {/* Body crease highlight */}
      <path
        d="M 52,68 L 112,60 L 290,56 L 450,58 L 510,66"
        stroke="#F5C05A" strokeWidth="1.2" fill="none" opacity="0.45"
      />

      {/* Front headlight strip */}
      <path d="M 510,52 L 540,68 L 536,80 L 508,66 Z" fill="#FFF8D6" opacity="0.85" />
      <path d="M 536,62 L 542,72 L 538,76 L 532,68 Z" fill="#fff" opacity="0.7" />

      {/* Rear tail light */}
      <rect x="28" y="70" width="5" height="20" rx="2" fill="#FF3030" opacity="0.9" />
      <rect x="24" y="74" width="3" height="12" rx="1" fill="#FF6060" opacity="0.7" />

      {/* Rear spoiler post */}
      <rect x="40" y="45" width="5" height="28" rx="2" fill="#E8A828" />
      {/* Spoiler wing */}
      <rect x="14" y="40" width="54" height="8" rx="3" fill="#E8A828" />
      <rect x="14" y="38" width="54" height="3" rx="1.5" fill="#F5C05A" opacity="0.7" />

      {/* Front diffuser / splitter */}
      <path d="M 526,98 L 548,98 L 548,104 L 526,102 Z" fill="#C48B18" opacity="0.8" />
      <path d="M 524,104 L 554,104 L 556,108 L 524,108 Z" fill="#B87A10" opacity="0.6" />

      {/* Rear diffuser */}
      <path d="M 24,98 L 48,98 L 46,105 L 24,105 Z" fill="#B87A10" opacity="0.6" />

      {/* Rear wheel */}
      <circle cx="145" cy="105" r="24" fill="#1A1A1A" />
      <circle cx="145" cy="105" r="17" fill="#252525" />
      {/* Spokes */}
      {[0,60,120,180,240,300].map(angle => (
        <line
          key={angle}
          x1={145 + 5 * Math.cos((angle * Math.PI) / 180)}
          y1={105 + 5 * Math.sin((angle * Math.PI) / 180)}
          x2={145 + 16 * Math.cos((angle * Math.PI) / 180)}
          y2={105 + 16 * Math.sin((angle * Math.PI) / 180)}
          stroke="#3A3A3A" strokeWidth="3" strokeLinecap="round"
        />
      ))}
      <circle cx="145" cy="105" r="5" fill="#E8A828" />

      {/* Front wheel */}
      <circle cx="474" cy="105" r="24" fill="#1A1A1A" />
      <circle cx="474" cy="105" r="17" fill="#252525" />
      {[0,60,120,180,240,300].map(angle => (
        <line
          key={angle}
          x1={474 + 5 * Math.cos((angle * Math.PI) / 180)}
          y1={105 + 5 * Math.sin((angle * Math.PI) / 180)}
          x2={474 + 16 * Math.cos((angle * Math.PI) / 180)}
          y2={105 + 16 * Math.sin((angle * Math.PI) / 180)}
          stroke="#3A3A3A" strokeWidth="3" strokeLinecap="round"
        />
      ))}
      <circle cx="474" cy="105" r="5" fill="#E8A828" />
    </svg>
  );
}

function SpeedStreaks() {
  const lines = [
    { y: 72, w: 320, opacity: 0.55 },
    { y: 80, w: 500, opacity: 0.45 },
    { y: 88, w: 260, opacity: 0.35 },
    { y: 95, w: 420, opacity: 0.40 },
    { y: 62, w: 180, opacity: 0.30 },
    { y: 100, w: 350, opacity: 0.25 },
  ];
  return (
    <svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg" width="540" height="130" aria-hidden="true">
      {lines.map((l, i) => (
        <rect key={i} x={0} y={l.y} width={l.w} height="2" rx="1" fill="#E8A828" opacity={l.opacity} />
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
