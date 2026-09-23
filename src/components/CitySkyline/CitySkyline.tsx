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

type Sign = { x: number; y: number; color: string; text: string };

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

const VERTICAL_TEXT = ['ホテル', 'サイバー', 'バー', 'ラーメン', 'ネオン'];
const AD_COLORS = [CYAN, PINK, ORANGE, PURPLE, CORAL];

// Hangs vertical neon signs off the sides of some buildings.
function placeSigns(buildings: Building[], seed: number, skipChance: number, signChance: number): Sign[] {
  const rand = mulberry32(seed);
  const signs: Sign[] = [];
  let sign = 0;

  for (const b of buildings) {
    const h = HEIGHT - b.top;
    const color = AD_COLORS[Math.floor(rand() * AD_COLORS.length)];
    // Wide buildings used to carry billboards; keep their random draws so the signs stay where they were.
    if (b.w >= 50 && h >= 110 && rand() < skipChance) {
      rand();
      continue;
    }
    if (h >= 150 && rand() < signChance) {
      signs.push({
        x: rand() < 0.5 ? b.x - 6 : b.x + b.w - 6,
        y: b.top + 20 + Math.round(rand() * 30),
        color,
        text: VERTICAL_TEXT[sign++ % VERTICAL_TEXT.length],
      });
    }
  }

  return signs;
}

const far = buildLayer({ seed: 1337, minW: 30, maxW: 70, minH: 170, maxH: 340, litChance: 0.05, neonChance: 0 });
const mid = buildLayer({ seed: 4242, minW: 35, maxW: 90, minH: 110, maxH: 280, litChance: 0.07, neonChance: 0.15 });
const near = buildLayer({ seed: 2077, minW: 45, maxW: 110, minH: 60, maxH: 220, litChance: 0.08, neonChance: 0.25 });

const midSigns = placeSigns(mid.buildings, 99, 0.25, 0.2);
const nearSigns = placeSigns(near.buildings, 7, 0.3, 0.25);

function Signs({ signs }: { signs: Sign[] }) {
  const size = 9;
  return (
    <g filter="url(#neon-glow)">
      {signs.map((sign, i) => {
        const chars = [...sign.text];
        return (
          <g
            key={i}
            className={styles.sign}
            style={{
              animationDelay: `${(i * 1.7) % 7}s`,
              animationDuration: `${6 + (i % 4) * 1.5}s`,
            }}
          >
            <rect x={sign.x} y={sign.y} width="12" height={chars.length * (size + 2) + 6} fill={sign.color} fillOpacity="0.12" stroke={sign.color} strokeWidth="0.8" />
            {chars.map((ch, j) => (
              <text key={j} x={sign.x + 6} y={sign.y + 3 + (j + 0.5) * (size + 2)} fontSize={size} className={styles.signText} fill={sign.color}>
                {ch}
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

        <g>
          <path d={mid.path} fill="#0d0a12" />
          <Lights layer={mid} cyan={0.45} orange={0.4} />
          <Signs signs={midSigns} />
        </g>

        <g>
          <path d={near.path} fill="#05060a" />
          <Lights layer={near} cyan={0.55} orange={0.45} />
          <Signs signs={nearSigns} />
        </g>

        <rect x="0" y={HEIGHT - 50} width={WIDTH} height="50" fill="url(#skyline-street)" />
      </svg>
    </div>
  );
}
