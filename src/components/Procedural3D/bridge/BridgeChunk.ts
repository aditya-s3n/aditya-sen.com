import type * as THREE from 'three';
import { CHUNK } from '../config';
import type { InstancePool } from '../world/InstancePool';
import { PARTS, type Parts, type PartPlacement } from '../types';
import { mulberry32 } from '../utils';
import { placeCables } from './parts/cables';
import { placeDeck } from './parts/deck';
import { placeSuspenders } from './parts/suspenders';
import { placeTower } from './parts/tower';



export function generateChunkParts(index: number, zStart: number): PartPlacement[] {
    const rng = mulberry32(index * 9973 + 17);

    const parts = [
        ...placeTower(zStart),
        ...placeDeck(zStart, rng),
        ...placeCables(zStart),
        ...placeSuspenders(zStart),
    ];

    return PARTS.map((part) => {
        const ofKind = parts.filter((p) => p.part === part);
        const matrices = ofKind.flatMap((p) => p.matrices);
        const hasColors = ofKind.some((p) => p.colors);
        const colors: THREE.Color[] | undefined = hasColors ? ofKind.flatMap((p) => p.colors ?? []) : undefined;
        
        return { part: part, matrices, colors };
    });
}


/** Instances per kind in one chunk, used to size the InstancePool. */
export function countChunkParts(): Record<Parts, number> {
  const counts = {} as Record<Parts, number>;

  for (const p of generateChunkParts(0, 0)) {
    counts[p.part] = p.matrices.length;
  }

  return counts;
}


/**
 * create BridgeChunk with all 
 * towers
 * cable
 * suspenders
 * deck
 * 
 * 
 * Chunk i starts -i * CHUNK.length
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