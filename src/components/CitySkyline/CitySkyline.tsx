import styles from './CitySkyline.module.css';

const WIDTH = 1600;
const HEIGHT = 420;

const CYAN = '#59EEF4';
const CORAL = '#FC7265';
const ORANGE = '#FCA765';
const PINK = '#ff2a6d';
const PURPLE = '#b347d9';

type Building = { x: number; w: number; top: number };

type Layer = {
  path: string;
  cyanWindows: string;
  orangeWindows: string;
  neonCyan: string;
  neonPink: string;
  beacons: { x: number; y: number }[];
  buildings: Building[];
};

type LayerOptions = {
  seed: number;
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
  litChance: number;
  neonChance: number;
};

type Ad =
  | { kind: 'board'; x: number; y: number; w: number; h: number; color: string; text: string[] }
  | { kind: 'vertical'; x: number; y: number; color: string; text: string };

// Seeded PRNG so the server and client render the same skyline.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildLayer({ seed, minW, maxW, minH, maxH, litChance, neonChance }: LayerOptions): Layer {
  const rand = mulberry32(seed);
  const between = (a: number, b: number) => a + rand() * (b - a);

  let path = '';
  let cyanWindows = '';
  let orangeWindows = '';
  let neonCyan = '';
  let neonPink = '';
  const beacons: Layer['beacons'] = [];
  const buildings: Building[] = [];

  let x = -20;
  while (x < WIDTH + 20) {
    const w = Math.round(between(minW, maxW));
    const h = Math.round(between(minH, maxH));
    const top = HEIGHT - h;
    const cx = x + Math.round(w / 2);

    buildings.push({ x, w, top });
    path += `M${x} ${HEIGHT}V${top}H${x + w}V${HEIGHT}Z`;

    let peakX = cx;
    let peakY = top;
    const roll = rand();
    if (roll < 0.25 && w > 40) {
      // Stepped setbacks.
      const sw = Math.round(w * between(0.5, 0.7));
      const sh = Math.round(between(12, 30));
      const sx = x + Math.round((w - sw) / 2);
      path += `M${sx} ${top}V${top - sh}H${sx + sw}V${top}Z`;
      peakY = top - sh;
      if (rand() < 0.5) {
        const tw = Math.round(sw * 0.5);
        const th = Math.round(between(8, 20));
        const tx = cx - Math.round(tw / 2);
        path += `M${tx} ${peakY}V${peakY - th}H${tx + tw}V${peakY}Z`;
        peakY -= th;
      }
    } else if (roll < 0.35) {
      // Slanted roof.
      const rise = Math.round(between(10, 30));
      path += `M${x} ${top}L${x + w} ${top - rise}V${top}Z`;
      peakX = x + w - 2;
      peakY = top - rise;
    } else if (roll < 0.45 && w > 30) {
      // Crown with a spire.
      const cw = Math.round(w * 0.4);
      const ch = Math.round(between(6, 14));
      const sh = Math.round(between(25, 55));
      path += `M${cx - cw / 2} ${top}V${top - ch}H${cx + cw / 2}V${top}Z`;
      path += `M${cx - 3} ${top - ch}L${cx} ${top - ch - sh}L${cx + 3} ${top - ch}Z`;
      peakY = top - ch - sh;
    } else if (roll < 0.65) {
      // Rooftop clutter: water tower and AC units.
      const tx = x + Math.round(between(4, Math.max(5, w - 16)));
      path += `M${tx} ${top}V${top - 5}H${tx + 1}V${top}Z`;
      path += `M${tx + 9} ${top}V${top - 5}H${tx + 10}V${top}Z`;
      path += `M${tx - 1} ${top - 5}V${top - 15}L${tx + 5} ${top - 18}L${tx + 11} ${top - 15}V${top - 5}Z`;
      for (let i = 0; i < 2; i++) {
        const ax = x + Math.round(between(2, Math.max(3, w - 10)));
        path += `M${ax} ${top}V${top - 4}H${ax + 7}V${top}Z`;
      }
    }

    // Antenna with a blinking beacon.
    if (rand() < 0.3) {
      const ah = Math.round(between(15, 45));
      path += `M${peakX - 1} ${peakY}V${peakY - ah}H${peakX + 1}V${peakY}Z`;
      beacons.push({ x: peakX, y: peakY - ah });
    }

    // Windows: either a grid of lights or long horizontal office bands.
    if (rand() < 0.25 && w > 30) {
      for (let wy = top + 8; wy < HEIGHT - 6; wy += 11) {
        if (rand() > litChance * 4) continue;
        const band = `M${x + 4} ${wy}h${w - 8}v2h-${w - 8}Z`;
        if (rand() < 0.6) cyanWindows += band;
        else orangeWindows += band;
      }
    } else {
      for (let wy = top + 8; wy < HEIGHT - 6; wy += 9) {
        for (let wx = x + 5; wx < x + w - 7; wx += 7) {
          if (rand() > litChance) continue;
          const rect = `M${wx} ${wy}h3v4h-3Z`;
          if (rand() < 0.6) cyanWindows += rect;
          else orangeWindows += rect;
        }
      }
    }

    // Neon strip running down one edge.
    if (rand() < neonChance) {
      const ex = rand() < 0.5 ? x + 1 : x + w - 2.5;
      const y0 = top + Math.round(between(4, 20));
      const len = Math.round(between(40, Math.max(41, h * 0.7)));
      const strip = `M${ex} ${y0}h1.5v${len}h-1.5Z`;
      if (rand() < 0.5) neonCyan += strip;
      else neonPink += strip;
    }

    x += w + Math.round(between(-4, 6));
  }

  return { path, cyanWindows, orangeWindows, neonCyan, neonPink, beacons, buildings };
}

