import type * as THREE from 'three';
import { BridgeChunk } from '../bridge/BridgeChunk';
import { CHUNK } from '../config';
import type { WorldOrigin } from '../types';
import { nextFrame } from '../utils';
import type { InstancePool } from './InstancePool';

/**
 * Endless streaming along -Z. Chunk i covers the distance range
 * [i * L, (i + 1) * L] from the (absolute) start of the bridge.
 * Each frame: find the camera's chunk, release chunks outside the window,
 * build at most one missing chunk.
 */
export class ChunkManager {
  /** Live window plus one spare block for the frame where we swap. */
  static readonly maxChunks = CHUNK.loadAhead + CHUNK.keepBehind + 2;

  private live = new Map<number, BridgeChunk>();

  constructor(private pool: InstancePool, private origin: WorldOrigin) {}

  /** Build the initial window, yielding a frame between chunks so the loading bar moves. */
  async prewarm(camera: THREE.Camera, onChunk?: (done: number, total: number) => void): Promise<void> {
    const wanted = this.wanted(camera);
    for (let i = 0; i < wanted.length; i++) {
      if (!this.live.has(wanted[i])) this.build(wanted[i]);
      onChunk?.(i + 1, wanted.length);
      await nextFrame();
    }
  }

  update(camera: THREE.Camera): void {
    const current = this.currentIndex(camera);
    for (const [index, chunk] of this.live) {
      if (index < current - CHUNK.keepBehind || index > current + CHUNK.loadAhead) {
        chunk.release();
        this.live.delete(index);
      }
    }
    // One chunk per frame at most, so streaming never causes a hitch.
    const missing = this.wanted(camera).find((index) => !this.live.has(index));
    if (missing !== undefined) this.build(missing);
  }

  /** Floating origin: existing instances move, new chunks use origin.z. */
  shift(dz: number): void {
    this.pool.shift(dz);
  }

  private currentIndex(camera: THREE.Camera) {
    // Distance travelled from the bridge's absolute start.
    const distance = this.origin.z - camera.position.z;
    return Math.floor(distance / CHUNK.length);
  }

  /** Chunk indices that should be live, nearest first. */
  private wanted(camera: THREE.Camera): number[] {
    const current = this.currentIndex(camera);
    const indices = [current];
    for (let i = 1; i <= CHUNK.loadAhead; i++) indices.push(current + i);
    for (let i = 1; i <= CHUNK.keepBehind; i++) indices.push(current - i);
    return indices;
  }

  private build(index: number) {
    const chunk = new BridgeChunk(index, this.pool);
    chunk.build(this.origin.z);
    this.live.set(index, chunk);
  }

  dispose(): void {
    for (const chunk of this.live.values()) chunk.release();
    this.live.clear();
  }
}
