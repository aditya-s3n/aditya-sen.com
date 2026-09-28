import * as THREE from "three";

import { BRIDGE, CHUNK } from "../../config";
import { PartPlacement } from "../../types";
import { beam } from "./helpers";


// curve with 48 tiny steps
const SAMPLES = 48;

/**
 * Main cable hieght 
 * position t
 * parabola is uniform for loaded suspension cable
 * y(t) = towerHeight - 4 * cableSag * t * (1 - t)
 */
export function cableHeightAt(t: number): number {
    return BRIDGE.towerHeight - 4*BRIDGE.cableSag * t * (1-t);
}


// Cable are short cylinders 
// 48 samples of short cylinders
export function placeCables(zStart: number): PartPlacement[] {
    const matrices: THREE.Matrix4[] = [];
    
    const startSegment = new THREE.Vector3();
    const endSegment = new THREE.Vector3();

    // create cables for 
    // -1: left cable
    // 1: right cable
    for (const side of [-1, 1]) {
        const x_val = (side * BRIDGE.cableSpacing) / 2;

        for (let i = 0; i < SAMPLES; i++) {

            const t0 = i / SAMPLES;
            const t1 = (i+1) / SAMPLES;

            startSegment.set(x_val, cableHeightAt(t0), zStart - t0*CHUNK.length);
            endSegment.set(x_val, cableHeightAt(t1), zStart - t1*CHUNK.length);

            matrices.push(beam(startSegment, endSegment, BRIDGE.cableRadius));
        }
    }


    return [{part: 'cable', matrices}];
}