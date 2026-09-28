// Golden Gate Bridge, used for the real-time sun position.
export const SF_LOCATION = { lat: 37.8199, lng: -122.4783 } as const;
export const SF_TIMEZONE = 'America/Los_Angeles';

// SIZE OF SKY DOME. Must disable culling for sky render
// needs to stay within camera.far to be drawn
export const SKY_SIZE = 4000;


// Re-origin the world once the camera gets this far from 0, to avoid float precision jitter on an endless flight.
export const FLOATING_ORIGIN_THRESHOLD = 5000;

export const MAX_PIXEL_RATIO = 1.5;

// How often the sun position is recomputed, in seconds.
export const SKY_UPDATE_INTERVAL = 60;

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
  cableRadius: 0.46,        // the dims of the cable
  suspenderSpacing: 15.2,  // 50 ft
  suspenderRadius: 0.1,     // the cables of the suspenders dims
  towerLegSize: [9, 16],   // [x, z] footprint at the base
  towerPortals: 4,         // cross-beams between the two legs, above the deck
  pierHeight: 12,          // concrete pier the tower stands on
  color: '#C0362C',        // International Orange
} as const;



// CHUNKING. Render one chunk then another to be endless
// tower -> span -> tower (render direction)
export const CHUNK = {
    length: BRIDGE.mainSpan,
    loadAhead: 2,   // two chunks for camera
    keepBehind: 1, // one chunk behind for sanity before recycling
}

export const CAMERA = {
    fov: 55, // field of view in degrees
    near: 0.5,  // near clipping, closer than 0.5 meters not drawn on screen
    far: 4000, // far clipping, farther than 4000 meters not drawn on screen
    speed: 40, // camera moves 40 m/s
    lookAhead: 90 // meters, distances the camera aims at
}

export const FOG = {
    density: 0.00025, // haze density everywhere
    heightDensity: 0.004, // marine layer density at baseHeight
    heightFalloff: 0.018, // how fast it falloff from the marine
    baseHeight: 20, // thickest fog below the Y
    
    // fog the farthest chunk to prevent pop in
    fadeStart: CHUNK.length * CHUNK.loadAhead*0.55,
    fadeEnd: CHUNK.length*CHUNK.loadAhead*0.97,
}