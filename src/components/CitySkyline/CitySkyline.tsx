import styles from './CitySkyline.module.css';

const WIDTH = 1600;
const HEIGHT = 420;

type Layer = {
  path: string;
  cyanWindows: string;
  orangeWindows: string;
  beacons: { x: number; y: number }[];
};

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

function buildLayer(
  seed: number,
  minW: number,
  maxW: number,
  minH: number,
  maxH: number,
  litChance: number,
): Layer {
  const rand = mulberry32(seed);
  const between = (a: number, b: number) => a + rand() * (b - a);

  let path = '';
  let cyanWindows = '';
  let orangeWindows = '';
  const beacons: Layer['beacons'] = [];

  let x = -20;
  while (x < WIDTH + 20) {
    const w = Math.round(between(minW, maxW));
    const h = Math.round(between(minH, maxH));
    const top = HEIGHT - h;

    path += `M${x} ${HEIGHT}V${top}H${x + w}V${HEIGHT}Z`;

    // Setback block on top of some towers.
    const roll = rand();
    let peakX = x + w / 2;
    let peakY = top;
    if (roll < 0.35 && w > 40) {
      const sw = Math.round(w * between(0.4, 0.65));
      const sh = Math.round(between(12, 36));
      const sx = x + Math.round((w - sw) / 2);
      path += `M${sx} ${top}V${top - sh}H${sx + sw}V${top}Z`;
      peakY = top - sh;
    } else if (roll < 0.5) {
      // Slanted roof.
      const rise = Math.round(between(10, 30));
      path += `M${x} ${top}L${x + w} ${top - rise}V${top}Z`;
      peakX = x + w - 2;
      peakY = top - rise;
    }

    // Antenna with a blinking beacon.
    if (rand() < 0.3) {
      const ah = Math.round(between(15, 45));
      path += `M${peakX - 1} ${peakY}V${peakY - ah}H${peakX + 1}V${peakY}Z`;
      beacons.push({ x: peakX, y: peakY - ah });
    }

    // Window grid.
    for (let wy = top + 8; wy < HEIGHT - 6; wy += 9) {
      for (let wx = x + 5; wx < x + w - 7; wx += 7) {
        if (rand() > litChance) continue;
        const rect = `M${wx} ${wy}h3v4h-3Z`;
        if (rand() < 0.6) cyanWindows += rect;
        else orangeWindows += rect;
      }
    }

    x += w + Math.round(between(-4, 6));
  }

  return { path, cyanWindows, orangeWindows, beacons };
}

// Searchlights sweeping up from behind the skyline.
const BEAMS = [
  { left: '12%', color: '#59EEF4', duration: 14, delay: 0 },
  { left: '38%', color: '#FC7265', duration: 18, delay: -6 },
  { left: '67%', color: '#59EEF4', duration: 16, delay: -11 },
  { left: '88%', color: '#FCA765', duration: 20, delay: -3 },
];

const far = buildLayer(1337, 30, 70, 140, 330, 0.05);
const near = buildLayer(2077, 45, 110, 60, 230, 0.08);

export default function CitySkyline() {
  return (
    <>
      <div className={styles.beams} aria-hidden="true">
        {BEAMS.map((beam, i) => (
          <div
            key={i}
            className={styles.beam}
            style={{
              left: beam.left,
              '--beam-color': beam.color,
              animationDuration: `${beam.duration}s`,
              animationDelay: `${beam.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <div className={styles.skyline} aria-hidden="true">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMax slice"
          className={styles.svg}
        >
          <defs>
            <linearGradient id="skyline-haze" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FC7265" stopOpacity="0" />
              <stop offset="70%" stopColor="#FC7265" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#59EEF4" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="skyline-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a1320" />
              <stop offset="100%" stopColor="#120a12" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#skyline-haze)" />

          <g className={styles.far}>
            <path d={far.path} fill="url(#skyline-far)" />
            <path d={far.cyanWindows} fill="#59EEF4" opacity="0.35" />
            <path d={far.orangeWindows} fill="#FCA765" opacity="0.3" />
          </g>

          <g className={styles.near}>
            <path d={near.path} fill="#05060a" />
            <path d={near.cyanWindows} fill="#59EEF4" opacity="0.55" />
            <path d={near.orangeWindows} fill="#FCA765" opacity="0.45" />
            {near.beacons.concat(far.beacons).map((b, i) => (
              <circle
                key={i}
                cx={b.x}
                cy={b.y}
                r="1.8"
                className={styles.beacon}
                style={{ animationDelay: `${(i * 0.7) % 3}s` }}
              />
            ))}
          </g>
        </svg>
      </div>
    </>
  );
}
