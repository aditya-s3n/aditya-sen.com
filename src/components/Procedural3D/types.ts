import type * as THREE from "three";



// one instanced mesh = one draw call
// instanced parts of the bridge
export const PARTS = [
    'steelBox',
    'concreteBox',
    'cable',
    'lamp'
] as const

export type Parts = (typeof PARTS)[number];


// one slice of instanced mesh owned by a chunk
export interface InstancedRange {
    part: Parts;
    start: number;
    count: number;
};

// output of part generator: one matrix per instance in world space
export interface PartPlacement {
    part: Parts;
    matrices: THREE.Matrix4[];
    colors?: THREE.Color[]; // for lamps
}


// world offest
export interface WorldOrigin {
    z: number;
}


export interface LoadProgress {
    stage: string; // label for loading
    value: number; // 0-1 completion
}

export interface Procedural3DProps {
    onProgress?: (progress: LoadProgess) => void;
    onReady?: () => void;

    // for TimeOfDayDropDown (null = live time)
    timeOverride?: Date | null;
}