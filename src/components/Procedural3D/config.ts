// World units are meters. Axes: +X = east, +Y = up, -Z = north.
// The drone flies along -Z; the bridge deck runs along the Z axis.

// Golden Gate Bridge, used for the real-time sun position.
export const SF_LOCATION = { lat: 37.8199, lng: -122.4783 } as const;
export const SF_TIMEZONE = 'America/Los_Angeles';

// Real bridge dimensions (approximate).
export const BRIDGE = {
  mainSpan: 1280,          // tower to tower
  towerHeight: 227,        // above water
  deckHeight: 67,          // road surface above water
  deckWidth: 27,           // truss to truss (cable plane to cable plane)
  roadWidth: 18,           // six lanes; passes between the tower legs
  deckDepth: 7.6,          // stiffening truss depth under the road
  cableSag: 144,           // tower top down to cable low point
  cableSpacing: 27.4,      // distance between the two main cables (X)
  cableRadius: 0.46,
  suspenderSpacing: 15.2,  // 50 ft
  suspenderRadius: 0.1,
  towerLegSize: [9, 16],   // [x, z] footprint at the base
  towerPortals: 4,         // cross-beams between the two legs, above the deck
  pierHeight: 12,          // concrete pier the tower stands on
  color: '#C0362C',        // International Orange
} as const;

// Chunking. One chunk = one main span with a tower at its -Z end, so the
// pattern tower -> span -> tower repeats forever.
export const CHUNK = {
  length: BRIDGE.mainSpan,
  loadAhead: 2,   // chunks kept in front of the camera
  keepBehind: 1,  // chunks kept behind before recycling
} as const;

export const CAMERA = {
  fov: 55,
  near: 0.5,
  far: 4000,
  speed: 40,       // m/s along the bridge
  lookAhead: 90,   // how far down the path the camera looks
} as const;

export const FOG = {
  density: 0.00025,     // thin haze everywhere (scene.fog, FogExp2)
  heightDensity: 0.004, // marine layer density at baseHeight
  heightFalloff: 0.018, // how fast the marine layer thins with altitude
  baseHeight: 20,       // fog is thickest below this Y
  // Everything is fully fogged before the farthest streamed chunk,
  // so chunks never visibly pop in.
  fadeStart: CHUNK.length * CHUNK.loadAhead * 0.55,
  fadeEnd: CHUNK.length * CHUNK.loadAhead * 0.97,
} as const;

// Sky dome size. Its corners must stay inside CAMERA.far (half * sqrt(3) < far).
export const SKY_SCALE = 4000;

// Re-origin the world once the camera gets this far from 0, to avoid
// float precision jitter on an endless flight.
export const FLOATING_ORIGIN_THRESHOLD = 5000;

export const MAX_PIXEL_RATIO = 1.5;

// How often the sun position is recomputed, in seconds.
export const SKY_UPDATE_INTERVAL = 60;