const BOARD_TEXT = [
  ['RENDER', 'レンダー'],
  ['SHADERS'],
  ['OPEN', '24H'],
  ['NEXUS', 'ネクサス'],
  ['SEN CORP'],
  ['ラーメン'],
  ['NEON', 'ネオン'],
];
const VERTICAL_TEXT = ['ホテル', 'サイバー', 'バー', 'ラーメン', 'ネオン'];
const AD_COLORS = [CYAN, PINK, ORANGE, PURPLE, CORAL];

// Hangs billboards and vertical signs on the faces of some buildings.
function placeAds(buildings: Building[], seed: number, boardChance: number, signChance: number): Ad[] {
  const rand = mulberry32(seed);
  const ads: Ad[] = [];
  let board = 0;
  let sign = 0;

  for (const b of buildings) {
    const h = HEIGHT - b.top;
    const color = AD_COLORS[Math.floor(rand() * AD_COLORS.length)];
    if (b.w >= 50 && h >= 110 && rand() < boardChance) {
      const w = b.w - 14;
      ads.push({
        kind: 'board',
        x: b.x + 7,
        y: b.top + 14 + Math.round(rand() * 20),
        w,
        h: Math.min(34, Math.round(w * 0.45)),
        color,
        text: BOARD_TEXT[board++ % BOARD_TEXT.length],
      });
    } else if (h >= 150 && rand() < signChance) {
      ads.push({
        kind: 'vertical',
        x: rand() < 0.5 ? b.x - 6 : b.x + b.w - 6,
        y: b.top + 20 + Math.round(rand() * 30),
        color,
        text: VERTICAL_TEXT[sign++ % VERTICAL_TEXT.length],
      });
    }
  }

  return ads;
}

// Rough text width in ems: full-width katakana vs. latin characters.
function textEms(text: string) {
  let ems = 0;
  for (const ch of text) ems += ch.charCodeAt(0) > 0x3000 ? 1 : 0.62;
  return ems;
}

const far = buildLayer({ seed: 1337, minW: 30, maxW: 70, minH: 170, maxH: 340, litChance: 0.05, neonChance: 0 });
const mid = buildLayer({ seed: 4242, minW: 35, maxW: 90, minH: 110, maxH: 280, litChance: 0.07, neonChance: 0.15 });
const near = buildLayer({ seed: 2077, minW: 45, maxW: 110, minH: 60, maxH: 220, litChance: 0.08, neonChance: 0.25 });

const midAds = placeAds(mid.buildings, 99, 0.25, 0.2);
const nearAds = placeAds(near.buildings, 7, 0.3, 0.25);

// Flying cars: `far` lanes pass behind the mid-rise layer, `near` lanes in front of it.
const CARS = [
  { lane: 'far', y: 165, scale: 0.5, duration: 46, delay: -5, dir: 1 },
  { lane: 'far', y: 195, scale: 0.55, duration: 52, delay: -30, dir: -1 },
  { lane: 'far', y: 140, scale: 0.45, duration: 60, delay: -44, dir: 1 },
  { lane: 'near', y: 250, scale: 0.85, duration: 28, delay: -12, dir: -1 },
  { lane: 'near', y: 285, scale: 1, duration: 24, delay: -3, dir: 1 },
  { lane: 'near', y: 225, scale: 0.75, duration: 34, delay: -20, dir: 1 },
] as const;

