import * as THREE from 'three';
import { BRIDGE, CHUNK } from '../../config';
import type { PartPlacement } from '../../types';
import { cableHeightAt } from './cables';
import { beam } from './helpers';

/** Vertical ropes every suspenderSpacing, from the deck up to the main cable. */
export function placeSuspenders(zStart: number): PartPlacement[] {
  const matrices: THREE.Matrix4[] = [];
  const top = new THREE.Vector3();
  const bottom = new THREE.Vector3();
  const count = Math.floor(CHUNK.length / BRIDGE.suspenderSpacing);

  for (let i = 1; i < count; i++) {
    const offset = i * BRIDGE.suspenderSpacing;
    const t = offset / CHUNK.length;
    const z = zStart - offset;
    const cableY = cableHeightAt(t);

    for (const side of [-1, 1]) {
      // The real bridge hangs two ropes per point, side by side.
      for (const pair of [-0.35, 0.35]) {
        const x = (side * BRIDGE.cableSpacing) / 2 + pair;
        bottom.set(x, BRIDGE.deckHeight - 0.5, z);
        top.set(x, cableY, z);
        matrices.push(beam(bottom, top, BRIDGE.suspenderRadius));
      }
    }
  }

  return [{ kind: 'cable', matrices }];
}
