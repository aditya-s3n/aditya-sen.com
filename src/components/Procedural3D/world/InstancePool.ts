import * as THREE from 'three';
import type { BridgeAssets } from '../bridge/assets';
import { PART_KINDS, type InstanceRange, type PartKind, type PartPlacement } from '../types';

const HIDDEN = new THREE.Matrix4().makeScale(0, 0, 0);
const WHITE = new THREE.Color(1, 1, 1);

/**
 * One InstancedMesh per PartKind, split into fixed-size "blocks", one per
 * live chunk. A chunk borrows a block, writes its matrices, and gives it
 * back when it falls behind the camera. Nothing is created or destroyed
 * while flying; only matrices are rewritten.
 */
export class InstancePool {
  readonly meshes = new Map<PartKind, THREE.InstancedMesh>();
  private perChunk!: Record<PartKind, number>;
  private freeBlocks: number[] = [];

  constructor(private scene: THREE.Scene) {}

  init(perChunk: Record<PartKind, number>, maxChunks: number, assets: BridgeAssets): void {
    this.perChunk = perChunk;
    this.freeBlocks = Array.from({ length: maxChunks }, (_, i) => maxChunks - 1 - i);

    for (const kind of PART_KINDS) {
      const capacity = perChunk[kind] * maxChunks;
      const mesh = new THREE.InstancedMesh(assets.geometries[kind], assets.materials[kind], capacity);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      // The auto bounding sphere is computed once and goes stale as chunks
      // move, so skip culling; there are only a handful of meshes anyway.
      mesh.frustumCulled = false;
      for (let i = 0; i < capacity; i++) {
        mesh.setMatrixAt(i, HIDDEN);
        // Creating instanceColor up front means the shader is compiled with
        // it during the loading screen, not on the first chunk that uses it.
        if (kind === 'lamp') mesh.setColorAt(i, WHITE);
      }
      this.meshes.set(kind, mesh);
      this.scene.add(mesh);
    }
  }

  acquireBlock(): number {
    const block = this.freeBlocks.pop();
    if (block === undefined) throw new Error('InstancePool: out of chunk blocks');
    return block;
  }

  /** Write a chunk's placements into its block. Unused slots stay hidden. */
  write(block: number, placements: PartPlacement[]): InstanceRange[] {
    return placements.map(({ kind, matrices, colors }) => {
      const mesh = this.meshes.get(kind)!;
      const size = this.perChunk[kind];
      if (matrices.length > size) throw new Error(`InstancePool: too many ${kind} instances`);

      const start = block * size;
      for (let i = 0; i < size; i++) {
        mesh.setMatrixAt(start + i, matrices[i] ?? HIDDEN);
        if (colors && mesh.instanceColor) mesh.setColorAt(start + i, colors[i] ?? WHITE);
      }
      this.markDirty(mesh, start, size);
      return { kind, start, count: matrices.length };
    });
  }

  releaseBlock(block: number): void {
    for (const [kind, mesh] of this.meshes) {
      const size = this.perChunk[kind];
      const start = block * size;
      for (let i = 0; i < size; i++) mesh.setMatrixAt(start + i, HIDDEN);
      this.markDirty(mesh, start, size);
    }
    this.freeBlocks.push(block);
  }

  /** Move every instance by dz along Z (floating origin). */
  shift(dz: number): void {
    for (const mesh of this.meshes.values()) {
      const array = mesh.instanceMatrix.array;
      // Element 14 of a column-major 4x4 matrix is the Z translation.
      for (let i = 14; i < array.length; i += 16) array[i] += dz;
      mesh.instanceMatrix.clearUpdateRanges(); // upload the whole buffer
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  /** Upload only the changed slice instead of the whole buffer. */
  private markDirty(mesh: THREE.InstancedMesh, start: number, count: number) {
    mesh.instanceMatrix.addUpdateRange(start * 16, count * 16);
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.addUpdateRange(start * 3, count * 3);
      mesh.instanceColor.needsUpdate = true;
    }
  }

  dispose(): void {
    for (const mesh of this.meshes.values()) {
      this.scene.remove(mesh);
      mesh.dispose(); // geometries/materials are shared, BridgeAssets disposes them
    }
    this.meshes.clear();
  }
}