function Cars({ lane }: { lane: 'far' | 'near' }) {
  return (
    <g>
      {CARS.filter((car) => car.lane === lane).map((car, i) => (
        <g key={i} transform={`translate(0 ${car.y})`}>
          <g
            className={styles.car}
            style={{
              animationDuration: `${car.duration}s`,
              animationDelay: `${car.delay}s`,
              animationDirection: car.dir < 0 ? 'reverse' : 'normal',
            }}
          >
            <g transform={`scale(${car.dir * car.scale} ${car.scale})`}>
              <rect x="-40" y="-0.6" width="30" height="1.2" fill="url(#car-trail)" />
              <path d="M8 0L34 -4V4Z" fill="url(#car-beam)" />
              <path d="M-10 1V-1L-6 -4H4L9 -1V1L6 3H-7Z" fill="#0b0c12" stroke={CYAN} strokeOpacity="0.5" strokeWidth="0.6" />
              <circle cx="8.5" cy="0" r="1.2" fill="#fff" />
              <circle cx="-10" cy="0" r="1.1" fill={PINK} />
              <rect x="-5" y="3" width="10" height="1" fill={CYAN} opacity="0.7" />
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}

function Ads({ ads }: { ads: Ad[] }) {
  return (
    <g filter="url(#neon-glow)">
      {ads.map((ad, i) => {
        const timing = {
          animationDelay: `${(i * 1.7) % 7}s`,
          animationDuration: `${6 + (i % 4) * 1.5}s`,
        };

        if (ad.kind === 'vertical') {
          const chars = [...ad.text];
          const size = 9;
          return (
            <g key={i} className={styles.ad} style={timing}>
              <rect x={ad.x} y={ad.y} width="12" height={chars.length * (size + 2) + 6} fill={ad.color} fillOpacity="0.12" stroke={ad.color} strokeWidth="0.8" />
              {chars.map((ch, j) => (
                <text key={j} x={ad.x + 6} y={ad.y + 3 + (j + 0.5) * (size + 2)} fontSize={size} className={styles.adText} fill={ad.color}>
                  {ch}
                </text>
              ))}
            </g>
          );
        }

        const cx = ad.x + ad.w / 2;
        const cy = ad.y + ad.h / 2;
        const sizeFor = (text: string) => Math.min(ad.h * 0.55, (ad.w - 8) / textEms(text));
        return (
          <g key={i} className={styles.ad} style={timing}>
            <rect x={ad.x} y={ad.y} width={ad.w} height={ad.h} rx="1" fill={ad.color} fillOpacity="0.12" stroke={ad.color} strokeWidth="1" />
            {ad.text.map((text, j) => (
              <text
                key={j}
                x={cx}
                y={cy}
                fontSize={sizeFor(text)}
                className={ad.text.length > 1 ? `${styles.adText} ${j === 0 ? styles.swapA : styles.swapB}` : styles.adText}
                fill={ad.color}
                style={{ animationDuration: timing.animationDuration }}
              >
                {text}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
}

function Lights({ layer, cyan, orange }: { layer: Layer; cyan: number; orange: number }) {
  return (
    <>
      {layer.beacons.map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r="1.8"
          className={styles.beacon}
          style={{ animationDelay: `${(b.x * 0.013) % 3}s` }}
        />
      ))}
      <path d={layer.cyanWindows} fill={CYAN} opacity={cyan} />
      <path d={layer.orangeWindows} fill={ORANGE} opacity={orange} />
      <g filter="url(#neon-glow)" opacity="0.8">
        <path d={layer.neonCyan} fill={CYAN} />
        <path d={layer.neonPink} fill={PINK} />
      </g>
    </>
  );
}

export default function CitySkyline() {
  return (
    <div className={styles.skyline} aria-hidden="true">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMax slice"
        className={styles.svg}
      >
        <defs>
          <linearGradient id="skyline-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CORAL} stopOpacity="0" />
            <stop offset="70%" stopColor={CORAL} stopOpacity="0.12" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="skyline-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1320" />
            <stop offset="100%" stopColor="#120a12" />
          </linearGradient>
          <linearGradient id="skyline-street" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PINK} stopOpacity="0" />
            <stop offset="100%" stopColor={PINK} stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="car-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="car-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#skyline-haze)" />

        <g className={styles.far}>
          <path d={far.path} fill="url(#skyline-far)" />
          <Lights layer={far} cyan={0.35} orange={0.3} />
        </g>

        <Cars lane="far" />

        <g>
          <path d={mid.path} fill="#0d0a12" />
          <Lights layer={mid} cyan={0.45} orange={0.4} />
          <Ads ads={midAds} />
        </g>

        <Cars lane="near" />

        <g>
          <path d={near.path} fill="#05060a" />
          <Lights layer={near} cyan={0.55} orange={0.45} />
          <Ads ads={nearAds} />
        </g>

        <rect x="0" y={HEIGHT - 50} width={WIDTH} height="50" fill="url(#skyline-street)" />
      </svg>
    </div>
  );
}
