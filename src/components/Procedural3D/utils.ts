export const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Same as GLSL smoothstep. */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Resolves on the next animation frame, lets the browser paint between steps. */
export const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Small seeded RNG so a chunk looks the same every time it is rebuilt. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
