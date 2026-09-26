import * as THREE from 'three';
import { BRIDGE } from '../../config';
import type { PartPlacement } from '../../types';
import { box } from './helpers';

const SECTIONS = 4;          // the legs step in as they rise
const TAPER_PER_SECTION = 0.1;
const PORTAL_HEIGHT = 7;
const AVIATION_RED = new THREE.Color(1, 0.08, 0.05);

/** Width/depth multiplier of a leg at height y. */
const taperAt = (y: number) =>
  1 - TAPER_PER_SECTION * Math.min(SECTIONS - 1, Math.floor((y / BRIDGE.towerHeight) * SECTIONS));

/** Pier, two stepped legs, portal cross-beams and aviation lights at z. */
export function placeTower(z: number): PartPlacement[] {
  const steel: THREE.Matrix4[] = [];
  const concrete: THREE.Matrix4[] = [];
  const lamps: THREE.Matrix4[] = [];
  const lampColors: THREE.Color[] = [];
  const [legX, legZ] = BRIDGE.towerLegSize;
  const legCenter = BRIDGE.cableSpacing / 2;
  const base = BRIDGE.pierHeight;

  concrete.push(box(0, base / 2, z, BRIDGE.cableSpacing + legX + 14, base, legZ + 16));

  for (const side of [-1, 1]) {
    for (let k = 0; k < SECTIONS; k++) {
      const y0 = base + ((BRIDGE.towerHeight - base) * k) / SECTIONS;
      const y1 = base + ((BRIDGE.towerHeight - base) * (k + 1)) / SECTIONS;
      const taper = 1 - TAPER_PER_SECTION * k;
      steel.push(box(side * legCenter, (y0 + y1) / 2, z, legX * taper, y1 - y0, legZ * taper));
    }

    lamps.push(box(side * legCenter, BRIDGE.towerHeight + 1.2, z, 1.2, 1.2, 1.2));
    lampColors.push(AVIATION_RED);
  }

  // One strut under the deck, then evenly spaced portals up to the top.
  const portalYs = [BRIDGE.deckHeight - BRIDGE.deckDepth - 4];
  const first = BRIDGE.deckHeight + 50;
  const last = BRIDGE.towerHeight - PORTAL_HEIGHT / 2;
  for (let i = 0; i < BRIDGE.towerPortals; i++) {
    portalYs.push(first + ((last - first) * i) / (BRIDGE.towerPortals - 1));
  }
  for (const y of portalYs) {
    const taper = taperAt(y);
    steel.push(box(0, y, z, BRIDGE.cableSpacing - legX * taper, PORTAL_HEIGHT, legZ * taper * 0.7));
  }

  return [
    { kind: 'steelBox', matrices: steel },
    { kind: 'concreteBox', matrices: concrete },
    { kind: 'lamp', matrices: lamps, colors: lampColors },
  ];
}
