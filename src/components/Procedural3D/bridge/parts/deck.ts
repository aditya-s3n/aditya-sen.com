import * as THREE from "three";

import { BRIDGE, CHUNK } from "../../config";
import { PartPlacement } from "../../types";
import { beam, box } from "./helpers";


const LAMP_COUNT = 3; // segments between street lamps
const SODIUM = new THREE.Color(1, 0.62, 0.3); //sodium-vapour street lamp
const EDGE_LIGHT = new THREE.Color(1, 0.75, 0.45).multiplyScalar(0.35); // strip along the railings, dimmer than the lamps
const POOL_SIZE = [12, 18] as const; // [x, z] of the light pool on the road




/**
 * Road, sidewalks, the two stiffening trusses (chords, posts, diagonals),
 * floor beams, railings and street lamps for one chunk starting at zStart.
 * `rng` is seeded per chunk; it only changes lamp tints, never counts,
 * so every chunk needs the same number of instances.
 */
export function placeDeck(zStart: number, rng: () => number): PartPlacement[] {
    const steel: THREE.Matrix4[] = [];
    const concrete: THREE.Matrix4[] = [];
    const lamps: THREE.Matrix4[] = [];
    const lampColors: THREE.Color[] = [];
    const pools: THREE.Matrix4[] = [];
    const poolColors: THREE.Color[] = [];



    const L = CHUNK.length;
    const seg = BRIDGE.suspenderSpacing;
    const deckY = BRIDGE.deckHeight;
    const trussX = BRIDGE.cableSpacing / 2;
    const bottomY = deckY-BRIDGE.deckDepth;


    // Keep the truss and sidewalks out of tower legs when chunk starts
    const clear = BRIDGE.towerLegSize[1] / 2 + 1;
    const spanLength = L-2 * clear;
    const spanMid = zStart - L/2;

    // create roads through tower
    concrete.push(box(0, deckY - 0.4, spanMid, BRIDGE.roadWidth, 0.8, L));

    // sidewalks + railing
    const walkWidth = trussX - BRIDGE.roadWidth/2;
    /**
     * -1: left sidewalk + railing
     * 1: right sidewalk + railing
     */
    for (const side of [-1, 1]) {
        const walkX = side * (BRIDGE.roadWidth/2 + walkWidth/2);

        concrete.push(box(walkX, deckY-0.2, spanMid, walkWidth, 0.6, spanLength));
        steel.push(box(side * (trussX+0.3), deckY+0.7, spanMid, 0.2, 1.3, spanLength));

        // light strip along the top of the railing
        lamps.push(box(side * (trussX+0.3), deckY+1.42, spanMid, 0.3, 0.15, spanLength));
        lampColors.push(EDGE_LIGHT);
    }


    const startSeg = new THREE.Vector3();
    const endSeg = new THREE.Vector3();
    const segments = Math.floor(spanLength / seg);

    /** create floor segments */
    for (let i = 0; i < segments; i++) {
        const z0 = zStart - clear - i*seg;
        const z1 = z0 - seg;
        const zMid = (z0 + z1) / 2;

        for (const side of [-1, 1]) {
            const x = side * trussX;

            steel.push(box(x, deckY-0.8, zMid, 1, 1, seg)); // top chord
            steel.push(box(x, bottomY, zMid, 1, 1, seg)); // bottom chord
            steel.push(box(x, (deckY + bottomY)/2, z0, 0.6, BRIDGE.deckDepth, 0.6)) // vertical post

            // golden gate truss zig-zag beneath the deck
            const up = i % 2 === 0;
            startSeg.set(x, bottomY, up?z0:z1);
            endSeg.set(x, deckY-0.8, up?z0:z1);
            steel.push(beam(startSeg, endSeg, 0.5));

            // create lamp
            if (i % LAMP_COUNT === 0) {
                const lampX = side * (BRIDGE.roadWidth/2 + 0.6);
                steel.push(box(lampX, deckY+4, z0, 0.25, 8, 0.25));
                lamps.push(box(lampX - side*1.2, deckY + 8, z0, 0.9, 0.35, 0.5));
                const tint = SODIUM.clone().multiplyScalar(0.8 + 0.4 * rng());
                lampColors.push(tint);
                poolColors.push(tint);

                // pool of light under the head, just above the sidewalk so it covers both
                pools.push(box(side * (BRIDGE.roadWidth/2 - 3), deckY + 0.15, z0, POOL_SIZE[0], 1, POOL_SIZE[1]));
            }
        }


        // floor beam acroos full width
        steel.push(box(0, bottomY + 0.6, z0, BRIDGE.cableSpacing, 0.9, 0.9));
    }


    return [
        { part: 'steelBox', matrices: steel },
        { part: 'concreteBox', matrices: concrete },
        { part: 'lamp', matrices: lamps, colors: lampColors },
        { part: 'lampPool', matrices: pools, colors: poolColors },
    ];
}