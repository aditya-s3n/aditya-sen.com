import * as THREE from 'three';

import { BRIDGE, CAMERA, CHUNK } from '../config';
import type { WorldOrigin } from '../types';


const FLIGHT_X = 0; // straight line
const FLIGHT_Y = BRIDGE.deckHeight + 12; // vertical height


export class Camera {
    private distance: number;


    constructor( 
        private camera: THREE.PerspectiveCamera, 
        private origin: WorldOrigin,
        startDistance = CHUNK.length * 0.35,
    ) {
        this.distance = startDistance;
    }



    // position of path, in world space
    pathAt(distance: number, target: THREE.Vector3): THREE.Vector3 {
        return target.set(FLIGHT_X, FLIGHT_Y, -distance + this.origin.z);
    }



    // move camera in a straight line in the Z-axis
    update (dt: number): void {
        this.distance += CAMERA.speed * dt;
        this.pathAt(this.distance, this.camera.position);
        this.camera.lookAt(FLIGHT_X, FLIGHT_Y, this.camera.position.z - CAMERA.lookAhead);
    }
}