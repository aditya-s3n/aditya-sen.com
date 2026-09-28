import * as THREE from 'three';
import type { BridgeAssets } from '../bridge/assets';
import { PARTS, TINTED_PARTS, type InstancedRange, type Parts, type PartPlacement } from '../types';

const HIDDEN = new THREE.Matrix4().makeScale(0, 0, 0);
const WHITE = new THREE.Color(1, 1, 1);



/**
 * Create InstancePool of which chunks to keep in memory and which to recycle
 * Chunk borrows a block
 * writes its matrices
 * 
 * only re-write matrices, no need to create or destroy 
 * cheap to re-write instead of fully recreating a chunk
 * 
 * use stack for instance pool
 */
export class InstancePool {
    readonly meshes = new Map<Parts, THREE.InstancedMesh>();
    private perChunk!: Record<Parts, number>;
    private freeBlocks: number[] = [];


    constructor(private scene: THREE.Scene){}


    init(perChunk: Record<Parts, number>, maxChunks: number, assets: BridgeAssets): void {
        this.perChunk = perChunk;
        this.freeBlocks = Array.from({ length: maxChunks }, (_, i) => maxChunks - 1 - i);

        for (const part of PARTS) {
            const capacity = perChunk[part] * maxChunks;
            const mesh = new THREE.InstancedMesh(assets.geometries[part], assets.materials[part], capacity);
            mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            
            // The auto bounding sphere is computed once and goes stale as chunks
            // move, so skip culling; there are only a handful of meshes anyway.
            mesh.frustumCulled = false;
            
            for (let i = 0; i < capacity; i++) {
                mesh.setMatrixAt(i, HIDDEN);
                // Creating instanceColor up front means the shader is compiled with
                // it during the loading screen, not on the first chunk that uses it.
                if (TINTED_PARTS.includes(part)) mesh.setColorAt(i, WHITE);
            }

            this.meshes.set(part, mesh);
            this.scene.add(mesh);
        }
    }


    // pop block from stack
    acquireBlock(): number {
        const block = this.freeBlocks.pop();
        if (block === undefined) {
            throw new Error("ERROR: Instance pool un out of chunk blocks")
        }
        
        return block;
    }

    /** write the chunk to the block
     * unused slots are hidden
     */
    write(block: number, placements: PartPlacement[]): InstancedRange[] {
        return placements.map(({ part, matrices, colors }) => {
            const mesh = this.meshes.get(part)!;
            const size = this.perChunk[part];

            if (matrices.length > size) {
                throw new Error(`InstancePool: too many ${part} instances`);
            }

            const start = block * size;
            for (let i = 0; i < size; i++) {
                mesh.setMatrixAt(start + i, matrices[i] ?? HIDDEN);

                if (colors && mesh.instanceColor) {
                    mesh.setColorAt(start + i, colors[i] ?? WHITE);
                }
            }

            this.markDirty(mesh, start, size);

            return { part, start, count: matrices.length };
        });
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


    releaseBlock(block: number): void {
        for (const [kind, mesh] of this.meshes) {
            const size = this.perChunk[kind];
            const start = block * size;

            for (let i = 0; i < size; i++) {
                mesh.setMatrixAt(start + i, HIDDEN);
            } 

            this.markDirty(mesh, start, size);
        }

        this.freeBlocks.push(block);
    }

    /** Move every instance by dz along Z (floating origin). */
    shift(dz: number): void {
        for (const mesh of this.meshes.values()) {
        const array = mesh.instanceMatrix.array;

        // Element 14 of a column-major 4x4 matrix is the Z translation.
        for (let i = 14; i < array.length; i += 16) {
            array[i] += dz;
        }
        
        mesh.instanceMatrix.clearUpdateRanges(); // upload the whole buffer
        mesh.instanceMatrix.needsUpdate = true;
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