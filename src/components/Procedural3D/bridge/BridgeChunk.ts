import type * as THREE from 'three';
import { CHUNK } from '../config';
import type { InstancePool } from '../world/InstancePool';
import { PART_KINDS, type PartKind, type PartPlacement } from '../types';
import { mulberry32 } from '../utils';
import { placeCables } from './parts/cables';
import { placeDeck } from './parts/deck';
import { placeSuspenders } from './parts/suspenders';
import { placeTower } from './parts/tower';

/**
 * Every instance of one chunk, merged into one placement per kind.
 * Pure: same (index, zStart) always gives the same result.
 */
export function generateChunkParts(index: number, zStart: number): PartPlacement[] {
  const rng = mulberry32(index * 9973 + 17);
  const parts = [
    ...placeTower(zStart),
    ...placeDeck(zStart, rng),
    ...placeCables(zStart),
    ...placeSuspenders(zStart),
  ];

  return PART_KINDS.map((kind) => {
    const ofKind = parts.filter((p) => p.kind === kind);
    const matrices = ofKind.flatMap((p) => p.matrices);
    const hasColors = ofKind.some((p) => p.colors);
    const colors: THREE.Color[] | undefined = hasColors ? ofKind.flatMap((p) => p.colors ?? []) : undefined;
    return { kind, matrices, colors };
  });
}

/** Instances per kind in one chunk, used to size the InstancePool. */
export function countChunkParts(): Record<PartKind, number> {
  const counts = {} as Record<PartKind, number>;
  for (const p of generateChunkParts(0, 0)) counts[p.kind] = p.matrices.length;
  return counts;
}

/**
 * One repeating span: a tower at the chunk's start, then deck, two
 * parabolic main cables and suspenders to the next chunk's tower.
 * Chunk i starts at z = -i * CHUNK.length (plus the floating origin).
 */
export class BridgeChunk {
  private block = -1;

  constructor(readonly index: number, private pool: InstancePool) {}

  build(originZ: number): void {
    const zStart = -this.index * CHUNK.length + originZ;
    this.block = this.pool.acquireBlock();
    this.pool.write(this.block, generateChunkParts(this.index, zStart));
  }

  release(): void {
    if (this.block < 0) return;
    this.pool.releaseBlock(this.block);
    this.block = -1;
  }
}
