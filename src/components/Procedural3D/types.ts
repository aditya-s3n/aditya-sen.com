import type * as THREE from 'three';

/**
 * Every instanced part of the bridge. One InstancedMesh (= one draw call)
 * per kind, so kinds are split by geometry + material, not by bridge part:
 * tower legs, portals and truss members are all orange boxes.
 */
export const PART_KINDS = ['steelBox', 'concreteBox', 'cable', 'lamp'] as const;
export type PartKind = (typeof PART_KINDS)[number];

/** A slice of one InstancedMesh owned by a single chunk. */
export interface InstanceRange {
  kind: PartKind;
  start: number;
  count: number;
}

/** Output of a part generator: one matrix per instance, in world space. */
export interface PartPlacement {
  kind: PartKind;
  matrices: THREE.Matrix4[];
  colors?: THREE.Color[]; // optional per-instance tint (lamps)
}

/** Shared, mutable world offset for the floating origin (see config.ts). */
export interface WorldOrigin {
  z: number;
}

export interface LoadProgress {
  stage: string;  // label for the loading screen
  value: number;  // 0..1 overall
}

export interface Procedural3DProps {
  onProgress?: (progress: LoadProgress) => void;
  onReady?: () => void;
  /** Render this time instead of now; null = real clock, undefined = leave as is. */
  timeOverride?: Date | null;
}
