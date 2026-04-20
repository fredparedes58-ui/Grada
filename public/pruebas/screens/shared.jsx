// shared.jsx — primitives: icons, neon effects, tab bar, images, generated photos
const { useState, useEffect, useRef, useMemo } = React;

// ═════════════════════════════════════════════════════════════
// ICONS (thin stroke, filled where noted)
// ═════════════════════════════════════════════════════════════
const Icon = {
  home:      (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-8 9 8v8a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2z"/></svg>,
  chat:      (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  community: (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  profile:   (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  play:      (p={}) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill={p.color||'currentColor'}><path d="M8 5v14l11-7z"/></svg>,
  search:    (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  mail:      (p={}) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>,
  lock:      (p={}) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 118 0v4"/></svg>,
  user:      (p={}) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>,
  flame:     (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill={p.color||'currentColor'}><path d="M13.5 0.67s.74 1.79.74 3.24c0 1.39-.91 2.52-2.3 2.52-1.4 0-2.44-1.13-2.44-2.52L9.54 3.8C6.22 6.25 4 10.23 4 14.5 4 18.64 7.58 22 12 22s8-3.36 8-7.5c0-5.18-2.49-9.78-6.5-13.83zM12 20c-3.03 0-5.5-2.24-5.5-5 0-2.56 2.03-5 5.5-5 2.97 0 5.5 2.44 5.5 5 0 2.76-2.47 5-5.5 5z"/></svg>,
  heart:     (p={}) => <svg viewBox="0 0 24 24" width={p.size||24} height={p.size||24} fill={p.filled?(p.color||'currentColor'):'none'} stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  share:     (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v14"/></svg>,
  bookmark:  (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill={p.filled?(p.color||'currentColor'):'none'} stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
  star:      (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill={p.color||'currentColor'}><path d="M12 2l3 7 7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5 9 9z"/></svg>,
  ball:      (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke={p.color||'currentColor'} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2l3 5-3 3-3-3z" fill={p.color||'currentColor'}/><path d="M2 12l5 3M22 12l-5 3M12 22l3-5M12 22l-3-5"/></svg>,
  plus:      (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke={p.color||'currentColor'} strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  chevron:   (p={}) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke={p.color||'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  settings:  (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  trophy:    (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill={p.color||'currentColor'}><path d="M6 4h12v4a6 6 0 11-12 0zM4 6v2a4 4 0 004 4M20 6v2a4 4 0 01-4 4M10 18h4v2H10zM8 20h8v2H8z"/></svg>,
  check:     (p={}) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke={p.color||'currentColor'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-11"/></svg>,
  bell:      (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  mic:       (p={}) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0M12 17v4"/></svg>,
  runner:    (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill={p.color||'currentColor'}><circle cx="13" cy="4" r="2"/><path d="M13.5 7l-3 5 3 2 1.5 5h-2l-1-3.5-2.5-1.7L6 17l-1.5-1 4-6 1-4h2.5zM17 11l3 1-1 2-4-1.5z"/></svg>,
  podium:    (p={}) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="18"/><rect x="2" y="9" width="7" height="12"/><rect x="15" y="6" width="7" height="15"/></svg>,
  calendar:  (p={}) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  pin:       (p={}) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};

// ═════════════════════════════════════════════════════════════
// RADIAL SPEED RAYS (hero bg from reference — green rays from center)
// ═════════════════════════════════════════════════════════════
function RadialRays({ intensity = 1, originY = 0, color = 'var(--accent-primary)' }) {
  const rays = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i * 360 / 32) + (Math.random() * 6 - 3);
      const len = 45 + Math.random() * 50;
      const w = 0.6 + Math.random() * 1.4;
      const opacity = 0.3 + Math.random() * 0.5;
      const delay = Math.random() * 4;
      const dur = 3 + Math.random() * 3;
      arr.push({ angle, len, w, opacity, delay, dur });
    }
    return arr;
  }, []);
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute',
        top: `${originY}%`, left: '50%',
        width: 0, height: 0,
        transform: 'translate(-50%, -50%)',
      }}>
        {rays.map((r, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: 0, top: 0,
            width: `${r.len}vmax`,
            height: r.w,
            background: `linear-gradient(90deg, ${color} 0%, ${color}aa 20%, transparent 100%)`,
            boxShadow: `0 0 6px ${color}, 0 0 14px ${color}88`,
            transformOrigin: '0% 50%',
            transform: `rotate(${r.angle}deg)`,
            opacity: r.opacity * intensity,
            animation: `ray-pulse ${r.dur}s ease-in-out ${r.delay}s infinite`,
            filter: 'blur(0.3px)',
          }} />
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// ORBITING NEON BALL (top hero — spinning, with glow)
// ═════════════════════════════════════════════════════════════
function NeonBall({ size = 90, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      width: size, height: size,
      ...style,
    }}>
      {/* outer glow */}
      <div style={{
        position: 'absolute', inset: -size * 0.25,
        borderRadius: '50%',
        background: `radial-gradient(circle, var(--accent-primary) 0%, transparent 60%)`,
        opacity: 0.55,
        filter: 'blur(12px)',
        animation: 'pulse-glow 2.5s ease-in-out infinite',
      }} />
      {/* ball itself — rotating */}
      <div style={{
        position: 'relative',
        width: size, height: size,
        animation: 'spin-slow 10s linear infinite',
      }}>
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <defs>
            <radialGradient id="nb-fill" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#041008" />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#nb-fill)"
            stroke="var(--accent-primary)" strokeWidth="2.5"
            style={{ filter: 'drop-shadow(0 0 8px var(--accent-primary))' }} />
          {/* hex pattern */}
          <g stroke="var(--accent-primary)" strokeWidth="1.8" fill="none"
            style={{ filter: 'drop-shadow(0 0 4px var(--accent-primary))' }}>
            <polygon points="50,22 62,30 58,44 42,44 38,30" />
            <polygon points="22,46 34,40 42,50 36,62 24,60" />
            <polygon points="78,46 66,40 58,50 64,62 76,60" />
            <polygon points="50,70 38,66 34,78 48,84 62,78" />
            <line x1="50" y1="44" x2="50" y2="66" />
            <line x1="42" y1="44" x2="36" y2="52" />
            <line x1="58" y1="44" x2="64" y2="52" />
            <line x1="38" y1="62" x2="34" y2="62" />
            <line x1="62" y1="62" x2="66" y2="62" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// SPARK PARTICLES (fly outward from a point)
// ═════════════════════════════════════════════════════════════
function Sparks({ count = 14, color = 'var(--accent-primary)', radius = 80 }) {
  const sparks = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * 360 + Math.random() * 10,
      dist: radius * (0.6 + Math.random() * 0.7),
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 2,
      dur: 1.2 + Math.random() * 1.8,
    }));
  }, [count, radius]);
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {sparks.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
          transform: `rotate(${s.angle}deg) translateX(0)`,
          animation: `spark-fly ${s.dur}s ease-out ${s.delay}s infinite`,
          '--dist': `${s.dist}px`,
        }} />
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// GENERATED PHOTO-LIKE PLACEHOLDERS (SVG scenes that look like stock sports photos)
// ═════════════════════════════════════════════════════════════

// Real photos from Unsplash (free to use, URLs with size params)
const PHOTOS = {
  bicycle:  'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80&auto=format&fit=crop',
  portrait: 'https://images.unsplash.com/photo-1628891439767-b50ff5d8d8ad?w=600&q=80&auto=format&fit=crop',
  team:     'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80&auto=format&fit=crop',
  stadium:  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&q=80&auto=format&fit=crop',
  action:   'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80&auto=format&fit=crop',
  pitch:    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80&auto=format&fit=crop',
};
const AVATAR_PHOTOS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80&auto=format&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80&auto=format&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80&auto=format&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80&auto=format&fit=crop&crop=faces',
];

// Full stadium scene — real photo from Unsplash with neon overlay
function StadiumPhoto({ style = {}, action = 'bicycle' }) {
  const url = PHOTOS[action] || PHOTOS.bicycle;
  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <img src={url} alt="" style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        filter: 'contrast(1.1) saturate(1.2) brightness(0.85)',
      }}/>
      {/* neon green tint overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 35%, rgba(204, 255, 0,0.12), transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(1,5,3,0.7) 100%)',
        pointerEvents: 'none',
      }}/>
      {/* orange sparks floating (stock reference feel) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[[12,18,2.5,3.2],[22,42,1.8,2.4],[78,26,2.2,2.8],[88,56,1.5,3.6],[35,72,2,2.2],[62,84,2.8,3],[8,66,1.6,2.6],[92,38,2,3.4]].map(([x,y,s,d], i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            width: s, height: s, borderRadius: '50%',
            background: '#FFB800',
            boxShadow: '0 0 6px #FFB800, 0 0 12px #FFB800aa',
            animation: `twinkle ${d}s ease-in-out ${i*0.3}s infinite`,
          }}/>
        ))}
      </div>
    </div>
  );
}

// Keep legacy SVG renderer for fallback (unused but safe)
function StadiumPhotoLegacy({ style = {}, action = 'bicycle' }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <svg viewBox="0 0 400 600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0a1428" />
            <stop offset="0.5" stopColor="#1a2d4a" />
            <stop offset="1" stopColor="#0a1828" />
          </linearGradient>
          <radialGradient id="stadium-light" cx="50%" cy="20%">
            <stop offset="0" stopColor="#ffecb0" stopOpacity="0.4" />
            <stop offset="0.5" stopColor="#FFB800" stopOpacity="0.15" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="pitch" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#1a4d2a" />
            <stop offset="1" stopColor="#0a2515" />
          </linearGradient>
          <pattern id="crowd-dots" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#334" />
          </pattern>
        </defs>
        {/* sky */}
        <rect width="400" height="300" fill="url(#sky)"/>
        {/* stadium lights glow */}
        <rect width="400" height="300" fill="url(#stadium-light)"/>
        {/* crowd upper stand */}
        <path d="M0 120 L0 260 L400 260 L400 120 Q300 140 200 138 Q100 140 0 120Z" fill="#15202e"/>
        <rect y="140" width="400" height="100" fill="url(#crowd-dots)" opacity="0.7"/>
        {/* stand railings */}
        <line x1="0" y1="180" x2="400" y2="180" stroke="#0a1018" strokeWidth="2"/>
        <line x1="0" y1="220" x2="400" y2="220" stroke="#0a1018" strokeWidth="2"/>
        {/* stadium light fixtures */}
        {[60, 140, 260, 340].map((x, i) => (
          <g key={i}>
            <rect x={x-1} y="40" width="2" height="40" fill="#222"/>
            <circle cx={x} cy="40" r="4" fill="#fffaea">
              <animate attributeName="opacity" values="0.9;1;0.9" dur={`${2+i*0.3}s`} repeatCount="indefinite"/>
            </circle>
            <circle cx={x} cy="40" r="10" fill="#fff3c0" opacity="0.3"/>
          </g>
        ))}
        {/* pitch */}
        <polygon points="0,260 400,260 460,600 -60,600" fill="url(#pitch)"/>
        {/* pitch stripes */}
        {[280, 310, 350, 400, 460, 540].map((y, i) => (
          <rect key={i} x="-60" y={y} width="520" height="12" fill="#224a2f" opacity="0.4"/>
        ))}
        {/* pitch line perspective */}
        <line x1="0" y1="260" x2="-60" y2="600" stroke="#2a6d3d" strokeWidth="1.5" opacity="0.4"/>
        <line x1="400" y1="260" x2="460" y2="600" stroke="#2a6d3d" strokeWidth="1.5" opacity="0.4"/>
        <line x1="200" y1="260" x2="200" y2="600" stroke="#2a6d3d" strokeWidth="1.5" opacity="0.3"/>

        {/* Player silhouette — bicycle kick */}
        {action === 'bicycle' && (
          <g>
            {/* body */}
            <g transform="translate(200,340) rotate(-15)" fill="#0a1428" stroke="#1a5eff" strokeWidth="1.2">
              {/* torso */}
              <path d="M-10 -30 L-5 20 L15 30 L25 0 L15 -35 Z" fill="#1e3ca8"/>
              {/* jersey stripes */}
              <path d="M-10 -30 L-5 20" stroke="#fff" strokeWidth="1.5" fill="none"/>
              <path d="M-2 -32 L3 22" stroke="#fff" strokeWidth="1.5" fill="none"/>
              {/* head */}
              <circle cx="-15" cy="-40" r="11" fill="#e8b98a" stroke="#5a3d20" strokeWidth="0.8"/>
              {/* arm extended back */}
              <path d="M-10 -20 L-55 -40 L-70 -32 L-55 -28" fill="#e8b98a"/>
              {/* arm forward */}
              <path d="M20 -25 L55 -10 L50 0 L15 -10" fill="#e8b98a"/>
              {/* leg kicking up */}
              <path d="M15 5 L55 -55 L72 -45 L28 18" fill="#fff"/>
              <path d="M58 -55 L82 -60 L75 -48 L65 -44" fill="#000"/>
              {/* leg back */}
              <path d="M-5 10 L-35 40 L-28 48 L5 22" fill="#fff"/>
              <path d="M-38 40 L-52 48 L-45 55 L-32 50" fill="#000"/>
              {/* socks */}
              <rect x="50" y="-62" width="22" height="8" fill="#fff" transform="rotate(-50 60 -58)"/>
            </g>
            {/* ball in motion */}
            <g transform="translate(290,245)">
              <circle r="10" fill="#fff" stroke="#000" strokeWidth="1"/>
              <polygon points="0,-7 6,-2 4,5 -4,5 -6,-2" fill="#000"/>
              {/* motion trail */}
              <circle cx="-20" cy="10" r="3" fill="#fff" opacity="0.4"/>
              <circle cx="-35" cy="18" r="2" fill="#fff" opacity="0.25"/>
              <circle cx="-50" cy="25" r="1.5" fill="#fff" opacity="0.15"/>
            </g>
            {/* sparks around ball impact */}
            <g stroke="#FFB800" strokeWidth="1.2" strokeLinecap="round">
              <line x1="260" y1="230" x2="275" y2="220"/>
              <line x1="310" y1="240" x2="320" y2="235"/>
              <line x1="300" y1="260" x2="315" y2="268"/>
              <line x1="250" y1="260" x2="238" y2="270"/>
            </g>
          </g>
        )}

        {/* team photo */}
        {action === 'team' && (
          <g>
            {[80, 140, 200, 260, 320].map((x, i) => (
              <g key={i} transform={`translate(${x}, 340)`}>
                <circle cx="0" cy="-5" r="12" fill="#e8b98a" stroke="#5a3d20" strokeWidth="0.8"/>
                <path d="M-18 10 L-14 50 L14 50 L18 10 Q0 6 -18 10Z" fill={i%2?"#1e3ca8":"#fff"}/>
                <rect x="-16" y="50" width="12" height="25" fill="#0a1428"/>
                <rect x="4" y="50" width="12" height="25" fill="#0a1428"/>
              </g>
            ))}
          </g>
        )}

        {/* portrait (single player close up) */}
        {action === 'portrait' && (
          <g>
            <ellipse cx="200" cy="440" rx="120" ry="180" fill="#0a1428"/>
            {/* head */}
            <circle cx="200" cy="280" r="60" fill="#e8b98a" stroke="#5a3d20" strokeWidth="1"/>
            {/* hair */}
            <path d="M150 260 Q180 210 240 230 Q260 250 254 290 Q230 260 200 255 Q170 260 150 280 Z" fill="#2a1810"/>
            {/* eyes */}
            <ellipse cx="182" cy="285" rx="3" ry="4" fill="#1a0f08"/>
            <ellipse cx="218" cy="285" rx="3" ry="4" fill="#1a0f08"/>
            {/* shoulders / jersey */}
            <path d="M100 400 Q150 370 200 370 Q250 370 300 400 L320 600 L80 600 Z" fill="#1e3ca8"/>
            <path d="M200 370 L200 600" stroke="#fff" strokeWidth="8" opacity="0.9"/>
          </g>
        )}

        {/* particle overlay */}
        <g opacity="0.7">
          {[[50,80,2],[120,60,1.5],[180,90,1],[250,70,2],[320,100,1.5],[370,60,1]].map(([x,y,r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5+i*0.3}s`} repeatCount="indefinite"/>
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
}

// Small avatar — real Unsplash portrait (seeded by bg color for stability)
function AvatarPhoto({ size = 48, bg = '#1e3ca8', style = {}, seed }) {
  // hash bg into a stable index
  const idx = useMemo(() => {
    const s = seed || bg;
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h % AVATAR_PHOTOS.length;
  }, [bg, seed]);
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      background: bg,
      position: 'relative',
      ...style,
    }}>
      <img src={AVATAR_PHOTOS[idx]} alt="" style={{
        width: '100%', height: '100%', objectFit: 'cover',
        filter: 'saturate(1.15) contrast(1.05)',
      }}/>
    </div>
  );
}

// Team photo — real Unsplash image (varies by palette seed)
const TEAM_PHOTOS = [
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80&auto=format&fit=crop',
];
function TeamPhoto({ style = {}, palette = ['#0a1428', '#1e3ca8', '#CCFF00'] }) {
  const idx = useMemo(() => {
    const s = palette.join('');
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h % TEAM_PHOTOS.length;
  }, [palette]);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <img src={TEAM_PHOTOS[idx]} alt="" style={{
        width: '100%', height: '100%', objectFit: 'cover',
        filter: 'saturate(1.2) contrast(1.1) brightness(0.9)',
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(204, 255, 0,0.08), transparent 60%, rgba(1,5,3,0.85))`,
      }}/>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// STARFIELD — floating sparks on dark background
// ═════════════════════════════════════════════════════════════
function Starfield({ count = 40 }) {
  const stars = useMemo(() => Array.from({ length: count }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.4,
    delay: Math.random() * 3,
    dur: 1.8 + Math.random() * 2.5,
    color: Math.random() > 0.7 ? 'var(--accent-primary)' : '#fff',
  })), [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: s.color,
          boxShadow: `0 0 4px ${s.color}`,
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// NEON FRAME CARD (the cut-corner chamfered card from the My Progress ref)
// ═════════════════════════════════════════════════════════════
function NeonFrameCard({ children, style = {}, glow = 'var(--accent-primary)', padding = 20, chamfer = 22 }) {
  // Chamfered neon card built from two stacked clip-path layers:
  //  - outer layer: accent-color fill (visible only as a 1.8px rim via inset)
  //  - inner layer: dark bg inset by the stroke width
  const clip = `polygon(${chamfer}px 0, calc(100% - ${chamfer}px) 0, 100% ${chamfer}px, 100% calc(100% - ${chamfer}px), calc(100% - ${chamfer}px) 100%, ${chamfer}px 100%, 0 calc(100% - ${chamfer}px), 0 ${chamfer}px)`;
  return (
    <div style={{ position: 'relative', ...style }}>
      {/* outer neon rim — solid glow color, clipped to chamfer */}
      <div style={{
        position: 'absolute', inset: 0,
        background: glow,
        clipPath: clip,
        WebkitClipPath: clip,
        filter: `drop-shadow(0 0 calc(6px * var(--glow-strength)) ${glow}) drop-shadow(0 0 calc(14px * var(--glow-strength)) ${glow})`,
      }} />
      {/* inner dark fill — inset by 1.8px to reveal the rim */}
      <div style={{
        position: 'absolute', top: 1.8, left: 1.8, right: 1.8, bottom: 1.8,
        background: 'rgba(3, 10, 7, 0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        clipPath: clip,
        WebkitClipPath: clip,
      }} />
      {/* dashed accent-secondary inner highlight */}
      <div style={{
        position: 'absolute', top: 4, left: 4, right: 4, bottom: 4,
        border: `0.8px dashed var(--accent-secondary)`,
        opacity: 0.45,
        clipPath: clip,
        WebkitClipPath: clip,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', padding }}>{children}</div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// SIMPLE GLASS CARD (rounded, for non-chamfered cards)
// ═════════════════════════════════════════════════════════════
function GlassCard({ children, glow = 'var(--accent-primary)', style = {}, padding = 16 }) {
  return (
    <div style={{
      background: 'rgba(3, 10, 7, 0.55)',
      backdropFilter: 'blur(18px) saturate(180%)',
      WebkitBackdropFilter: 'blur(18px) saturate(180%)',
      border: `1.5px solid ${glow}66`,
      borderRadius: 18,
      padding,
      boxShadow: `0 0 calc(14px * var(--glow-strength)) ${glow}55, 0 0 calc(30px * var(--glow-strength)) ${glow}22, 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`,
      position: 'relative',
      ...style,
    }}>{children}</div>
  );
}

// ═════════════════════════════════════════════════════════════
// TAB BAR — icons only, matching reference
// ═════════════════════════════════════════════════════════════
function TabBar({ active, onNavigate }) {
  const tabs = [
    { id: 'home', icon: Icon.home, label: 'Feed' },
    { id: 'community', icon: Icon.community, label: 'Comunidad' },
    { id: 'league', icon: Icon.trophy, label: 'Liga' },
    { id: 'chat', icon: Icon.chat, label: 'Chat' },
    { id: 'profile', icon: Icon.profile, label: 'Perfil' },
  ];
  return (
    <div style={{
      position: 'absolute',
      bottom: 10, left: 10, right: 10,
      height: 62,
      borderRadius: 22,
      background: 'rgba(3, 8, 5, 0.85)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(204, 255, 0, 0.25)',
      boxShadow: '0 -2px 20px rgba(0,0,0,0.3), 0 0 calc(20px * var(--glow-strength)) rgba(204, 255, 0, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 50,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        const color = isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.4)';
        return (
          <button key={t.id} onClick={() => onNavigate(t.id)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '6px 10px', borderRadius: 14,
            position: 'relative',
          }}>
            <div style={{
              color,
              filter: isActive ? `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color})` : 'none',
              transition: 'all 0.2s',
            }}>
              <t.icon color={color} />
            </div>
            <div style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color,
              fontFamily: 'Space Grotesk, sans-serif',
              textShadow: isActive ? `0 0 6px ${color}` : 'none',
            }}>{t.label}</div>
          </button>
        );
      })}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// NEON BUTTON — outlined (SEGUIR style) or filled
// ═════════════════════════════════════════════════════════════
function NeonButton({ children, color = 'var(--accent-primary)', onClick, style = {}, disabled = false, variant = 'solid', size = 'md' }) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const h = size === 'sm' ? 36 : size === 'lg' ? 58 : 50;
  const fs = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  if (variant === 'outline') {
    return (
      <button onClick={onClick} disabled={disabled}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          height: h,
          padding: '0 22px',
          borderRadius: h / 2,
          background: hover ? `${color}14` : 'transparent',
          border: `1.8px solid ${color}`,
          color,
          fontFamily: 'Archivo, sans-serif',
          fontWeight: 900, fontStyle: 'italic',
          fontSize: fs, letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
          boxShadow: `0 0 calc(${hover?20:10}px * var(--glow-strength)) ${color}aa, 0 0 calc(${hover?32:18}px * var(--glow-strength)) ${color}55, inset 0 0 10px ${color}22`,
          textShadow: `0 0 8px ${color}`,
          transition: 'all 0.2s',
          ...style,
        }}>{children}</button>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}
      style={{
        height: h,
        width: '100%',
        borderRadius: 16,
        background: `linear-gradient(180deg, ${color}, ${color}cc)`,
        border: 'none',
        color: '#041008',
        fontFamily: 'Archivo, sans-serif',
        fontWeight: 900, fontStyle: 'italic',
        fontSize: fs, letterSpacing: '0.14em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        boxShadow: press
          ? `0 0 16px ${color}88, inset 0 2px 8px rgba(0,0,0,0.2)`
          : `0 0 calc(20px * var(--glow-strength)) ${color}aa, 0 0 calc(40px * var(--glow-strength)) ${color}55, 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)`,
        transform: press ? 'translateY(1px)' : hover ? 'translateY(-1px)' : 'none',
        transition: 'all 0.15s',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.28), transparent)',
        pointerEvents: 'none',
      }} />
      {children}
    </button>
  );
}

// ═════════════════════════════════════════════════════════════
// NEON INPUT
// ═════════════════════════════════════════════════════════════
function NeonInput({ icon, placeholder, type = 'text', value, onChange, error, accent = 'var(--accent-primary)' }) {
  const [focus, setFocus] = useState(false);
  const color = error ? '#FF5B3A' : accent;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        height: 52,
        borderRadius: 14,
        background: 'rgba(3, 10, 7, 0.5)',
        border: `1.5px solid ${focus || error ? color : 'rgba(204, 255, 0,0.2)'}`,
        padding: '0 16px',
        gap: 12,
        transition: 'all 0.2s',
        boxShadow: focus ? `0 0 calc(16px * var(--glow-strength)) ${color}88, inset 0 0 0 1px ${color}44` : `0 0 calc(6px * var(--glow-strength)) ${color}33`,
      }}>
        {icon && <div style={{ color: focus || error ? color : 'rgba(204, 255, 0,0.6)', flexShrink: 0, filter: `drop-shadow(0 0 4px ${color}88)` }}>{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={e => onChange && onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 15, fontWeight: 500,
          }}
        />
      </div>
      {error && (
        <div style={{
          marginTop: 6, paddingLeft: 4, fontSize: 11, color: '#FF5B3A',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
        }}>⚠ {error}</div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// TOAST
// ═════════════════════════════════════════════════════════════
function Toast({ msg, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 2400);
    return () => clearTimeout(t);
  }, [msg]);
  if (!msg) return null;
  return (
    <div style={{
      position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(204, 255, 0, 0.14)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--accent-primary)',
      borderRadius: 12, padding: '10px 18px',
      color: 'var(--accent-primary)',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
      boxShadow: '0 0 20px rgba(204, 255, 0,0.4)',
      textShadow: '0 0 6px var(--accent-primary)',
      zIndex: 100, textAlign: 'center',
      animation: 'screen-in 0.3s ease',
    }}>{msg}</div>
  );
}

// ═════════════════════════════════════════════════════════════
// NEON TITLE (large italic glow — for hero headers)
// ═════════════════════════════════════════════════════════════
function NeonTitle({ children, size = 34, color = 'var(--accent-primary)', style = {} }) {
  return (
    <div style={{
      fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontStyle: 'italic',
      fontSize: size, lineHeight: 0.95,
      letterSpacing: '-0.01em',
      color,
      textShadow: `0 0 calc(10px * var(--glow-strength)) ${color}, 0 0 calc(22px * var(--glow-strength)) ${color}, 0 0 calc(40px * var(--glow-strength)) ${color}88`,
      ...style,
    }}>{children}</div>
  );
}

// ═════════════════════════════════════════════════════════════
// FLOATING ORBS — colored blurred blobs drifting across the bg
// ═════════════════════════════════════════════════════════════
function FloatingOrbs({ orbs }) {
  const list = orbs || [
    { x: 10, y: 20, size: 180, color: '#CCFF00', opacity: 0.35, dur: 14 },
    { x: 75, y: 15, size: 140, color: '#FFB800', opacity: 0.25, dur: 18 },
    { x: 60, y: 70, size: 220, color: '#CCFF00', opacity: 0.20, dur: 22 },
    { x: 15, y: 80, size: 160, color: '#b24bff', opacity: 0.18, dur: 16 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {list.map((o, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${o.x}%`, top: `${o.y}%`,
          width: o.size, height: o.size,
          borderRadius: '50%',
          background: o.color,
          opacity: o.opacity,
          filter: 'blur(60px)',
          animation: `float-drift ${o.dur}s ease-in-out ${i * 1.2}s infinite`,
          transform: 'translate(-50%, -50%)',
        }}/>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// FLOATING BALLS + ICONS — animated bubble-up from bottom
// ═════════════════════════════════════════════════════════════
function FloatingEmojis({ emojis, count = 12, duration = 10 }) {
  const items = useMemo(() => {
    const pool = emojis || ['⚽', '🔥', '⭐', '🏆', '⚡', '💪', '🥅'];
    return Array.from({ length: count }, (_, i) => ({
      emoji: pool[i % pool.length],
      x: Math.random() * 100,
      size: 14 + Math.random() * 18,
      delay: (i / count) * duration + Math.random() * 3,
      dur: duration + Math.random() * 6,
      drift: (Math.random() - 0.5) * 60,
    }));
  }, [count, duration]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {items.map((it, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${it.x}%`, bottom: 0,
          fontSize: it.size,
          opacity: 0,
          animation: `float-up ${it.dur}s linear ${it.delay}s infinite`,
          '--drift': `${it.drift}px`,
          filter: 'drop-shadow(0 0 8px rgba(204, 255, 0,0.6))',
        }}>{it.emoji}</div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PULSE RINGS — expanding concentric rings from a point
// ═════════════════════════════════════════════════════════════
function PulseRings({ size = 60, color = '#CCFF00', count = 3 }) {
  return (
    <div style={{
      position: 'relative', width: size, height: size, pointerEvents: 'none',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          animation: `pulse-ring 2.2s ease-out ${i * 0.7}s infinite`,
        }}/>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// LIVE TICKER — vertical scrolling feed items (stats/notifications)
// ═════════════════════════════════════════════════════════════
function LiveTicker({ items, height = 28 }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ height, overflow: 'hidden', position: 'relative' }}>
      <div style={{
        animation: `scroll-y ${items.length * 3}s linear infinite`,
      }}>
        {doubled.map((it, i) => (
          <div key={i} style={{
            height, display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 12,
            color: 'rgba(255,255,255,0.8)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#CCFF00', boxShadow: '0 0 6px #CCFF00' }}/>
            {it}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// FLOATING CHIP — animated stat chip with icon
// ═════════════════════════════════════════════════════════════
function FloatingChip({ icon, label, value, color = '#CCFF00', style = {} }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', borderRadius: 999,
      background: 'rgba(10,20,30,0.7)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: `1px solid ${color}55`,
      boxShadow: `0 4px 16px rgba(0,0,0,0.3), 0 0 12px ${color}33`,
      animation: 'float-slow 4s ease-in-out infinite',
      ...style,
    }}>
      {icon && <div style={{ color }}>{icon}</div>}
      {value && <div style={{
        fontFamily: 'Archivo, sans-serif', fontWeight: 800,
        fontSize: 14, color, lineHeight: 1,
      }}>{value}</div>}
      {label && <div style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
        fontSize: 11, color: 'rgba(255,255,255,0.85)',
      }}>{label}</div>}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// EPIC STADIUM BACKGROUND POOL — rotating crossfade
// ═════════════════════════════════════════════════════════════
const EPIC_STADIUM_PHOTOS = [
  // Proven URLs (already used in this project)
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=90&auto=format&fit=crop',     // Stadium wide w/ crowd
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=90&auto=format&fit=crop',     // Floodlit stadium bowl
  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200&q=90&auto=format&fit=crop',     // Stadium floodlights
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=90&auto=format&fit=crop',     // Pitch from stand
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=90&auto=format&fit=crop',       // Action chilena
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=90&auto=format&fit=crop',     // Team action
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=90&auto=format&fit=crop',     // Pyro crowd
  'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=1200&q=90&auto=format&fit=crop',     // Aerial stadium
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=90&auto=format&fit=crop',     // Night match crowd
  'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=1200&q=90&auto=format&fit=crop',       // Stadium tunnel lights
];

// Auto-rotating stadium background — crossfades every N seconds
function EpicStadiumBackground({ interval = 6000, photos, initial = 0, showDots = false }) {
  const pool = photos || EPIC_STADIUM_PHOTOS;
  const [current, setCurrent] = useState(initial % pool.length);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    const t = setInterval(() => {
      setPrev(current);
      setCurrent(c => (c + 1) % pool.length);
    }, interval);
    return () => clearInterval(t);
  }, [current, interval, pool.length]);

  function goTo(i) {
    if (i === current) return;
    setPrev(current);
    setCurrent(i);
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Prev layer fading out */}
      {prev != null && prev !== current && (
        <img
          key={`p-${prev}`}
          src={pool[prev]}
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transform: 'scale(1.1)',
            animation: 'bg-fade-out 1.5s ease-out forwards',
          }}
        />
      )}
      {/* Current layer fading in with Ken Burns */}
      <img
        key={`c-${current}`}
        src={pool[current]}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          transform: 'scale(1.08)',
          animation: 'bg-fade-in 1.5s ease-out forwards, ken-burns 12s ease-in-out infinite alternate',
          filter: 'contrast(1.08) saturate(1.15)',
        }}
      />
      {/* Thin progress bar at top */}
      {showDots && (
        <div style={{
          position: 'absolute', top: 10, left: 16, right: 16,
          display: 'flex', gap: 4, zIndex: 6,
        }}>
          {pool.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                flex: 1, height: 2.5, borderRadius: 2,
                background: i === current ? '#fff' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: 'pointer',
                padding: 0,
                transition: 'background 0.4s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  Icon, RadialRays, NeonBall, Sparks, StadiumPhoto, AvatarPhoto, TeamPhoto,
  Starfield, NeonFrameCard, GlassCard, TabBar, NeonButton, NeonInput, Toast, NeonTitle,
  FloatingOrbs, FloatingEmojis, PulseRings, LiveTicker, FloatingChip,
  EpicStadiumBackground, EPIC_STADIUM_PHOTOS,
});
