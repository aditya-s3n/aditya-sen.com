import * as THREE from 'three';
import { BRIDGE, CHUNK } from '../../config';
import type { PartPlacement } from '../../types';
import { beam } from './helpers';

const SAMPLES = 48;

/**
 * Main cable height at local position t in [0, 1] across the span.
 * A parabola is correct for a uniformly loaded suspension cable:
 *   y(t) = towerHeight - 4 * cableSag * t * (1 - t)
 */
export function cableHeightAt(t: number): number {
  return BRIDGE.towerHeight - 4 * BRIDGE.cableSag * t * (1 - t);
}

/** Cable as short cylinder segments between samples of cableHeightAt. */
export function placeCables(zStart: number): PartPlacement[] {
  const matrices: THREE.Matrix4[] = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();

  for (const side of [-1, 1]) {
    const x = (side * BRIDGE.cableSpacing) / 2;
    for (let i = 0; i < SAMPLES; i++) {
      const t0 = i / SAMPLES;
      const t1 = (i + 1) / SAMPLES;
      a.set(x, cableHeightAt(t0), zStart - t0 * CHUNK.length);
      b.set(x, cableHeightAt(t1), zStart - t1 * CHUNK.length);
      matrices.push(beam(a, b, BRIDGE.cableRadius));
    }
  }

  return [{ kind: 'cable', matrices }];
}
