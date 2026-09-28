import * as THREE from 'three';
import { BRIDGE, CHUNK } from '../../config';
import type { PartPlacement } from '../../types';
import { cableHeightAt } from './cables';
import { beam } from './helpers';

/** VERTICAL ropas from deck up to main cable */
export function placeSuspenders(zStart: number): PartPlacement[] {
    const matrices: THREE.Matrix4[] = [];
    const top = new THREE.Vector3();
    const bottom = new THREE.Vector3();
    const count = Math.floor(CHUNK.length / BRIDGE.suspenderSpacing);


    // create suspenders based on count
    for (let i = 1; i < count; i++) {
        const offset = i * BRIDGE.suspenderSpacing; // meters from the chunk start
        const t = offset / CHUNK.length;  // same distance, fraction 0-1
        const z = zStart - offset;  // same distance, as world Z coordinates
        const cableY = cableHeightAt(t);


        /** create suspenders on both sides
         * -1: left side
         * 1: right side
         */
        for (const side of [-1, 1]) {
            // create a pair of ropes
            for (const pair of [-0.35, 0.35]) {
                const x = (side * BRIDGE.cableSpacing)/2 + pair;
                bottom.set(x, BRIDGE.deckHeight - 0.5, z);
                top.set(x, cableY, z);

                matrices.push(beam(bottom, top, BRIDGE.suspenderRadius));
            }
        }
    }

    return [
        { part: 'cable', matrices }
    ];

}