import * as THREE from 'three';
import { BRIDGE, CHUNK } from '../../config';
import type { PartPlacement } from '../../types';
import { beam, box } from './helpers';

const LAMP_EVERY = 3;             // segments between street lamps
const SODIUM = new THREE.Color(1, 0.62, 0.3);

/**
 * Road, sidewalks, the two stiffening trusses (chords, posts, diagonals),
 * floor beams, railings and street lamps for one chunk starting at zStart.
 * `rng` is seeded per chunk; it only changes lamp tints, never counts,
 * so every chunk needs the same number of instances.
 */
export function placeDeck(zStart: number, rng: () => number): PartPlacement[] {
  const steel: THREE.Matrix4[] = [];
  const concrete: THREE.Matrix4[] = [];
  const lamps: THREE.Matrix4[] = [];
  const lampColors: THREE.Color[] = [];

  const L = CHUNK.length;
  const seg = BRIDGE.suspenderSpacing;
  const deckY = BRIDGE.deckHeight;
  const trussX = BRIDGE.cableSpacing / 2;
  const bottomY = deckY - BRIDGE.deckDepth;
  // Keep the truss and sidewalks out of the tower legs at the chunk start.
  const clear = BRIDGE.towerLegSize[1] / 2 + 1;
  const spanLength = L - 2 * clear;
  const spanMid = zStart - L / 2;

  // Road runs straight through the tower portal.
  concrete.push(box(0, deckY - 0.4, spanMid, BRIDGE.roadWidth, 0.8, L));

  // Sidewalks + railings between the road and the trusses.
  const walkWidth = trussX - BRIDGE.roadWidth / 2;
  for (const side of [-1, 1]) {
    const walkX = side * (BRIDGE.roadWidth / 2 + walkWidth / 2);
    concrete.push(box(walkX, deckY - 0.2, spanMid, walkWidth, 0.6, spanLength));
    steel.push(box(side * (trussX + 0.3), deckY + 0.7, spanMid, 0.2, 1.3, spanLength));
  }

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const segments = Math.floor(spanLength / seg);

  for (let i = 0; i < segments; i++) {
    const z0 = zStart - clear - i * seg;
    const z1 = z0 - seg;
    const zMid = (z0 + z1) / 2;

    for (const side of [-1, 1]) {
      const x = side * trussX;
      steel.push(box(x, deckY - 0.8, zMid, 1, 1, seg));                          // top chord
      steel.push(box(x, bottomY, zMid, 1, 1, seg));                              // bottom chord
      steel.push(box(x, (deckY + bottomY) / 2, z0, 0.6, BRIDGE.deckDepth, 0.6)); // vertical post
      // Diagonals alternate direction, giving the Warren-truss zig-zag.
      const up = i % 2 === 0;
      a.set(x, bottomY, up ? z0 : z1);
      b.set(x, deckY - 0.8, up ? z1 : z0);
      steel.push(beam(a, b, 0.5));

      if (i % LAMP_EVERY === 0) {
        const lampX = side * (BRIDGE.roadWidth / 2 + 0.6);
        steel.push(box(lampX, deckY + 4, z0, 0.25, 8, 0.25));
        lamps.push(box(lampX - side * 1.2, deckY + 8, z0, 0.9, 0.35, 0.5));
        lampColors.push(SODIUM.clone().multiplyScalar(0.8 + 0.4 * rng()));
      }
    }

    // Floor beam across the full width.
    steel.push(box(0, bottomY + 0.6, z0, BRIDGE.cableSpacing, 0.9, 0.9));
  }

  return [
    { kind: 'steelBox', matrices: steel },
    { kind: 'concreteBox', matrices: concrete },
    { kind: 'lamp', matrices: lamps, colors: lampColors },
  ];
}
